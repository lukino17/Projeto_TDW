"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClienteMarcacoesPage() {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const [oficinas, setOficinas] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [veiculos, setVeiculos] = useState([]);

    const [oficinaSelecionada, setOficinaSelecionada] = useState("");
    const [servicoSelecionado, setServicoSelecionado] = useState("");
    const [turnoSelecionado, setTurnoSelecionado] = useState("");
    const [veiculoSelecionado, setVeiculoSelecionado] = useState("");

    const [mensagem, setMensagem] = useState("");

    /* ---------- AUTH ---------- */
    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("user"));
        const t = localStorage.getItem("token");

        if (!u || !t || u.role !== "cliente") {
            router.push("/");
            return;
        }

        setUser(u);
        setToken(t);
    }, [router]);

    /* ---------- LOAD BASE ---------- */
    useEffect(() => {
        if (!user || !token) return;

        fetch("http://localhost:3000/oficinas")
            .then(r => r.json())
            .then(d => setOficinas(Array.isArray(d) ? d : []));

        fetch(`http://localhost:3000/veiculos/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => setVeiculos(Array.isArray(d) ? d : []));
    }, [user, token]);

    /* ---------- LOAD SERVIÇOS ---------- */
    const carregarServicos = async (oficinaId) => {
        setServicoSelecionado("");
        setTurnoSelecionado("");
        setServicos([]);
        setTurnos([]);

        const r = await fetch(
            `http://localhost:3000/oficinas/${oficinaId}/servicos`
        );

        const dados = await r.json();
        setServicos(Array.isArray(dados) ? dados : []);
    };

    /* ---------- LOAD TURNOS ---------- */
    const carregarTurnos = async (oficinaId) => {
        const r = await fetch(
            `http://localhost:3000/turnos/disponiveis/${oficinaId}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        const dados = await r.json();
        setTurnos(Array.isArray(dados) ? dados : []);
    };

    /* ---------- CRIAR MARCAÇÃO ---------- */
    const criarMarcacao = async () => {
        setMensagem("");

        if (
            !oficinaSelecionada ||
            !veiculoSelecionado ||
            !servicoSelecionado ||
            !turnoSelecionado
        ) {
            setMensagem("❌ Preenche todos os campos");
            return;
        }

        const r = await fetch("http://localhost:3000/marcacoes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                veiculo: veiculoSelecionado,
                oficina: oficinaSelecionada,
                servico: servicoSelecionado,
                turno: turnoSelecionado
            })
        });

        const dados = await r.json();

        if (!r.ok) {
            setMensagem(dados.erro || "Erro ao criar marcação");
            return;
        }

        setMensagem("✅ Marcação criada com sucesso!");
        setTurnoSelecionado("");
    };

    return (
        <div className="page">
            <h1>Nova Marcação</h1>

            {mensagem && <p>{mensagem}</p>}

            {/* OFICINA */}
            <select
                value={oficinaSelecionada}
                onChange={e => {
                    const id = e.target.value;
                    setOficinaSelecionada(id);

                    if (id) {
                        carregarServicos(id);
                        carregarTurnos(id);
                    } else {
                        setServicos([]);
                        setTurnos([]);
                    }
                }}
            >
                <option value="">Selecionar Oficina</option>
                {oficinas.map(o => (
                    <option key={o._id} value={o._id}>
                        {o.nome}
                    </option>
                ))}
            </select>

            {/* VEÍCULO */}
            <select
                value={veiculoSelecionado}
                onChange={e => setVeiculoSelecionado(e.target.value)}
            >
                <option value="">Selecionar Veículo</option>
                {veiculos.map(v => (
                    <option key={v._id} value={v._id}>
                        {v.marca} ({v.matricula})
                    </option>
                ))}
            </select>

            {/* SERVIÇO */}
            <select
                value={servicoSelecionado}
                onChange={e => setServicoSelecionado(e.target.value)}
                disabled={!servicos.length}
            >
                <option value="">Selecionar Serviço</option>
                {servicos.map(s => (
                    <option key={s._id} value={s._id}>
                        {s.nome}
                    </option>
                ))}
            </select>

            {/* TURNO */}
            <select
                value={turnoSelecionado}
                onChange={e => setTurnoSelecionado(e.target.value)}
                disabled={!turnos.length}
            >
                <option value="">Selecionar Turno</option>
                {turnos.map(t => (
                    <option key={t._id} value={t._id}>
                        {new Date(t.data).toLocaleDateString("pt-PT")} —{" "}
                        {t.horaInicio} às {t.horaFim} (
                        {t.vagasTotais - t.vagasOcupadas} vagas)
                    </option>
                ))}
            </select>

            <button onClick={criarMarcacao}>
                Criar Marcação
            </button>
        </div>
    );
}
