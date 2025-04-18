import multer, { diskStorage } from "multer";
import {Request, Response} from "express";

const allowedFileMimeType = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.ms-powerpoint",
    "application/vnd.ms-excel",
    "application/vnd.ms-powerpoint",
    "application/vnd.google-apps.document",
    "application/vnd.google-apps.spreadsheet",
    "application/vnd.google-apps.presentation",
  ];

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req: Request, file, cb) {
            cb(null, "./file-uploads")
        },
        filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
        // get the extension
        const extension = file.originalname.split(".").pop();
        // get the name without extension
        const withoutExtension = file.originalname.split(".")[0];
        // Put the name all-together
        cb(null, withoutExtension + uniqueSuffix + "." + extension);
        },
    }),

    fileFilter: function (req: Request, file, cb) {
        //TODO: Check for Virus
        if (allowedFileMimeType.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Invalid file type"));
        }
      },


});


export default upload;