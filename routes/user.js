const express = require('express');
const router = express.Router();
const {
    getUser
  } = require("../middlewares"); 
const {
  getListCategory,
  handleCreateNewUser,
  getListCategory,
  handleRemoveUser,
  getDetailUser
} = require('../controllers/user');


router.post('/full/s',  getUser, getListCategory);
router.get('/:id', getUser, getDetailUser);

router.post('/add', getUser, handleCreateNewUser);
router.put('/edit', getUser, handleUpdateUser);

router.delete('/delete', getUser, handleRemoveUser);

module.exports = router;
