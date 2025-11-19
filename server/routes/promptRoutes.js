const express = require('express');
const { getWebsiteTypes, getBasePrompt } = require('../controllers/promptController');

const router = express.Router();

router.get('/types', getWebsiteTypes);
router.get('/base/:websiteType', getBasePrompt);

module.exports = router;