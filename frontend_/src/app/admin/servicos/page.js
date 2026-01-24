"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminServicosPage() {
    const [servicos, setServicos] = useState([]);
    const [oficinas, setOficinas] = useState([]);

    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [oficina, setOficina] = useState("");
    const [descricaoPublica, setDescricaoPublica] = useState("");
    const [duracao, setDuracao] = useState("");


    const [loading, setLoading] = useState(true);
    const router = useRouter();

    /* ---------- AUTH ---------- */
    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!user || !token) {
            router.push("/");
            return;
        }

        const u = JSON.parse(user);
        if (u.role !== "admin") {
            router.push("/");
            return;
        }

        carregar(token);
    }, [router]);

    /* ---------- LOAD ---------- */
    const carregar = async (token) => {
        try {
            const r1 = await fetch("http://localhost:3000/admin/servicos", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const r2 = await fetch("http://localhost:3000/oficinas");

            const s = await r1.json();
            const o = await r2.json();

            setServicos(Array.isArray(s) ? s : []);
            setOficinas(Array.isArray(o) ? o : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- CREATE ---------- */
    const criarServico = async () => {
        if (!nome || !preco || !descricaoPublica || !duracao || !oficina) {
            alert("Preenche todos os campos");
            return;
        }

        const token = localStorage.getItem("token");

        await fetch("http://localhost:3000/admin/servicos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                nome,
                preco,
                descricaoPublica,
                duracao,
                oficina
            })
        });

        // limpar
        setNome("");
        setPreco("");
        setDescricaoPublica("");
        setDuracao("");
        setOficina("");

        carregar(token);
    };


    if (loading) return <p>A carregar serviços...</p>;

    return (
        <div className="page">
            <h1>Gestão de Serviços</h1>

            {/* ---------- CRIAR ---------- */}
            <div className="card">
                <h2>Novo Serviço</h2>

                <input
                    placeholder="Nome do serviço"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Preço (€)"
                    value={preco}
                    onChange={e => setPreco(e.target.value)}
                />
                <textarea
                    placeholder="Descrição do serviço"
                    value={descricaoPublica}
                    onChange={e => setDescricaoPublica(e.target.value)}
                    rows={3}
                />

                <input
                    type="number"
                    placeholder="Duração (minutos)"
                    value={duracao}
                    onChange={e => setDuracao(e.target.value)}
                />


                <select
                    value={oficina}
                    onChange={e => setOficina(e.target.value)}
                >
                    <option value="">Selecionar Oficina</option>
                    {oficinas.map(o => (
                        <option key={o._id} value={o._id}>
                            {o.nome}
                        </option>
                    ))}
                </select>

                <button onClick={criarServico}>Criar Serviço</button>
            </div>

            {/* ---------- LISTA ---------- */}
            <h2>Serviços Existentes</h2>

            {servicos.length === 0 && <p>Sem serviços.</p>}

            <table className="tabela">
                <thead>
                <tr>
                    <th>Serviço</th>
                    <th>Preço</th>
                    <th>Oficina</th>
                </tr>
                </thead>
                <tbody>
                {servicos.map(s => (
                    <tr key={s._id}>
                        <td>{s.nome}</td>
                        <td>{s.preco} €</td>
                        <td>{s.oficina?.nome || "—"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
