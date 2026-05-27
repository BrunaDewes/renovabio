import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://renovabio-production.up.railway.app";

const emptyData = {
  usuarios: [],
  parceiros: [],
  recompensas: [],
  cidades: [],
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
  const { usuarios, parceiros, recompensas, acoes } = data;
  const activeUsers = usuarios.filter((user) => user.ativo !== false).length;
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
        {metric("Parceiros cadastrados", parceiros.length)}
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

function Partners({
  cidades,
  parceiros,
  recompensas,
  onSavePartner,
  onSaveReward,
  onTogglePartner,
  onToggleReward,
}) {
  const [search, setSearch] = useState("");
  const [partnerForm, setPartnerForm] = useState(null);
  const [rewardForm, setRewardForm] = useState(null);
  const [status, setStatus] = useState("");

  const filteredRewards = useMemo(() => {
    const term = search.trim().toLowerCase();
    return recompensas.filter((reward) => `${reward.parceiro?.nome || ""} ${reward.descricao}`.toLowerCase().includes(term));
  }, [recompensas, search]);

  function startNewPartner() {
    setStatus("");
    setRewardForm(null);
    setPartnerForm({
      id: null,
      nome: "",
      descricao: "",
      cidadeId: cidades[0]?.id || "",
      ativo: true,
    });
  }

  function startEditPartner(parceiro) {
    setStatus("");
    setRewardForm(null);
    setPartnerForm({
      id: parceiro.id,
      nome: parceiro.nome || "",
      descricao: parceiro.descricao || "",
      cidadeId: parceiro.cidade?.id || cidades[0]?.id || "",
      ativo: parceiro.ativo !== false,
    });
  }

  function startNewReward() {
    setStatus("");
    setPartnerForm(null);
    setRewardForm({
      id: null,
      descricao: "",
      pontosNecessarios: "",
      quantidadeDisponivel: "",
      parceiroId: parceiros[0]?.id || "",
      ativo: true,
    });
  }

  function startEditReward(reward) {
    setStatus("");
    setPartnerForm(null);
    setRewardForm({
      id: reward.id || reward.idRecompensa,
      descricao: reward.descricao || "",
      pontosNecessarios: reward.pontosNecessarios ?? "",
      quantidadeDisponivel: reward.quantidadeDisponivel ?? "",
      parceiroId: reward.parceiro?.id || "",
      ativo: reward.ativo !== false,
    });
  }

  async function submitPartner(event) {
    event.preventDefault();
    try {
      await onSavePartner({
        ...partnerForm,
        cidadeId: Number(partnerForm.cidadeId),
      });
      setPartnerForm(null);
      setStatus("Parceiro salvo.");
    } catch (error) {
      setStatus(extractErrorMessage(error));
    }
  }

  async function submitReward(event) {
    event.preventDefault();
    try {
      await onSaveReward({
        ...rewardForm,
        pontosNecessarios: Number(rewardForm.pontosNecessarios),
        quantidadeDisponivel: Number(rewardForm.quantidadeDisponivel),
        parceiroId: Number(rewardForm.parceiroId),
      });
      setRewardForm(null);
      setStatus("Recompensa salva.");
    } catch (error) {
      setStatus(extractErrorMessage(error));
    }
  }

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
          <strong className="summary-number">{parceiros.length}</strong>
          <span className="summary-label">Parceiros cadastrados</span>
          <button className="small-btn" type="button" onClick={startNewPartner}>+ Novo parceiro</button>
        </article>
        <article className="summary-card">
          <strong className="summary-number">{recompensas.length}</strong>
          <span className="summary-label">Recompensas cadastradas</span>
          <button className="small-btn" type="button" onClick={startNewReward}>+ Nova recompensa</button>
        </article>
      </div>

      {partnerForm ? (
        <form className="admin-form" onSubmit={submitPartner}>
          <h2>{partnerForm.id ? "Editar parceiro" : "Novo parceiro"}</h2>
          <input value={partnerForm.nome} onChange={(event) => setPartnerForm({ ...partnerForm, nome: event.target.value })} placeholder="Nome do parceiro" required />
          <input value={partnerForm.descricao} onChange={(event) => setPartnerForm({ ...partnerForm, descricao: event.target.value })} placeholder="Descricao" />
          <select value={partnerForm.cidadeId} onChange={(event) => setPartnerForm({ ...partnerForm, cidadeId: event.target.value })} required>
            <option value="">Selecione a cidade</option>
            {cidades.map((cidade) => (
              <option key={cidade.id} value={cidade.id}>{cidade.nome} - {cidade.estado}</option>
            ))}
          </select>
          <label className="check-row">
            <input type="checkbox" checked={partnerForm.ativo} onChange={(event) => setPartnerForm({ ...partnerForm, ativo: event.target.checked })} />
            Ativo
          </label>
          <div className="form-actions">
            <button className="small-btn" type="submit">Salvar parceiro</button>
            <button className="text-action" type="button" onClick={() => setPartnerForm(null)}>Cancelar</button>
          </div>
        </form>
      ) : null}

      {rewardForm ? (
        <form className="admin-form" onSubmit={submitReward}>
          <h2>{rewardForm.id ? "Editar recompensa" : "Nova recompensa"}</h2>
          <input value={rewardForm.descricao} onChange={(event) => setRewardForm({ ...rewardForm, descricao: event.target.value })} placeholder="Descricao da recompensa" required />
          <input value={rewardForm.pontosNecessarios} onChange={(event) => setRewardForm({ ...rewardForm, pontosNecessarios: event.target.value })} placeholder="Pontos necessarios" min="0" type="number" required />
          <input value={rewardForm.quantidadeDisponivel} onChange={(event) => setRewardForm({ ...rewardForm, quantidadeDisponivel: event.target.value })} placeholder="Quantidade disponivel" min="0" type="number" required />
          <select value={rewardForm.parceiroId} onChange={(event) => setRewardForm({ ...rewardForm, parceiroId: event.target.value })} required>
            <option value="">Selecione o parceiro</option>
            {parceiros.map((parceiro) => (
              <option key={parceiro.id} value={parceiro.id}>{parceiro.nome}</option>
            ))}
          </select>
          <label className="check-row">
            <input type="checkbox" checked={rewardForm.ativo} onChange={(event) => setRewardForm({ ...rewardForm, ativo: event.target.checked })} />
            Ativa
          </label>
          <div className="form-actions">
            <button className="small-btn" type="submit">Salvar recompensa</button>
            <button className="text-action" type="button" onClick={() => setRewardForm(null)}>Cancelar</button>
          </div>
        </form>
      ) : null}

      {status ? <div className="status admin-status">{status}</div> : null}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome parceiro</th>
              <th>Data cadastro</th>
              <th>Recompensa</th>
              <th>Pontos necessarios para ganhar</th>
              <th>Status</th>
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
                <td>{reward.ativo === false ? "Inativa" : "Ativa"}</td>
                <td>
                  <span className="actions">
                    <button className="icon-btn" type="button" onClick={() => startEditReward(reward)}>
                      Editar
                    </button>
                    <button className="icon-btn" type="button" onClick={() => onToggleReward(reward)}>
                      {reward.ativo === false ? "Ativar" : "Desativar"}
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-wrap partner-table">
        <table>
          <thead>
            <tr>
              <th>Parceiro</th>
              <th>Descricao</th>
              <th>Cidade</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {parceiros.map((parceiro) => (
              <tr key={parceiro.id}>
                <td><strong>{parceiro.nome}</strong></td>
                <td>{parceiro.descricao || "-"}</td>
                <td>{parceiro.cidade ? `${parceiro.cidade.nome} - ${parceiro.cidade.estado}` : "-"}</td>
                <td>{parceiro.ativo === false ? "Inativo" : "Ativo"}</td>
                <td>
                  <span className="actions">
                    <button className="icon-btn" type="button" onClick={() => startEditPartner(parceiro)}>Editar</button>
                    <button className="icon-btn" type="button" onClick={() => onTogglePartner(parceiro)}>
                      {parceiro.ativo === false ? "Ativar" : "Desativar"}
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

function AdminShell({
  data,
  email,
  activeTab,
  onTabChange,
  onLogout,
  onEmailChange,
  onSavePartner,
  onSaveReward,
  onTogglePartner,
  onToggleReward,
}) {
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
        {activeTab === "parceiros" && (
          <Partners
            cidades={data.cidades}
            parceiros={data.parceiros}
            recompensas={data.recompensas}
            onSavePartner={onSavePartner}
            onSaveReward={onSaveReward}
            onTogglePartner={onTogglePartner}
            onToggleReward={onToggleReward}
          />
        )}
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
      const [usuarios, parceiros, recompensas, feedbacks, cidades] = await Promise.all([
        request("/usuarios", {}, authToken),
        request("/parceiros", {}, authToken),
        request("/recompensas", {}, authToken),
        request("/feedbacks", {}, authToken),
        request("/cidades", {}, ""),
      ]);
      const userList = Array.isArray(usuarios) ? usuarios : [];
      const actionGroups = await Promise.all(
        userList
          .filter((user) => user.id)
          .map((user) => request(`/usuarios/${user.id}/acoes`, {}, authToken).catch(() => [])),
      );
      setData({
        usuarios: userList,
        parceiros: Array.isArray(parceiros) ? parceiros : [],
        recompensas: Array.isArray(recompensas) ? recompensas : [],
        cidades: Array.isArray(cidades) ? cidades : [],
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

  async function savePartner(form) {
    const path = form.id ? `/parceiros/${form.id}` : "/parceiros";
    const method = form.id ? "PUT" : "POST";

    await request(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.nome,
        descricao: form.descricao,
        cidadeId: form.cidadeId,
        ativo: form.ativo,
      }),
    });
    await loadData();
  }

  async function saveReward(form) {
    const path = form.id ? `/recompensas/${form.id}` : "/recompensas";
    const method = form.id ? "PUT" : "POST";

    await request(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descricao: form.descricao,
        pontosNecessarios: form.pontosNecessarios,
        quantidadeDisponivel: form.quantidadeDisponivel,
        parceiroId: form.parceiroId,
        ativo: form.ativo,
      }),
    });
    await loadData();
  }

  async function togglePartner(parceiro) {
    const nextActive = parceiro.ativo === false;
    await request(`/parceiros/${parceiro.id}/ativo?ativo=${nextActive}`, { method: "PATCH" });
    await loadData();
  }

  async function toggleReward(reward) {
    const id = reward.id || reward.idRecompensa;
    const nextActive = reward.ativo === false;
    await request(`/recompensas/${id}/ativo?ativo=${nextActive}`, { method: "PATCH" });
    await loadData();
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
      onSavePartner={savePartner}
      onSaveReward={saveReward}
      onTogglePartner={togglePartner}
      onToggleReward={toggleReward}
    />
  );
}
