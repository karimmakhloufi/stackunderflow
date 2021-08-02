import { Schema, model } from "mongoose";

const QuestionSchema = new Schema({
  content: String,
  author: {
    email: String,
  },
});

const QuestionModel = model("Question", QuestionSchema);

export default QuestionModel;
