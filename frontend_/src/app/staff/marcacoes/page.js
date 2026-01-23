"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ESTADOS = ["agendada", "confirmada", "cancelada", "concluida" , "em_progresso"];

export default function StaffMarcacoesPage() {
    const [marcacoes, setMarcacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensagem, setMensagem] = useState("");

    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!user || !token) {
            router.push("/");
            return;
        }

        const parsedUser = JSON.parse(user);

        if (parsedUser.role !== "staff") {
            router.push("/");
            return;
        }

        fetch("http://localhost:3000/marcacoes/oficina", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                setMarcacoes(Array.isArray(data) ? data : []);
            })
            .finally(() => setLoading(false));
    }, [router]);

    const alterarEstado = async (id, novoEstado) => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(
                `http://localhost:3000/marcacoes/${id}/estado`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ estado: novoEstado }),
                }
            );

            if (!res.ok) {
                alert("Erro ao alterar estado");
                return;
            }

            // atualizar localmente sem refresh
            setMarcacoes(prev =>
                prev.map(m =>
                    m._id === id ? { ...m, estado: novoEstado } : m
                )
            );
            setMensagem("Cliente notificado com sucesso ");
            setTimeout(() => setMensagem(""), 3000);

        } catch (err) {
            console.error(err);
            alert("Erro de ligação ao servidor");
        }
    };

    if (loading) return <p>Carregando marcações...</p>;

    return (
        <div className="page">
            <h1>Marcações da Oficina</h1>
            {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}


            {marcacoes.length === 0 && <p>Sem marcações.</p>}

            {marcacoes.map(m => (
                <div key={m._id} className="card">
                    <p><strong>Cliente:</strong> {m.cliente?.nome}</p>
                    <p>
                        <strong>Veículo:</strong>{" "}
                        {m.veiculo?.marca} - {m.veiculo?.matricula}
                    </p>
                    <p><strong>Serviço:</strong> {m.servico?.nome}</p>
                    <p>
                        <strong>Data:</strong>{" "}
                        {new Date(m.data).toLocaleDateString()}
                    </p>

                    {/* ESTADO */}
                    <div style={{ marginTop: 10 }}>
                        <p>
                            <strong>Estado atual:</strong>{" "}
                            <span
                                style={{
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    background:
                                        m.estado === "confirmada"
                                            ? "#dcfce7"
                                            : m.estado === "em_progresso"
                                                ? "#fff7ed"
                                                : m.estado === "cancelada"
                                                    ? "#fee2e2"
                                                    : "#e0e7ff",
                                }}
                            >
                                {m.estado}
                            </span>
                        </p>

                        <label><strong>Alterar estado:</strong></label>
                        <select
                            value={m.estado}
                            onChange={e =>
                                alterarEstado(m._id, e.target.value)
                            }
                            style={{ marginLeft: 10 }}
                        >
                            {ESTADOS.map(e => (
                                <option key={e} value={e}>
                                    {e}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            ))}
        </div>
    );
}
