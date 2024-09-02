import {
  Injectable,
  NotFoundException,
  ConflictException,
  // UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Test } from '../schemas/test.schema';
import { Question } from '../schemas/question.schema';
// import { User } from '../schemas/user.schema';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Test.name) private testModel: Model<Test>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
    // @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getTestByUniqueURL(userId: string): Promise<any> {
    const newTestUrl = uuidv4(); //generating uuid

    //check url exists or not
    let test = await this.testModel.findOne({ testUrl: newTestUrl }).exec();

    if (test) {
      // if exists
      throw new ConflictException('Test with this URL already exists');
    } else {
      // if not exists
      test = new this.testModel({
        userId: new Types.ObjectId(userId),
        testUrl: newTestUrl,
        isExpired: false,
        questionsAttempted: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await test.save();
    }
    return {
      testUrl: test.testUrl,
      isExpired: test.isExpired,
    };
  }

  async startAdaptiveTest(testId: string, userId: string) {
    const test = await this.testModel.findOne({ testUrl: testId });

    if (!test || (test.userId.toString() !== userId && test.isExpired)) {
      throw new NotFoundException('Test not found or access denied');
    }

    const selectedFields = {
      _id: 1,
      questionText: 1,
      options: 1,
      weightage: 1,
    };
    if (test.questionsAttempted.length === 0) {
      // fetch the single question who has weightage 5
      const getQuestion = await this.questionModel.aggregate([
        { $match: { weightage: 5 } },
        { $sample: { size: 1 } },
        {
          $project: selectedFields,
        },
      ]);
      return getQuestion;
    } else {
      // adaptive algorithm
      // const fetchUserPreviousAnswer = await this.testModel;

      const fetchUserPreviousAnswer = await this.testModel.aggregate([
        {
          $match: {
            testUrl: testId,
          },
        },
        {
          $unwind: '$questionsAttempted',
        },
        {
          $project: {
            questionsAttempted: 1, // Include only the questionsAttempted field
          },
        },
        {
          $sort: {
            'questionsAttempted.date': -1, // Sort by date in descending order
          },
        },
        {
          $limit: 1, // Limit to the most recent record
        },
      ]);

      const questionId = fetchUserPreviousAnswer[0].questionsAttempted.question;
      const fetchQuestion = await this.questionModel.findOne({
        _id: questionId,
      });

      //when correct answer leads to harder question
      if (
        fetchUserPreviousAnswer[0].questionsAttempted.option.toLowerCase() ===
        fetchQuestion.correctAnswer.toLocaleLowerCase()
      ) {
        const pickUniqueHardQuestion = async (
          testId: string,
          selectedFields: object,
        ): Promise<any> => {
          // Fetch the test document to get the list of attempted questions
          const test = await this.testModel
            .findOne({ testUrl: testId })
            .select('questionsAttempted');

          if (!test) {
            throw new NotFoundException('Test not found');
          }

          // Pick a random hard question
          const pickHardQuestion = await this.questionModel.aggregate([
            { $match: { weightage: 10 } },
            { $sample: { size: 1 } },
            { $project: selectedFields },
          ]);

          if (pickHardQuestion.length === 0) {
            throw new NotFoundException('No hard questions found');
          }

          const pickedQuestionId = pickHardQuestion[0]._id;

          // Check if the picked question ID exists in questionsAttempted
          const questionExists = test.questionsAttempted.some((attempt: any) =>
            attempt.question.equals(pickedQuestionId),
          );

          if (questionExists) {
            // Recursively call the function to pick another question
            return pickUniqueHardQuestion(testId, selectedFields);
          }

          // If the question doesn't exist in questionsAttempted, return it
          return pickHardQuestion[0];
        };
        return pickUniqueHardQuestion(testId, selectedFields);
      } else {
        const pickUniqueEasyQuestion = async (
          testId: string,
          selectedFields: object,
        ): Promise<any> => {
          // Fetch the test document to get the list of attempted questions
          const test = await this.testModel
            .findOne({ testUrl: testId })
            .select('questionsAttempted');

          if (!test) {
            throw new NotFoundException('Test not found');
          }

          // Pick a random hard question
          const pickHardQuestion = await this.questionModel.aggregate([
            { $match: { weightage: 1 } },
            { $sample: { size: 1 } },
            { $project: selectedFields },
          ]);

          if (pickHardQuestion.length === 0) {
            throw new NotFoundException('No hard questions found');
          }

          const pickedQuestionId = pickHardQuestion[0]._id;

          // Check if the picked question ID exists in questionsAttempted
          const questionExists = test.questionsAttempted.some((attempt: any) =>
            attempt.question.equals(pickedQuestionId),
          );

          if (questionExists) {
            // Recursively call the function to pick another question
            return pickUniqueEasyQuestion(testId, selectedFields);
          }

          // If the question doesn't exist in questionsAttempted, return it
          return pickHardQuestion[0];
        };
        return pickUniqueEasyQuestion(testId, selectedFields);
      }
    }
  }

  async answerQuestion(
    testId: string,
    questionId: string,
    answerQuestionDto: AnswerQuestionDto,
  ): Promise<any> {
    try {
      // Fetch the test document
      const test = await this.testModel.findOne({
        testUrl: testId,
        isExpired: false,
      });

      if (!test || test.isExpired) {
        throw new NotFoundException('Test not found or is expired');
      }

      // Convert questionId to ObjectId
      const objectIdQuestionId = new Types.ObjectId(questionId);

      // Fetch the question using the ObjectId
      const question: any =
        await this.questionModel.findById(objectIdQuestionId);
      // .session(session);

      if (!question) {
        throw new NotFoundException('Question not found');
      }

      // Check if the question has already been answered
      const questionAlreadyAttempted = test.questionsAttempted.some((attempt) =>
        attempt.question.equals(objectIdQuestionId),
      );

      if (questionAlreadyAttempted) {
        throw new ConflictException(
          'Answer already submitted for this question',
        );
      }

      // Determine if the answer is correct
      const isCorrect =
        question.correctAnswer.toLowerCase() ===
        answerQuestionDto.option.toLowerCase();

      // Update the test document with the new answer
      await this.testModel.updateOne(
        { testUrl: testId },
        {
          $push: {
            questionsAttempted: {
              question: objectIdQuestionId,
              option: answerQuestionDto.option,
              isCompleted: true,
              date: new Date(),
            },
          },
          $inc: { score: isCorrect ? question.weightage : 0 },
        },
      );

      const updatedTest = await this.testModel.findOne({ testUrl: testId });

      // Check test end conditions
      const testDetails = await this.checkTestEndConditions(
        updatedTest,
        questionId,
      );

      // Update the test document to mark as expired if needed
      if (testDetails.isCompleted) {
        await this.testModel.updateOne(
          { testUrl: testId },
          { $set: { isExpired: true } },
        );
        return {
          message: 'Test has been finished',
          isCorrect,
          score: updatedTest.score,
          totalObtainedScore: testDetails.totalObtainedScore,
          testCompleted: testDetails.isCompleted,
          percentage:
            (updatedTest.score / testDetails.totalObtainedScore) * 100,
        };
      }

      return {
        message: 'Answer submitted successfully',
        isCorrect,
        score: updatedTest.score,
        totalObtainedScore: testDetails.totalObtainedScore,
        testCompleted: updatedTest.isExpired,
        percentage: (updatedTest.score / testDetails.totalObtainedScore) * 100,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async checkTestEndConditions(test: Test, questionId: string): Promise<any> {
    const questionIds = test.questionsAttempted.filter((attempt) =>
      attempt.question.equals(questionId),
    );
    const questions = await this.questionModel
      .find({ _id: questionIds[0].question })
      .exec();

    const questionMap = new Map(
      questions.map((question) => [question._id.toString(), question]),
    );
    const incorrectAttempts = test.questionsAttempted
      .slice(-3)
      .filter((attempt) => {
        const question = questionMap.get(attempt.question.toString());
        return (
          question &&
          attempt.option.toLowerCase() !== question.correctAnswer.toLowerCase()
        );
      });
    let totalObtainedScore = test.totalObtainedScore || 0;
    let score = test.score || 0;

    for (const attempt of test.questionsAttempted) {
      const question = questionMap.get(attempt.question.toString());

      if (question) {
        if (
          attempt.option.toLowerCase() === question.correctAnswer.toLowerCase()
        ) {
          score += question.weightage;
          totalObtainedScore += question.weightage;
        } else {
          totalObtainedScore += question.weightage;
        }
      }
    }

    // Check for consecutive incorrect attempts on hard questions (weightage 10)
    const hasConsecutiveIncorrectHardQuestions =
      incorrectAttempts.length === 3 &&
      incorrectAttempts.every((attempt) => {
        const question = questionMap.get(attempt.question.toString());
        return question && question.weightage === 10;
      });

    // Check for an incorrect answer on a question with weightage 1
    const hasIncorrectEasyQuestion = test.questionsAttempted.some((attempt) => {
      const question = questionMap.get(attempt.question.toString());
      return (
        question &&
        question.weightage === 1 &&
        !question.correctAnswer
          .toLowerCase()
          .includes(attempt.option.toLowerCase())
      );
    });

    const reachedMaxQuestions = test.questionsAttempted.length >= 20;

    // Check if test should end based on the conditions
    if (
      hasConsecutiveIncorrectHardQuestions ||
      hasIncorrectEasyQuestion ||
      reachedMaxQuestions
    ) {
      // Mark the test as expired and update the score and totalObtainedScore
      await this.testModel.updateOne(
        { testUrl: test.testUrl },
        {
          isExpired: true,
          totalObtainedScore: totalObtainedScore,
          score: score,
        },
      );

      return {
        isCompleted: true,
        totalObtainedScore: totalObtainedScore,
        score: score,
      };
    }

    // If test is not expired, update the totalObtainedScore
    await this.testModel.updateOne(
      { testUrl: test.testUrl },
      {
        totalObtainedScore: totalObtainedScore,
      },
    );

    return {
      isCompleted: false,
      totalObtainedScore: totalObtainedScore,
      score: score,
    };
  }
  // async getTestDetails(testId: string): Promise<any> {
  //   try {
  //     // Find the test by ID
  //     const test = await this.testModel
  //       .findById(testId)
  //       .populate('userId')
  //       .populate('questionsAttempted.question')
  //       .exec();

  //     if (!test) {
  //       throw new NotFoundException(`Test with ID "${testId}" not found`);
  //     }
  //     console.log('Test whole by admin', test);
  //     // Transform the test object to the required format
  //     return {
  //       testId: test._id.toString(),
  //       testUrl: test.testUrl,
  //       // user: test.userId.name,
  //       isExpired: test.isExpired,
  //       score: test.score,
  //       totalObtainedScore: test.totalObtainedScore,
  //       questionsAttempted: test.questionsAttempted.map((attempt) => ({
  //         // question: attempt.question.questionText,
  //         option: attempt.option,
  //         isCompleted: attempt.isCompleted,
  //         date: attempt.date.toISOString(),
  //         // _id: attempt._id.toString(),
  //       })),
  //     };
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to retrieve test details');
  //   }
  // }
  async getTestDetails(testUrl: string): Promise<any> {
    try {
      // Aggregate the test details by testUrl
      const result = await this.testModel.aggregate([
        { $match: { testUrl } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'questions',
            localField: 'questionsAttempted.question',
            foreignField: '_id',
            as: 'questionsDetails',
          },
        },
        {
          $addFields: {
            questionDetails: {
              $map: {
                input: '$questionsAttempted',
                as: 'attempt',
                in: {
                  questionId: '$$attempt.question',
                  questionText: {
                    $let: {
                      vars: {
                        question: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$questionsDetails',
                                as: 'q',
                                cond: {
                                  $eq: ['$$q._id', '$$attempt.question'],
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },
                      in: '$$question.questionText',
                    },
                  },
                  correctAnswer: {
                    $let: {
                      vars: {
                        question: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$questionsDetails',
                                as: 'q',
                                cond: {
                                  $eq: ['$$q._id', '$$attempt.question'],
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },
                      in: '$$question.correctAnswer',
                    },
                  },
                  options: {
                    $let: {
                      vars: {
                        question: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$questionsDetails',
                                as: 'q',
                                cond: {
                                  $eq: ['$$q._id', '$$attempt.question'],
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },
                      in: '$$question.options',
                    },
                  },
                  userSelected: '$$attempt.option',
                  isCompleted: '$$attempt.isCompleted',
                  date: '$$attempt.date',
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            testId: '$_id',
            testUrl: '$testUrl',
            testDate: '$createdAt',
            score: '$score',
            totalObtainedScore: '$totalObtainedScore',
            questionDetails: 1,
            user: {
              id: '$user._id',
              name: '$user.name',
            },
          },
        },
      ]);

      if (result.length === 0) {
        throw new NotFoundException(`Test with URL "${testUrl}" not found`);
      }

      // Since aggregation returns an array, we return the first element
      return result[0];
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve test details');
    }
  }
}
