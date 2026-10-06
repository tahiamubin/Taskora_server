import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { ProblemFormData } from "./types/problem";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const client = new MongoClient(process.env.MONGO_URL as string);

export async function connectToMongoDB() {
  try {
    await client.connect();
    const database = client.db("codeTrail");
    const problemsCollection = database.collection<ProblemFormData>("problems");

    // students-------------------------

    // student problem
    app.post(
      "/problems",
      async (req: Request<{}, {}, ProblemFormData>, res: Response) => {
        try {
          const data = req.body;
          const result = await problemsCollection.insertOne(data);
          res.json(result);
        } catch (error) {
          res.status(500).json("Failed to add problem");
        }
      },
    );

    app.get("/problems", async (req: Request, res: Response) => {
      const result = await problemsCollection.find().toArray();

      res.json(result);
    });

    app.patch(
      "/problems/:id",
      async (
        req: Request<{ id: string }, {}, Partial<ProblemFormData>>,
        res: Response,
      ) => {
        const { id } = req.params;
        const updateData = req.body;
        const result = await problemsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData },
        );

        res.json(result);
      },
    );

    //console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

connectToMongoDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
