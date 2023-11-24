const express = require('express');
const router = express.Router();
const {
    getUser
  } = require("../middlewares"); 
const {
  handleRemoveCategory,
  handleUpdateCategory,
  handleCreateNewCategory,
  getListCategory,
} = require('../controllers/category');


router.post('/full/s', getListCategory);
router.post('/add', getUser, handleCreateNewCategory);
router.put('/edit', getUser, handleUpdateCategory);
router.delete('/delete', getUser, handleRemoveCategory);

module.exports = router;
