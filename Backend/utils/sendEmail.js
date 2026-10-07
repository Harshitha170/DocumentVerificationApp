import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (toEmail, subject, textMessage) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Document Verification Portal" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: subject,
            text: textMessage,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Nodemailer Detailed Error:", error);
        throw error;
    }
};