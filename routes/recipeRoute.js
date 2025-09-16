const express = require("express")
const recipeControllerFile = require("../controller/recipeController")
const recipeRoute = express()
const auth = require("../middleware/auth");
const upload = require("../utils/multer");


recipeRoute.use(express.json())

recipeRoute.post("/create/recipe", auth, upload.single("image"), recipeControllerFile.createRecipe)

recipeRoute.post("/all/recipe", recipeControllerFile.AllRecipe)

recipeRoute.post("/update/recipe", auth, upload.single("image"), recipeControllerFile.updateRecipe)

recipeRoute.post("/delete/recipe", auth, recipeControllerFile.DeleteRecipe)


module.exports = recipeRoute
