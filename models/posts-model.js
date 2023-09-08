const mongoose = require("mongoose");
// const Joi =require('joi')
const Schema = mongoose.Schema;
const PostSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },

    likes: {
      type: Array,
      default: [],
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    creator: {
      type: String,
    },
  },
  //when upate users or whatever ... that update timee stampes
  {
    timestamps: true,
  }
);

// module.exports=mongoose.model("Post", PostSchema);
module.exports = mongoose.model("Post", PostSchema);

// function validateAgainstErrors(post) {
//   const schema = Joi.object({ content: Joi.string().max(255).required() });

//   return schema.validate(post);
// }
// exports.validate = validateAgainstErrors;
