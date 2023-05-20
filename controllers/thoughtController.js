const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

const getThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.status(200).json(thoughts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const getSingleThought = async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId }).select(
      "-__v"
    );
    !thought
      ? res.status(404).json({ message: "No thought with that ID" })
      : res.status(200).json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const createThought = async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    res.status(200).json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const updateThought = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      // condition
      { _id: req.params.thoughtId },
      // update
      req.body,
      { runValidators: true, new: true }
    );
    !thought
      ? res.status(404).json({ message: "No thought found with that ID." })
      : res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findOneAndRemove({
      _id: req.params.thoughtId,
    });
    !thought
      ? res.status(404).json({ message: "No thought found with that ID." })
      : res.status(200).json({ user: user, thoughts: thoughts });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const createReaction = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    );
    !thought
      ? res.status(404).json({ message: "No thought found with that ID" })
      : res.status(200).json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const deleteReaction = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    );
    !thought
      ? res.status(404).json({ message: "No user found with that ID" })
      : res.status(200).json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

module.exports = {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction,
};
