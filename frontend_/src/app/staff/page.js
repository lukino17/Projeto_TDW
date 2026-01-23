"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffPage() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const u = localStorage.getItem("user");

        if (!u) {
            router.push("/");
            return;
        }

        const parsedUser = JSON.parse(u);

        if (parsedUser.role !== "staff") {
            router.push("/");
            return;
        }

        setUser(parsedUser);
    }, [router]);

    if (!user) return <p>Carregando...</p>;

    return (
        <div className="page">
            <h1>Dashboard Staff</h1>
            <p>Bem-vindo, {user.nome}</p>

            <div className="cards">
                <div
                    className="card"
                    onClick={() => router.push("/staff/marcacoes")}
                >
                    <h3>Marcações da Oficina</h3>
                    <p>Ver e gerir marcações</p>
                </div>
            </div>
        </div>
    );
}
