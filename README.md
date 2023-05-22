# NoSQL Social API

## Description

This week I'm leaving my SQL comfort zone and exploring a little NoSQL via MongoDB with Mongoose as an ODM. Based on some limited research, I get the impression that a driving force behind NoSQL's popularity has been its use in social applications, so that seemed like a decent enough test project to get started.

| **Scenario**                                                                                                                |
| :-------------------------------------------------------------------------------------------------------------------------- |
| _I want a basic social app where users can post thoughts, friend other users, and post reactions to other users' thoughts._ |

---

## Usage

The app is built with Node, Express, and uses a MongoDB database. Currently the app has no front-end, but if you'd like to play around with the API, you should feel free to do so. (I use [Insomnia](https://insomnia.rest/) for API testing.)

1. Install dependences: `npm i`
2. Update the database configuration in `/config/connection.js` to suit your environment
3. I made some silly seed data to help with testing. If you'd like to use it, just call `npm run seed`. Feel free to personalize the data beforehand, use it as is, or skip this step entirely.
4. Start the server: `npm start`

---

## My Approach

The app follows a basic Model-Controller pattern. (No real views yet.) So I started with the models, then built I built the routes, and then I built the controllers.

---

## Models

I had a little fun in here playing around with validation. I was recently brushing up on some Regex patterns, so I included some email validation on the User collection:

```javascript
email: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
          .test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
      required: [true, "User email address required"],
    },
```

Reading through the [Mongoose docs](https://mongoosejs.com/docs/tutorials/getters-setters.html), Getters and Setters caught my eye, so I threw a little date formatting on the Reaction schema.

> It also gave me a chance to brush up on my Javascript date formatting, which is always appreciated.

```javascript
createdAt: {
      type: Date,
      default: Date.now,
      // Add a getter to format the date 5/21/23 at 8:47 PM
      get: function (date) {
        const dateFormatOptions = {
          month: "numeric",
          day: "numeric",
          year: "2-digit",
        };
        const timeFormatOptions = {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };
        const formattedDate = date.toLocaleDateString(
          undefined,
          dateFormatOptions
        );
        const formattedTime = date.toLocaleTimeString(
          undefined,
          timeFormatOptions
        );
        return `${formattedDate} at ${formattedTime}`;
      },
    },
```

---

## Routes

I wrote the routes first because it felt like an intuitive way to think through my intended user behaviors. Nothing too interesting, except I recently learned this single-line syntax that I absolutely adore:

```javascript
// /api/users
router.route("/").get(getUsers).post(createUser);

// /api/users/<specific userid>
router.route("/:userId").get(getSingleUser).put(updateUser).delete(deleteUser);

// /api/users/<specific userid>/friends/<specific userid>
router.route("/:userId/friends/:friendId").post(addFriend).delete(deleteFriend);
```

Prior to this I'd been writing everything in these long vertical lists (and including the function code):

```javascript
router.get("/", async( req, res ) => { ... get Users code... });
router.post("/", async ( req, res ) => { ...create User code...};
// etc. etc.
```

That was fine on smaller structures, but I quickly got annoyed scrolling through code as things got longer. (This is especially difficult in collaborative environments where I'm not the only one contributing to the ever-expanding layout.) Realizing I could just split the routes from the controllers was a real moment of, "Oh, duh, that is so much better."

---

## Controllers

Nothing too interesting to report here. I spent most of the time trying to retrain my brain to think in MongoDB/Mongoose instead of MySQL/Sequelize.

I did think it was fun to check out some of the operators in MongoDB. For example, `$addToSet` and `$pull`.

```javascript
// Add a friend to a user document
const user = await User.findOneAndUpdate(
  { _id: req.params.userId },
  { $addToSet: { friends: req.params.friendId } },
  { runValidators: true, new: true }
);
// Remove a friend from a user document
const user = await User.findOneAndUpdate(
  { _id: req.params.userId },
  { $pull: { friends: req.params.friendId } },
  { runValidators: true, new: true }
);
```

One thing I find annoying about NoSQL is the need to explicitly declare linked behavior between documents/collections. For example, upon deleting a User, if I want to delete all associated Thoughts, I can't just `CASCADE` like I would in SQL.

```javascript
const user = await User.findOneAndRemove({
  _id: req.params.userId,
});
const thoughts = await Thought.deleteMany({
  _id: { $in: user.thoughts },
});
```

> In an earlier version, I messed this up by filtering the `Thought.deleteMany` query by a `username` property. But then I realized that updating a username wouldn't propagate to the username field stored on the Thought document, which even as I'm writing this I'm realizing is something that's still broken.
>
> What I should do is tie the id fields of both documents to each other more explicitly, so I have access to both ids no matter which document I look at. But see!? Annoying! Just give me a many-to-many through table and call it good! j/k.

---

## Learnings / Reflections

All jokes aside, I do understand the strengths of NoSQL and at this point my quibbles are entirely my own silly attachment to SQL. And, on that note, how exciting to get into new stuff!
