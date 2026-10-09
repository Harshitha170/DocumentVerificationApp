import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Document } from "../models/document.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from 'fs';

const registerUser = async (req, res) => {
    try {
        const { userName, email, mobile,age , gender, password, role} = req.body;

        const existingUser = await User.findOne({ $or: [{ mobile }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this mobile or email" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({ 
            userName,
            email,
            mobile,
            age,
            gender, 
            password: hashedPassword,
            role: 'user'
        });

        return res.status(201).json({ 
            message: "User Registered successfully.",
            userId: newUser._id 
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ message: "Server error during registration", error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({ message: "Mobile number and password are required" });
        }
        
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please register" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: "Login Successful",
            token,
            customId: user.customId, // <-- Sent explicitly for frontend storage
            user: {
                id: user._id,
                userName: user.userName,
                customId: user.customId,
                mobile: user.mobile,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error during login.", error: error.message });
    }
};

// Single Document Upload Controller (Handles one file + docType at a time)
const uploadDocuments = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { docType } = req.body; // Expecting 'Aadhar', 'Pan', or 'DL'
        const file = req.file; // Expects multer single('file') middleware

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. Please login first.' });
        }

        if (!docType || !file) {
            if (file?.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            return res.status(400).json({ message: "Document type and file are required." });
        }

        // Upload to Cloudinary
        const cloudinaryResponse = await uploadOnCloudinary(file.path);
        if (!cloudinaryResponse) {
            return res.status(500).json({ message: "Error uploading file to Cloudinary." });
        }

        // Save or update the document in MongoDB for this user and docType
        const savedDoc = await Document.findOneAndUpdate(
            { userId, docType },
            {
                userId,
                docType,
                fileUrl: cloudinaryResponse.secure_url,
                cloudinaryPublicId: cloudinaryResponse.public_id,
                status: 'Pending'
            },
            { upsert: true, new: true }
        );
            
        setTimeout(() => {
            console.log(`[Background Task] Document ${docType} processed for user ${userId}`);
        }, 1000);

        return res.status(200).json({
            success: true,
            message: `${docType} uploaded successfully!`,
            timestamp: new Date().toISOString(),
            document: savedDoc
        });
        

    } catch (error) {
        console.error("Cloudinary upload error:", error);

        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        return res.status(500).json({ message: "Server error during document upload.", error: error.message });
    }
};

export {
    registerUser,
    loginUser,
    uploadDocuments
};