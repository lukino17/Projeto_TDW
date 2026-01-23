"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensagem, setMensagem] = useState("");
    const router = useRouter();

    const fazerLogin = async () => {
        try {
            const r = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const dados = await r.json();

            if (!r.ok) {
                setMensagem(dados.erro);
                return;
            }

            localStorage.setItem("user", JSON.stringify(dados.user));
            localStorage.setItem("token", dados.token);

            if (dados.user.role === "cliente") router.push("/cliente");
            if (dados.user.role === "staff") router.push("/staff");
            if (dados.user.role === "admin") router.push("/admin");

        } catch {
            setMensagem("Erro ao ligar ao servidor");
        }
    };

    return (
        <div className="card">
            <h1>Login</h1>

            <input
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <button onClick={fazerLogin}>Entrar</button>

            {mensagem && <p>{mensagem}</p>}
        </div>
    );
}
