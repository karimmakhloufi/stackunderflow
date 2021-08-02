import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  content: String,
  author: {
    email: String,
  },
});

const TopicModel = mongoose.model("Topic", TopicSchema);

export default TopicModel;
