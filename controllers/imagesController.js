const {Images} = require('../models/images-model');
const cloudinary = require("../cloudinary/cloudinary-config");
const _ = require("lodash");


exports.UploadImage=async(imagePath)=>{
    const Uploadresult=await cloudinary.uploader.upload(imagePath);
    const image=new Images({
        imgUrl:Uploadresult.url
    })
   const UploadImage=await image.save()
    return UploadImage
}