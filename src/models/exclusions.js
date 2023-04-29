const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");

const exclusionSchema = new Schema(
  {
    market: {
      type: String,
      required: [true, "Set <market> for exclusion"],
    },
    pair: {
      type: String,
      required: [true, "Set <pair> for exclusion"],
    },
  },
  { versionKey: false, timestamps: true }
);

exclusionSchema.post("save", handleMongooseError);

const Exclusion = model("exclusion", exclusionSchema);

module.exports = Exclusion;
