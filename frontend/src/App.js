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

    // OFICINA SELECIONADA
    const [oficinaSelecionada, setOficinaSelecionada] = useState(null);

    // SERVIÇOS DA OFICINA
    const [servicos, setServicos] = useState([]);

    // LOGIN
    const fazerLogin = async () => {
        try {
            const resposta = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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

    // CARREGAR SERVIÇOS DA OFICINA
    const carregarServicos = async (oficinaId) => {
        try {
            const resposta = await fetch(
                `http://localhost:3000/oficinas/${oficinaId}/servicos`
            );
            const dados = await resposta.json();
            setServicos(dados);
        } catch (error) {
            console.error(error);
        }
    };

    // QUANDO FAZ LOGIN
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
        setOficinaSelecionada(null);
        setServicos([]);
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>

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

                    {/* LISTA DE OFICINAS */}
                    <h2>Oficinas</h2>

                    {oficinas.length === 0 && <p>Não existem oficinas.</p>}

                    <ul>
                        {oficinas.map(oficina => (
                            <li key={oficina._id} style={{ marginBottom: "15px" }}>
                                <strong>{oficina.nome}</strong><br />
                                {oficina.localizacao}<br />
                                {oficina.contacto}<br />
                                <button
                                    onClick={() => {
                                        setOficinaSelecionada(oficina);
                                        carregarServicos(oficina._id);
                                    }}
                                >
                                    Ver serviços
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* SERVIÇOS DA OFICINA */}
                    {oficinaSelecionada && (
                        <div>
                            <hr />
                            <h2>Serviços da oficina: {oficinaSelecionada.nome}</h2>

                            {servicos.length === 0 && (
                                <p>Esta oficina não tem serviços.</p>
                            )}

                            <ul>
                                {servicos.map(servico => (
                                    <li key={servico._id} style={{ marginBottom: "10px" }}>
                                        <strong>{servico.nome}</strong><br />
                                        Preço: {servico.preco} €<br />
                                        Duração: {servico.duracao} minutos
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

export default App;