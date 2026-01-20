"use client";

import { useState, useEffect } from "react";
import "./globals.css";

export default function Page() {

    // AUTH
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [token, setToken] = useState(null);

    // USER
    const [user, setUser] = useState(null);

    // CLIENTE
    const [oficinas, setOficinas] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [oficinaSelecionada, setOficinaSelecionada] = useState(null);

    const [veiculos, setVeiculos] = useState([]);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState("");
    const [servicoSelecionado, setServicoSelecionado] = useState("");
    const [dataHora, setDataHora] = useState("");
    const [marcacoes, setMarcacoes] = useState([]);

    // VEICULO
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [matricula, setMatricula] = useState("");
    const [ano, setAno] = useState("");

    // STAFF
    const [marcacoesOficina, setMarcacoesOficina] = useState([]);

    // ---------------- LOGIN ----------------
    const fazerLogin = async () => {
        try {
            const r = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const dados = await r.json();

            if (!r.ok) {
                setMensagem(dados.erro);
                return;
            }

            setUser(dados.user);
            setToken(dados.token);
            setMensagem("");
        } catch {
            setMensagem("Erro ao ligar ao servidor");
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    // ---------------- CLIENTE ----------------
    const carregarOficinas = async () => {
        const r = await fetch("http://localhost:3000/oficinas");
        setOficinas(await r.json());
    };

    const carregarServicos = async (id) => {
        const r = await fetch(`http://localhost:3000/oficinas/${id}/servicos`);
        setServicos(await r.json());
    };

    const carregarVeiculos = async () => {
        const r = await fetch(`http://localhost:3000/veiculos/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setVeiculos(await r.json());
    };

    const carregarMarcacoesCliente = async () => {
        const r = await fetch(`http://localhost:3000/marcacoes/cliente/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMarcacoes(await r.json());
    };

    const criarVeiculo = async () => {
        const r = await fetch("http://localhost:3000/veiculos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                marca,
                modelo,
                matricula,
                ano
            })
        });

        const dados = await r.json();

        if (r.ok) {
            setVeiculos([...veiculos, dados.veiculo]);
            setMarca(""); setModelo(""); setMatricula(""); setAno("");
        }
    };

    const criarMarcacao = async () => {
        await fetch("http://localhost:3000/marcacoes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                veiculo: veiculoSelecionado,
                oficina: oficinaSelecionada._id,
                servico: servicoSelecionado,
                dataHora
            })
        });

        carregarMarcacoesCliente();
    };

    // ---------------- STAFF ----------------
    const carregarMarcacoesOficina = async () => {
        const r = await fetch("http://localhost:3000/marcacoes/oficina", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMarcacoesOficina(await r.json());
    };

    const atualizarEstadoMarcacao = async (id, estado) => {
        await fetch(`http://localhost:3000/marcacoes/${id}/estado`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ estado })
        });

        carregarMarcacoesOficina();
    };


    // ---------------- EFFECT ----------------
    useEffect(() => {
        if (!user || !token) return;

        if (user.role === "cliente") {
            carregarOficinas();
            carregarVeiculos();
            carregarMarcacoesCliente();
        }

        if (user.role === "staff") {
            carregarMarcacoesOficina();
        }
    }, [user, token]);

    // ---------------- UI ----------------
    if (!user) {
        return (
            <div className="card">
                <h1>Login</h1>
                <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button onClick={fazerLogin}>Entrar</button>
                <p>{mensagem}</p>
            </div>
        );
    }

    return (
        <div className="app-container">
            <h1>Bem-vindo, {user.nome} ({user.role})</h1>
            <button onClick={logout}>Logout</button>

            {/* -------- CLIENTE -------- */}
            {user.role === "cliente" && (
                <>
                    <h2>Criar Veículo</h2>
                    <input placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} />
                    <input placeholder="Modelo" value={modelo} onChange={e => setModelo(e.target.value)} />
                    <input placeholder="Matrícula" value={matricula} onChange={e => setMatricula(e.target.value)} />
                    <input placeholder="Ano" value={ano} onChange={e => setAno(e.target.value)} />
                    <button onClick={criarVeiculo}>Criar</button>

                    <h2>Oficinas</h2>
                    {oficinas.map(o => (
                        <div key={o._id}>
                            <strong>{o.nome}</strong>
                            <button onClick={() => {
                                setOficinaSelecionada(o);
                                carregarServicos(o._id);
                            }}>
                                Ver serviços
                            </button>
                        </div>
                    ))}

                    {oficinaSelecionada && (
                        <>
                            <h3>Nova Marcação</h3>

                            <select onChange={e => setVeiculoSelecionado(e.target.value)}>
                                <option value="">Veículo</option>
                                {veiculos.map(v => (
                                    <option key={v._id} value={v._id}>
                                        {v.marca} ({v.matricula})
                                    </option>
                                ))}
                            </select>

                            <select onChange={e => setServicoSelecionado(e.target.value)}>
                                <option value="">Serviço</option>
                                {servicos.map(s => (
                                    <option key={s._id} value={s._id}>{s.nome}</option>
                                ))}
                            </select>

                            <input type="datetime-local" onChange={e => setDataHora(e.target.value)} />
                            <button onClick={criarMarcacao}>Marcar</button>
                        </>
                    )}

                    <h2>Minhas Marcações</h2>
                    {marcacoes.map(m => (
                        <div key={m._id}>
                            {m.servico?.nome} - {new Date(m.dataHora).toLocaleString()}
                        </div>
                    ))}
                </>
            )}

            {/* -------- STAFF -------- */}
            {user.role === "staff" && (
                <>
                    <h2>Marcações da Minha Oficina</h2>

                    {marcacoesOficina.length === 0 && (
                        <p>Sem marcações.</p>
                    )}

                    {marcacoesOficina.map(m => (
                        <div key={m._id} className="card">
                            <strong>{m.servico?.nome}</strong><br />
                            Cliente: {m.cliente?.nome}<br />
                            Veículo: {m.veiculo?.matricula}<br />
                            Data: {new Date(m.dataHora).toLocaleString()}<br />
                            Estado: <strong>{m.estado}</strong>

                            <div style={{ marginTop: "10px" }}>
                                <button onClick={() => atualizarEstadoMarcacao(m._id, "em_progresso")}>
                                    Em progresso
                                </button>

                                <button onClick={() => atualizarEstadoMarcacao(m._id, "concluida")}>
                                    Concluir
                                </button>

                                <button
                                    className="danger"
                                    onClick={() => atualizarEstadoMarcacao(m._id, "cancelada")}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}

        </div>
    );
}
