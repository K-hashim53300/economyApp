
const validationType = ["body","formData","params","query","headers"];
export const validationMidd = (schema) =>{
    return (req,res,next)=>{
        let validationErrorArr = []
        validationType.forEach((key)=>{
            if(schema[key]){
                let valid = schema[key].validate(req[key],{abortEarly:false});
                if(valid.error){
                    validationErrorArr.push(valid.error.details[0].message);
                }
            }
        });
        if (validationErrorArr.length) {
            res.status(400).json({message:"Error!",validationErrorArr});
        } else {
            next();
        }
    }
}