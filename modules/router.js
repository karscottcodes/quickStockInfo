const express = require("express");
const pageRouter = express.Router();

pageRouter.get("/", async (request, response) => {
    response.render("index", {title: "Home"});
});



module.exports = pageRouter;