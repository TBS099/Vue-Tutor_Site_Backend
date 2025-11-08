import { MongoClient } from "mongodb";
import Lesson from "./Models/Lesson";

let dbConnection;

//Create connection string to MongoDB Atlas
const connectionString =
  "mongodb+srv://root:root@tutor-site-db.8jwbs2s.mongodb.net/?appName=Tutor-Site-DB";

//Function to connect to the database
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

export function getDB() {
  return dbConnection;
}

//Initialize the database if necessary
async function initDB() {
  const lessonCollection = dbConnection.collection("lessons");

  const count = await lessonCollection.countDocuments();

  if (count === 0) {
    console.log("Initializing sample lessons data");

    // Sample lessons data
    const sampleLessons = [
      new Lesson(
        1,
        "Mathematics",
        "London",
        50,
        5,
        "/images/math.jpg",
        "Comprehensive math tutoring sessions",
        4.5
      ),
      new Lesson(
        2,
        "Physics",
        "Manchester",
        60,
        3,
        "/images/physics.jpg",
        "Physics fundamentals and practical applications",
        4.2
      ),
      new Lesson(
        3,
        "Chemistry",
        "Birmingham",
        55,
        4,
        "/images/chemistry.jpg",
        "Introduction to chemistry concepts and experiments",
        4.0
      ),
      new Lesson(
        4,
        "Biology",
        "Liverpool",
        45,
        6,
        "/images/biology.jpg",
        "Study of living organisms and ecosystems",
        4.3
      ),
      new Lesson(
        5,
        "Computer Science",
        "Leeds",
        70,
        5,
        "/images/compsci.jpg",
        "Programming and computer fundamentals",
        4.8
      ),
      new Lesson(
        6,
        "English Literature",
        "Bristol",
        40,
        8,
        "/images/english.jpg",
        "Exploring poetry, drama, and classic novels",
        4.4
      ),
      new Lesson(
        7,
        "History",
        "Nottingham",
        50,
        7,
        "/images/history.jpg",
        "World history and modern civilization overview",
        4.1
      ),
      new Lesson(
        8,
        "Geography",
        "Cardiff",
        45,
        6,
        "/images/geography.jpg",
        "Understanding the world’s landscapes and cultures",
        4.0
      ),
      new Lesson(
        9,
        "Art & Design",
        "Edinburgh",
        65,
        5,
        "/images/art.jpg",
        "Hands-on creative art and digital design projects",
        4.6
      ),
      new Lesson(
        10,
        "Music",
        "Glasgow",
        55,
        4,
        "/images/music.jpg",
        "Learn instruments, music theory, and performance",
        4.7
      ),
    ];

    await lessonCollection.insertMany(sampleLessons);
    console.log("Lessons collection initialized with 10 sample lessons!");
  } else {
    console.log(`Lessons collection already has ${count} documents.`);
  }
}
