const jwt = require("jsonwebtoken");
require("dotenv").config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
const PORT = 3000;
app.use(express.json());

const User = require('./models/User');
const Oficina = require('./models/Oficina');
const Servico = require('./models/Servico');
const Veiculo = require('./models/Veiculo');
const Marcacao = require('./models/Marcacao');

app.use("/auth", require("./routes/auth.routes"));
app.use("/oficinas", require("./routes/oficinas.routes"));
app.use("/servicos", require("./routes/servicos.routes"));
app.use("/veiculos", require("./routes/veiculos.routes"));
app.use("/marcacoes", require("./routes/marcacoes.routes"));

const authRoutes = require("./routes/auth.routes");
const veiculosRoutes = require("./routes/veiculos.routes");
const oficinasRoutes = require("./routes/oficinas.routes");
const usersRoutes = require("./routes/users.routes");
const marcacoesRoutes = require("./routes/marcacoes.routes");
const servicosRoutes = require("./routes/servicos.routes");
const notificacoesRoutes = require("./routes/notificacoes.routes");
const adminRoutes = require("./routes/admin.routes");


app.use("/admin", adminRoutes);
app.use("/servicos", require("./routes/servicos.public.routes"));
app.use("/servicos", servicosRoutes);
app.use("/marcacoes", marcacoesRoutes);
app.use("/notificacoes", notificacoesRoutes);
app.use("/auth", authRoutes);
app.use("/oficinas", oficinasRoutes);
app.use("/users", usersRoutes);
app.use("/veiculos", veiculosRoutes);
app.use(express.json());


//mongoose.connect('mongodb://127.0.0.1:27017/projeto_tdw')
  //  .then(() => console.log('MongoDB LOCAL conectado com sucesso'))
    //.catch(err => console.error(' Erro MongoDB:', err));


mongoose.connect(
     'mongodb+srv://davidelucchino16_db_user:pass123@cluster0.mxofthh.mongodb.net/?appName=Cluster0',
     {}
 );


 mongoose.connection.on('connected', () => {
     console.log(' MongoDB Atlas conectado com sucesso');
 });


 mongoose.connection.on('error', (err) => {
     console.error(' Erro MongoDB:', err);
 });




app.get('/', (req, res) => {
    res.send('Servidor funcionando com MongoDB Atlas!');
});

app.post('/teste', (req, res) => {
    console.log(req.body);

    res.json({
        mensagem: 'POST recebido com sucesso',
        dadosRecebidos: req.body
    });
});

    app.post('/users', async (req, res) => {
        try {
            const user = await User.create(req.body);

            res.status(201).json({
                mensagem: 'Utilizador criado com sucesso',
                user
            });
        } catch (error) {
            res.status(400).json({
                erro: 'Erro ao criar utilizador',
                detalhes: error.message
            });
        }
    });


    app.post('/auth/register', async (req, res) => {
    try {
        const { nome, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ erro: 'Email já registado' });
        }

        const user = await User.create({
            nome,
            email,
            password,
            role
        });

        res.status(201).json({
            mensagem: 'Utilizador registado com sucesso',
            user
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
    });

app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).populate("oficina");

        if (!user) {
            return res.status(400).json({ erro: "Email ou password incorretos" });
        }

        if (user.password !== password) {
            return res.status(400).json({ erro: "Email ou password incorretos" });
        }

        // 🔑 GERAR TOKEN
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET || "segredo_super_secreto",
            { expiresIn: "1d" }
        );

        res.json({
            mensagem: "Login efetuado com sucesso",
            token,
            user: {
                id: user._id,
                nome: user.nome,
                email: user.email,
                role: user.role,
                oficina: user.oficina || null
            }
        });

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});


app.post('/oficinas', async (req, res) => {
    try {
        const { nome, localizacao, contacto } = req.body;

        const oficina = await Oficina.create({
            nome,
            localizacao,
            contacto
        });

        res.status(201).json({
            mensagem: 'Oficina criada com sucesso',
            oficina
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
    });

    app.get('/oficinas', async (req, res) => {
        try {
            const oficinas = await Oficina.find();

            res.json(oficinas);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    });

    app.post('/oficinas/:id/servicos', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, preco, duracao, descricaoPublica, descricaoPr696d2ee62cc9f321d94ddfc2ivada } = req.body;

        // verificar se a oficina existe
        const oficina = await Oficina.findById(id);
        if (!oficina) {
            return res.status(404).json({ erro: 'Oficina não encontrada' });
        }


        const servico = await Servico.create({
            nome,
            preco,
            duracao,
            descricaoPublica,
            descricaoPrivada,
            oficina: id
        });

        res.status(201).json({
            mensagem: 'Serviço criado com sucesso',
            servico
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
    });

app.get('/oficinas/:id/servicos', async (req, res) => {
    try {
        const { id } = req.params;


        const oficina = await Oficina.findById(id);
        if (!oficina) {
            return res.status(404).json({ erro: 'Oficina não encontrada' });
        }


        const servicos = await Servico.find({ oficina: id });

        res.json(servicos);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
    });

app.post('/veiculos', async (req, res) => {
    try {
        const { marca, modelo, matricula, ano, cliente } = req.body;

        const user = await User.findById(cliente);

        if (!user || user.role !== "cliente") {
            return res.status(403).json({ erro: "Apenas clientes podem criar veículos" });
        }

        const veiculo = await Veiculo.create({
            marca,
            modelo,
            matricula,
            ano,
            cliente
        });

        res.status(201).json({
            mensagem: 'Veículo criado com sucesso',
            veiculo
        });
    } catch (error) {
        res.status(400).json({
            erro: 'Erro ao criar veículo',
            detalhes: error.message
        });
    }
});


    app.get('/veiculos/:clienteId', async (req, res) => {
        try {
            const { clienteId } = req.params;

            const veiculos = await Veiculo.find({ cliente: clienteId });

            res.json(veiculos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    });

app.post('/marcacoes', async (req, res) => {
    try {
        const { cliente, veiculo, oficina, servico, dataHora } = req.body;

        const user = await User.findById(cliente);

        if (!user || user.role !== "cliente") {
            return res.status(403).json({ erro: "Apenas clientes podem criar marcações" });
        }

        const marcacao = await Marcacao.create({
            cliente,
            veiculo,
            oficina,
            servico,
            dataHora
        });

        res.status(201).json({
            mensagem: 'Marcação criada com sucesso',
            marcacao
        });

    } catch (error) {
        res.status(400).json({
            erro: 'Erro ao criar marcação',
            detalhes: error.message
        });
    }
});


app.get('/marcacoes/cliente/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const marcacoes = await Marcacao.find({ cliente: id })
            .populate('veiculo')
            .populate('servico')
            .populate('oficina');

        res.json(marcacoes);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.get('/marcacoes/oficina/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const marcacoes = await Marcacao.find({ oficina: id })
            .populate('cliente')
            .populate('veiculo')
            .populate('servico');

        res.json(marcacoes);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.put('/marcacoes/:id/cancelar', async (req, res) => {
    try {
        const { id } = req.params;

        const marcacao = await Marcacao.findByIdAndUpdate(
            id,
            { estado: 'cancelada' },
            { new: true }
        );

        res.json({
            mensagem: 'Marcação cancelada',
            marcacao
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});











app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
