import multer from "multer";

export const validationType = {
    image:["image/png","image/jpg","image/jpeg"],
}
export const handleMulterErr = (err,req,res,next)=>{
    if (err) {
        res.status(403).json({message:"multer error",err});
    } else {
        next();
    }
}
export const myMulter = (acceptType) => {
  
    const storage = multer.diskStorage({
      
    });
    function fileFilter(req,file,cb){
        if (acceptType.includes(file.mimetype)) {
            cb(null,true)
        } else {
            req.imageError = true;
            cb(null,false);
        }
    } 
    const upload = multer({storage,dest:`/uploads`,fileFilter});
    return upload;
}