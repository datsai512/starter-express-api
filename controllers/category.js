const Category = require("../models/category");
const {
    getRegexPatternSearch,
    Response,
    permission,
    convertId
} = require('../utils')
const {

} = require('../middlewares')


const getListCategory = async (req, res, next) => {
    const search = req.body?.search || req.query?.search || "";
    const pageNumber = req.body?.pageNumber || 0;
    const pageLength = search ? 1e18 : (req.body?.pageLength || 10);


    const regexSearch = getRegexPatternSearch(search) || "";

    try {
        const totalLength = await Product.find({}).count();
        const response = await Product.aggregate([
            {
                $skip: pageNumber * pageLength
            },
            {
                $match: {
                    name : {$regex: regexSearch}
                }
            },

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
        console.log('err at getListCategory ======>', e)
    }
}

// const getDetailProduct = async (req, res, next) => {
//     const id = req.body?.id || req.query?.id || "";
//     try {
//         const response = await Category.aggregate([
//             {
//                 $match: {
//                     $and: [
//                         { _id: { $eq: convertId(id)} },
//                     ],
//                 },
//             },

//         ]);

//         if(response.length > 0) {
//             res.send(Response(200, 'Succesfully', {
//                 data: response[0],
//             }))
//         } else {
//             res.send(Response(403, 'Not Found'))
//         }


//     } catch(e) {
//         console.log('err at getListProduct ======>', e)
//     }
// }

const handleCreateNewCategory = async (req, res, next) => {
    const userInfo = req.userInfo;

    const hasPermission = permission('category', userInfo, 'add');
    if(!hasPermission) {
        res.send(Response(403, 'Unauthentication!'));
        return;
    }

    const body = req.body;
    try {
      const newProduct = await Category.create({ ...body });
      if(newProduct) {
        res.send(Response(200, "Create Category Successfully"));
      } else {
        res.send(Response(500, "Internal Server !"));
      }

    } catch(e) {
        console.log('err at handleCreateNewCategory ======>', e)
    }
}

const handleUpdateCategory = async (req, res, next) => {
    const userInfo = req.userInfo;

    const hasPermission = permission('category', userInfo, 'edit');
    if(!hasPermission) {
        res.send(Response(403, 'Unauthentication!'));
        return;
    }

    const body = req.body;
    const id = req?.params.id || body?.id
    try {
      const updateProduct = await Category.findByIdAndUpdate(id, {$set: req.body}, {new: true});
      if(updateProduct) {
        res.send(Response(200, "Update Category Successfully"));
      } else {
        res.send(Response(500, "Internal Server !"));
      }

    } catch(e) {
        console.log('err at handleUpdateCategory ======>', e)
    }
}

const handleRemoveCategory = async (req, res, next) => {
    const userInfo = req.userInfo;

    const hasPermission = permission('category', userInfo, 'delete');
    if(!hasPermission) {
        res.send(Response(403, 'Unauthentication!'));
        return;
    }

    const body = req.body;
    const id = body?.id
    try {
        let removeProduct;
        if(typeof id === 'string') {
            removeProduct = await Category.deleteOne({
                _id: { $eq: convertId(id) },
            });
        } else {
            const newArrId = (id || []).map(item => convertId(item));
            removeProduct = await Patient.deleteMany({
                _id: { $eq: newArrId },
            });
        }

        if(removeProduct) {
            res.send(Response(200, "Remove Category Successfully"));
        } else {
            res.send(Response(500, "Internal Server !"));
        }

    } catch(e) {
        console.log('err at handleRemoveCategory ======>', e)
    }
}


module.exports = {
    getListCategory,
    // getDetailProduct,
    handleCreateNewCategory,
    handleUpdateCategory,
    handleRemoveCategory
};