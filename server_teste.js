const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


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

app.post('/deletar:tipo', async (req, res) => {
    const { id } = req.body;
    const tipo = req.params.tipo
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(`collection${tipo}`)

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

app.get('/:collection', async (req, res) => {
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