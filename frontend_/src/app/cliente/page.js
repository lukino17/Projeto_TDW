"use client";

import { useEffect, useState } from "react";

export default function ClientePage() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const [oficinas, setOficinas] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [oficinaSelecionada, setOficinaSelecionada] = useState(null);

    const [veiculos, setVeiculos] = useState([]);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState("");
    const [servicoSelecionado, setServicoSelecionado] = useState("");
    const [dataHora, setDataHora] = useState("");

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("user"));
        const t = localStorage.getItem("token");

        if (!u || u.role !== "cliente") {
            window.location.href = "/";
            return;
        }

        setUser(u);
        setToken(t);
    }, []);

    useEffect(() => {
        if (!user || !token) return;
        carregarOficinas();
        carregarVeiculos();
    }, [user, token]);

    const carregarOficinas = async () => {
        const r = await fetch("http://localhost:3000/oficinas");
        const dados = await r.json();
        setOficinas(Array.isArray(dados) ? dados : []);
    };

    const carregarServicos = async (id) => {
        const r = await fetch(`http://localhost:3000/oficinas/${id}/servicos`);
        const dados = await r.json();
        setServicos(Array.isArray(dados) ? dados : []);
    };

    const carregarVeiculos = async () => {
        const r = await fetch(`http://localhost:3000/veiculos/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const dados = await r.json();
        setVeiculos(Array.isArray(dados) ? dados : []);
    };

    const criarMarcacao = async () => {
        if (!veiculoSelecionado || !servicoSelecionado || !dataHora) {
            alert("Preencha todos os campos!");
            return;
        }

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

        alert("Marcação criada com sucesso!");
        setOficinaSelecionada(null);
    };

    return (
        <div className="page">
            <h1 className="page-title">Área do Cliente</h1>

            {/* OFICINAS */}
            <h2 className="section-title">Escolha uma Oficina</h2>
            <div className="grid">
                {oficinas.map(o => (
                    <div key={o._id} className="card oficina-card">
                        <h3>{o.nome}</h3>
                        <button
                            className="primary-btn"
                            onClick={() => {
                                setOficinaSelecionada(o);
                                carregarServicos(o._id);
                            }}
                        >
                            Ver Serviços
                        </button>
                    </div>
                ))}
            </div>

            {/* FORM MARCAÇÃO */}
            {oficinaSelecionada && (
                <div className="card booking-card">
                    <h2>Nova Marcação — {oficinaSelecionada.nome}</h2>

                    <div className="form-grid">
                        <select onChange={e => setVeiculoSelecionado(e.target.value)}>
                            <option value="">Selecione um Veículo</option>
                            {veiculos.map(v => (
                                <option key={v._id} value={v._id}>
                                    {v.marca} ({v.matricula})
                                </option>
                            ))}
                        </select>

                        <select onChange={e => setServicoSelecionado(e.target.value)}>
                            <option value="">Selecione um Serviço</option>
                            {servicos.map(s => (
                                <option key={s._id} value={s._id}>{s.nome}</option>
                            ))}
                        </select>

                        <input
                            type="datetime-local"
                            onChange={e => setDataHora(e.target.value)}
                        />
                    </div>

                    <button className="success-btn" onClick={criarMarcacao}>
                        Confirmar Marcação
                    </button>
                </div>
            )}
        </div>
    );
}
