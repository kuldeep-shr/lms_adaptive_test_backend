import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Test extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, default: 0 }) // Default to 0 if not provided
  score: number;

  @Prop({ type: Number, default: 0 }) // Default to 0 if not provided
  totalObtainedScore: number;

  @Prop({
    type: [
      {
        question: { type: Types.ObjectId, ref: 'Question' },
        option: { type: String, required: true },
        isCompleted: { type: Boolean, required: true },
        date: { type: Date, required: true },
      },
    ],
    required: true,
  })
  questionsAttempted: Array<{
    question: Types.ObjectId;
    option: string;
    isCompleted: boolean;
    date: Date;
  }>;

  @Prop({ type: Boolean, default: false })
  isExpired: boolean;

  @Prop({ type: String, required: true, unique: true })
  testUrl: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const TestSchema = SchemaFactory.createForClass(Test);
