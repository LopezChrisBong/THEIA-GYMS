import { join } from 'path';

export class Helper1 {
  static customFileName(req, file, cb) {
    let customFile = file.originalname.split('.')[0];
    // console.log('FILES',file, cb ,req)
    customFile =
      customFile.replace(/\s/g, "").replace(/%20/g, "") + Date.now() + '-' + Math.round(Math.random() * 1e9);
    let fileExtension = '';
    
    if (file.mimetype.indexOf('jpeg') > -1) {
      fileExtension = '.jpeg';
    } else if (file.mimetype.indexOf('jpg') > -1) {
      fileExtension = '.jpg';
    } else if (file.mimetype.indexOf('png') > -1) {
      fileExtension = '.png';
    } else if (file.mimetype.indexOf('pdf') > -1) {
      fileExtension = '.pdf';
    }else if (file.mimetype.indexOf('doc') > -1) {
        fileExtension = '.doc';
    }else if (file.mimetype.indexOf('docx') > -1) {
        fileExtension = '.docx';
    }else if (file.mimetype.indexOf('docx') > -1) {
      fileExtension = '.csv';
  }
  else if (file.mimetype.indexOf('xls') > -1) {
    fileExtension = '.xls';
}
else if (file.mimetype.indexOf('xlsx') > -1) {
  fileExtension = '.xlsx';
}else if (file.mimetype.indexOf('txt') > -1) {
  fileExtension = '.txt';
}

    customFile = customFile + fileExtension;
    cb(null, customFile);
  }




  static upload_application_letter(req, file, cb) {
    // cb(null, join(process.cwd(), '/uploaded_leave_attachment/'));
    cb(null, join(process.cwd(), '/../upload_application_letter/'));
  }

   

  static multiple_file_upload(req, file, cb) {
    cb(null, join(process.cwd(), '/upload_job_application/'));
    // cb(null, join(process.cwd(), '/../upload_job_application/'));
}


static resolution_file(req, file, cb) {
  // cb(null, join(process.cwd(), '/uploaded_resolution/'));
  cb(null, join(process.cwd(), '/../uploaded_resolution/'));
}

  static esign_filepath(req, file, cb) {
    cb(null, join(process.cwd(), '/../uploadedEsigImg/'));
  }
}
