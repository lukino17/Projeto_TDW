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

    return (
        <div>
            <h1>Minhas Marcações</h1>

            {marcacoes.length === 0 && <p>Sem marcações.</p>}

            {marcacoes.map(m => (
                <div key={m._id} className="card">
                    {m.servico?.nome} <br />
                    {new Date(m.dataHora).toLocaleString()} <br />
                    Estado: {m.estado}
                </div>
            ))}
        </div>
    );
}
