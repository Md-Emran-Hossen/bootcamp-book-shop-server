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
    const categoryCollection = client.db("newDb").collection("categories");
    const bookCollection = client.db("newDb").collection("books");
   
    // book route
    app.post("/books", async (req, res) => {
      const books = req.body;
      console.log("Book Details:=", books);
      const result = await bookCollection.insertOne(books);
      res.send(result);
    });

    app.get("/books", async (req, res) => {
      const query = bookCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.findOne(query);
      res.send(result);
    });

    app.put("/book/:id", async (req, res) => {
      const bookId = req.params.id;
      const book = req.body;
      const filter = { _id: new ObjectId(bookId) };
      const option = { upsert: true };

      const updatedBook = {
        $set: {
          bookName: book.bookName,
          resalePrice: book.resalePrice,
          description: book.description,
          author: book.author,
          publisher: book.publisher,
          rating: book.rating,
          totalPages:book.totalPages,
        },
      };

      const result = await bookCollection.updateOne(
        filter,
        updatedBook,
        option
      );
      res.send(result);
    });

    // Category route
    app.post("/categories", async (req, res) => {
      const categories = req.body;
      const result = await categoryCollection.insertOne(categories);
      // console.log(result);
      res.send(result);
    });

    app.get("/categories", async (req, res) => {
      const query = categoryCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    app.delete("/category/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Deleted Value:=", id);
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.findOne(query);
      res.send(result);
    });

    app.put("/category/:id", async (req, res) => {
      const categoryId = req.params.id;
      // console.log(categoryId);
      const category = req.body;

      const filter = { _id: new ObjectId(categoryId) };
      const option = { upsert: true };

      const updatedCategory = {
        $set: {
          categoryName: category.categoryName,
          categoryDetails: category.categoryDetails,
        },
      };

      const result = await categoryCollection.updateOne(
        filter,
        updatedCategory,
        option
      );
      res.send(result);
    });

    // route for loading books categorybased
    app.get("/categoryy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { categoryId: id };
      const result = await bookCollection.find(query).toArray();
      console.log("Check HIT", result);
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
      const query = { userId: uid };
      console.log(query);
      const result = await userCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;

      console.log("User Update Value:", user);

      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };

      const updatedUser = {
        $set: {
          displayName: user.displayName,
          phone: user.phone,
          // photoUrl: user.photoUrl,
          address: user.address,
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
