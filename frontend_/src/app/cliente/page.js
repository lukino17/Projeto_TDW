"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClienteHomePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [oficinas, setOficinas] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        const u = localStorage.getItem("user");
        const t = localStorage.getItem("token");

        if (!u || !t) {
            router.push("/");
            return;
        }

        const user = JSON.parse(u);
        if (user.role !== "cliente") {
            router.push("/");
            return;
        }

        carregarOficinas();
        // eslint-disable-next-line
    }, []);

    const carregarOficinas = async () => {
        try {
            setErro("");
            setLoading(true);

            const r = await fetch("http://localhost:3000/oficinas");
            const dados = await r.json();

            if (!r.ok) {
                setErro(dados.erro || "Erro ao carregar oficinas");
                setOficinas([]);
                return;
            }

            setOficinas(Array.isArray(dados) ? dados : []);
        } catch (e) {
            setErro("Erro ao ligar ao servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Área do Cliente</h1>
                <p className="page-subtitle">Escolhe uma oficina para marcar um serviço.</p>
            </div>

            {erro && <div className="alert error">{erro}</div>}

            {loading ? (
                <div className="card">A carregar oficinas…</div>
            ) : (
                <div className="grid">
                    {oficinas.map((o) => (
                        <div key={o._id} className="card oficina-card">
                            <div className="oficina-top">
                                <h3 className="oficina-nome">{o.nome}</h3>
                                <span className="badge">{o.localizacao || "—"}</span>
                            </div>

                            <p className="muted">{o.contacto || ""}</p>

                            <div className="card-actions">
                                <button
                                    className="primary-btn"
                                    onClick={() => router.push(`/cliente/marcacoes?oficinaId=${o._id}`)}
                                >
                                    Marcar
                                </button>
                                <button
                                    className="ghost-btn"
                                    onClick={() => router.push("/cliente/marcacoes")}
                                >
                                    Ver marcações
                                </button>
                            </div>
                        </div>
                    ))}

                    {oficinas.length === 0 && (
                        <div className="card">
                            <p>Sem oficinas para mostrar.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
