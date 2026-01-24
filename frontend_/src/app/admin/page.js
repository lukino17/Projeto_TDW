"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const [resumo, setResumo] = useState(null);
    const [marcacoes, setMarcacoes] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!user || !token) {
            router.push("/");
            return;
        }

        const parsedUser = JSON.parse(user);

        if (parsedUser.role !== "admin") {
            router.push("/");
            return;
        }

        carregarDashboard(token);
    }, [router]);

    const carregarDashboard = async (token) => {
        try {
            // RESUMO
            const r1 = await fetch("http://localhost:3000/admin/resumo", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const resumoData = await r1.json();
            setResumo(resumoData);

            // MARCAÇÕES RECENTES
            const r2 = await fetch("http://localhost:3000/admin/marcacoes-recentes", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const marcacoesData = await r2.json();
            setMarcacoes(Array.isArray(marcacoesData) ? marcacoesData : []);

        } catch (err) {
            console.error(err);
        }
    };

    if (!resumo) return <p>A carregar dashboard...</p>;

    return (
        <div className="admin-page">
            <h1 className="titulo">Dashboard do Administrador</h1>

            {/* CARDS RESUMO */}
            <div className="cards">
                <Card titulo="Clientes" valor={resumo.clientes} />
                <Card titulo="Staff" valor={resumo.staff} />
                <Card titulo="Marcações Hoje" valor={resumo.marcacoesHoje} />
                <Card titulo="Serviços" valor={resumo.servicos} />
            </div>

            {/* MARCAÇÕES RECENTES */}
            <section className="secao">
                <div className="secao-header">
                    <h2>Marcações Recentes</h2>
                    <button
                        className="btn-secundario"
                        onClick={() => router.push("/admin/marcacoes")}
                    >
                        Ver todas
                    </button>
                </div>

                {marcacoes.length === 0 ? (
                    <p className="vazio">Sem marcações registadas.</p>
                ) : (
                    <div className="tabela-container">
                        <table className="tabela">
                            <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Serviço</th>
                                <th>Data</th>
                                <th>Estado</th>
                            </tr>
                            </thead>
                            <tbody>
                            {marcacoes.map(m => (
                                <tr key={m._id}>
                                    <td>{m.cliente?.nome}</td>
                                    <td>{m.servico?.nome || "—"}</td>
                                    <td>
                                        {new Date(m.dataHora).toLocaleString("pt-PT")}
                                    </td>
                                    <td>
                                        <span className={`estado ${m.estado}`}>
                                            {m.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* GESTÃO */}
            <section className="secao">
                <h2>Gestão do Sistema</h2>

                <div className="acoes">
                    <button
                        className="btn-primario"
                        onClick={() => router.push("/admin/utilizadores")}
                    >
                        Gerir Utilizadores
                    </button>

                    <button
                        className="btn-primario"
                        onClick={() => router.push("/admin/servicos")}
                    >
                        Gerir Serviços
                    </button>
                </div>
            </section>
        </div>
    );

}

/* COMPONENTE CARD */
function Card({ titulo, valor }) {
    return (
        <div className="card resumo">
            <h3>{titulo}</h3>
            <p>{valor}</p>
        </div>
    );
}
