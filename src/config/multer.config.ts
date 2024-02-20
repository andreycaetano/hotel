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
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const storageIcons = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/icons');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});


export const upload = multer({ storage: storage });
export const uploadIcons = multer({storage: storageIcons})