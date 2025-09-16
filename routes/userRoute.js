const express = require("express")
const userRoute = express.Router();
const userControllerFile = require("../controller/userController");
// const auth = require('../middlware/auth');
const auth = require("../middleware/auth")    //auth m token bhjna jaruri hota h h front se
const upload = require("../middleware/upload");

// const authenticate = userControllerFile.authenticate;

userRoute.post('/user/register', userControllerFile.Register);

userRoute.post('/user/login', userControllerFile.login);

// userRoute.get('/findAlluser', userControllerFile.AllUser);

// userRoute.post('/user/update', userControllerFile.UpdateUser);

// userRoute.post('/profile/update', upload.single("image"), userControllerFile.profileUpdate);

// userRoute.post('/delete/user', userControllerFile.deleteUser);



module.exports = userRoute