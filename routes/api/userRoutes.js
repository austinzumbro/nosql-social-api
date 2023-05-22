const router = require("express").Router();

const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
} = require("../../controllers/userController");

// /api/users
router.route("/").get(getUsers).post(createUser);

// /api/users/<specific userid>
router.route("/:userId").get(getSingleUser).put(updateUser).delete(deleteUser);

// /api/users/<specific userid>/friends/<specific userid>
router.route("/:userId/friends/:friendId").post(addFriend).delete(deleteFriend);

module.exports = router;
