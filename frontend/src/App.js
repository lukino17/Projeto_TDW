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

    // VEÍCULO
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [matricula, setMatricula] = useState("");
    const [ano, setAno] = useState("");

    // VIECULO
    const [veiculos, setVeiculos] = useState([]);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState("");

    //MARCACAO
    const [servicoSelecionado, setServicoSelecionado] = useState("");
    const [dataHora, setDataHora] = useState("");
    const [marcacoes, setMarcacoes] = useState([]);



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

    // LOGOUT
    const logout = () => {
        setUser(null);
        setEmail("");
        setPassword("");
        setOficinas([]);
        setOficinaSelecionada(null);
        setServicos([]);
    };

    //MARACAO
    const criarMarcacao = async () => {
        try {
            const resposta = await fetch("http://localhost:3000/marcacoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cliente: user.id,
                    veiculo: veiculoSelecionado,
                    oficina: oficinaSelecionada._id,
                    servico: servicoSelecionado,
                    dataHora
                })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                alert("Marcação criada com sucesso!");
                setDataHora("");
                carregarMarcacoes();
            } else {
                alert(dados.erro);
            }
        } catch (error) {
            alert("Erro ao criar marcação");
        }
    };

    //Carregar MARCACOES
    const carregarMarcacoes = async () => {
        try {
            const resposta = await fetch(
                `http://localhost:3000/marcacoes/${user.id}`
            );
            const dados = await resposta.json();
            setMarcacoes(dados);
        } catch (error) {
            console.error(error);
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

    // CRIAR VEÍCULO
    const criarVeiculo = async () => {
        try {
            const resposta = await fetch("http://localhost:3000/veiculos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    marca,
                    modelo,
                    matricula,
                    ano,
                    cliente: user.id
                })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                alert("Veículo criado com sucesso!");
                setMarca("");
                setModelo("");
                setMatricula("");
                setAno("");
            } else {
                alert(dados.erro);
            }
        } catch (error) {
            alert("Erro ao criar veículo");
        }
    };

    // CARREGARVEICULOS
    const carregarVeiculos = async () => {
        try {
            const resposta = await fetch(
                `http://localhost:3000/veiculos/${user.id}`
            );
            const dados = await resposta.json();
            setVeiculos(dados);
        } catch (error) {
            console.error(error);
        }
    };


    // QUANDO FAZ LOGIN
    useEffect(() => {
        if (user) {
            carregarOficinas();
            carregarVeiculos();
            carregarMarcacoes();
        }
    }, [user]);

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

                    {/* CRIAR VEÍCULO */}
                    <h2>Criar Veículo</h2>

                    <input
                        placeholder="Marca"
                        value={marca}
                        onChange={(e) => setMarca(e.target.value)}
                    />
                    <br /><br />

                    <input
                        placeholder="Modelo"
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                    />
                    <br /><br />

                    <input
                        placeholder="Matrícula"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                    />
                    <br /><br />

                    <input
                        type="number"
                        placeholder="Ano"
                        value={ano}
                        onChange={(e) => setAno(e.target.value)}
                    />
                    <br /><br />

                    <button onClick={criarVeiculo}>Criar Veículo</button>

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

                            <hr />
                            <h3>Nova Marcação</h3>

                            <select
                                value={veiculoSelecionado}
                                onChange={(e) => setVeiculoSelecionado(e.target.value)}
                            >
                                <option value="">Selecionar veículo</option>
                                {veiculos.map(v => (
                                    <option key={v._id} value={v._id}>
                                        {v.marca} {v.modelo} ({v.matricula})
                                    </option>
                                ))}
                            </select>
                            <br /><br />

                            <select
                                value={servicoSelecionado}
                                onChange={(e) => setServicoSelecionado(e.target.value)}
                            >
                                <option value="">Selecionar serviço</option>
                                {servicos.map(s => (
                                    <option key={s._id} value={s._id}>
                                        {s.nome}
                                    </option>
                                ))}
                            </select>
                            <br /><br />

                            <input
                                type="datetime-local"
                                value={dataHora}
                                onChange={(e) => setDataHora(e.target.value)}
                            />
                            <br /><br />

                            <button onClick={criarMarcacao}>Criar Marcação</button>

                        </div>

                    )}
                    <hr />
                    <h2>Minhas Marcações</h2>

                    {marcacoes.length === 0 && <p>Sem marcações.</p>}

                    <ul>
                        {marcacoes.map(m => (
                            <li key={m._id} style={{ marginBottom: "15px" }}>
                                <strong>Oficina:</strong> {m.oficina?.nome}<br />
                                <strong>Serviço:</strong> {m.servico?.nome}<br />
                                <strong>Veículo:</strong> {m.veiculo?.marca} {m.veiculo?.modelo} ({m.veiculo?.matricula})<br />
                                <strong>Data:</strong> {new Date(m.dataHora).toLocaleString()}
                            </li>
                        ))}
                    </ul>

                </div>
            )}
        </div>
    );
}

export default App;
