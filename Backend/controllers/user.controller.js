import { User } from '../models/user.model.js';

export const getCurrentUser = async (req, res) => {
    try {
        // Match the JWT payload key (userId)
        const id = req.user?.userId || req.user?._id;
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};