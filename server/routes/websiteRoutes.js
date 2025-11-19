const express = require('express');
const { generateWebsite } = require('../controllers/websiteController');
const { validateWebsiteRequest } = require('../middleware/validation');

const router = express.Router();

router.post('/generate', validateWebsiteRequest, generateWebsite);

module.exports = router;