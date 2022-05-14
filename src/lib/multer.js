const multer = require('multer')
const path = require('path')

const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/avatars'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[1])
    },
})
const avatarUpload = multer({
    // storage: avatarStorage,
    limits: { fileSize: 1048576 }, // bit-> 1MB
    fileFilter(req, file, cb) {
        // avatar upload validate
        if (!file.originalname.match(/\.(jpg|JPEG|jpeg|png)$/)) {
            return cb(new Error('File upload is incorrect format(jpg,jpeg,png)!'))
        }
        cb(null, true)
        // cb(null, false)
        // cb(null, false)
    },
})

module.exports = { avatarUpload }
