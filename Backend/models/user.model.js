import mongoose, { Schema } from 'mongoose';
import { Counter } from './counter.model.js';

const userSchema = new Schema({
    customId: { 
        type: String, 
        unique: true 
    },
    userName: {
        type: String,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Others']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

// Auto-increment middleware for customId (using async/await without 'next')
userSchema.pre('save', async function () {
    if (!this.isNew) return;

    try {
        const counter = await Counter.findOneAndUpdate(
            { id: 'userId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true, returnDocument: 'after' }
        );

        this.customId = `ENWEB${counter.seq}`;
    } catch (error) {
        throw error; // Mongoose will catch this and pass it to your registration error handler
    }
});

export const User = mongoose.model("User", userSchema);