import jwt from 'jsonwebtoken';

export const verifyJWT = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Unauthorized. Token missing or malformed." });
        }

        const token = authHeader.split(' ')[1]; // Extracts the actual token string after "Bearer "

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        
        req.user = decoded; // Attaches the payload which contains userId and role to req.user
        next(); // Proceeds to your controller (uploadDocuments)
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized. Invalid or expired token." });
    }
}


export const verifyAdmin = (req, res, next) => {
    try {
         if( req.user && req.user.role === 'admin'){
            next();
         } else {
            return res
            .status(403)
            .json({
                message: "Access denied. Admin privilages required"
            });
         }
        
    } catch (error) {
        return res
        .status(500)
        .json({
            message: "Internal server error during authorization",
            error: error.message
        });
    }
}
 
