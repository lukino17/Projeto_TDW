"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClienteMinhasMarcacoesPage() {
    const router = useRouter();

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [marcacoes, setMarcacoes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("user"));
        const t = localStorage.getItem("token");

        if (!u || !t || u.role !== "cliente") {
            router.push("/");
            return;
        }

        setUser(u);
        setToken(t);
    }, [router]);

    useEffect(() => {
        if (!user || !token) return;

        const carregar = async () => {
            try {
                const r = await fetch("http://localhost:3000/marcacoes/cliente", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const d = await r.json();
                setMarcacoes(Array.isArray(d) ? d : []);
            } catch {
                setMarcacoes([]);
            } finally {
                setLoading(false);
            }
        };

        carregar();
    }, [user, token]);

    if (loading) return <p className="page">A carregar...</p>;

    return (
        <div className="page">
            <h1 className="page-title">Minhas Marcações</h1>

            {marcacoes.length === 0 && <p className="muted">Sem marcações.</p>}

            <div className="grid">
                {marcacoes.map((m) => (
                    <div key={m._id} className="card">
                        <h3>{m.servico?.nome || "Serviço"}</h3>
                        <p className="muted">{m.oficina?.nome || "—"}</p>

                        <div style={{ marginTop: 10 }}>
                            <p>
                                <strong>Veículo:</strong>{" "}
                                {m.veiculo?.marca} ({m.veiculo?.matricula})
                            </p>

                            <p>
                                <strong>Turno:</strong>{" "}
                                {m.turno?.data
                                    ? `${new Date(m.turno.data).toLocaleDateString("pt-PT")} — ${m.turno.horaInicio} às ${m.turno.horaFim}`
                                    : "—"}
                            </p>

                            <p>
                                <strong>Estado:</strong> {m.estado}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
