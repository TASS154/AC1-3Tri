const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const path = require('path')
const port = 3000;
const methodOverride = require('method-override');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));

const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'Farmacia';
const collectionPaciente = 'pacientes';
const collectionMedicamento = 'medicamentos';
const collectionVenda = 'vendas';


app.use(express.static(path.join(__dirname)));

function CardPacientes(pacientes) {
    return `
    <div class="card mb-3">
        <div class="card-body">
        <h5 class="card-title">${pacientes.Nome}</h5>
        <p class="card-text">${pacientes.Nascimento}</p>
        <p class="card-text">identidade: ${pacientes.Identidade}</p>
        <form action="/deletar" method="POST">
        <input type="hidden" name="id" value="${pacientes._id}" />
        <input type="hidden" name="_method" value="DELETE" />
        <button type="submit" class="btn btn-danger">Deletar</button>
        </form>

        <button class="btn btn-warning">
            <a href="/modificar">alterar</a>
        </button>
        </div>
    </div>
    `;
}

function CardMedicamentos(medicamentos) {
    return `
    <div class="card mb-3">
    <img src="${medicamentos.foto}" class="card-img-top" style="width: 175px; height: 175px" alt="${medicamentos.Nome}>
        <div class="card-body">
        <h5 class="card-title">${medicamentos.Nome}</h5>
        <p class="card-text">${medicamentos.Registro}</p>
        <p class="card-text">identidade: ${medicamentos.Dosagem}</p>
        <form action="/deletar" method="POST">
        <input type="hidden" name="id" value="${medicamentos._id}" />
        <input type="hidden" name="_method" value="DELETE" />
        <button type="submit" class="btn btn-danger">Deletar</button>
        </form>
        </div>
    </div>
    `;
}

function CardVendas(vendas) {
    return `
    <div class="card mb-3">
        <div class="card-body">
        <h5 class="card-title">${vendas.Compra}</h5>
        <p class="card-text">Paciente: ${vendas.Info_paciente.Nome},<br> Nascimento: ${vendas.Info_paciente.Nascimento}, <br> Identidade: ${vendas.Info_paciente.Identidade}</p>
        <p class="card-text">Medicamento: ${vendas.Info_medicamento.Nome}, <br> Registro: ${vendas.Info_medicamento.Registro}, <br> Dosagem: ${vendas.Info_medicamento.Dosagem}</p>
        <p class="card-text">quantidade: ${vendas.Quantidade}</p>
        <form action="/deletar" method="POST">
        <input type="hidden" name="id" value="${vendas._id}" />
        <input type="hidden" name="_method" value="DELETE" />
        <button type="submit" class="btn btn-danger">Deletar</button>
        </form>
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

//CADASTRAR

app.post('/cadastro/paciente', async (req, res) => {
    const novoPaciente = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionPaciente);

        const result = await collection.insertOne(novoPaciente);
        console.log(`Paciente cadastrado com sucesso. ID: ${result.insertedId}`);

        res.redirect('/pacientes')
    } catch (err) {
        console.error('Erro ao cadastrar o Paciente:', err);
        res.status(500).send('Erro ao cadastrar o paciente. Por favor, tente novamente mais tarde');
    } finally {
        client.close();
    }
});

app.post('/cadastro/medicamento', async (req, res) => {
    const novoMedicamento = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionMedicamento);

        const result = await collection.insertOne(novoMedicamento);
        console.log(`Medicamento cadastrado com sucesso. ID: ${result.insertedId}`);
        res.redirect('/medicamentos')
    } catch (err) {
        console.error('Erro ao cadastrar o Medicamento:', err);
        res.status(500).send('Erro ao cadastrar o Medicamento. Por favor, tente novamente mais tarde');
    } finally {
        client.close();
    }
});

app.post('/cadastro/venda', async (req, res) => {
    const novoVenda = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionVenda);

        const result = await collection.insertOne(novoVenda);
        console.log(`Venda cadastrado com sucesso. ID: ${result.insertedId}`);
        res.redirect('/vendas')
    } catch (err) {
        console.error('Erro ao cadastrar o Venda:', err);
        res.status(500).send('Erro ao cadastrar o Venda. Por favor, tente novamente mais tarde');
    } finally {
        client.close();
    }
});


//FIM DO CADASTRAR

app.get('/deletar', (req, res) => {
    res.send(`
    <h1>Deletado</h1>
    `)
});

app.post('/deletar', async (req, res) => {
    const { id } = req.body;
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collectionP = db.collection(collectionPaciente)
        const collectionM = db.collection(collectionMedicamento)
        const collectionV = db.collection(collectionVenda)

        const result1 = await collectionP.deleteOne({ _id: new ObjectId(id)});
        const result2 = await collectionM.deleteOne({ _id: new ObjectId(id)});
        const result3 = await collectionV.deleteOne({ _id: new ObjectId(id)});

        if (result1.deletedCount > 0 || result2.deletedCount > 0 || result3.deletedCount > 0){
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



            const cardsHtml = pacientes.map(paciente => CardPacientes(paciente)).join('');
            const pageHtmlPath = path.join(__dirname, 'dados.html');
            let pageHtml = fs.readFileSync(pageHtmlPath, 'utf-8');
            pageHtml = pageHtml.replace('{{cardsHtml}}', cardsHtml);
            res.send(pageHtml);
            
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
    
        const medicamentos = await collection.find({}).toArray();

        const cardsHtml = medicamentos.map(medicamento => CardMedicamentos(medicamento)).join('');
        const pageHtmlPath = path.join(__dirname, 'dados.html');
        let pageHtml = fs.readFileSync(pageHtmlPath, 'utf-8');
        pageHtml = pageHtml.replace('{{cardsHtml}}', cardsHtml);
        res.send(pageHtml);

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

        const cardsHtml = vendas.map(venda => CardVendas(venda)).join('');
        const pageHtmlPath = path.join(__dirname, 'dados.html');
        let pageHtml = fs.readFileSync(pageHtmlPath, 'utf-8');
        pageHtml = pageHtml.replace('{{cardsHtml}}', cardsHtml);
        res.send(pageHtml);
        
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