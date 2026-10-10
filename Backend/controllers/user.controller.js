import { User } from '../models/user.model.js';

export const getCurrentUser = async (req, res) => {
    try {
        // Match the JWT payload key (userId)
        const id = req.user?.userId || req.user?._id;
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
    customId: user.customId,
    userName: user.userName || user.email.split('@')[0], // Falls back cleanly if userName is blank
    role: user.role,
    mobile: user.mobile
})
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};