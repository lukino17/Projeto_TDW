"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensagem, setMensagem] = useState("");
    const router = useRouter();

    const registar = async () => {
        try {
            const r = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, password })
            });

            const dados = await r.json();

            if (!r.ok) {
                setMensagem(dados.erro);
                return;
            }

            setMensagem("Conta criada! A redirecionar para login...");
            setTimeout(() => router.push("/"), 1500);

        } catch {
            setMensagem("Erro ao ligar ao servidor");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Criar Conta</h1>

                <input
                    placeholder="Nome"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />

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

                <button onClick={registar}>Registar</button>

                {mensagem && <p className="mensagem">{mensagem}</p>}
            </div>
        </div>
    );
}
