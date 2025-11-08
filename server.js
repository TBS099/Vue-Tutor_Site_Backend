import express from "express";
import { connectToDatabase, getDB } from "./db.js";

const app = express();
app.use(express.json());

let db;

// Connect to the the database before starting the server
connectToDatabase((error) => {
  if (!error) {
    db = getDB();

    //ROUTES
    //GET: all lessons
    app.get("/lessons", async (req, res) => {
      try {
        const lessons = await db.collection("lessons").find().toArray();
        res.status(200).json(lessons);
      } catch (error) {
        console.error("Error fetching lessons:", error);
        res.status(500).json({ error: "Failed to fetch lessons" });
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
