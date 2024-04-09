import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
const router = express.Router();

const storage = multer.memoryStorage();
const uplpoad = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 megabytes
  },
});

// multer will attach the files to the request object
router.post(
  '/',
  uplpoad.array('imageFiles', 6),
  async (req: Request, res: Response) => {
    try {
      if (!req.files) {
        return res.status(400).json({
          message: 'No files uploaded',
        });
      }

      const imageFiles = req.files as Express.Multer.File[];
      const newHotel = req.body;

      // 1- upload the images to cloudinary
      const uploadPromises = imageFiles.map(async (imageFile) => {
        const b64 = Buffer.from(imageFile.buffer).toString('base64');
        let dataURI = `data:${imageFile.mimetype};base64,${b64}`;
        const uploadedImage = await cloudinary.v2.uploader.upload(dataURI);
        return uploadedImage.url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      // 2- if upload is successful, add the URLs to the newHotel object
      // 3- save the newHotel object to the database
      // 4- return a 201 status code with the newHotel object
    } catch (error) {
      console.error('error while creating hotel: ', error);
      res.status(500).json({
        message: 'something went wrong...',
      });
    }
  }
);
