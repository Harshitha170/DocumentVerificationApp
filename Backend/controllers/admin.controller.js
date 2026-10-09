import { User } from '../models/user.model.js';
import { Document } from '../models/document.model.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

// Get all users and their documents for the admin queue
export const getPendingDocuments = async (req, res) => {
    try {
        // Fetch only non-admin users (role: 'user') and select customId explicitly
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password').lean();
        
        const allDocuments = await Document.find({}).lean();

        // Map documents to their respective users and include customId
        let usersWithDocs = users.map(user => {
            const userDocs = allDocuments.filter(doc => {
                const docUserRef = doc.userId || doc.user;
                return docUserRef && String(docUserRef) === String(user._id);
            });

            return {
                _id: user._id,
                customId: user.customId || 'N/A', 
                username: user.userName || user.name || 'User',
                email: user.email || 'No Email',
                mobile: user.mobile || user.phone || 'N/A',
                documents: userDocs
            };
        });

        // Filter out users who have NO documents uploaded yet so the queue stays tidy
        usersWithDocs = usersWithDocs.filter(user => user.documents.length > 0);

        return res.status(200).json(usersWithDocs);
    } catch (error) {
        console.error("Error fetching admin documents:", error);
        return res.status(500).json({ message: "Failed to load admin dashboard queue", error: error.message });
    }
};

// Update Document Status (Approve/Reject) & Send Email Safely
export const updateDocumentStatus = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { status, rejectedReason } = req.body; // Expects 'Approved' or 'Rejected'

        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        // Update document status in DB
        document.status = status;
        if (rejectedReason) {
            document.rejectedReason = rejectedReason;
        }
        await document.save();

        let emailStatus = "Email sent successfully";

        // Try sending email, but DO NOT crash the request if email fails
        try {
            const user = await User.findById(document.userId);
            if (user && user.email) {
                const subject = `Document Update: Your ${document.docType || 'Document'} was ${status}`;
                const message = status === 'Approved' 
                    ? `Hello ${user.userName || 'User'},\n\nGreat news! Your document (${document.docType || 'ID'}) has been verified and approved.`
                    : `Hello ${user.userName || 'User'},\n\nUnfortunately, your document (${document.docType || 'ID'}) was rejected. Reason: ${rejectedReason || 'Not specified'}. Please re-upload.`;
                
                await sendVerificationEmail(user.email, subject, message);
            }
        } catch (emailError) {
            console.error("Warning: Failed to send notification email:", emailError.message);
            emailStatus = "Status updated, but email notification failed due to server mail settings.";
        }

        return res.status(200).json({ 
            message: `Document ${status} successfully! ${emailStatus}`, 
            document 
        });

    } catch (error) {
        console.error("Backend Error in updateDocumentStatus:", error);
        return res.status(500).json({ message: "Error updating document status", error: error.message });
    }
};