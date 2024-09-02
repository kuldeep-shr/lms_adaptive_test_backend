import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Question extends Document {
  @Prop({ required: true })
  questionText: string;

  @Prop({
    type: [{ option: { type: String, required: true } }],
    required: true,
  })
  options: { option: string }[];

  @Prop({ required: true })
  correctAnswer: string;

  @Prop({ type: Number, default: 0 })
  weightage: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
