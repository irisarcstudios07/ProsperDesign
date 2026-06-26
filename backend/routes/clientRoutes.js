const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getClients,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientController');

router.get('/', getClients);
router.post('/', protect, createClient);
router.put('/:id', protect, updateClient);
router.delete('/:id', protect, deleteClient);

module.exports = router;
