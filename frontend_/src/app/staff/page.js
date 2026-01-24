"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffDashboard() {
    const [marcacoes, setMarcacoes] = useState([]);
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
        if (parsedUser.role !== "staff") {
            router.push("/");
            return;
        }

        fetch("http://localhost:3000/marcacoes/oficina", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setMarcacoes(Array.isArray(data) ? data : []))
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) return <p style={{ padding: 20 }}>Carregando dashboard...</p>;

    const hoje = new Date().toDateString();

    const marcacoesHoje = marcacoes.filter(m =>
        new Date(m.data).toDateString() === hoje
    );

    const emProgresso = marcacoes.filter(m => m.estado === "em_progresso");
    const concluidasHoje = marcacoes.filter(m =>
        m.estado === "concluida" &&
        new Date(m.data).toDateString() === hoje
    );
    const canceladas = marcacoes.filter(m => m.estado === "cancelada");

    const proximaMarcacao = marcacoes
        .filter(m => new Date(m.data) > new Date())
        .sort((a, b) => new Date(a.data) - new Date(b.data))[0];

    return (
        <div style={{ padding: 20 }}>
            <h1>Dashboard da Oficina</h1>

            {/* 🔢 CARDS */}
            <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
                <Card titulo="Marcações Hoje" valor={marcacoesHoje.length} cor="#3498db" />
                <Card titulo="Em Progresso" valor={emProgresso.length} cor="#f39c12" />
                <Card titulo="Concluídas Hoje" valor={concluidasHoje.length} cor="#2ecc71" />
                <Card titulo="Canceladas" valor={canceladas.length} cor="#e74c3c" />
            </div>

            {/* 📅 TRABALHOS DE HOJE */}
            <Section titulo="Trabalhos de Hoje">
                {marcacoesHoje.length === 0 && <p>Sem trabalhos para hoje.</p>}

                {marcacoesHoje.map(m => (
                    <div key={m._id} className="card">
                        <p><strong>Cliente:</strong> {m.cliente?.nome}</p>
                        <p><strong>Veículo:</strong> {m.veiculo?.marca} - {m.veiculo?.matricula}</p>
                        <p><strong>Serviço:</strong> {m.servico?.nome}</p>
                        <p><strong>Hora:</strong> {new Date(m.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <EstadoBadge estado={m.estado} />
                    </div>
                ))}
            </Section>

            {/* ⏰ PRÓXIMA MARCAÇÃO */}
            <Section titulo="Próxima Marcação">
                {!proximaMarcacao && <p>Sem próximas marcações.</p>}

                {proximaMarcacao && (
                    <div className="card destaque">
                        <p><strong>Cliente:</strong> {proximaMarcacao.cliente?.nome}</p>
                        <p><strong>Serviço:</strong> {proximaMarcacao.servico?.nome}</p>
                        <p><strong>Data:</strong> {new Date(proximaMarcacao.data).toLocaleString()}</p>
                    </div>
                )}
            </Section>
        </div>
    );
}

/* COMPONENTES */

function Card({ titulo, valor, cor }) {
    return (
        <div style={{
            flex: 1,
            minWidth: 180,
            background: cor,
            color: "white",
            padding: 20,
            borderRadius: 10
        }}>
            <h3>{titulo}</h3>
            <h1>{valor}</h1>
        </div>
    );
}

function Section({ titulo, children }) {
    return (
        <div style={{ marginTop: 40 }}>
            <h2>{titulo}</h2>
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                {children}
            </div>
        </div>
    );
}

function EstadoBadge({ estado }) {
    const cores = {
        agendada: "#3498db",
        em_progresso: "#f39c12",
        concluida: "#2ecc71",
        cancelada: "#e74c3c"
    };

    return (
        <span style={{
            background: cores[estado] || "#777",
            color: "white",
            padding: "4px 10px",
            borderRadius: 20,
            fontSize: 12
        }}>
            {estado}
        </span>
    );
}
