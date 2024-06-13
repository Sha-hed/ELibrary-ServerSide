const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "https://assignment-11-5ffa8.web.app",
      "https://assignment-11-5ffa8.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: "unauthorized Access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status().send({ message: "Unauthorized Access" });
    }
    req.user = decoded;
    next();
  });
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ojv3wo1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const BookCategory = client.db("Assignment-11").collection("Category");
    const BookCollection = client.db("Assignment-11").collection("AllBooks");
    const BorrowedCollection = client
      .db("Assignment-11")
      .collection("Borrowed");

    // JWT Section

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "1h",
      });
      res.cookie("token", token, options).send({ success: true });
    });
    //Get Book or Category  Section

    app.get("/cat", async (req, res) => {
      const result = await BookCategory.find({}).toArray();
      res.send(result);
    });

    app.get("/books", async (req, res) => {
      const result = await BookCollection.find().toArray();
      res.send(result);
    });

    app.get("/books/:category", async (req, res) => {
      const findCategory = req.params.category;
      const query = { category: findCategory };
      const result = await BookCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/borrowedBooks", async (req, res) => {
      const email = req.query.email;
      const filter = { bor_email: email };
      const result = await BorrowedCollection.find(filter).toArray();
      res.send(result);
    });
    app.get("/boiNai", async (req, res) => {
      const email = req.query.email;
      const filter = { bor_email: email };
      const result = await BorrowedCollection.find(filter).toArray();
      res.send(result);
    });

    app.get("/please/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { bor_email: email };
      const result = await BorrowedCollection.find(filter).toArray();
      res.send(result);
    });

    app.get("/quan", async (req, res) => {
      const result = await BookCollection.find({
        quantity: { $gt: 0 },
      }).toArray();
      res.send(result);
    });

    app.get("/singleBook/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await BookCollection.findOne(query);
      res.send(result);
    });

    app.get("/updateB/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await BookCollection.findOne(query);
      res.send(result);
    });

    //Post Book Section

    app.post("/add", verifyToken, async (req, res) => {
      const book = req.body;
      const result = await BookCollection.insertOne(book);
      res.send(result);
    });

    app.post("/bor", async (req, res) => {
      const bor_book = req.body;
      const result = await BorrowedCollection.insertOne(bor_book);
      res.send(result);
    });

    //Update Book Section

    app.patch("/dec", async (req, res) => {
      const book = req.body;
      const filter = { _id: new ObjectId(book._id) };
      const updateDoc = {
        $inc: { quantity: -1 },
        // $inc : { quantity : 1 }
      };
      const result = await BookCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.patch("/returnQuantity/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $inc: { quantity: 1 },
      };
      const result = await BookCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.patch("/UpdateBooks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const bookInfo = req.body;
      console.log(bookInfo);
      const updateDoc = {
        $set: {
          ...bookInfo,
        },
      };
      const result = await BookCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Delete Book Section :

    app.delete("/returnBook/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await BorrowedCollection.deleteOne(filter);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("We are Heading Towards completing Assignment-11");
});

app.listen(port, () => {
  console.log(`Our backend Server is running for assignment on Port : ${port}`);
});
