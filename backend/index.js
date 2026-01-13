import { useState, useEffect } from "react";

function App() {

    // LOGIN
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensagem, setMensagem] = useState("");

    // UTILIZADOR LOGADO
    const [user, setUser] = useState(null);

    // OFICINAS
    const [oficinas, setOficinas] = useState([]);

    // FUNÇÃO LOGIN
    const fazerLogin = async () => {
        try {
            const resposta = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                setUser(dados.user);
                setMensagem("");
            } else {
                setMensagem(dados.erro);
            }
        } catch (error) {
            setMensagem("Erro ao ligar ao servidor");
        }
    };

    // CARREGAR OFICINAS
    const carregarOficinas = async () => {
        try {
            const resposta = await fetch("http://localhost:3000/oficinas");
            const dados = await resposta.json();
            setOficinas(dados);
        } catch (error) {
            console.error(error);
        }
    };

    // QUANDO O UTILIZADOR FAZ LOGIN
    useEffect(() => {
        if (user) {
            carregarOficinas();
        }
    }, [user]);

    // LOGOUT
    const logout = () => {
        setUser(null);
        setEmail("");
        setPassword("");
        setOficinas([]);
    };

    return (
        <div style={{ padding: "20px" }}>

            {/* LOGIN */}
            {!user && (
                <div>
                    <h1>Login Oficina</h1>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <br /><br />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <br /><br />

                    <button onClick={fazerLogin}>Entrar</button>

                    <p>{mensagem}</p>
                </div>
            )}

            {/* APÓS LOGIN */}
            {user && (
                <div>
                    <h1>Bem-vindo, {user.nome}</h1>
                    <p>Tipo de utilizador: {user.role}</p>

                    <button onClick={logout}>Logout</button>

                    <hr />

                    <h2>Oficinas Disponíveis</h2>

                    {oficinas.length === 0 && <p>Não existem oficinas</p>}

                    <ul>
                        {oficinas.map(oficina => (
                            <li key={oficina._id}>
                                <strong>{oficina.nome}</strong><br />
                                {oficina.localizacao}<br />
                                {oficina.contacto}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
}

export default App;
