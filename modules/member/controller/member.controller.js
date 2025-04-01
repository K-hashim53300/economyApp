import { memberModel } from "../../../DB/models/member.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { addMemberSchema } from "../validation/member.validation.js";
//add member function
//note this Api post in form-data
export const addMember = async (req, res) => {
  try {
    const userId = req.user._id; //get user._id from authMiddleware
    // Verify the validity of the data before uploading the image
    const { error, value } = addMemberSchema.validate(req.body);
    if (error) {
      return res
        .status(401)
        .json({ status: "error", message: error.details[0].message });
    } else {
      //uplod image on cloudinary
      const uplodedImg = await cloudinary.uploader.upload(req.file.path, {
        folder: `members`,
      });
      const newMember = new memberModel({
        userId,
        ...value, // it is valid data
        image: uplodedImg.secure_url,
      });
      const savedMember = await newMember.save();
      res.status(201).json({
        status: "success",
        message: "Member added successfully",
        savedMember,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//update member function
export const updateMember = async (req, res) => {
  try {
    const {id} = req.params;
    //get member by his id from params
    const foundMember = await memberModel.findById(id);
    if (foundMember) {
      //upload image on cloudinary
      const uploadedImg = await cloudinary.uploader.upload(req.file.path, {
        folder: `members`,
        });
        // any data you want update it
      const updateData = {
                memberName: req.body.memberName,
                roleInFamily: req.body.roleInFamily,
                job: req.body.job,
                salary: req.body.salary,
                gender: req.body.gender,
                birthday:req.body.birthday,
                image:uploadedImg.secure_url
              };
          const updatedMember = await memberModel.findByIdAndUpdate(
            id,
            updateData,
            {
              new: true,
              runValidators: true,
            }
          );
            res.status(200).json({
            status: "success",
            message: "Member updated successfully",
            updatedMember,
          });
        
    } else {
      res
      .status(404)
      .json({ status: "error", message: "This member not found" });
          
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
//delete member function
export const deleteMember = async (req, res) => {
  try {
    let { id } = req.params;
    const foundMember = await memberModel.findById(id);
    if (foundMember) {
      //delete member by id
      await memberModel.findByIdAndDelete(foundMember._id);
      res
        .status(200)
        .json({ status: "success", message: "Member deleted successfully" });
    } else {
      res
        .status(404)
        .json({ status: "error", message: "This member not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//get all members based on userId
export const getAllMembers = async (req, res) => {
  try {
    const userId = req.user._id;
    if (userId) {
      //get all members
      const members = await memberModel.find({ userId });
      if (!members.length) {
        res.status(404).json({
          status: "error",
          message: "This user doesn't have any members ",
        });
      } else {
        res.status(200).json({ status: "success", message: "Done", members });
      }
    } else {
      res.status(403).json({ message: "invalid userId" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//get member by memberName
export const getMemberByMemberName = async (req, res) => {
  try {
    const { memberName } = req.params;
    const member = await memberModel.findOne({ memberName });
    if (!member) {
      res.status(404).json({
        status: "error",
        message: "There is no member with this name",
      });
    } else {
      res.status(200).json({ status: "success", message: "Done", member });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
