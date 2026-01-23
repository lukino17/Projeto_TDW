"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard({ token }) {

    const [oficinas, setOficinas] = useState([]);
    const [marcacoes, setMarcacoes] = useState([]);

    useEffect(() => {
        carregarOficinas();
        carregarMarcacoes();
    }, []);

    const carregarOficinas = async () => {
        const r = await fetch("http://localhost:3000/oficinas/admin", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setOficinas(await r.json());
    };

    const carregarMarcacoes = async () => {
        const r = await fetch("http://localhost:3000/marcacoes/admin", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setMarcacoes(await r.json());
    };

    return (
        <div className="card">
            <h1>Admin Dashboard</h1>

            <h2>Oficinas</h2>
            {oficinas.map(o => (
                <div key={o._id}>
                    <strong>{o.nome}</strong> – {o.localizacao}
                </div>
            ))}

            <h2>Marcações</h2>
            {marcacoes.map(m => (
                <div key={m._id} className="card">
                    <strong>{m.oficina?.nome}</strong><br />
                    {m.servico?.nome}<br />
                    Cliente: {m.cliente?.nome}<br />
                    Estado: {m.estado}<br />
                    {new Date(m.dataHora).toLocaleString()}
                </div>
            ))}
        </div>
    );
}
