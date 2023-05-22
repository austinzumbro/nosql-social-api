const { Schema, Types } = require("mongoose");

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
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
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

module.exports = reactionSchema;
