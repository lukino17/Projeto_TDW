"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientePage() {
    const [oficinas, setOficinas] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "cliente") {
            router.push("/");
            return;
        }

        fetch("http://localhost:3000/oficinas")
            .then(r => r.json())
            .then(d => setOficinas(Array.isArray(d) ? d : []));
    }, [router]);

    return (
        <div className="page">
            <h1>Área do Cliente</h1>

            <div className="grid">
                {oficinas.map(o => (
                    <div key={o._id} className="card oficina-card">
                        <h3>{o.nome}</h3>
                        <p>{o.morada}</p>

                        <button
                            className="primary-btn"
                            onClick={() =>
                                router.push(`/cliente/marcacoes?oficina=${o._id}`)
                            }
                        >
                            Marcar Serviço
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
