const Product = require("../models/products");
const {
    getRegexPatternSearch,
    Response,
    permission,
    convertId
} = require('../utils')
const {

} = require('../middlewares')


const getListProduct = async (req, res, next) => {
    const search = req.body?.search || req.query?.search || "";
    const pageNumber = req.body?.pageNumber || 0;
    const pageLength = req.body?.pageLength || 10;

    const fromPrice = req.body?.fromPrice || 0;
    const toPrice = req.body?.toPrice || 1e18;

    const isSale = req.body?.isSale || false;
    const isHot = req.body?.isHot || false;

    const categoryRefArr = req?.body?.categories || [];
    const colorArr = req?.body?.colors || [];
    const sizeArr = req?.body?.sizes || [];

    const regexSearch = getRegexPatternSearch(search) || "";

    try {
        const totalLength = await Product.find({}).count();
        const response = await Product.aggregate([
            {
                $skip: pageNumber * pageLength
            },
            {
                $match: {
                    $or: [
                        {categoryRefIds : {$in: categoryRefArr}}
                    ]
                }
            },
            {
                $match: {
                    $or: [
                        {isSale : {$eq: isSale}}
                    ]
                }
            },
            {
                $match: {
                    $or: [
                        {isHot : {$eq: isHot}}
                    ]
                }
            },
            {
                $match: {
                    $or: [
                        {$and: [
                            {price : {$gte: fromPrice}},
                            {price : {$lte: toPrice}},
                        ]},
                        {$and: [
                            {"colors.sizes.price": {$gte: fromPrice}}, 
                            {"colors.sizes.price": {$lte: toPrice}}
                        ]}
                    ]
                }
            },

            {
                $match: {
                    $or: [
                        {$and: [
                            {"colors.color" : {$in: colorArr}},
                        ]},
                    ]
                }
            },

            {
                $match: {
                    $or: [
                        {$and: [
                            {"colors.sizes.size" : {$in: sizeArr}},
                        ]},
                    ]
                }
            },

            {
                $match: {
                    name : {$regex: regexSearch}
                }
            },
            {
                $project: {
                    colors: 0,
                    description: 0,
                    dateDiscount: 0
                }
            }

        ]);

        if(response.length > 0) {

            res.send(Response(200, 'Succesfully', {
                list: response,
                page: {
                    totalLength,
                    pageLength,
                    pageNumber
                }
            }))
        } else {
            res.send(Response(403, 'Not Found'))
        }


    } catch(e) {
        console.log('err at getListProduct ======>', e)
    }

 
}

const getListProductShort = async (req, res, next) => {
    const search = req.body?.search || req.query?.search || "";
    const regexSearch = getRegexPatternSearch(search) || "";

    try {
        const response = await Product.aggregate([
            {
                $match: {
                    name : {$regex: regexSearch}
                }
            },
            {
                $project: {
                    name: 1,
                    imgs: 1
                }
            }

        ]);

        if(response.length > 0) {

            res.send(Response(200, 'Succesfully', {
                list: response,
                page: {
                    totalLength,
                    pageLength,
                    pageNumber
                }
            }))
        } else {
            res.send(Response(403, 'Not Found'))
        }


    } catch(e) {
        console.log('err at getListProduct ======>', e)
    }

 
}

const getDetailProduct = async (req, res, next) => {
    const id = req.body?.id || req.query?.id || "";
    try {
        const response = await Product.aggregate([
            {
                $match: {
                    $and: [
                        { _id: { $eq: convertId(id)} },
                    ],
                },
            },

        ]);

        if(response.length > 0) {
            res.send(Response(200, 'Succesfully', {
                data: response[0],
            }))
        } else {
            res.send(Response(403, 'Not Found'))
        }


    } catch(e) {
        console.log('err at getListProduct ======>', e)
    }
}

const handleCreateNewProduct = async (req, res, next) => {
    const userInfo = req.userInfo;

    const hasPermission = permission('product', userInfo, 'add');
    if(!hasPermission) {
        res.send(Response(403, 'Unauthentication!'));
        return;
    }

    const body = req.body;
    try {
      const newProduct = await Product.create({ ...body });
      if(newProduct) {
        res.send(Response(200, "Create Product Successfully"));
      } else {
        res.send(Response(500, "Internal Server !"));
      }

    } catch(e) {
        console.log('err at getListProduct ======>', e)
    }
}

const handleUpdateProduct = async (req, res, next) => {
    const userInfo = req.userInfo;

    const hasPermission = permission('product', userInfo, 'edit');
    if(!hasPermission) {
        res.send(Response(403, 'Unauthentication!'));
        return;
    }

    const body = req.body;
    const id = req?.params.id || body?.id
    try {
      const updateProduct = await Product.findByIdAndUpdate(id, {$set: req.body}, {new: true});
      if(updateProduct) {
        res.send(Response(200, "Update Product Successfully"));
      } else {
        res.send(Response(500, "Internal Server !"));
      }

    } catch(e) {
        console.log('err at getListProduct ======>', e)
    }
}

const handleRemoveProduct = async (req, res, next) => {
    const userInfo = req.userInfo;

    const hasPermission = permission('product', userInfo, 'delete');
    if(!hasPermission) {
        res.send(Response(403, 'Unauthentication!'));
        return;
    }

    const body = req.body;
    const id = body?.id
    try {
        let removeProduct;
        if(typeof id === 'string') {
            removeProduct = await Product.deleteOne({
                _id: { $eq: convertId(id) },
            });
        } else {
            const newArrId = (id || []).map(item => convertId(item));
            removeProduct = await Product.deleteMany({
                _id: { $eq: newArrId },
            });
        }

        if(removeProduct) {
            res.send(Response(200, "Remove Product Successfully"));
        } else {
            res.send(Response(500, "Internal Server !"));
        }

    } catch(e) {
        console.log('err at getListProduct ======>', e)
    }
}


module.exports = {
    getListProduct,
    getListProductShort,
    getDetailProduct,
    handleCreateNewProduct,
    handleUpdateProduct,
    handleRemoveProduct
};