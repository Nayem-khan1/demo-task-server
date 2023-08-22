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
          const result = await coursesCollection.insertOne(data);
          res.send(result);
      })

      app.get('/get-courses', async (req, res) => {
        const query = {}
        const cursor = coursesCollection.find(query);
        const courseData = await cursor.toArray();
        res.send(courseData);
    });

    app.get('/get-courses/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const service = await coursesCollection.findOne(query);
      res.send(service);
  });
    app.patch('/update-course/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const status = req.body;
        const query = { _id: new ObjectId(id) };
    
        const replacement = {
          imageUrl: status.imageUrl,
          title: status.title,
          classNumber: status.classNumber,
          courseType: status.courseType,
        };
    
        const result = await coursesCollection.replaceOne(query, replacement);
    
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Document not found' });
        }
    
        if (result.modifiedCount === 0) {
          return res.status(400).json({ message: 'Document was not modified' });
        }
    
        res.status(200).json({ message: 'Document replaced successfully' });
        // console.log('Document replaced:', result);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
  })

    app.delete('/course/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coursesCollection.deleteOne(query);
      res.send(result);
  })
    
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