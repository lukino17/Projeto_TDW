"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        const u = localStorage.getItem("user");
        if (u) setUser(JSON.parse(u));
        else setUser(null);
    }, [pathname]); // 👈 MUITO IMPORTANTE

    if (!user) return null;

    return (
        <nav className="navbar">
            <strong>OficinaApp</strong>

            {user.role === "cliente" && (
                <>
                    <a href="/cliente">Dashboard</a>
                    <a href="/cliente/veiculos">Veículos</a>
                    <a href="/cliente/marcacoes">Marcações</a>
                    <a href="/cliente/notificacoes">Notificações</a>

                </>
            )}

            {user.role === "staff" && (
                <>
                    <a href="/staff">Dashboard</a>
                    <a href="/staff/marcacoes">Marcações</a>
                </>
            )}

            {user.role === "admin" && (
                <>
                    <a href="/admin">Dashboard</a>
                    <a href="/admin/oficinas">Oficinas</a>
                    <a href="/admin/staffs">Staff</a>
                </>
            )}

            <button
                onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                }}
            >
                Logout
            </button>
        </nav>
    );
}
