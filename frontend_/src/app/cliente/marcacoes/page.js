"use client";

import { useEffect, useState } from "react";

export default function MarcacoesPage() {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [marcacoes, setMarcacoes] = useState([]);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        setUser(JSON.parse(localStorage.getItem("user")));
    }, []);

    useEffect(() => {
        if (!user || !token) return;

        fetch(`http://localhost:3000/marcacoes/cliente/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => setMarcacoes(Array.isArray(d) ? d : []));
    }, [user, token]);

    const formatarEstado = (estado) => {
        switch (estado) {
            case "pendente": return "Pendente";
            case "confirmada": return "Confirmada";
            case "em_progresso": return "Em Progresso";
            case "concluida": return "Concluída";
            case "cancelada": return "Cancelada";
            default: return estado;
        }
    };

    const statusClass = (estado) => {
        switch (estado) {
            case "pendente": return "status pendente";
            case "confirmada": return "status confirmada";
            case "em_progresso": return "status progresso";
            case "concluida": return "status concluida";
            case "cancelada": return "status cancelada";
            default: return "status";
        }
    };

    return (
        <div className="page">
            <h1 className="page-title">Minhas Marcações</h1>

            {marcacoes.length === 0 && (
                <div className="empty-state">Ainda não tens marcações.</div>
            )}

            <div className="grid-marcacoes">
                {marcacoes.map(m => (
                    <div key={m._id} className="marcacao-card">
                        <div className="marcacao-header">
                            <h3>{m.servico?.nome}</h3>
                            <span className={statusClass(m.estado)}>
                                {formatarEstado(m.estado)}
                            </span>
                        </div>

                        <div className="marcacao-info">
                            <p><strong>Data:</strong> {new Date(m.dataHora).toLocaleString("pt-PT")}</p>
                            <p><strong>Oficina:</strong> {m.oficina?.nome || "—"}</p>
                            <p><strong>Veículo:</strong> {m.veiculo?.marca || "—"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
