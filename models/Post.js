import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
      unique: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, //Referring to a user in the database
      ref: "User",
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true, //create data
  }
);
export default mongoose.model("Post", PostSchema);
