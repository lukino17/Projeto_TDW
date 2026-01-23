"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("user"));

        if (!u || u.role !== "admin") {
            window.location.href = "/";
            return;
        }

        setUser(u);
    }, []);

    if (!user) return null;

    return (
        <div className="app-container">
            <h1>Dashboard Admin</h1>

            <ul>
                <li>📁 Gerir Oficinas</li>
                <li>👷 Atribuir Staff</li>
            </ul>

            <p>Usa a navbar para navegar.</p>
        </div>
    );
}
