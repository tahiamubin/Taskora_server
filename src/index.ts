import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { ProblemFormData } from "./types/problem";
import { AskForHelpFormData } from "./types/help";
import {
  InterviewPrep,
  Topic,
  InterviewTopicDoc,
} from "./types/interview-prep";
import { ContestFormData } from "./types/Contest";

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
    const contestCollection = database.collection<ProblemFormData>("contest");
    const helpCollection = database.collection<AskForHelpFormData>("help");
    const InterviewCompanyCollection =
      database.collection<InterviewPrep>("Interview-company");
    const InterviewTopicCollection =
      database.collection<InterviewPrep>("Interview-topic");

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

    app.get("/problems/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await problemsCollection
        .find({
          userId: id,
        })
        .toArray();

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

    app.delete("/problems/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await problemsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.post("/contest", async (req: Request<{}, {}, ContestFormData>, res: Response) => {
      try {
        const data = req.body;
        const result = await contestCollection.insertOne(data);
        res.json(result);
      } catch (error) {
        res.status(500).json("Failed to add contest");
      }
    });

    app.get("/contest/:id", async (req: Request, res: Response) => {
      try {
        const {id} = req.params;
        const result = await contestCollection.find(
         { userId: id}
        ).toArray();
        res.json(result);
      } catch (error) {
        res.status(500).json("Failed to fetch data");
      }
    });

    app.patch("/contest/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      const updateData = req.body;
      const result = await contestCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );
      res.json(result);
    });

    app.delete("/contest/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await contestCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    // ask for help
    app.post("/help", async (req: Request, res: Response) => {
      try {
        const data = req.body;
        const result = await helpCollection.insertOne(data);
        res.json(result);
      } catch (error) {
        res.status(500).json("failed to ask for help");
      }
    });

    // help board
    app.get("/help", async (req: Request, res: Response) => {
      const result = await helpCollection.find().toArray();
      res.json(result);
    });

    //shared help --> student
    app.get("/shared-help/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await helpCollection
        .find({
          userId: id,
        })
        .toArray();
      res.json(result);
    });

    app.delete("/shared-help/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await helpCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.patch("/shared-help/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      const updateData = req.body;
      const result = await helpCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );
      res.json(result);
    });

    //Interview prep
    app.post("/interview-prep", async (req: Request, res: Response) => {
      try {
        const data = req.body;
        const result = await InterviewCompanyCollection.insertOne(data);
        res.json(result);
      } catch (error) {
        res.status(500).json("failed to ask for help");
      }
    });

    app.get("/interview-prep/:id", async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const result = await InterviewCompanyCollection.find({
          userId: id,
        }).toArray();
        res.json(result);
      } catch (error) {
        res.status(500).json("Failed to post interview prep");
      }
    });
    app.delete("/interview-prep/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await InterviewCompanyCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.patch("/interview-prep/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      const updateData = req.body;
      const result = await InterviewCompanyCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );
      res.json(result);
    });

    // 1. Topic যোগ করা (array-র শেষে যাবে)
    app.post("/interview-topic", async (req: Request, res: Response) => {
      try {
        const { planId, userId, title } = req.body;
        const cleanTitle = typeof title === "string" ? title.trim() : "";

        if (!ObjectId.isValid(planId) || !userId || !cleanTitle) {
          return res
            .status(400)
            .json({ message: "planId, userId and title are required" });
        }

        const topic: Topic = {
          id: new ObjectId(),
          title: cleanTitle,
          isDone: false,
          createdAt: new Date(),
        };

        await InterviewTopicCollection.updateOne(
          { planId: new ObjectId(planId), userId },
          { $push: { topics: topic }, $setOnInsert: { createdAt: new Date() } },
          { upsert: true },
        );

        res.status(201).json(topic);
      } catch (error) {
        res.status(500).json({ message: "Failed to add topic" });
      }
    });

    // 2. একটা plan-এর সব topic আনা
    app.get("/interview-topic/:planId", async (req: Request, res: Response) => {
      try {
        const { planId } = req.params;
        const userId = String(req.query.userId ?? "");

        if (!ObjectId.isValid(planId) || !userId) {
          return res.status(400).json({ message: "Invalid planId or userId" });
        }

        const doc = await InterviewTopicCollection.findOne({
          planId: new ObjectId(planId),
          userId,
        });

        res.json(doc?.topics ?? []);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch topics" });
      }
    });

    // edit and delete button
    app.patch(
      "/interview-topic/:planId/:topicId",
      async (req: Request, res: Response) => {
        try {
          const { planId, topicId } = req.params;
          const { userId, isDone, title } = req.body;

          if (
            !ObjectId.isValid(planId) ||
            !ObjectId.isValid(topicId) ||
            !userId
          ) {
            return res.status(400).json({ message: "Invalid ids or userId" });
          }

          const set: Document = {};
          if (typeof isDone === "boolean") set["topics.$.isDone"] = isDone;
          if (typeof title === "string" && title.trim()) {
            set["topics.$.title"] = title.trim();
          }

          if (Object.keys(set).length === 0) {
            return res.status(400).json({ message: "Nothing to update" });
          }

          const result = await InterviewTopicCollection.updateOne(
            {
              planId: new ObjectId(planId),
              userId,
              "topics.id": new ObjectId(topicId),
            },
            { $set: set },
          );

          if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Topic not found" });
          }

          res.json({ success: true });
        } catch (error) {
          res.status(500).json({ message: "Failed to update topic" });
        }
      },
    );

    // 4. Topic মুছে ফেলা

    // app.delete(
    //   "/interview-topic/:planId/:topicId",
    //   async (req: Request, res: Response) => {
    //     try {
    //       const { planId, topicId } = req.params;
    //       const userId = String(req.query.userId ?? "");

    //       if (!ObjectId.isValid(planId) || !ObjectId.isValid(topicId) || !userId) {
    //         return res.status(400).json({ message: "Invalid ids or userId" });
    //       }

    //       const result = await InterviewTopicCollection.updateOne(
    //         { planId: new ObjectId(planId), userId },
    //         { $pull: { topics: { id: new ObjectId(topicId) } } },
    //       );

    //       if (result.modifiedCount === 0) {
    //         return res.status(404).json({ message: "Topic not found" });
    //       }

    //       res.json({ success: true });
    //     } catch (error) {
    //       res.status(500).json({ message: "Failed to delete topic" });
    //     }
    //   },
    // );

    //console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

connectToMongoDB();

app.get(
  "/",
  (
    req: Request<{ id: string }, {}, Partial<AskForHelpFormData>>,
    res: Response,
  ) => {
    res.send("Server is running");
  },
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
