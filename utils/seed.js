const connection = require("../config/connection");
const { userData, thoughtData } = require("./data");
const { User, Thought } = require("../models");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  // Drop existing courses
  await User.deleteMany({});

  // Drop existing students
  await Thought.deleteMany({});

  await User.insertMany(userData);

  for (const thought of thoughtData) {
    const createdThought = await Thought.create(thought);
    console.log(createdThought);
    const updatedUser = await User.findOneAndUpdate(
      {
        $or: [
          { username: createdThought.username },
          { _id: createdThought.userId },
        ],
      },
      { $addToSet: { thoughts: createdThought._id } },
      { runValidators: true, new: true }
    );
    console.log(updatedUser);
  }

  console.info("Seeding complete! 🌱");
  process.exit(0);
});
