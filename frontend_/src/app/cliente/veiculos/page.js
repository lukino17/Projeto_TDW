"use client";

import { useEffect, useState } from "react";

export default function VeiculosPage() {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    const [veiculos, setVeiculos] = useState([]);

    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [matricula, setMatricula] = useState("");
    const [ano, setAno] = useState("");

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        setUser(JSON.parse(localStorage.getItem("user")));
    }, []);

    useEffect(() => {
        if (!user || !token) return;

        fetch(`http://localhost:3000/veiculos/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => setVeiculos(Array.isArray(d) ? d : []));
    }, [user, token]);

    const criarVeiculo = async () => {
        const r = await fetch("http://localhost:3000/veiculos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ marca, modelo, matricula, ano })
        });

        const dados = await r.json();

        if (r.ok) {
            setVeiculos([...veiculos, dados.veiculo]);
            setMarca(""); setModelo(""); setMatricula(""); setAno("");
        }
    };

    return (
        <div>
            <h1>Meus Veículos</h1>

            <input placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} />
            <input placeholder="Modelo" value={modelo} onChange={e => setModelo(e.target.value)} />
            <input placeholder="Matrícula" value={matricula} onChange={e => setMatricula(e.target.value)} />
            <input placeholder="Ano" value={ano} onChange={e => setAno(e.target.value)} />
            <button onClick={criarVeiculo}>Criar</button>

            {veiculos.map(v => (
                <div key={v._id} className="card">
                    {v.marca} - {v.matricula}
                </div>
            ))}
        </div>
    );
}
