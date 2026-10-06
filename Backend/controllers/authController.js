import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Document } from "../models/document.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from 'fs'

const registerUser = (async(req, res) => {
    try {
        const {mobile, password} = req.body;

        const existingUser = await User.findOne({mobile})
        if (existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //for newUser
        const newUser = await User.create({mobile, 
            password: hashedPassword,
            role: 'user'
        });
        return res.status(200).json({message: "User Registered successfully.",
            userId: newUser._id
        });



    } catch (error) {
        res
        .status(500).json({message: "Server error", error: error.message})
    }
})



const loginUser = (async(req,res) => {
      try {
        const {mobile, password} = req.body;

        if (!mobile || !password)
        {
            return res
            .status(400)
            .json(
                {
                    message: "Mobile number and password are required"
                }
            )
        }
        
        const user = await User.findOne({mobile});
        if(!user){
            return res
            .status(404)
            .json({message: "User not found . Please register"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res
            .status(401)
            .json({message: "Invalid credentials"})
        }

        //jwt token
        const token = jwt.sign(
            {userId: user._id, role: user.role},
            process.env.JWT_SECRET || 'secret123',
            {expiresIn: '1d'}
        );

        return res
        .status(200)
        .json({message: "Login Succesfull",
            token,
            user: {
                id: user._id,
                mobile: user.mobile,
                role: user.role
            }
      });

      } catch (error) {
        return res.status(500).json({message: "Server error during login.", error: error.message});
      }

})


const uploadDocuments = (async(req, res) => {
      try {
       const userId = req.user?.userId; //Getting user id  form middleware


       //user is authenticated?
       if(!userId){
        return res
        .status(401)
        .json({
            message: 'Unauthorized.Please login first'
        });
       }
       //extracting files from req.files 
       const aadharFile = req.files?.['Aadhar']?.[0];
       const panFile = req.files?.['Pan']?.[0];
       const dlFile = req.files?.['DL']?.[0];

       //checking files if exist
        if(!aadharFile || !panFile || !dlFile){

            // Clean up any uploaded temp files if validation fails
            [aadharFile, panFile, dlFile].forEach(file => {
                if (file?.path && fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
            return res
            .status(400)
            .json({
                message: "Please Upload all neccessary documents (Aadhar, Pan and DL)"
            })
        }

        //  Upload files to Cloudinary and store responses
        const aadharCloud = await uploadOnCloudinary(aadharFile.path);
        const panCloud = await uploadOnCloudinary(panFile.path);
        const dlCloud = await uploadOnCloudinary(dlFile.path);

        if (!aadharCloud || !panCloud || !dlCloud) {
            return res.status(500).json({ message: "Error uploading files to Cloudinary." });
        }

        //if successfull uploaded 
        // --cloudinary --> mongodb
        //save all three docs to mongodb in one go

        const savedDocuments = await Document.insertMany([
            {
                userId: userId,
                docType: 'Aadhar',
                fileUrl: aadharCloud.secure_url,
                cloudinaryPublicId: aadharCloud.public_id,
                status: 'Pending'
            },
            {
                userId: userId,
                docType: 'Pan',
                fileUrl: panCloud.secure_url,
                cloudinaryPublicId: panCloud.public_id,
                status: 'Pending'
            },
            {
                userId: userId,
                docType: 'DL',
                fileUrl: dlCloud.secure_url,
                cloudinaryPublicId: dlCloud.public_id,
                status: 'Pending'
            }
        ]);

        //sending success response to the frontend
        return res
        .status(200)
        .json
        ({message: "Documents uploaded successfully and sent for the verification", savedDocuments})


      } catch (error) {
        console.log("Cloudinary upload error:", error); // Log the real error to terminal

        // Safe cleanup for all temp files on error
        const files = [req.files?.['Aadhar']?.[0], req.files?.['Pan']?.[0], req.files?.['DL']?.[0]];
        files.forEach(file => {
            if (file?.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
      
       return res.status(500).json({ message: "Server error during document upload.", error: error.message });
}
})

export {registerUser,
    loginUser,
    uploadDocuments
}