import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://renovabio-production.up.railway.app";

const emptyData = {
  usuarios: [],
  recompensas: [],
  feedbacks: [],
  acoes: [],
};

function formatDate(value) {
  if (!value) return "12/01/2026";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function metric(label, value, extra = "") {
  return (
    <article className={`metric ${extra}`}>
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
    </article>
  );
}

function Chart({ title, data }) {
  const max = Math.max(...data.map((item) => item.value), 0);

  return (
    <article className="chart-card">
      <h2 className="chart-title">{title}</h2>
      {max === 0 ? (
        <div className="empty-chart">Sem dados suficientes para gerar este grafico.</div>
      ) : (
        <div className="bar-chart">
          <div className="axis">
            {[0, max * 0.25, max * 0.5, max * 0.75, max].map((value) => (
              <span key={value}>{Math.round(value)}</span>
            ))}
          </div>
          <div className="bars">
            {data.map((item) => (
              <span className="bar-group" key={item.label}>
                <span className="bar-value">{item.value}</span>
                <span className="bar" style={{ height: `${Math.max(10, (item.value / max) * 100)}%` }} />
                <span className="bar-label">{item.label}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function AuthScreen({ screen, email, onScreenChange, onLogin, onSignup }) {
  const [status, setStatus] = useState("");
  const isLogin = screen === "login";
  const isSignup = screen === "cadastro";
  const title = isSignup ? "Cadastro" : "Esqueceu a senha?";

  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (isLogin) {
      setStatus("Conectando com a API...");
      onLogin(form.email.value.trim(), form.senha.value, setStatus);
      return;
    }

    if (isSignup) {
      setStatus("Cadastrando prefeitura...");
      onSignup(form.email.value.trim(), form.cidade.value.trim(), form.senha.value, setStatus);
      return;
    }

    setStatus("Instrucao de recuperacao enviada.");
  }

  return (
    <section className={`auth-screen ${isLogin ? "" : "compact"}`}>
      <div className="brand">
        <h1 className="logo">
          RENOVABIO<span className="subtitle">PREFEITURA</span>
        </h1>
        {isLogin && (
          <form className="auth-card" onSubmit={submit}>
            <input className="field" name="email" type="email" placeholder="Email" defaultValue={email} required />
            <input className="field" name="senha" type="password" placeholder="Senha" required />
            <button className="primary-btn" type="submit">
              Login
            </button>
            <div className="auth-links">
              <button className="text-btn" type="button" onClick={() => onScreenChange("cadastro")}>
                Cadastrar-se
              </button>
              <span>|</span>
              <button className="text-btn" type="button" onClick={() => onScreenChange("recuperar")}>
                Esqueci a senha
              </button>
            </div>
            <div className="status">{status}</div>
          </form>
        )}
      </div>

      {isLogin ? (
        <div className="phone-preview" aria-label="Previa do aplicativo" />
      ) : (
        <form className="auth-card" onSubmit={submit}>
          <h2 className="auth-title">{title}</h2>
          {isSignup ? (
            <>
              <input className="field" name="email" type="email" placeholder="Email" required />
              <input className="field" name="cidade" type="text" placeholder="Cidade" required />
              <input className="field" name="senha" type="password" placeholder="Senha" required />
              <button className="primary-btn" type="submit">
                Cadastrar
              </button>
            </>
          ) : (
            <>
              <p className="auth-copy">Informe o email para o qual deseja redefinir sua senha</p>
              <input className="field" name="email" type="email" placeholder="Email" required />
              <button className="primary-btn" type="submit">
                Enviar
              </button>
            </>
          )}
          <button className="text-btn" type="button" onClick={() => onScreenChange("login")}>
            Voltar ao login
          </button>
          <div className="status">{status}</div>
        </form>
      )}
    </section>
  );
}

function Dashboard({ data }) {
  const { usuarios, recompensas, acoes } = data;
  const activeUsers = usuarios.filter((user) => user.ativo !== false).length;
  const partners = new Set(recompensas.map((item) => item.parceiro?.nome).filter(Boolean)).size;
  const totalPoints = usuarios.reduce((total, user) => total + (Number(user.pontuacao ?? user.pontuacaoAtual) || 0), 0);
  const actions = acoes.length;
  const pointsByUser = usuarios
    .map((user) => ({
      label: user.nome?.split(" ")[0] || user.email?.split("@")[0] || `U${user.id}`,
      value: Number(user.pontuacao ?? user.pontuacaoAtual) || 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const actionsByType = Object.entries(
    acoes.reduce((groups, action) => {
      const key = action.tipoAcao || "ACAO";
      groups[key] = (groups[key] || 0) + 1;
      return groups;
    }, {}),
  ).map(([label, value]) => ({ label: label.replaceAll("_", " "), value }));

  return (
    <>
      <div className="metrics">
        {metric("Usuarios cadastrados", usuarios.length)}
        {metric("Usuarios ativos", activeUsers)}
        {metric("Parceiros cadastrados", partners)}
        {metric("Recompensas ativas", recompensas.filter((item) => item.ativo !== false).length)}
        {metric("Total de acoes sustentaveis", actions, "wide")}
        {metric("Pontuacao total gerada", totalPoints, "wide")}
      </div>
      <div className="charts">
        <Chart title="Acoes sustentaveis por tipo" data={actionsByType} />
        <Chart title="Pontuacao por usuario" data={pointsByUser} />
      </div>
    </>
  );
}

function extractErrorMessage(error) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Nao foi possivel conectar com a API.";
}

function Partners({ recompensas }) {
  const [search, setSearch] = useState("");
  const filteredRewards = useMemo(() => {
    const term = search.trim().toLowerCase();
    return recompensas.filter((reward) => `${reward.parceiro?.nome || ""} ${reward.descricao}`.toLowerCase().includes(term));
  }, [recompensas, search]);
  const partners = new Set(recompensas.map((item) => item.parceiro?.nome).filter(Boolean));

  return (
    <>
      <input
        className="search"
        type="search"
        placeholder="Buscar parceiro pelo nome"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="partner-stats">
        <article className="summary-card">
          <strong className="summary-number">{partners.size}</strong>
          <span className="summary-label">Parceiros cadastrados</span>
          <button className="small-btn">+ Novo parceiro</button>
        </article>
        <article className="summary-card">
          <strong className="summary-number">{recompensas.length}</strong>
          <span className="summary-label">Recompensas cadastradas</span>
          <button className="small-btn">+ Nova recompensa</button>
        </article>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome parceiro</th>
              <th>Data cadastro</th>
              <th>Recompensa</th>
              <th>Pontos necessarios para ganhar</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {filteredRewards.map((reward, index) => (
              <tr key={reward.id || reward.idRecompensa || index}>
                <td>
                  <strong>{reward.parceiro?.nome || `Parceiro ${String.fromCharCode(65 + index)}`}</strong>
                </td>
                <td>{formatDate(reward.parceiro?.dataCadastro || (index ? "2025-12-12" : "2026-01-16"))}</td>
                <td>{reward.descricao}</td>
                <td>{reward.pontosNecessarios || 0}</td>
                <td>
                  <span className="actions">
                    <button className="icon-btn" aria-label="Editar">
                      Edit
                    </button>
                    <button className="icon-btn" aria-label="Excluir">
                      Del
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Feedbacks({ feedbacks }) {
  if (!feedbacks.length) {
    return <div className="empty-state">Nenhum feedback encontrado na API.</div>;
  }

  return (
    <div className="feedback-list">
      {feedbacks.map((item, index) => (
        <article className="feedback" key={item.id || index}>
          <p>"{item.mensagem}"</p>
          <strong>Enviado em: {formatDate(item.dataEnvio)}</strong>
        </article>
      ))}
    </div>
  );
}

function Settings({ email, onEmailChange }) {
  const [status, setStatus] = useState("");
  const [nextEmail, setNextEmail] = useState(email);

  function submit(event) {
    event.preventDefault();
    onEmailChange(nextEmail.trim() || email);
    setStatus("Configuracoes salvas.");
  }

  return (
    <form className="settings" onSubmit={submit}>
      <section className="settings-card">
        <h2>Email da Prefeitura</h2>
        <div className="settings-row">
          <input className="field light" type="email" value={nextEmail} onChange={(event) => setNextEmail(event.target.value)} />
          <button className="pill-btn" type="submit">
            Salvar
          </button>
        </div>
      </section>
      <section className="settings-card">
        <h2>Alterar senha</h2>
        <div className="settings-row">
          <div className="password-stack">
            <input className="field light" type="password" placeholder="Nova senha" />
            <input className="field light" type="password" placeholder="Confirmar nova senha" />
          </div>
          <button className="pill-btn" type="submit">
            Salvar
          </button>
        </div>
      </section>
      <div className="status">{status}</div>
    </form>
  );
}

function AdminShell({ data, email, activeTab, onTabChange, onLogout, onEmailChange }) {
  const tabs = [
    ["inicio", "Inicio"],
    ["parceiros", "Parceiros"],
    ["feedbacks", "Feedbacks"],
    ["configuracoes", "Configuracoes"],
  ];

  return (
    <section className="app-shell">
      <header className="topbar">
        <h1 className="admin-logo">PREFEITURA</h1>
        <span className="admin-email">{email}</span>
        <button className="text-btn logout" type="button" onClick={onLogout}>
          Sair
        </button>
      </header>
      <nav className="tabs">
        {tabs.map(([id, label]) => (
          <button className={`tab ${activeTab === id ? "active" : ""}`} type="button" key={id} onClick={() => onTabChange(id)}>
            {label}
          </button>
        ))}
      </nav>
      <div className="view">
        {activeTab === "inicio" && <Dashboard data={data} />}
        {activeTab === "parceiros" && <Partners recompensas={data.recompensas} />}
        {activeTab === "feedbacks" && <Feedbacks feedbacks={data.feedbacks} />}
        {activeTab === "configuracoes" && <Settings email={email} onEmailChange={onEmailChange} />}
      </div>
    </section>
  );
}

export default function App() {
  const [screen, setScreen] = useState("login");
  const [activeTab, setActiveTab] = useState("inicio");
  const [data, setData] = useState(emptyData);
  const [email, setEmail] = useState(localStorage.getItem("renovabioEmail") || "prefeituracaibate@gmail.com");
  const [token, setToken] = useState(localStorage.getItem("renovabioToken") || "");

  async function request(path, options = {}, authToken = token) {
    const headers = { ...(options.headers || {}) };
    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    if (!response.ok) {
      let message = `Erro ${response.status} ao chamar ${path}`;

      try {
        const payload = await response.json();
        message = payload.message || payload.error || message;
      } catch {
        const text = await response.text().catch(() => "");
        if (text) message = text;
      }

      throw new Error(message);
    }

    if (response.status === 204) return null;
    return response.json();
  }

  async function loadData(authToken = token) {
    if (!authToken) {
      setData(emptyData);
      return;
    }

    try {
      const [usuarios, recompensas, feedbacks] = await Promise.all([
        request("/usuarios", {}, authToken),
        request("/recompensas", {}, authToken),
        request("/feedbacks", {}, authToken),
      ]);
      const userList = Array.isArray(usuarios) ? usuarios : [];
      const actionGroups = await Promise.all(
        userList
          .filter((user) => user.id)
          .map((user) => request(`/usuarios/${user.id}/acoes`, {}, authToken).catch(() => [])),
      );
      setData({
        usuarios: userList,
        recompensas: Array.isArray(recompensas) ? recompensas : [],
        feedbacks: Array.isArray(feedbacks) ? feedbacks : [],
        acoes: actionGroups.flat(),
      });
    } catch (error) {
      setData(emptyData);
      throw error;
    }
  }

  async function login(nextEmail, password, setStatus) {
    try {
      const user = await request("/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: nextEmail, senha: password }),
      });
      const nextToken = user.token || "";

      if (!Object.hasOwn(user, "tipo")) {
        throw new Error("A API nao retornou o tipo do usuario. Publique a API atualizada antes de acessar o painel.");
      }

      if (user.tipo !== "PREFEITURA") {
        throw new Error("Este acesso e exclusivo para usuarios do tipo PREFEITURA.");
      }

      setToken(nextToken);
      setEmail(nextEmail);
      localStorage.setItem("renovabioToken", nextToken);
      localStorage.setItem("renovabioEmail", nextEmail);
      await loadData(nextToken);
      setStatus("");
      setScreen("admin");
    } catch (error) {
      setToken("");
      localStorage.removeItem("renovabioToken");
      setStatus(extractErrorMessage(error));
    }
  }

  async function signupPrefeitura(nextEmail, cityName, password, setStatus) {
    try {
      const cidades = await request("/cidades", {}, "");
      const cidade = Array.isArray(cidades)
        ? cidades.find((item) => normalizeText(item.nome) === normalizeText(cityName))
        : null;

      if (!cidade) {
        throw new Error("Cidade nao encontrada. Digite o nome igual ao cadastro da API.");
      }

      await request(
        "/usuarios",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: "Prefeitura",
            email: nextEmail,
            senha: password,
            cidadeId: cidade.id,
            tipo: "PREFEITURA",
          }),
        },
        "",
      );

      setEmail(nextEmail);
      localStorage.setItem("renovabioEmail", nextEmail);
      setStatus("Cadastro concluido. Faca login para acessar o painel.");
      setTimeout(() => setScreen("login"), 900);
    } catch (error) {
      setStatus(extractErrorMessage(error));
    }
  }

  function updateEmail(nextEmail) {
    setEmail(nextEmail);
    localStorage.setItem("renovabioEmail", nextEmail);
  }

  function logout() {
    setScreen("login");
    setToken("");
    localStorage.removeItem("renovabioToken");
  }

  useEffect(() => {
    if (token) {
      loadData(token).catch(() => {
        setToken("");
        localStorage.removeItem("renovabioToken");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (screen !== "admin") {
    return (
      <AuthScreen
        screen={screen}
        email={email}
        onScreenChange={setScreen}
        onLogin={login}
        onSignup={signupPrefeitura}
      />
    );
  }

  return (
    <AdminShell
      data={data}
      email={email}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={logout}
      onEmailChange={updateEmail}
    />
  );
}
