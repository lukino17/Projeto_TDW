"use client";

import { useState, useEffect } from "react";
import "./globals.css";

export default function Page() {

    // LOGIN
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensagem, setMensagem] = useState("");

    // UTILIZADOR LOGADO
    const [user, setUser] = useState(null);

    // OFICINAS
    const [oficinas, setOficinas] = useState([]);

    // OFICINA SELECIONADA
    const [oficinaSelecionada, setOficinaSelecionada] = useState(null);

    // SERVIÇOS
    const [servicos, setServicos] = useState([]);

    // VEÍCULO
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [matricula, setMatricula] = useState("");
    const [ano, setAno] = useState("");

    const [veiculos, setVeiculos] = useState([]);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState("");

    // MARCAÇÕES
    const [servicoSelecionado, setServicoSelecionado] = useState("");
    const [dataHora, setDataHora] = useState("");
    const [marcacoes, setMarcacoes] = useState([]);

    // LOGIN
    const fazerLogin = async () => {
        try {
            const resposta = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                setUser(dados.user);
                setMensagem("");
            } else {
                setMensagem(dados.erro);
            }
        } catch {
            setMensagem("Erro ao ligar ao servidor");
        }
    };

    const logout = () => {
        setUser(null);
        setEmail("");
        setPassword("");
    };

    // CARREGAR DADOS
    const carregarOficinas = async () => {
        const r = await fetch("http://localhost:3000/oficinas");
        setOficinas(await r.json());
    };

    const carregarVeiculos = async () => {
        const r = await fetch(`http://localhost:3000/veiculos/${user.id}`);
        setVeiculos(await r.json());
    };

    const carregarMarcacoes = async () => {
        const r = await fetch(`http://localhost:3000/marcacoes/cliente/${user.id}`);
        setMarcacoes(await r.json());
    };

    const carregarServicos = async (id) => {
        const r = await fetch(`http://localhost:3000/oficinas/${id}/servicos`);
        setServicos(await r.json());
    };

    // CRIAR VEÍCULO
    const criarVeiculo = async () => {
        const r = await fetch("http://localhost:3000/veiculos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                marca,
                modelo,
                matricula,
                ano,
                cliente: user.id
            })
        });

        const dados = await r.json();

        if (r.ok) {
            setVeiculos([...veiculos, dados.veiculo]);
            setVeiculoSelecionado(dados.veiculo._id);
            setMarca("");
            setModelo("");
            setMatricula("");
            setAno("");
        }
    };

    // CRIAR MARCAÇÃO
    const criarMarcacao = async () => {
        await fetch("http://localhost:3000/marcacoes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cliente: user.id,
                veiculo: veiculoSelecionado,
                oficina: oficinaSelecionada._id,
                servico: servicoSelecionado,
                dataHora
            })
        });

        carregarMarcacoes();
    };

    const cancelarMarcacao = async (id) => {
        await fetch(`http://localhost:3000/marcacoes/${id}/cancelar`, {
            method: "PUT"
        });
        carregarMarcacoes();
    };

    useEffect(() => {
        if (user) {
            carregarOficinas();
            carregarVeiculos();
            carregarMarcacoes();
        }
    }, [user]);

    return (
        <div className="app-container">

            {!user && (
                <div className="card">
                    <h1>Login</h1>

                    <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

                    <button onClick={fazerLogin}>Entrar</button>
                    <p>{mensagem}</p>
                </div>
            )}

            {user && (
                <>
                    <h1>Bem-vindo, {user.nome}</h1>
                    <button onClick={logout}>Logout</button>

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
                            }}>Ver serviços</button>
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
                            {m.estado !== "cancelada" &&
                                <button onClick={() => cancelarMarcacao(m._id)}>Cancelar</button>
                            }
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}
