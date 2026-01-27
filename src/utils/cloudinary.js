import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error("No file path provided to uploadOnCloudinary");
            return null;
        }
        
        // Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.error(`File does not exist: ${localFilePath}`);
            return null;
        }
        
        console.log(`Uploading to Cloudinary: ${localFilePath}`);
        
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        
        // file has been uploaded successfull
        console.log("File uploaded to Cloudinary:", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.error("Cloudinary upload error:", error.message);
        // Remove file if it exists
        if (localFilePath && fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
            } catch (unlinkError) {
                console.error("Error deleting temp file:", unlinkError);
            }
        }
        return null;
    }
}



export {uploadOnCloudinary}