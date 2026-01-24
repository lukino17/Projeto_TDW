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
    const [loading, setLoading] = useState(false);



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
        if (!marca || !modelo || !matricula || !ano) return;

        setLoading(true);

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
            const novoVeiculo = dados.veiculo || dados; // cobre os dois casos

            if (novoVeiculo && novoVeiculo.marca) {
                setVeiculos(prev => [...prev, novoVeiculo]);
            }

            setMarca("");
            setModelo("");
            setMatricula("");
            setAno("");
        }


        setLoading(false);
    };


    return (
        <div className="page">
            <h1 className="page-title">Meus Veículos</h1>

            <div className="veiculo-form">
                <input placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} />
                <input placeholder="Modelo" value={modelo} onChange={e => setModelo(e.target.value)} />
                <input placeholder="Matrícula" value={matricula} onChange={e => setMatricula(e.target.value)} />
                <input placeholder="Ano" value={ano} onChange={e => setAno(e.target.value)} />
                <button onClick={criarVeiculo} disabled={loading}>
                    {loading ? (
                        <span className="spinner"></span>
                    ) : (
                        <>
                            <span className="plus">＋</span> Adicionar Veículo
                        </>
                    )}
                </button>
            </div>

            {veiculos.length === 0 && (
                <div className="empty-state">Nenhum veículo registado.</div>
            )}

            <div className="grid-veiculos">
                {veiculos.filter(v => v && v.marca).map(v => (

                    <div key={v._id} className="veiculo-card">
                        <h3>{v.marca} {v.modelo}</h3>
                        <p><strong>Matrícula:</strong> {v.matricula}</p>
                        <p><strong>Ano:</strong> {v.ano}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
