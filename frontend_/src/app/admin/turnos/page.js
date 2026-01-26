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
    const [vagasTotais, setVagasTotais] = useState(1);

    const [mensagem, setMensagem] = useState("");

    /* ---------- AUTH ---------- */
    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!user || !token) {
            router.push("/");
            return;
        }

        if (JSON.parse(user).role !== "admin") {
            router.push("/");
            return;
        }

        carregar(token);
    }, [router]);

    /* ---------- LOAD ---------- */
    const carregar = async (token) => {
        try {
            const r1 = await fetch("http://localhost:3000/oficinas");

            const r2 = await fetch("http://localhost:3000/turnos", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const oficinasData = await r1.json();
            const turnosData = await r2.json();

            setOficinas(Array.isArray(oficinasData) ? oficinasData : []);
            setTurnos(Array.isArray(turnosData) ? turnosData : []);
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
        }
    };


    /* ---------- CREATE ---------- */
    const criarTurno = async () => {
        if (!oficina || !data || !horaInicio || !horaFim || !vagasTotais) {
            setMensagem("Preenche todos os campos");
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

        const d = await r.json();

        if (!r.ok) {
            setMensagem(d.erro || "Erro ao criar turno");
            return;
        }

        setMensagem("Turno criado com sucesso!");

        setOficina("");
        setData("");
        setHoraInicio("");
        setHoraFim("");
        setVagasTotais(1);

        carregar(token);
    };

    return (
        <div className="page">
            <h1>Gestão de Turnos</h1>

            {mensagem && <p>{mensagem}</p>}

            {/* CRIAR */}
            <div className="card">
                <h2>Novo Turno</h2>

                <select value={oficina} onChange={e => setOficina(e.target.value)}>
                    <option value="">Selecionar Oficina</option>
                    {oficinas.map(o => (
                        <option key={o._id} value={o._id}>{o.nome}</option>
                    ))}
                </select>

                <input
                    type="date"
                    value={data}
                    onChange={e => setData(e.target.value)}
                />

                <input
                    type="time"
                    value={horaInicio}
                    onChange={e => setHoraInicio(e.target.value)}
                />

                <input
                    type="time"
                    value={horaFim}
                    onChange={e => setHoraFim(e.target.value)}
                />

                <input
                    type="number"
                    min="1"
                    value={vagasTotais}
                    onChange={e => setVagasTotais(Number(e.target.value))}
                />

                <button onClick={criarTurno}>Criar Turno</button>
            </div>

            {/* LISTA */}
            <h2>Turnos Criados</h2>

            {turnos.length === 0 && <p>Sem turnos.</p>}

            <table>
                <thead>
                <tr>
                    <th>Oficina</th>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Ocupação</th>
                </tr>
                </thead>
                <tbody>
                {turnos.map(t => (
                    <tr key={t._id}>
                        <td>{t.oficina?.nome}</td>
                        <td>{new Date(t.data).toLocaleDateString("pt-PT")}</td>
                        <td>{t.horaInicio} - {t.horaFim}</td>
                        <td>{t.vagasOcupadas} / {t.vagasTotais}</td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
}
