const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gkz5fmx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const jobsCollection = client.db('easyJobs').collection('jobs')
        const companiesCollection = client.db('easyJobs').collection('topCompanies')
        const appliedJobsCollection = client.db('easyJobs').collection('appliedJobs')

        app.get('/allJobs', async (req, res) => {
            const result = await jobsCollection.find().toArray()
            res.send(result)
        })

        app.get('/fresherJobs', async (req, res) => {
            const query = { category: 'Fresher' }
            const result = await jobsCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/experiencedJobs', async (req, res) => {
            const query = { category: 'experienced' }
            const result = await jobsCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/topCompanies', async (req, res) => {
            const result = await companiesCollection.find().toArray()
            res.send(result)
        })

        app.get('/singleCompany/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await companiesCollection.findOne(query)
            res.send(result)
        })

        app.post('/applyJob', async (req, res) => {
            const job = req.body
            const result = await appliedJobsCollection.insertOne(job)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Job portal server is running')
})

app.listen(port, () => {
    console.log(`server is running on port: ${port}`)
})