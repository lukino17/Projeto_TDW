"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VeiculosPage() {
    const router = useRouter();

    const [token, setToken] = useState("");
    const [user, setUser] = useState(null);

    const [veiculos, setVeiculos] = useState([]);
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [matricula, setMatricula] = useState("");
    const [ano, setAno] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [erro, setErro] = useState("");
    const [msg, setMsg] = useState("");

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
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!user || !token) return;
        carregar();
        // eslint-disable-next-line
    }, [user, token]);

    const carregar = async () => {
        try {
            setLoading(true);
            setErro("");

            const r = await fetch(`http://localhost:3000/veiculos/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const dados = await r.json();

            if (!r.ok) {
                setErro(dados.erro || "Erro ao carregar veículos");
                setVeiculos([]);
                return;
            }

            setVeiculos(Array.isArray(dados) ? dados.filter(Boolean) : []);
        } catch {
            setErro("Erro ao ligar ao servidor");
            setVeiculos([]);
        } finally {
            setLoading(false);
        }
    };

    const criarVeiculo = async () => {
        setErro("");
        setMsg("");

        if (!marca || !modelo || !matricula || !ano) {
            setErro("Preenche todos os campos.");
            return;
        }

        try {
            setCreating(true);

            const r = await fetch("http://localhost:3000/veiculos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ marca, modelo, matricula, ano }),
            });

            const dados = await r.json();

            if (!r.ok) {
                setErro(dados.erro || "Erro ao criar veículo");
                return;
            }

            const novo = dados.veiculo || dados; // dependendo do teu backend
            if (novo && novo._id) setVeiculos((prev) => [novo, ...prev.filter(Boolean)]);

            setMarca("");
            setModelo("");
            setMatricula("");
            setAno("");

            setMsg("✅ Veículo adicionado!");
            setTimeout(() => setMsg(""), 2500);
        } catch {
            setErro("Erro ao ligar ao servidor");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Veículos</h1>
                <p className="page-subtitle">Gere os teus veículos para poderes marcar serviços.</p>
            </div>

            {msg && <div className="alert success">{msg}</div>}
            {erro && <div className="alert error">{erro}</div>}

            <div className="card">
                <h2 className="section-title">Adicionar Veículo</h2>

                <div className="form-grid">
                    <div>
                        <label className="label">Marca</label>
                        <input value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Ex: BMW" />
                    </div>

                    <div>
                        <label className="label">Modelo</label>
                        <input value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Ex: Série 1" />
                    </div>

                    <div>
                        <label className="label">Matrícula</label>
                        <input value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="AA-00-BB" />
                    </div>

                    <div>
                        <label className="label">Ano</label>
                        <input value={ano} onChange={(e) => setAno(e.target.value)} placeholder="2020" />
                    </div>
                </div>

                <button className="primary-btn full" onClick={criarVeiculo} disabled={creating}>
                    {creating ? "A adicionar…" : "➕ Adicionar veículo"}
                </button>
            </div>

            <div className="card" style={{ marginTop: 16 }}>
                <div className="row-between">
                    <h2 className="section-title">Meus Veículos</h2>
                    <button className="ghost-btn" onClick={() => router.push("/cliente")}>
                        Voltar
                    </button>
                </div>

                {loading ? (
                    <p className="muted">A carregar…</p>
                ) : veiculos.length === 0 ? (
                    <p className="muted">Ainda não tens veículos.</p>
                ) : (
                    <div className="grid">
                        {veiculos.filter(Boolean).map((v) => (
                            <div key={v._id} className="card veiculo-card">
                                <h3 style={{ margin: 0 }}>
                                    {v.marca || "—"} {v.modelo || ""}
                                </h3>
                                <p className="muted">
                                    <strong>Matrícula:</strong> {v.matricula || "—"}
                                    <br />
                                    <strong>Ano:</strong> {v.ano || "—"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
