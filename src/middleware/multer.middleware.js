import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}-${Date.now()}`);
  },
});

const upload=multer({
  storage:storage,
  limits:{
    fileSize:5*1024*1024
  }
})
export default upload