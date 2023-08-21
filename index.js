const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json({limit: '50mb'}));

const uri = "mongodb+srv://demoTaskDB:EkAEzNzdZBBXYJcV@cluster0.msmcqlg.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  async function run() {
    try{

        await client.connect(); // Connect to the MongoDB database
        console.log("Connected to the database");

        const coursesCollection = client.db('courses').collection('courses-collection');
        app.post("/add-course", async (req, res) => {

          const data = req.body;
          
          // console.log(info)

          const result = await coursesCollection.insertOne(data);
          // console.log(result)
          res.send(result);
      })

      app.get('/get-courses', async (req, res) => {
        const query = {}
        const cursor = coursesCollection.find(query);
        const courseData = await cursor.toArray();
        res.send(courseData);
    });
    
    } finally{

    }
  }
  run().catch((error) => console.error(error))

app.get('/', (req, res) => {
    res.send('Hello World! change change again')
})

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})
// demoTaskDB
// EkAEzNzdZBBXYJcV  ,Pass

// mongodb+srv://demoTaskDB:EkAEzNzdZBBXYJcV@cluster0.msmcqlg.mongodb.net/?retryWrites=true&w=majority