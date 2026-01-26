"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/* ---------- HELPERS ---------- */
function badgeEstado(estado) {
    const e = (estado || "").toLowerCase();
    if (e === "concluida") return "estado green";
    if (e === "em_progresso") return "estado orange";
    if (e === "cancelada") return "estado red";
    return "estado blue";
}

/* ---------- COMPONENT ---------- */
export default function ClienteMarcacoesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const oficinaIdParam = searchParams.get("oficinaId");

    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");

    const [loading, setLoading] = useState(true);
    const [loadingTurnos, setLoadingTurnos] = useState(false);
    const [loadingMarcacao, setLoadingMarcacao] = useState(false);

    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    const [oficinas, setOficinas] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [turnos, setTurnos] = useState([]);

    const [oficinaSelecionada, setOficinaSelecionada] = useState("");
    const [veiculoSelecionado, setVeiculoSelecionado] = useState("");
    const [servicoSelecionado, setServicoSelecionado] = useState("");
    const [turnoSelecionado, setTurnoSelecionado] = useState("");

    const [minhasMarcacoes, setMinhasMarcacoes] = useState([]);

    /* ---------- AUTH ---------- */
    useEffect(() => {
        const u = localStorage.getItem("user");
        const t = localStorage.getItem("token");

        if (!u || !t) {
            router.push("/");
            return;
        }

        const parsed = JSON.parse(u);
        if (parsed.role !== "cliente") {
            router.push("/");
            return;
        }

        setUser(parsed);
        setToken(t);
    }, [router]);

    /* ---------- LOAD ---------- */
    useEffect(() => {
        if (!user || !token) return;

        (async () => {
            try {
                setLoading(true);

                const [rOf, rV, rM] = await Promise.all([
                    fetch("http://localhost:3000/oficinas"),
                    fetch(`http://localhost:3000/veiculos/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`http://localhost:3000/marcacoes/cliente/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setOficinas(await rOf.json());
                setVeiculos(await rV.json());
                setMinhasMarcacoes(await rM.json());

                if (oficinaIdParam) setOficinaSelecionada(oficinaIdParam);
            } catch {
                setErro("Erro ao ligar ao servidor");
            } finally {
                setLoading(false);
            }
        })();
    }, [user, token, oficinaIdParam]);

    /* ---------- DEPENDÊNCIAS ---------- */
    useEffect(() => {
        if (!oficinaSelecionada || !token) return;

        setServicos([]);
        setTurnos([]);

        fetch(`http://localhost:3000/oficinas/${oficinaSelecionada}/servicos`)
            .then(r => r.json())
            .then(setServicos);

        fetch(`http://localhost:3000/turnos/disponiveis/${oficinaSelecionada}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(setTurnos);
    }, [oficinaSelecionada, token]);

    const podeCriar = useMemo(() => (
        oficinaSelecionada &&
        veiculoSelecionado &&
        servicoSelecionado &&
        turnoSelecionado &&
        !loadingMarcacao
    ), [oficinaSelecionada, veiculoSelecionado, servicoSelecionado, turnoSelecionado, loadingMarcacao]);

    const carregarTurnos = async (oficinaId) => {
        try {
            setLoadingTurnos(true);
            setErro("");

            const r = await fetch(
                `http://localhost:3000/turnos/disponiveis/${oficinaId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const dados = await r.json();

            if (!r.ok) {
                setErro(dados.erro || "Erro ao carregar turnos");
                setTurnos([]);
                return;
            }

            // backend já deve devolver só disponíveis
            setTurnos(Array.isArray(dados) ? dados : []);
        } catch {
            setTurnos([]);
            setErro("Erro ao carregar turnos");
        } finally {
            setLoadingTurnos(false);
        }
    };
    const criarMarcacao = async () => {
        setMensagem("");
        setErro("");

        if (!oficinaSelecionada || !veiculoSelecionado || !servicoSelecionado || !turnoSelecionado) {
            setErro("Preenche todos os campos.");
            return;
        }

        try {
            setLoadingMarcacao(true);

            const r = await fetch("http://localhost:3000/marcacoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    veiculo: veiculoSelecionado,
                    oficina: oficinaSelecionada,
                    servico: servicoSelecionado,
                    turno: turnoSelecionado,
                }),
            });

            const dados = await r.json();

            if (!r.ok) {
                setErro(dados.erro || "Erro ao criar marcação");
                return;
            }

            setMensagem("Marcação criada! A vaga do turno foi atualizada.");

            // refresh turnos e marcações
            await Promise.all([
                carregarTurnos(oficinaSelecionada),
                (async () => {
                    const rM = await fetch("http://localhost:3000/marcacoes/cliente", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const m = await rM.json();
                    setMinhasMarcacoes(Array.isArray(m) ? m : []);
                })(),
            ]);

            setTurnoSelecionado("");
        } catch (e) {
            setErro("Erro ao ligar ao servidor");
        } finally {
            setLoadingMarcacao(false);
            setTimeout(() => setMensagem(""), 3500);
        }
    };


    if (loading) return <p>A carregar…</p>;

    return (


            <div className="page">
                <div className="page-header">
                    <h1 className="page-title">Marcações</h1>
                    <p className="page-subtitle">Cria uma nova marcação escolhendo turno (com vagas).</p>
                </div>

                {mensagem && <div className="alert success">{mensagem}</div>}
                {erro && <div className="alert error">{erro}</div>}

                {/* NOVA MARCAÇÃO */}
                <div className="card">
                    <h2 className="section-title">Nova Marcação</h2>

                    <div className="form-grid">
                        <div>
                            <label className="label">Oficina</label>
                            <select
                                value={oficinaSelecionada}
                                onChange={(e) => setOficinaSelecionada(e.target.value)}
                            >
                                <option value="">Selecionar Oficina</option>
                                {oficinas.map((o) => (
                                    <option key={o._id} value={o._id}>{o.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Veículo</label>
                            <select
                                value={veiculoSelecionado}
                                onChange={(e) => setVeiculoSelecionado(e.target.value)}
                            >
                                <option value="">Selecionar Veículo</option>
                                {veiculos.map((v) => (
                                    <option key={v._id} value={v._id}>
                                        {v.marca} ({v.matricula})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Serviço</label>
                            <select
                                value={servicoSelecionado}
                                onChange={(e) => setServicoSelecionado(e.target.value)}
                                disabled={!oficinaSelecionada}
                            >
                                <option value="">{oficinaSelecionada ? "Selecionar Serviço" : "Escolhe uma oficina primeiro"}</option>
                                {servicos.map((s) => (
                                    <option key={s._id} value={s._id}>{s.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Turno</label>
                            <select
                                value={turnoSelecionado}
                                onChange={(e) => setTurnoSelecionado(e.target.value)}
                                disabled={!oficinaSelecionada || loadingTurnos}
                            >
                                <option value="">
                                    {loadingTurnos
                                        ? "A carregar turnos…"
                                        : oficinaSelecionada
                                            ? "Selecionar Turno"
                                            : "Escolhe uma oficina primeiro"}
                                </option>

                                {turnos.map(t => {
                                    const agora = new Date();

                                    const dataFim = new Date(t.data);
                                    const [h, m] = t.horaFim.split(":");
                                    dataFim.setHours(h, m, 0, 0);

                                    const passou = dataFim <= agora;
                                    const disponiveis = t.vagasTotais - t.vagasOcupadas;

                                    return (
                                        <option
                                            key={t._id}
                                            value={t._id}
                                            disabled={passou || disponiveis === 0}
                                        >
                                            {new Date(t.data).toLocaleDateString("pt-PT")} —{" "}
                                            {t.horaInicio} às {t.horaFim}
                                            {" | "}
                                            {passou
                                                ? "Turno passado"
                                                : disponiveis === 0
                                                    ? "Lotado"
                                                    : `${disponiveis} vagas`}
                                        </option>
                                    );
                                })}

                            </select>

                            {!loadingTurnos && oficinaSelecionada && turnos.length === 0 && (
                                <p className="muted" style={{ marginTop: 6 }}>
                                    Sem turnos disponíveis para esta oficina.
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        className="success-btn full"
                        disabled={!podeCriar}
                        onClick={criarMarcacao}
                    >
                        {loadingMarcacao ? "A criar…" : "Criar Marcação"}
                    </button>
                </div>

                {/* MINHAS MARCAÇÕES */}
                <div className="card" style={{ marginTop: 16 }}>
                    <div className="row-between">
                        <h2 className="section-title">Minhas Marcações</h2>
                        <button className="ghost-btn" onClick={() => router.push("/cliente")}>
                            Voltar às oficinas
                        </button>
                    </div>

                    {minhasMarcacoes.length === 0 ? (
                        <p className="muted">Ainda não tens marcações.</p>
                    ) : (
                        <div className="list">
                            {minhasMarcacoes.map((m) => (
                                <div key={m._id} className="list-item">
                                    <div className="list-main">
                                        <div className="list-title">
                                            {m.servico?.nome || "Serviço"}{" "}
                                            <span className={badgeEstado(m.estado)}>{m.estado}</span>
                                        </div>
                                        <div className="muted">
                                            Oficina: {m.oficina?.nome || "—"} • Veículo: {m.veiculo?.matricula || "—"}
                                        </div>
                                        <div className="muted">
                                            Turno: {m.turno
                                            ? `${new Date(m.turno.data).toLocaleDateString("pt-PT")} — ${m.turno.horaInicio} às ${m.turno.horaFim}`
                                            : "—"}
                                        </div>


                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>



    );
}
