"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffAdminPage() {
    const router = useRouter();

    const [token, setToken] = useState("");
    const [staffs, setStaffs] = useState([]);
    const [oficinas, setOficinas] = useState([]);

    const [staffSelecionado, setStaffSelecionado] = useState(null);
    const [oficinaSelecionada, setOficinaSelecionada] = useState(null);

    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(true);

    /* ---------- AUTH ---------- */
    useEffect(() => {
        const u = localStorage.getItem("user");
        const t = localStorage.getItem("token");

        if (!u || !t) {
            router.push("/");
            return;
        }

        const parsed = JSON.parse(u);
        if (parsed.role !== "admin") {
            router.push("/");
            return;
        }

        setToken(t);
        carregarDados(t);
        // eslint-disable-next-line
    }, []);

    /* ---------- LOAD ---------- */
    const carregarDados = async (token) => {
        try {
            setLoading(true);

            const [rStaff, rOf] = await Promise.all([
                fetch("http://localhost:3000/users/staffs/livres", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch("http://localhost:3000/oficinas")
            ]);

            setStaffs(await rStaff.json());
            setOficinas(await rOf.json());
        } catch {
            setErro("Erro ao carregar dados");
        } finally {
            setLoading(false);
        }
    };

    /* ---------- ATRIBUIR ---------- */
    const atribuirStaff = async () => {
        setErro("");
        setMensagem("");

        if (!staffSelecionado || !oficinaSelecionada) {
            setErro("Seleciona um staff e uma oficina");
            return;
        }

        const r = await fetch("http://localhost:3000/users/atribuir-oficina", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                staffId: staffSelecionado._id,
                oficinaId: oficinaSelecionada._id
            })
        });

        if (!r.ok) {
            setErro("Erro ao atribuir staff");
            return;
        }

        setMensagem("✅ Staff atribuído com sucesso!");

        setStaffSelecionado(null);
        setOficinaSelecionada(null);

        carregarDados(token);
        setTimeout(() => setMensagem(""), 3000);
    };

    if (loading) return <p>A carregar...</p>;

    return (
        <div className="page">
            <h1 className="page-title">Atribuir Staff a Oficina</h1>

            {erro && <div className="alert error">{erro}</div>}
            {mensagem && <div className="alert success">{mensagem}</div>}

            <div className="grid-2">
                {/* STAFF */}
                <div className="card">
                    <h2>Staff Livre</h2>

                    {staffs.length === 0 && (
                        <p className="muted">Sem staff disponível</p>
                    )}

                    <ul className="list">
                        {staffs.map(s => (
                            <li
                                key={s._id}
                                className={`list-item clickable ${
                                    staffSelecionado?._id === s._id ? "active" : ""
                                }`}
                                onClick={() => setStaffSelecionado(s)}
                            >
                                <strong>{s.nome}</strong>
                                <div className="muted">{s.email}</div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* OFICINAS */}
                <div className="card">
                    <h2>Oficinas</h2>

                    <ul className="list">
                        {oficinas.map(o => (
                            <li
                                key={o._id}
                                className={`list-item clickable ${
                                    oficinaSelecionada?._id === o._id ? "active" : ""
                                }`}
                                onClick={() => setOficinaSelecionada(o)}
                            >
                                <strong>{o.nome}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* RESUMO */}
            <div className="card resumo" style={{ marginTop: 16 }}>
                <h3>Resumo</h3>

                <p>
                    <strong>Staff:</strong>{" "}
                    {staffSelecionado ? staffSelecionado.nome : "—"}
                </p>
                <p>
                    <strong>Oficina:</strong>{" "}
                    {oficinaSelecionada ? oficinaSelecionada.nome : "—"}
                </p>

                <button
                    className="success-btn full"
                    disabled={!staffSelecionado || !oficinaSelecionada}
                    onClick={atribuirStaff}
                >
                    Atribuir Staff
                </button>
            </div>
        </div>
    );
}
