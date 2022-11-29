require('dotenv').config()
const multer = require("multer");
const express=require('express');
const bodyParser = require('body-parser');

const UserRouter=require('./routes/users-router');
const AuthRouter=require('./routes/auth-router');
const PostsRouter=require('./routes/posts-routes');


const app=express();
const morgan=require('morgan');

const fileFilter = (req,file, cb) => {
  file.mimetype.startsWith("image")
    ? cb(null, true)
    : cb(new Error('Only images are allowed !'))
};
app.use(
  multer({ storage: multer.diskStorage({}), fileFilter: fileFilter }).single( "image")
);


//middleware
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use('/api/user',UserRouter);
app.use('/api/auth',AuthRouter);
app.use('/api/post',PostsRouter)


app.use(require('./middellware/globalmiddellware'));




const mongoose=require('mongoose');
const port=process.env.PORT;
mongoose.connect(process.env.db)
.then((result)=>{
  app.listen(port,()=>{
    console.log('connect db')
    console.log( `the sever run in ${port}`);
  })
})
.catch((err)=>{
  console.log(err);
});





