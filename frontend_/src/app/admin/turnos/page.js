"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminTurnosPage() {
    const router = useRouter();

    const [oficinas, setOficinas] = useState([]);
    const [turnos, setTurnos] = useState([]);

    const [oficina, setOficina] = useState("");
    const [data, setData] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const [vagasTotais, setVagasTotais] = useState("");

    const [loading, setLoading] = useState(true);
    const [mensagem, setMensagem] = useState("");

    /* ---------- AUTH ---------- */
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!user || !token || user.role !== "admin") {
            router.push("/");
            return;
        }

        carregarDados(token);
    }, [router]);

    /* ---------- LOAD ---------- */
    const carregarDados = async (token) => {
        try {
            const r1 = await fetch("http://localhost:3000/oficinas");
            const r2 = await fetch("http://localhost:3000/turnos", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOficinas(await r1.json());
            setTurnos(await r2.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- CREATE ---------- */
    const criarTurno = async () => {
        if (!oficina || !data || !horaInicio || !horaFim || !vagasTotais) {
            alert("Preenche todos os campos");
            return;
        }

        const token = localStorage.getItem("token");

        const r = await fetch("http://localhost:3000/turnos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                oficina,
                data,
                horaInicio,
                horaFim,
                vagasTotais
            })
        });

        if (!r.ok) {
            alert("Erro ao criar turno");
            return;
        }

        setMensagem("Turno criado com sucesso");

        setOficina("");
        setData("");
        setHoraInicio("");
        setHoraFim("");
        setVagasTotais("");

        carregarDados(token);
        setTimeout(() => setMensagem(""), 3000);
    };

    if (loading) return <p>A carregar turnos...</p>;

    return (
        <div className="page">
            <h1>Gestão de Turnos</h1>

            {/* ---------- CRIAR TURNO ---------- */}
            <div className="card">
                <h2>Novo Turno</h2>

                <select value={oficina} onChange={e => setOficina(e.target.value)}>
                    <option value="">Selecionar Oficina</option>
                    {oficinas.map(o => (
                        <option key={o._id} value={o._id}>{o.nome}</option>
                    ))}
                </select>

                <input type="date" value={data} onChange={e => setData(e.target.value)} />
                <input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
                <input type="time" value={horaFim} onChange={e => setHoraFim(e.target.value)} />
                <input
                    type="number"
                    min="1"
                    placeholder="Vagas Totais"
                    value={vagasTotais}
                    onChange={e => setVagasTotais(Number(e.target.value))}
                />


                <button onClick={criarTurno}>Criar Turno</button>
                {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
            </div>

            {/* ---------- LISTA ---------- */}
            <h2>Turnos Criados</h2>

            {turnos.length === 0 && <p>Sem turnos.</p>}

            <table className="tabela">
                <thead>
                <tr>
                    <th>Oficina</th>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Vagas</th>
                    <th>Estado</th>
                </tr>
                </thead>
                <tbody>
                {turnos.map(t => {
                    const disponiveis = t.vagasTotais - t.vagasOcupadas;
                    return (
                        <tr key={t._id}>
                            <td>{t.oficina?.nome}</td>
                            <td>{new Date(t.data).toLocaleDateString("pt-PT")}</td>
                            <td>{t.horaInicio} — {t.horaFim}</td>
                            <td>
                                {t.vagasOcupadas}/{t.vagasTotais}
                                {" "}({disponiveis} livres)
                            </td>
                            <td>
                                    <span
                                        style={{
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            fontSize: "13px",
                                            background: disponiveis === 0 ? "#fee2e2" : "#dcfce7"
                                        }}
                                    >
                                        {disponiveis === 0 ? "Lotado" : "Disponível"}
                                    </span>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
