import multer from 'multer'

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/hotel');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''));
  }
});

const storageIcons = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/icons');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''));
  }
});

const storageGalery = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/galery');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''));
  }
});


export const uploadHotel = multer({ storage: storage });
export const uploadIcons = multer({ storage: storageIcons });
export const uploadGalery = multer({ storage: storageGalery });