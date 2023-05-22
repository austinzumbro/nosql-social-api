const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const getSingleUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate("friends")
      .populate("thoughts");
    !user
      ? res.status(404).json({ message: "No user with that ID" })
      : res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      // condition
      { _id: req.params.userId },
      // update
      req.body,
      { runValidators: true, new: true }
    );
    !user
      ? res.status(404).json({ message: "No user found with that ID." })
      : res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndRemove({ _id: req.params.userId });
    const thoughts = await Thought.deleteMany({ _id: { $in: user.thoughts } });
    !user
      ? res.status(404).json({ message: "No user found with that ID." })
      : res.status(200).json({ deletedUser: user, deletedThoughts: thoughts });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const addFriend = async (req, res) => {
  try {
    const friend = await User.findById(req.params.friendId);
    if (!friend) {
      res
        .status(404)
        .json({ message: "Unable to find the friend by their ID." });
    }
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );
    !user
      ? res.status(404).json({ message: "No user found with that ID" })
      : res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const deleteFriend = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );
    !user
      ? res.status(404).json({ message: "No user found with that ID" })
      : res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

module.exports = {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
};
