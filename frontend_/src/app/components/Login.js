"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensagem, setMensagem] = useState("");
    const router = useRouter();

    const fazerLogin = async () => {
        setMensagem("");
        try {
            const r = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const dados = await r.json();

            if (!r.ok) {
                setMensagem(dados.erro || "Credenciais inválidas");
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
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Bem-vindo</h1>
                <p style={styles.subtitle}>
                    Aceda à sua conta
                </p>

                <input
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <input
                    style={styles.input}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button style={styles.button} onClick={fazerLogin}>
                    Entrar
                </button>

                {mensagem && (
                    <p style={styles.error}>
                        {mensagem}
                    </p>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f6f8",
    },
    card: {
        width: "100%",
        maxWidth: 400,
        background: "#fff",
        padding: "32px",
        borderRadius: "10px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
    },
    title: {
        textAlign: "center",
        marginBottom: 8,
        fontSize: 26,
    },
    subtitle: {
        textAlign: "center",
        marginBottom: 24,
        color: "#666",
        fontSize: 14,
    },
    input: {
        padding: "12px",
        marginBottom: "14px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "15px",
    },
    button: {
        padding: "12px",
        marginTop: 10,
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
    },
    error: {
        marginTop: 15,
        color: "#dc2626",
        textAlign: "center",
        fontSize: 14,
    },
};
