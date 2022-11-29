const mongoose=require('mongoose');
// const Joi =require('joi')
const Schema=mongoose.Schema;
const PostSchema=new Schema({
  content:{
    type:String,
    required:true
  },
  images: [{ type: Schema.Types.ObjectId, ref: "Images" }],
  likes:{
    type:Array,
    default:[]
  },
  creator: {
    type: String,
  }
},
//when upate users or whatever ... that update timee stampes
{
    timestamps:true
}

);

// module.exports=mongoose.model("Post", PostSchema);
const Post = mongoose.model("Post", PostSchema);

function validateAgainstErrors(post) {
  const schema =Joi.object({content: Joi.string().max(255).required(),
  });

  return schema.validate(post);
}

exports.Post = Post;
exports.validate = validateAgainstErrors;


  