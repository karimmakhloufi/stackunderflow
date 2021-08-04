import { Schema } from "mongoose";

const AnswerSchema = new Schema({
  sourceId: Schema.Types.ObjectId,
  questionId: Schema.Types.ObjectId,
  content: String,
  author: {
    email: String,
  },
});

export default AnswerSchema;
