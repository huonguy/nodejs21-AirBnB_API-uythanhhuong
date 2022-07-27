const multer = require("multer");

function createId() {
  let id = "";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 25; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return id;
}

const uploadImage = (desPath) => {
  return multer({
    storage: multer.diskStorage({
      destination: `${desPath}`,
      filename(req, file, done) {
        const imgName = Date.now() + "-" + file.originalname;
        done(null, imgName);
      },
    }),
  });
};

module.exports = {
  createId,
  uploadImage,
};
