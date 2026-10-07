import 'dotenv/config';
import connectDb from '../config/db.js';
import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';


const seedAdmin = async () => {
    try {
        await connectDb();
        const existingAdmin = await User.findOne({role: 'admin'});

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }
            //defining admin credentials
            const adminMobile = process.env.ADMIN_MOBILE;
            const adminPassword = process.env.ADMIN_PASSWORD;
            const adminEmail = process.env.ADMIN_EMAIL;
            const adminUserName = "SuperAdmin";
              
            //hashing the password
            const salt =  bcrypt.genSalt(10);
            const hashedPassword = bcrypt.hash(adminPassword, salt);

            //create and saving admin
             await User.create({
                userName: adminUserName,
                mobile: adminMobile,
                email: adminEmail,
                password: hashedPassword,
              role: 'admin'
             });

            console.log("Admin seeded Successfully!");
            process.exit(0);
        


    } catch (error) {
        console.log("Error seeding Admin", error);
        process.exit(1); //EXIT WITH FAILURE CODE
        
    }
};

seedAdmin();