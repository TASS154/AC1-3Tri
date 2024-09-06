const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const path = require('path')
const port = 3000;
const methodOverride = require('method-override');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));

const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'Venda';
const collectionPaciente = 'pacientes';
const collectionMedicamento = 'medicamentos';
const collectionVenda = 'vendas';


app.use(express.static(path.join(__dirname)));

function CardPacientes(pacientes) {
    return `
    <div class="card mb-3">
    <img src="${pacientes.foto}" class="card-img-top w-100 hauto" alt="${pacientes.nome}>
        <div class="card-body">
        <h5 class="card-title">${pacientes.nome}</h5>
        <p class="card-text">${pacientes.data_nascimento}</p>
        <p class="card-text">identidade: ${pacientes.documento_identidade}</p>
        </div>
    </div>
    `;
}

function CardMedicamentos(medicamentos) {
    return `
    <div class="card mb-3">
    <img src="${medicamentos.foto}" class="card-img-top w-100 hauto" alt="${medicamentos.nome}>
        <div class="card-body">
        <h5 class="card-title">${medicamentos.nome}</h5>
        <p class="card-text">${medicamentos.data_nascimento}</p>
        <p class="card-text">identidade: ${medicamentos.documento_identidade}</p>
        </div>
    </div>
    `;
}

function Cardvendas(vendas) {
    return `
    <div class="card mb-3">
    <img src="${vendas.foto}" class="card-img-top w-100 hauto" alt="${vendas.nome}>
        <div class="card-body">
        <h5 class="card-title">${vendas.nome}</h5>
        <p class="card-text">${vendas.data_nascimento}</p>
        <p class="card-text">identidade: ${vendas.documento_identidade}</p>
        </div>
    </div>
    `;
}


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


//CRUD Pacientes


app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/cadastro.html');
});

app.post('/cadastro', async (req, res) => {
    const novoPaciente = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionPaciente);

        const result = await collection.insertOne(novoPaciente);
        console.log(`Paciente cadastrado com sucesso. ID: ${result.insertedId}`);

        res.redirect('/')
    } catch (err) {
        console.error('Erro ao cadastrar o Paciente:', err);
        res.status(500).send('Erro ao cadastrar o paciente. Por favor, tente novamente mais tarde');
    } finally {
        client.close();
    }
});

app.post('/deletar', async (req, res) => {
    const { id } = req.body;
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionPaciente)

        const result = await collection.deleteOne({ _id: new ObjectId(id)});

        if (result.deletedCount > 0){
            res.redirect('/');
        } else {
            res.status(404).send('Paciente não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao deletar o paciente:', err);
        res.status(500).send(
            'Erro ao deletar o paciente. por favor tente novamente mais tarde'
        )
    } finally {
        client.close();
    }
});

app.get('/pacientes', async (req, res) => {
    const client = new MongoClient(url)

    try {
        await client.connect()
        const db = client.db(dbName);
        const collection = db.collection(collectionPaciente);
    
        const pacientes = await collection.find({}).toArray();

        res.json(pacientes);
    } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
        res.status(500).send(
            'Erro ao buscar pacientes, por favor, tente novamente mais tarde'
        );
    } finally {
        client.close();
    }


})

//CRUD Medicamentos


app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/cadastro.html');
});

app.post('/cadastro', async (req, res) => {
    const novoMedicamento = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionMedicamento);

        const result = await collection.insertOne(novoMedicamento);
        console.log(`Medicamento cadastrado com sucesso. ID: ${result.insertedId}`);

        res.redirect('/')
    } catch (err) {
        console.error('Erro ao cadastrar o medicamento:', err);
        res.status(500).send('Erro ao cadastrar o medicamento. Por favor, tente novamente mais tarde');
    } finally {
        client.close();
    }
});

app.post('/deletar', async (req, res) => {
    const { id } = req.body;
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionMedicamento)

        const result = await collection.deleteOne({ _id: new ObjectId(id)});

        if (result.deletedCount > 0){
            res.redirect('/');
        } else {
            res.status(404).send('Medicamento não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao deletar o medicamento:', err);
        res.status(500).send(
            'Erro ao deletar o medicamento. por favor tente novamente mais tarde'
        )
    } finally {
        client.close();
    }
});

app.get('/medicamentos', async (req, res) => {
    const client = new MongoClient(url)

    try {
        await client.connect()
        const db = client.db(dbName);
        const collection = db.collection(collectionMedicamento);
    
        const medicamento = await collection.find({}).toArray();

        res.json(medicamento);
    } catch (err) {
        console.error('Erro ao buscar medicamentos:', err);
        res.status(500).send(
            'Erro ao buscar medicamentos, por favor, tente novamente mais tarde'
        );
    } finally {
        client.close();
    }


})

//CRUD Vendas


app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/cadastro.html');
});

app.post('/cadastro', async (req, res) => {
    const novoVenda = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionVenda);

        const result = await collection.insertOne(novoVenda);
        console.log(`Venda cadastrada com sucesso. ID: ${result.insertedId}`);

        res.redirect('/')
    } catch (err) {
        console.error('Erro ao cadastrar a venda:', err);
        res.status(500).send('Erro ao cadastrar a vendaria. Por favor, tente novamente mais tarde');
    } finally {
        client.close();
    }
});

app.post('/deletar', async (req, res) => {
    const { id } = req.body;
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionVenda)

        const result = await collection.deleteOne({ _id: new ObjectId(id)});

        if (result.deletedCount > 0){
            res.redirect('/');
        } else {
            res.status(404).send('Venda não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao deletar a venda:', err);
        res.status(500).send(
            'Erro ao deletar o livro. por favor tente novamente mais tarde'
        )
    } finally {
        client.close();
    }
});

app.get('/vendas', async (req, res) => {
    const client = new MongoClient(url)

    try {
        await client.connect()
        const db = client.db(dbName);
        const collection = db.collection(collectionVenda);
    
        const vendas = await collection.find({}).toArray();

        res.json(vendas);
    } catch (err) {
        console.error('Erro ao buscar vendas:', err);
        res.status(500).send(
            'Erro ao buscar vendas, por favor, tente novamente mais tarde'
        );
    } finally {
        client.close();
    }


})


app.listen(port, () => {
    console.log(`Servidor Node.js em execução em http://localhost:${port}`);
})