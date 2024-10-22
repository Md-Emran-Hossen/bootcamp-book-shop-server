const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// const uri = "mongodb://localhost:27017/";

const uri =
`mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET}@cluster0.ikm2v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("newDb").collection("users");
    const userListCollection = client.db("usersDbBootcamp").collection("userList");
    const categoryCollection = client.db("usersDbBootcamp").collection("categoryList");
    // const productCollection = client.db("usersDbBootcamp").collection("productList");
   
   // Category route
   app.post("/categoryList", async (req, res) => {
    const categories = req.body;
    const result = await categoryCollection.insertOne(categories);
    res.send(result);
  });

  app.get("/categoryList", async (req, res) => {
    const query = categoryCollection.find();
    const result = await query.toArray();
    res.send(result);
  });

    // // Products route
    // app.post("/productList", async (req, res) => {
    //   const products = req.body;
    //   // console.log(users);
    //   const result = await productCollection.insertOne(products);
    //   res.send(result);
    // });

    // app.get("/productList", async (req, res) => {
    //   const query = productCollection.find();
    //   const result = await query.toArray();
    //   res.send(result);
    // });


     // Users route

     app.get("/userList", async (req, res) => {
      const query = userListCollection.find();
      const result = await query.toArray();
      res.send(result);
    });
    // // Getting by firebase uid
    app.get("/userList/:uid", async (req, res) => {
      const id = req.params.uid;
      console.log(id);
      const query = { userId: id };
      const result = await userListCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.post("/userList", async (req, res) => {
      const usersLst = req.body;
      console.log(usersLst);
      const result = await userListCollection.insertOne(usersLst);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const users = req.body;
      console.log(users);
      const result = await userCollection.insertOne(users);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const query = userCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    // getting by firebase uid
    app.get("/user/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { userId : uid };
      console.log(query);
      const result = await userCollection.findOne(query);
     console.log(result);
      res.send(result);
    });

    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(id, user);

      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };

      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };

      const result = await userCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Bootcamp React Node CRUD Server is Running");
});

app.listen(port, () => {
  console.log(`Bootcamp React Node CRUD Server is Running on ${port}`);
});
