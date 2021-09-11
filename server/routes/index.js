// THIS ENTIRE FOLDER ISNT USED ANYMORE, THIS FOLDER USES REST, WE ARE TRYING TO CONVERT THIS APP TO USE GRAPHQL
//
//
//

const router = require("express").Router();
const path = require("path");
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

// serve up react front-end in production
router.use((req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

module.exports = router; // this entre folder has been commented out in server.js
