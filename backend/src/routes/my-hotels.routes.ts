import multer from 'multer';
import cloudinary from 'cloudinary';
import { body } from 'express-validator';
import express, { Request, Response } from 'express';

import verifyToken from '../middlewares/auth';
import Hotel, { HotelType } from '../models/hotels';

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
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  uplpoad.array('imageFiles', 6),
  async (req: Request, res: Response) => {
    try {
      if (!req.files) {
        return res.status(400).json({
          message: 'No files uploaded',
        });
      }

      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      // 1- upload the images to cloudinary
      const uploadPromises = imageFiles.map(async (imageFile) => {
        const b64 = Buffer.from(imageFile.buffer).toString('base64');
        let dataURI = `data:${imageFile.mimetype};base64,${b64}`;
        const uploadedImage = await cloudinary.v2.uploader.upload(dataURI);
        return uploadedImage.url;
      });

      const imageUrls = await Promise.all(uploadPromises);

      // 2- if upload is successful, add the URLs to the newHotel object
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      
      // 3- save the newHotel object to the database
      const hotel = new Hotel(newHotel);
      
      await hotel.save();

      // 4- return a 201 status code with the newHotel object
      res.status(201).send(hotel);
    } catch (error) {
      console.error('error while creating hotel: ', error);
      res.status(500).json({
        message: 'something went wrong...',
        error: error
      });
    }
  }
);

export default router;