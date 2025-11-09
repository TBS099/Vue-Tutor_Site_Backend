import express from "express";
import { connectToDatabase, getDB } from "./db.js";

const app = express();
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
        const lessons = await db.collection("lessons").find().toArray();
        res.status(200).json(lessons);
      } catch (error) {
        console.error("Error fetching lessons:", error);
        res.status(500).json({ error: "Failed to fetch lessons" });
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
        const result = await db.collection("orders").insertOne(newOrder);

        // Reduce spaces available for each lesson in the order
        for (const lessonId of lessonIds) {
          await db
            .collection("lessons")
            .updateOne({ id: lessonId }, { $inc: { spaces: -1 } });
        }

        console.log("Order created with ID:", result.insertedId);
        res
          .status(201)
          .json({
            message: "Order created successfully",
            orderId: result.insertedId,
          });
      } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Failed to create order" });
      }
    });

    // Start the server
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } else {
    console.error("Failed to start server due to database connection error");
  }
});
