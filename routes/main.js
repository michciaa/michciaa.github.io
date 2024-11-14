const express = require('express');

const router = express.Router();
const mainController = require('../controllers/main');


/* GET ROUTES */

router.get('/', mainController.getIndex);

/* ----------------------- */


/* POST ROUTES */

router.post('/', mainController.sendPrompt)

/* ----------------------- */

module.exports = router;