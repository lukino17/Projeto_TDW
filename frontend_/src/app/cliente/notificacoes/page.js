"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClienteNotificacoesPage() {
    const [notificacoes, setNotificacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!user || !token) {
            router.push("/");
            return;
        }

        const parsedUser = JSON.parse(user);
        if (parsedUser.role !== "cliente") {
            router.push("/");
            return;
        }

        fetch("http://localhost:3000/notificacoes", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                setNotificacoes(Array.isArray(data) ? data : []);
            })
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) return <p>A carregar notificações...</p>;

    return (
        <div className="page">
            <h1>Notificações</h1>

            {notificacoes.length === 0 && (
                <p>Não tem notificações.</p>
            )}

            {notificacoes.map(n => (
                <div
                    key={n._id}
                    className={`card ${
                        n.lida
                            ? "notificacao-lida"
                            : "notificacao-nao-lida"
                    }`}
                >

                    <strong>{n.titulo}</strong>
                    <p>{n.mensagem}</p>
                    <small>
                        {new Date(n.criadaEm).toLocaleString()}
                    </small>
                </div>
            ))}
        </div>
    );
}
