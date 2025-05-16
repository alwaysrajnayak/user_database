import { Request, Response, NextFunction } from "express";
import axios from "axios";
import User from "../models/User";
import Post from "../models/Post";

// GET /load
export const loadData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const usersResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/users?_limit=10"
    );
    const usersData = usersResponse.data;

    const postsResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    const postsData = postsResponse.data;

    const commentsResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/comments"
    );
    const commentsData = commentsResponse.data;

    await User.deleteMany({});
    await Post.deleteMany({});

    for (const user of usersData) {
      const newUser = new User({
        name: user.name,
        username: user.username,
        email: user.email,
        address: user.address,
        phone: user.phone,
        website: user.website,
        company: user.company,
        posts: [],
      });
      await newUser.save();

      // Filter posts for this user
      const userPosts = postsData.filter(
        (post: any) => post.userId === user.id
      );

      // Create posts with proper userId
      const createdPosts = await Promise.all(
        userPosts.map(async (post: any) => {
          const postComments = commentsData.filter(
            (comment: any) => comment.postId === post.id
          );

          const newPost = new Post({
            title: post.title,
            body: post.body,
            comments: postComments.map((c: any) => ({
              name: c.name,
              email: c.email,
              body: c.body,
            })),
            userId: newUser._id, // set userId correctly here
          });

          await newPost.save();
          return newPost._id;
        })
      );

      // Update user with posts array
      newUser.posts = createdPosts;
      await newUser.save();
    }

    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load data" });
  }
};

// DELETE /users
export const deleteAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await User.deleteMany({});
    await Post.deleteMany({});
    res.json({ message: "All users deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete users" });
  }
};

// DELETE /users/:userId
export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(userId);
    await Post.deleteMany({ userId: userId });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// GET /users/:userId
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("posts").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      address: user.address,
      posts: user.posts,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// POST /users
export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: "Error adding user", error });
  }
};
