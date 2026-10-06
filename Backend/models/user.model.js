import mongoose, {Schema} from 'mongoose';

const userSchema = new Schema({
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
                type:String,
                unique: true,
                trim: true,
                lowecase: true
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
                type:String,
                enum: ['user', 'admin'],
                default: 'user'
            }
}, {timestamps: true});



export const User = mongoose.model("User", userSchema);