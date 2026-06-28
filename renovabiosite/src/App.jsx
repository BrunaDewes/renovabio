import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://renovabio-production.up.railway.app";

const emptyData = {
  usuarios: [],
  parceiros: [],
  recompensas: [],
  cidades: [],
  feedbacks: [],
  acoes: [],
  desafios: [],
  trocas: [],
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

function isCurrentMonth(value) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

function metric(label, value, extra = "") {
  return (
    <article className={`metric ${extra}`}>
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
    </article>
  );
}

function BarChart({ title, data }) {
  const max = Math.max(...data.map((item) => item.value), 0);

  return (
    <article className="chart-card">
      <h2 className="chart-title">{title}</h2>
      {max === 0 ? (
        <div className="empty-chart">Sem dados suficientes para gerar este gráfico.</div>
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

function PieChart({ title, data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let current = 0;
  const colors = ["#8fd10f", "#1f9bd1", "#4fbd7a", "#166b9a"];
  const gradient = data
    .map((item, index) => {
      const start = current;
      const end = current + (item.value / total) * 100;
      current = end;
      return `${colors[index % colors.length]} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <article className="chart-card pie-card">
      <h2 className="chart-title">{title}</h2>
      {total === 0 ? (
        <div className="empty-chart">Sem dados suficientes para gerar este gráfico.</div>
      ) : (
        <div className="pie-layout">
          <div className="pie" style={{ background: `conic-gradient(${gradient})` }}>
            <span>{total}</span>
          </div>
          <div className="pie-legend">
            {data.map((item, index) => (
              <div className="legend-row" key={item.label}>
                <span className="legend-color" style={{ backgroundColor: colors[index % colors.length] }} />
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function AuthScreen({ screen, email, onScreenChange, onLogin, onSignup, onRecoverPassword }) {
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

    if (!form.novaSenha.value.trim()) {
      setStatus("Informe a nova senha.");
      return;
    }

    if (form.novaSenha.value !== form.confirmarSenha.value) {
      setStatus("As senhas não conferem.");
      return;
    }

    setStatus("Alterando senha...");
    onRecoverPassword(form.email.value.trim(), form.novaSenha.value, setStatus);
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
              <p className="auth-copy">Informe o email e cadastre uma nova senha</p>
              <input className="field" name="email" type="email" placeholder="Email" required />
              <input className="field" name="novaSenha" type="password" placeholder="Nova senha" required />
              <input className="field" name="confirmarSenha" type="password" placeholder="Confirmar nova senha" required />
              <button className="primary-btn" type="submit">
                Alterar senha
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
  const { usuarios, parceiros, recompensas, acoes, desafios, trocas } = data;
  const citizenUsers = usuarios.filter((user) => user.tipo !== "PREFEITURA");
  const activeUsers = citizenUsers.filter((user) => user.ativo === true).length;
  const activePartners = parceiros.filter((parceiro) => parceiro.ativo !== false).length;
  const totalPoints = citizenUsers.reduce((total, user) => total + (Number(user.pontuacao ?? user.pontuacaoAtual) || 0), 0);
  const actions = acoes.length;
  const newUsersThisMonth = citizenUsers.filter((user) => isCurrentMonth(user.dataCadastro)).length;
  const actionsThisMonth = acoes.filter((action) => isCurrentMonth(action.dataAcao)).length;
  const challengeTitles = new Map(desafios.map((desafio) => [Number(desafio.id || desafio.idDesafio), desafio.titulo || "Desafio"]));
  const pointsByUser = citizenUsers
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
  const mostCompletedChallenges = Object.entries(
    acoes
      .filter((action) => action.tipoAcao === "DESAFIO")
      .reduce((groups, action) => {
        const id = Number(action.idReferencia);
        const label = challengeTitles.get(id) || `Desafio ${id || ""}`.trim();
        groups[label] = (groups[label] || 0) + 1;
        return groups;
      }, {}),
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const mostRedeemedRewards = Object.entries(
    trocas.reduce((groups, troca) => {
      const reward = troca.recompensaDescricao || "Recompensa";
      const partner = troca.parceiroNome ? ` (${troca.parceiroNome})` : "";
      const label = `${reward}${partner}`;
      groups[label] = (groups[label] || 0) + 1;
      return groups;
    }, {}),
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <>
      <div className="metrics">
        {metric("Usuários cadastrados", citizenUsers.length)}
        {metric("Usuários ativos", activeUsers)}
        {metric("Parceiros ativos", activePartners)}
        {metric("Recompensas ativas", recompensas.filter((item) => item.ativo !== false).length)}
        {metric("Novos usuários no mês", newUsersThisMonth)}
        {metric("Ações sustentáveis no mês", actionsThisMonth)}
        {metric("Total de ações sustentáveis", actions, "wide")}
        {metric("Pontuação total gerada", totalPoints, "wide")}
      </div>
      <div className="charts">
        <PieChart title="Ações sustentáveis por tipo" data={actionsByType} />
        <BarChart title="Ranking dos 5 usuários com maior pontuação" data={pointsByUser} />
        <BarChart title="Desafios mais realizados" data={mostCompletedChallenges} />
        <BarChart title="Recompensas mais resgatadas" data={mostRedeemedRewards} />
      </div>
    </>
  );
}

function extractErrorMessage(error) {
  if (error?.status === 403 && error?.path?.startsWith("/parceiros/")) {
    return "Não foi possível excluir este parceiro. Confirme se você está logada na prefeitura da mesma cidade dele.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Não foi possível conectar com a API.";
}

function Partners({
  parceiros,
  recompensas,
  onSavePartner,
  onSaveReward,
  onTogglePartner,
  onToggleReward,
  onDeletePartner,
  onDeleteReward,
}) {
  const [search, setSearch] = useState("");
  const [tableView, setTableView] = useState("recompensas");
  const [partnerForm, setPartnerForm] = useState(null);
  const [rewardForm, setRewardForm] = useState(null);
  const [status, setStatus] = useState("");

  const filteredRewards = useMemo(() => {
    const term = search.trim().toLowerCase();
    return recompensas.filter((reward) => `${reward.parceiro?.nome || ""} ${reward.descricao}`.toLowerCase().includes(term));
  }, [recompensas, search]);

  const filteredPartners = useMemo(() => {
    const term = search.trim().toLowerCase();
    return parceiros.filter((parceiro) =>
      `${parceiro.nome || ""} ${parceiro.descricao || ""} ${parceiro.cidade?.nome || ""}`.toLowerCase().includes(term),
    );
  }, [parceiros, search]);

  function startNewPartner() {
    setStatus("");
    setRewardForm(null);
    setTableView("parceiros");
    setPartnerForm({
      id: null,
      nome: "",
      descricao: "",
      ativo: true,
    });
  }

  function startEditPartner(parceiro) {
    setStatus("");
    setRewardForm(null);
    setTableView("parceiros");
    setPartnerForm({
      id: parceiro.id,
      nome: parceiro.nome || "",
      descricao: parceiro.descricao || "",
      ativo: parceiro.ativo !== false,
    });
  }

  function startNewReward() {
    setStatus("");
    setPartnerForm(null);
    setTableView("recompensas");
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
    setTableView("recompensas");
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

  async function deletePartner(parceiro) {
    const confirmed = window.confirm(`Excluir o parceiro "${parceiro.nome}" e suas recompensas?`);
    if (!confirmed) return;

    try {
      await onDeletePartner(parceiro);
      setPartnerForm(null);
      setStatus("Parceiro excluído.");
    } catch (error) {
      setStatus(extractErrorMessage(error));
    }
  }

  async function deleteReward(reward) {
    const confirmed = window.confirm(`Excluir a recompensa "${reward.descricao}"?`);
    if (!confirmed) return;

    try {
      await onDeleteReward(reward);
      setRewardForm(null);
      setStatus("Recompensa excluída.");
    } catch (error) {
      setStatus(extractErrorMessage(error));
    }
  }

  return (
    <>
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

      <div className="table-toolbar">
        <div className="segmented" aria-label="Selecionar tabela">
          <button className={tableView === "recompensas" ? "active" : ""} type="button" onClick={() => setTableView("recompensas")}>
            Recompensas
          </button>
          <button className={tableView === "parceiros" ? "active" : ""} type="button" onClick={() => setTableView("parceiros")}>
            Parceiros
          </button>
        </div>
        <input
          className="search"
          type="search"
          placeholder={tableView === "recompensas" ? "Buscar por parceiro ou recompensa" : "Buscar por parceiro ou descrição"}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {partnerForm ? (
        <form className="admin-form" onSubmit={submitPartner}>
          <h2>{partnerForm.id ? "Editar parceiro" : "Novo parceiro"}</h2>
          <input value={partnerForm.nome} onChange={(event) => setPartnerForm({ ...partnerForm, nome: event.target.value })} placeholder="Nome do parceiro" required />
          <input value={partnerForm.descricao} onChange={(event) => setPartnerForm({ ...partnerForm, descricao: event.target.value })} placeholder="Descrição" />
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
          <input value={rewardForm.descricao} onChange={(event) => setRewardForm({ ...rewardForm, descricao: event.target.value })} placeholder="Descrição da recompensa" required />
          <input value={rewardForm.pontosNecessarios} onChange={(event) => setRewardForm({ ...rewardForm, pontosNecessarios: event.target.value })} placeholder="Pontos necessários" min="0" type="number" required />
          <input value={rewardForm.quantidadeDisponivel} onChange={(event) => setRewardForm({ ...rewardForm, quantidadeDisponivel: event.target.value })} placeholder="Quantidade disponível" min="0" type="number" required />
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

      {tableView === "recompensas" ? (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome parceiro</th>
              <th>Data cadastro</th>
              <th>Recompensa</th>
              <th>Pontos necessários para ganhar</th>
              <th>Status</th>
              <th>Ações</th>
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
                    <button className="icon-btn danger" type="button" onClick={() => deleteReward(reward)}>
                      Excluir
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ) : (

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Parceiro</th>
              <th>Descrição</th>
              <th>Cidade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.map((parceiro) => (
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
                    <button className="icon-btn danger" type="button" onClick={() => deletePartner(parceiro)}>
                      Excluir
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
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

function Settings({ email, onEmailChange, onPasswordChange }) {
  const [status, setStatus] = useState("");
  const [nextEmail, setNextEmail] = useState(email);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  async function submitEmail(event) {
    event.preventDefault();
    setSavingEmail(true);
    setStatus("");

    try {
      await onEmailChange(nextEmail.trim() || email);
      setStatus("Email salvo.");
    } catch (error) {
      setStatus(extractErrorMessage(error));
    } finally {
      setSavingEmail(false);
    }
  }

  async function submitPassword(event) {
    event.preventDefault();
    setStatus("");

    if (!newPassword.trim()) {
      setStatus("Informe a nova senha.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("As senhas não conferem.");
      return;
    }

    setSavingPassword(true);

    try {
      await onPasswordChange(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setStatus("Senha alterada.");
    } catch (error) {
      setStatus(extractErrorMessage(error));
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="settings">
      <form className="settings-card" onSubmit={submitEmail}>
        <h2>Email da Prefeitura</h2>
        <div className="settings-row">
          <input className="field light" type="email" value={nextEmail} onChange={(event) => setNextEmail(event.target.value)} />
          <button className="pill-btn" type="submit" disabled={savingEmail}>
            {savingEmail ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
      <form className="settings-card" onSubmit={submitPassword}>
        <h2>Alterar senha</h2>
        <div className="settings-row">
          <div className="password-stack">
            <input
              className="field light"
              type="password"
              placeholder="Nova senha"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <input
              className="field light"
              type="password"
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
          <button className="pill-btn" type="submit" disabled={savingPassword}>
            {savingPassword ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
      <div className="status">{status}</div>
    </div>
  );
}

function AdminShell({
  data,
  email,
  activeTab,
  onTabChange,
  onLogout,
  onEmailChange,
  onPasswordChange,
  onSavePartner,
  onSaveReward,
  onTogglePartner,
  onToggleReward,
  onDeletePartner,
  onDeleteReward,
}) {
  const tabs = [
    ["inicio", "Inicio"],
    ["parceiros", "Parceiros e recompensas"],
    ["feedbacks", "Feedbacks"],
    ["configuracoes", "Configurações"],
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
            parceiros={data.parceiros}
            recompensas={data.recompensas}
            onSavePartner={onSavePartner}
            onSaveReward={onSaveReward}
            onTogglePartner={onTogglePartner}
            onToggleReward={onToggleReward}
            onDeletePartner={onDeletePartner}
            onDeleteReward={onDeleteReward}
          />
        )}
        {activeTab === "feedbacks" && <Feedbacks feedbacks={data.feedbacks} />}
        {activeTab === "configuracoes" && (
          <Settings email={email} onEmailChange={onEmailChange} onPasswordChange={onPasswordChange} />
        )}
      </div>
    </section>
  );
}

export default function App() {
  const [screen, setScreen] = useState("login");
  const [activeTab, setActiveTab] = useState("inicio");
  const [data, setData] = useState(emptyData);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(localStorage.getItem("renovabioToken") || "");

  async function request(path, options = {}, authToken) {
    const headers = { ...(options.headers || {}) };
    const effectiveToken = authToken === undefined ? token || localStorage.getItem("renovabioToken") || "" : authToken;
    if (effectiveToken) headers.Authorization = `Bearer ${effectiveToken}`;
    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    if (!response.ok) {
      let message = `Erro ${response.status} ao chamar ${path}`;

      try {
        const payload = await response.json();
        message = payload.message || payload.detail || payload.error || message;
      } catch {
        const text = await response.text().catch(() => "");
        if (text) message = text;
      }

      const error = new Error(message);
      error.status = response.status;
      error.path = path;
      throw error;
    }

    if (response.status === 204) return null;

    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  async function loadData(authToken = token) {
    if (!authToken) {
      setData(emptyData);
      return;
    }

    try {
      const [usuarios, parceiros, recompensas, feedbacks, cidades, desafios, trocas] = await Promise.all([
        request("/usuarios", {}, authToken),
        request("/parceiros", {}, authToken),
        request("/recompensas", {}, authToken),
        request("/feedbacks", {}, authToken),
        request("/cidades", {}, ""),
        request("/desafios", {}, "").catch(() => []),
        request("/recompensas/trocas", {}, authToken).catch(() => []),
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
        desafios: Array.isArray(desafios) ? desafios : [],
        trocas: Array.isArray(trocas) ? trocas : [],
      });
    } catch (error) {
      setData(emptyData);
      throw error;
    }
  }

  async function login(nextEmail, password, setStatus) {
    let loginValidated = false;

    try {
      const user = await request("/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: nextEmail, senha: password }),
      });
      const nextToken = user.token || "";

      if (!Object.hasOwn(user, "tipo")) {
        throw new Error("A API não retornou o tipo do usuário. Publique a API atualizada antes de acessar o painel.");
      }

      if (user.tipo !== "PREFEITURA") {
        throw new Error("Este acesso é exclusivo para usuários do tipo PREFEITURA.");
      }

      loginValidated = true;
      setToken(nextToken);
      setEmail(nextEmail);
      localStorage.setItem("renovabioToken", nextToken);
      await loadData(nextToken);
      setStatus("");
      setScreen("admin");
    } catch (error) {
      setToken("");
      localStorage.removeItem("renovabioToken");
      if (!loginValidated && (error?.status === 401 || error?.status === 403)) {
        setStatus("Email ou senha incorretos.");
      } else {
        setStatus(extractErrorMessage(error));
      }
    }
  }

  async function signupPrefeitura(nextEmail, cityName, password, setStatus) {
    try {
      const cidades = await request("/cidades", {}, "");
      const cidade = Array.isArray(cidades)
        ? cidades.find((item) => normalizeText(item.nome) === normalizeText(cityName))
        : null;

      if (!cidade) {
        throw new Error("Cidade não encontrada. Digite o nome igual ao cadastro da API.");
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
      setStatus("Cadastro concluído. Faça login para acessar o painel.");
      setTimeout(() => setScreen("login"), 900);
    } catch (error) {
      setStatus(extractErrorMessage(error));
    }
  }

  async function recoverPassword(nextEmail, newPassword, setStatus) {
    try {
      await request(
        "/usuarios/recuperar-senha",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: nextEmail, novaSenha: newPassword }),
        },
        "",
      );

      setEmail(nextEmail);
      setStatus("Senha alterada. Faça login com a nova senha.");
      setTimeout(() => setScreen("login"), 1000);
    } catch (error) {
      setStatus(extractErrorMessage(error));
    }
  }

  async function updateEmail(nextEmail) {
    const user = await request("/usuarios/me/email", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: nextEmail }),
    });
    const savedEmail = user?.email || nextEmail;
    setEmail(savedEmail);
  }

  async function updatePassword(newPassword) {
    await request("/usuarios/me/senha", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ novaSenha: newPassword }),
    });
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

  async function deletePartner(parceiro) {
    await request(`/parceiros/${parceiro.id}`, { method: "DELETE" });
    await loadData();
  }

  async function deleteReward(reward) {
    const id = reward.id || reward.idRecompensa;
    await request(`/recompensas/${id}`, { method: "DELETE" });
    await loadData();
  }

  function logout() {
    setScreen("login");
    setToken("");
    localStorage.removeItem("renovabioToken");
  }

  useEffect(() => {
    localStorage.removeItem("renovabioEmail");

    if (token) {
      loadData(token)
        .then(() => setScreen("admin"))
        .catch(() => {
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
        onRecoverPassword={recoverPassword}
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
      onPasswordChange={updatePassword}
      onSavePartner={savePartner}
      onSaveReward={saveReward}
      onTogglePartner={togglePartner}
      onToggleReward={toggleReward}
      onDeletePartner={deletePartner}
      onDeleteReward={deleteReward}
    />
  );
}
