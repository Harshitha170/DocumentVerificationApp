import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(localFilePath) => {  //localFilePath is an argument
    try {
        if(!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        }) //cloudinary.uploader.opload  .. will send file from local temp folder up to the cloudinary.
        

        fs.unlinkSync(localFilePath) // once th efile uploaded to the cloud, this line delete the temporary file from our  local server's harddrive
        return response; // returns the repsonse obj from cloudinary , which contains the secure URL 


    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary files as upload operation got failed
    }
}

export {uploadOnCloudinary}