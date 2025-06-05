import { userModel } from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../services/sendEmail.js";

//signup function
export const signUp = async (req, res) => {
  try {
    let { fullName, email, password, cPassword, address,role } = req.body;
    if (!fullName || !email || !password) {
      res.status(404).json({status:"error", message: "All field are required" });
    } else {
      if (password == cPassword) {
        //Verify user existence
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
          res.status(400).json({status:"error", message: "This email already exisit" });
        } else {
          //Password encryption
          const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND));
          const hashedPassword = await bcrypt.hash(password, salt);
          //Create new user
          const newUser = new userModel({
            fullName,
            email,
            password: hashedPassword,
            address,
            role,
          });
          const savedUser = await newUser.save();
          const token = jwt.sign(
            { id: savedUser._id },
            process.env.JWT_EMAIL_KEY,
            { expiresIn: 60 * 60 * 60 }
          );
          const user = await userModel.findOne({email}).select("fullName email address isConfirm ");
          const url = `${req.protocol}://${req.headers.host}/economy-api/v1/auth/confirm/${token}`;
          const subject = 'Link for you to confirm your account';
          const message = `    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fff;">
      <h2 style="color: #753636;">Welcome in our application🎉</h2>
      <p style="color: #753636;">Thank you for register</p>
      <ul>
        <a href="${url}">Clik here to confirm your account successfully</a>
      </ul>
      <p style="color: #753636;">If you need any assistance, do not hesitate to contact us.</p>
      <hr>
      <p style="text-align: center; font-size: 14px; color: #753636;">
         All rights reserved 2025 &copy;
      </p>
    </div>
          `;
          sendEmail(savedUser.email, message,subject);
          res
            .status(201)
            .json({
              status:"success",
              message:
                "User registered successfully. Please confirm your email.",
              user,
            });
        }
      } else {
        res.status(403).json({status:"error", message: "password not match with confirm password" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Login function
export const logIn = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      res.status(404).json({status:"error", message: "All field are required" });
    } else {
      //Verify user existence
      const exisitingUser = await userModel.findOne({ email });
      if (exisitingUser) {
        if (exisitingUser.isConfirm) {
          //Verify passowrd
          const matched = await bcrypt.compare(
            password,
            exisitingUser.password
          );
          if (!matched) {
            res.status(401).json({status:"error", message: "This password is in-correct" });
          } else {
            //create token
            const token = jwt.sign(
              { id: exisitingUser._id , role:exisitingUser.role},
              process.env.JWT_SECRET,
              { expiresIn: 60 * 60 * 60 }
            );
            //return {token,id,fullName,email}
            res.status(200).json({
              status:'success',
              message: "You are logged in successfully",
              token,
            });
          }
        } else {
          res.status(403).json({status:"error", message: "Please confirm your email before logging in." });
        }
      } else {
        res.status(401).json({status:"error", message: "You must register first" });
      }
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

//confirm account function
export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (token == undefined || token == null || !token) {
      res.status(400).json({status:"error", message: "You must have a token" });
    } else {
      const decoded = jwt.verify(token, process.env.JWT_EMAIL_KEY); //verify token
      if (decoded) {
        const { id } = decoded;
        const foundedUser = await userModel.findById(id);
        if (foundedUser) {
          if (foundedUser.isConfirm) {
            res
              .status(403)
              .json({status:"error", message: "This account is already confirmed" });
          } else {
            //update isConfirm
            const updatedUser = await userModel.findByIdAndUpdate(
              foundedUser.id,
              { isConfirm: true },
              { new: true }
            );
            res
              .status(200)
              .json({status:"success", message: "Email confirmed successfully. You can now log in."});
          }
        } else {
          res.status(400).json({ status:"error",message: "This account not found" });
        }
      } else {
        res.status(400).json({status:"error", message: "Invalid token" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//send code function
export const sendCode = async (req, res) => {
  try {
    let { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      res
        .status(404)
        .json({status:"error", message: "This email not found you have to register" });
    } else {
      const verifyCode =  Math.floor(Math.random()* (199999-100000+1)+100000);//create verification code by Math
      await userModel.findByIdAndUpdate(user._id, { code: verifyCode });//save verification code in database
      const subject = 'Code for you to change your password';
      const message = `  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fff;">
      <h2 style="color: #753636;">Welcome in our application🎉</h2>
      <p style="color: #753636;">Thank you for register</p>
      <ul>
        <li style="color: #753636;">This is your verification code:
        <h2 style="color:#26994F;">${verifyCode}</h2>
        </li>
      </ul>
      <p style="color: #753636;">If you need any assistance, do not hesitate to contact us.</p>
      <hr>
      <p style="text-align: center; font-size: 14px; color: #753636;">
         All rights reserved 2025 &copy;
      </p>
    </div>
      `;
      sendEmail(user.email, message,subject);
      res
        .status(200)
        .json({status:"success", message: "Verification code sent to your email." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//forget password function
export const forgetPassword = async (req, res) => {
  try {
    let { code, email, password } = req.body;
    if (!code) {
      res.status(400).json({status:"error", message: "Invalid verification code" });
    } else {
      //check if code and email exisit and correct
      const exisitingUser = await userModel.findOne({ email, code });
      if (!exisitingUser) {
        res.status(404).json({status:"error", message: "Email or code is in-correct" });
      } else {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND));
        const hashedPass = await bcrypt.hash(password, salt);
        //update password and code
        const updatedUser = await userModel.findByIdAndUpdate(
          exisitingUser._id,
          { code: null, password: hashedPass },
          { new: true }
        );
        res
          .status(200)
          .json({status:"success", message: "Password reset successfully. You can now log in."});
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//logout function
export const logOut = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

