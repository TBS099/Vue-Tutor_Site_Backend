import cors from "cors";
import express from "express";
import { connectToDatabase, getDB } from "./db.js";
import { logger } from "./middleware.js";
import Order from "./Models/Order.js";
import path from "path";
import { fileURLToPath } from "url";

// __dirname replacement in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
app.use(cors());
app.use(logger);
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
        const lessons = await db.collection("Lessons").find().toArray(); // Fetch lessons from DB
        const host = `${req.protocol}://${req.get("host")}`; // Construct host URL

        // Transform lessons to include full image URL
        const transformedLessons = lessons.map((lesson) => ({
          ...lesson,
          imageUrl: lesson.image ? `${host}/Images/${lesson.image}` : null,
        }));

        res.status(200).json(transformedLessons);
      } catch (error) {
        console.error("Error fetching lessons:", error);
        res.status(500).json({ error: "Failed to fetch lessons" });
      }
    });

    //PUT: update lesson spaces
    app.put("/lessons/:id", async (req, res) => {
      try {
        // Parse lesson ID and update data from request
        const lessonId = parseInt(req.params.id);
        const updateData = req.body;

        // Only allow valid fields
        const allowedFields = [
          "subject",
          "location",
          "price",
          "spaces",
          "description",
          "rating",
        ];

        // Build the update object
        const updateFields = {};
        for (const key of allowedFields) {
          if (updateData[key] !== undefined)
            updateFields[key] = updateData[key];
        }

        // If no valid fields to update, return error
        if (Object.keys(updateFields).length === 0) {
          return res.status(400).json({ error: "No valid fields to update" });
        }

        // Update the lesson in the database
        const result = await db
          .collection("Lessons")
          .updateOne({ id: lessonId }, { $set: updateFields });

        // Check if the lesson was found and updated
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: "Lesson not found" });
        }

        res
          .status(200)
          .json({ message: "Lesson updated", updated: updateFields });
      } catch (error) {
        console.error("Error updating lesson:", error);
        res.status(500).json({ error: "Could not update lesson" });
      }
    });

    //GET: Lesson Images
    app.get("/Images/:imageName", (req, res) => {
      // Serve lesson image files
      const imageName = req.params.imageName;
      const imagePath = path.join(__dirname, "Uploads", imageName);

      res.sendFile(imagePath, (err) => {
        if (err) {
          console.error("Error sending image file:", err);
          res.status(404).json({ error: "Image not found" });
        }
      });
    });

    // POST: create a new order
    app.post("/orders", async (req, res) => {
      try {
        // Extract order data from request body
        const { name, email, phone, lessonIds, total } = req.body;
        console.log(req.body);

        // Basic validation
        if (
          !name ||
          !email ||
          !phone ||
          !Array.isArray(lessonIds) ||
          lessonIds.length === 0 ||
          !total
        ) {
          return res.status(400).json({ error: "Invalid order data" });
        }

        // Create new order object
        const newOrder = new Order(name, email, phone, lessonIds, total);

        // Insert order into the database
        const result = await db.collection("Orders").insertOne(newOrder);

        // Reduce spaces available for each lesson in the order
        for (const lessonId of lessonIds) {
          await db
            .collection("Lessons")
            .updateOne({ id: lessonId }, { $inc: { spaces: -1 } });
        }

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
