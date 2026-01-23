"use client";

import { useEffect, useState } from "react";

export default function OficinasAdminPage() {
    const [token, setToken] = useState(null);
    const [adminOficinas, setAdminOficinas] = useState([]);

    const [nome, setNome] = useState("");
    const [localizacao, setLocalizacao] = useState("");
    const [contacto, setContacto] = useState("");

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        carregarOficinas();
    }, []);

    const carregarOficinas = async () => {
        const r = await fetch("http://localhost:3000/oficinas", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        const dados = await r.json();
        setAdminOficinas(Array.isArray(dados) ? dados : []);
    };

    const criarOficina = async () => {
        const r = await fetch("http://localhost:3000/oficinas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ nome, localizacao, contacto })
        });

        if (r.ok) {
            setNome(""); setLocalizacao(""); setContacto("");
            carregarOficinas();
        }
    };

    return (
        <div className="app-container">
            <h1>Oficinas</h1>

            <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
            <input placeholder="Localização" value={localizacao} onChange={e => setLocalizacao(e.target.value)} />
            <input placeholder="Contacto" value={contacto} onChange={e => setContacto(e.target.value)} />
            <button onClick={criarOficina}>Criar Oficina</button>

            <h2>Existentes</h2>

            {adminOficinas.map(o => (
                <div key={o._id} className="card">
                    <strong>{o.nome}</strong><br />
                    {o.localizacao}<br />
                    {o.contacto}
                </div>
            ))}
        </div>
    );
}
