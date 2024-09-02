import { connect, connection } from 'mongoose';
import { QuestionSchema } from '../schemas/question.schema';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function seed() {
  try {
    // Use the MONGODB_URI environment variable for the connection string
    const mongoUri = process.env.DATABASE;

    await connect(mongoUri);
    console.log('Connected to MongoDB');

    const QuestionModel = connection.model('Question', QuestionSchema);

    const questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));

    await QuestionModel.insertMany(questions);
    console.log('Questions seeded successfully');
  } catch (error) {
    console.error('Error seeding questions:', error);
  } finally {
    connection.close();
  }
}

seed();
