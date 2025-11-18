import { MongoClient } from "mongodb";
import Lesson from "./Models/Lesson.js";

let dbConnection;

// Create connection string to MongoDB Atlas
const connectionString = process.env.MONGO_URI;

// Function to connect to the database
export async function connectToDatabase(callback) {
  try {
    const client = await MongoClient.connect(connectionString);
    dbConnection = client.db("Tutor-Site-DB");
    console.log("Connected to database");

    await initDB();
    callback();
  } catch (error) {
    console.error("Could not connect to database", error);
    callback(error);
  }
}

// Function to get the database connection
export function getDB() {
  return dbConnection;
}

// Initialize the database if necessary
async function initDB() {
  // Get existing collection names
  const collections = await dbConnection.listCollections().toArray();
  const collectionNames = collections.map((col) => col.name);

  // Check if lessons collection exists; if not, create it
  if (!collectionNames.includes("Lessons")) {
    await dbConnection.createCollection("Lessons");
    console.log("Lessons collection created");
  }

  const lessonCollection = dbConnection.collection("Lessons");
  const lessonsCount = await lessonCollection.countDocuments();

  // Check if lessons collection is empty; if so, populate with sample data
  if (lessonsCount === 0) {
    console.log("Initializing sample lessons data");

    // Sample lessons data
    const sampleLessons = [
      new Lesson(
        1,
        "Mathematics",
        "London",
        50,
        5,
        "math.webp",
        "Comprehensive math tutoring sessions",
        4.5
      ),
      new Lesson(
        2,
        "Physics",
        "Manchester",
        60,
        3,
        "physics.jpg",
        "Physics fundamentals and practical applications",
        4.2
      ),
      new Lesson(
        3,
        "Chemistry",
        "Birmingham",
        55,
        4,
        "chemistry.jpg",
        "Introduction to chemistry concepts and experiments",
        4.0
      ),
      new Lesson(
        4,
        "Biology",
        "Liverpool",
        45,
        6,
        "biology.jpg",
        "Study of living organisms and ecosystems",
        4.3
      ),
      new Lesson(
        5,
        "Computer Science",
        "Leeds",
        70,
        5,
        "compsci.jpg",
        "Programming and computer fundamentals",
        4.8
      ),
      new Lesson(
        6,
        "English Literature",
        "Bristol",
        40,
        8,
        "english.jpg",
        "Exploring poetry, drama, and classic novels",
        4.4
      ),
      new Lesson(
        7,
        "History",
        "Nottingham",
        50,
        7,
        "history.jpg",
        "World history and modern civilization overview",
        4.1
      ),
      new Lesson(
        8,
        "Geography",
        "Cardiff",
        45,
        6,
        "geography.jpg",
        "Understanding the world’s landscapes and cultures",
        4.0
      ),
      new Lesson(
        9,
        "Art & Design",
        "Edinburgh",
        65,
        5,
        "art.jpg",
        "Hands-on creative art and digital design projects",
        4.6
      ),
      new Lesson(
        10,
        "Music",
        "Glasgow",
        55,
        4,
        "music.webp",
        "Learn instruments, music theory, and performance",
        4.7
      ),
    ];

    // Insert sample lessons into the collection and log the result
    await lessonCollection.insertMany(sampleLessons);
    console.log("Lessons collection initialized with 10 sample lessons!");
  } else {
    console.log(`Lessons collection already has ${lessonsCount} documents.`);
  }

  //Check if Orders collection exists; if not, create it
  if (!collectionNames.includes("Orders")) {
    await dbConnection.createCollection("Orders");
    console.log("Orders collection created");
  } else {
    console.log("Orders collection already exists");
  }
}
