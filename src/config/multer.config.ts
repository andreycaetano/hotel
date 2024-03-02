import multer from 'multer'
import { AppError } from '../errors/appError.erros';

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

export interface UploadedFiles {
  [fieldname: string]: UploadedFile[];
}

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'hotel') {
      cb(null, 'uploads/hotel');
    } else if (file.fieldname === 'authors') {
      cb(null, 'uploads/authors');
    } else {
      throw new AppError(409 ,'Campo de imagem inválido');
    }
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now() + '-' + file.originalname.replace(/\s/g, ''));
  }
});


export const uploadHotel = multer({ storage: storage });
export const uploadIcons = multer({ storage: storageIcons });
export const uploadGalery = multer({ storage: storageGalery });