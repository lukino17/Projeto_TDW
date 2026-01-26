"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminServicosPage() {
    const router = useRouter();

    const [servicos, setServicos] = useState([]);
    const [oficinas, setOficinas] = useState([]);

    const [form, setForm] = useState({
        nome: "",
        preco: "",
        duracao: "",
        descricaoPublica: "",
        oficina: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    /* ---------------- AUTH ---------------- */
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

    /* ---------------- LOAD ---------------- */
    const carregar = async (token) => {
        try {
            setLoading(true);
            const [r1, r2] = await Promise.all([
                fetch("http://localhost:3000/admin/servicos", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("http://localhost:3000/oficinas"),
            ]);

            const s = await r1.json();
            const o = await r2.json();

            setServicos(Array.isArray(s) ? s : []);
            setOficinas(Array.isArray(o) ? o : []);
        } catch (e) {
            setErro("Erro ao carregar dados");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- FORM ---------------- */
    const onChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const podeCriar = useMemo(() => {
        return (
            form.nome &&
            form.preco &&
            form.duracao &&
            form.descricaoPublica &&
            form.oficina &&
            !saving
        );
    }, [form, saving]);

    /* ---------------- CREATE ---------------- */
    const criarServico = async () => {
        setErro("");
        setSucesso("");

        if (!podeCriar) {
            setErro("Preenche todos os campos corretamente.");
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem("token");

            const r = await fetch("http://localhost:3000/admin/servicos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const dados = await r.json();

            if (!r.ok) {
                setErro(dados.erro || "Erro ao criar serviço");
                return;
            }

            setSucesso("Serviço criado com sucesso ✔");
            setForm({ nome: "", preco: "", duracao: "", descricaoPublica: "", oficina: "" });
            carregar(token);
        } catch {
            setErro("Erro ao comunicar com o servidor");
        } finally {
            setSaving(false);
            setTimeout(() => setSucesso(""), 3000);
        }
    };

    if (loading) return <p>A carregar serviços…</p>;

    return (
        <div className="page">
            <h1>Gestão de Serviços</h1>

            {erro && <div className="alert error">{erro}</div>}
            {sucesso && <div className="alert success">{sucesso}</div>}

            {/* -------- NOVO SERVIÇO -------- */}
            <div className="card">
                <h2>Novo Serviço</h2>

                <div className="form-grid">
                    <input
                        name="nome"
                        placeholder="Nome do serviço"
                        value={form.nome}
                        onChange={onChange}
                    />

                    <input
                        name="preco"
                        type="number"
                        placeholder="Preço (€)"
                        value={form.preco}
                        onChange={onChange}
                    />

                    <input
                        name="duracao"
                        type="number"
                        placeholder="Duração (minutos)"
                        value={form.duracao}
                        onChange={onChange}
                    />

                    <select name="oficina" value={form.oficina} onChange={onChange}>
                        <option value="">Selecionar Oficina</option>
                        {oficinas.map((o) => (
                            <option key={o._id} value={o._id}>{o.nome}</option>
                        ))}
                    </select>

                    <textarea
                        name="descricaoPublica"
                        placeholder="Descrição pública do serviço"
                        rows={3}
                        value={form.descricaoPublica}
                        onChange={onChange}
                    />
                </div>

                <button className="btn-primario" disabled={!podeCriar} onClick={criarServico}>
                    {saving ? "A criar…" : "Criar Serviço"}
                </button>
            </div>

            {/* -------- LISTAGEM -------- */}
            <div className="card" style={{ marginTop: 16 }}>
                <h2>Serviços Existentes</h2>

                {servicos.length === 0 ? (
                    <p className="muted">Sem serviços registados.</p>
                ) : (
                    <table className="tabela">
                        <thead>
                        <tr>
                            <th>Serviço</th>
                            <th>Preço</th>
                            <th>Duração</th>
                            <th>Oficina</th>
                        </tr>
                        </thead>
                        <tbody>
                        {servicos.map((s) => (
                            <tr key={s._id}>
                                <td>{s.nome}</td>
                                <td>{s.preco} €</td>
                                <td>{s.duracao} min</td>
                                <td>{s.oficina?.nome || "—"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
