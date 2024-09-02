import * as fs from 'fs';

const generateQuestions = (numQuestions: number) => {
  const questions = [];
  for (let i = 1; i <= numQuestions; i++) {
    questions.push({
      questionText: `Sample Question ${i}: What is ${i} + ${i}?`,
      options: [
        { option: `${i * 2 - 1}` },
        { option: `${i * 2}` },
        { option: `${i * 2 + 1}` },
      ],
      correctAnswer: `${i * 2}`,
      difficulty: Math.floor(Math.random() * 5) + 1,
      weightage: Math.floor(Math.random() * 10) + 1,
    });
  }
  return questions;
};

const questions = generateQuestions(60);
fs.writeFileSync('questions.json', JSON.stringify(questions, null, 2));
console.log('Questions generated and saved to questions.json');
