import cors from "cors";
import express from "express";
import { connectToDatabase, getDB } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Connect to the the database before starting the server
connectToDatabase((error) => {
  if (!error) {
    db = getDB();

    // ROUTES
    // GET: all lessons
    app.get("/lessons", async (req, res) => {
      try {
        const lessons = await db.collection("Lessons").find().toArray();
        res.status(200).json(lessons);
      } catch (error) {
        console.error("Error fetching lessons:", error);
        res.status(500).json({ error: "Failed to fetch lessons" });
      }
    });

    //PUT: update lesson spaces
    app.put("/lessons/:id", async (req, res) => {
      try {
        const lessonId = parseInt(req.params.id);
        const updateData = req.body;
        console.log(req.params.id);

        // Only allow valid fields
        const allowedFields = [
          "subject",
          "location",
          "price",
          "spaces",
          "description",
          "rating",
        ];
        const updateFields = {};
        for (const key of allowedFields) {
          if (updateData[key] !== undefined)
            updateFields[key] = updateData[key];
        }

        if (Object.keys(updateFields).length === 0) {
          return res.status(400).json({ error: "No valid fields to update" });
        }

        const result = await db
          .collection("Lessons")
          .updateOne({ id: lessonId }, { $set: updateFields });

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: "Lesson not found" });
        }

        console.log(`Lesson ${lessonId} updated:`, updateFields);
        res
          .status(200)
          .json({ message: "Lesson updated", updated: updateFields });
      } catch (error) {
        console.error("Error updating lesson:", error);
        res.status(500).json({ error: "Could not update lesson" });
      }
    });

    // POST: create a new order
    app.post("/orders", async (req, res) => {
      try {
        const { name, phone, lessonIds, total } = req.body;

        // Basic validation
        if (
          !name ||
          !phone ||
          !Array.isArray(lessonIds) ||
          lessonIds.length === 0 ||
          !total
        ) {
          return res.status(400).json({ error: "Invalid order data" });
        }

        // Create new order object
        const newOrder = new Order(name, phone, lessonIds, total);

        // Insert order into the database
        const result = await db.collection("Orders").insertOne(newOrder);

        // Reduce spaces available for each lesson in the order
        for (const lessonId of lessonIds) {
          await db
            .collection("Lessons")
            .updateOne({ id: lessonId }, { $inc: { spaces: -1 } });
        }

        console.log("Order created with ID:", result.insertedId);
        res.status(201).json({
          message: "Order created successfully",
          orderId: result.insertedId,
        });
      } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Failed to create order" });
      }
    });

    //Health check route
    app.get("/", (req, res) => {
      res.send("Backend is running and connected to MongoDB Atlas");
    });

    // Start the server
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } else {
    console.error("Failed to start server due to database connection error");
  }
});
