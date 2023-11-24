const express = require('express');
const router = express.Router();
const {
    getUser
  } = require("../middlewares"); 
const {
    getListProduct,
    getListProductShort,
    handleCreateNewProduct,
    handleRemoveProduct,
    handleUpdateProduct,
    getDetailProduct,
} = require('../controllers/product')


router.post('/full/s', getListProduct);

router.post('/full', getListProductShort);

router.get('/:id', getDetailProduct);

router.post('/add', getUser, handleCreateNewProduct);

router.put('/edit', getUser, handleUpdateProduct);

router.delete('/delete', getUser, handleRemoveProduct);

module.exports = router;
