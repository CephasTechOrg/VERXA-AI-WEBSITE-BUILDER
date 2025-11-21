const express = require('express');
const { generateWebsite, downloadWebsite } = require('../controllers/websiteController');
const { validateWebsiteRequest } = require('../middleware/validation');

const router = express.Router();

router.post('/generate', validateWebsiteRequest, generateWebsite);
router.get('/download/:id', downloadWebsite);

module.exports = router;
