import mongoose, { Schema, Document } from "mongoose";

interface Comment {
  name: string;
  email: string;
  body: string;
}

const CommentSchema = new Schema<Comment>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  body: { type: String, required: true },
});

interface IPost extends Document {
  title: string;
  body: string;
  comments: Comment[];
  userId: mongoose.Types.ObjectId; // reference to User
}

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  comments: [CommentSchema],
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Post = mongoose.model<IPost>("Post", PostSchema);
export default Post;
