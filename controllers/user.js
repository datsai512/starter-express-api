const User = require("../models/user");
const {
    getRegexPatternSearch,
    Response,
    permission,
    convertId
} = require('../utils')
const {

} = require('../middlewares')


const getListUser = async (req, res, next) => {
    const search = req.body?.search || req.query?.search || "";
    const roles = req.body?.roles || req.query?.roles || [];
    const gender = req.body?.gender || req.query?.gender || [];
    
    const pageNumber = search ? 1 : (req.body?.pageNumber || 0);
    const pageLength = search ? 1e18 : (req.body?.pageLength || 10);
   

    const regexSearch = getRegexPatternSearch(search) || "";

    try {
        const totalLength = await User.find({}).count();
        const response = await User.aggregate([
            {
                $skip: pageNumber * pageLength
            },
            {
                $match: {
                    $or: [
                        {role : {$in: roles}}
                    ]
                }
            },
            {
                $match: {
                    $or: [
                        {gender : {$eq: gender}}
                    ]
                }
            },
            {
                $match: {
                    $or: [
                        {name : {$regex: regexSearch}},
                        {email : {$regex: regexSearch}},
                        {phoneNumber : {$regex: regexSearch}},
                    ]
                }
            },
            {
                $project: {
                    avatar: 1,
                    fullName: 1,
                    phoneNumber: 1,
                    email: 1,
                    role: 1,
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

const getListUserShort = async (req, res, next) => {
    const search = req.body?.search || req.query?.search || "";
    const regexSearch = getRegexPatternSearch(search) || "";

    try {
        const response = await User.aggregate([
            {
                $match: {
                    name : {$regex: regexSearch}
                }
            },
            {
                $project: {
                    name: 1,
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

const getDetailUser = async (req, res, next) => {
    const userInfo = req.userInfo;
    const id = req.body?.id || req.query?.id || "";
    const role = userInfo?.role;

    let project = {}

    const hasPermission = permission('user', userInfo, 'detail');
    const isYou = userInfo?._id === id;

    if(role === 'Customer' && isYou) {
        project = {
            permission: 0,
            password: 0,
        }
    }

    if(!isYou && !hasPermission) {
        res.send(Response(403, 'Unauthentication!'));
        return;
    }
 
    try {
        const response = await User.aggregate([
            {
                $match: {
                    $and: [
                        { _id: { $eq: convertId(id)} },
                    ],
                },
            },
            {
                $project: {
                    ...project
                }
            }


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

const handleCreateNewUser = async (req, res, next) => {
    const userInfo = req?.userInfo;
    const isSuperAdmin = userInfo?.role === 'SuperAdmin';

    const hasPermission = permission('user', userInfo, 'add');

    if(!hasPermission && !isSuperAdmin) {
        res.send(Response(403, 'Unauthentication!'));
        return;
    }

    const userRole = userInfo?.role;
    const body = req.body;
    const requestRole = body?.role;

    if (userRole === 'Employee') {
        if(['SuperAdmin', 'Admin'].indexOf(requestRole) >=0) {
            res.send(Response(403, 'You do not permission to create this account!'));
            return;
        }
    }

    if (userRole === 'Admin') {
        if(['SuperAdmin'].indexOf(requestRole) >=0) {
            res.send(Response(403, 'You do not permission to create this account!'));
            return;
        }
    }

    try {
      const newUser = await User.create({ ...body });
      if(newUser) {
        res.send(Response(200, "Create User Successfully"));
      } else {
        res.send(Response(500, "Internal Server !"));
      }

    } catch(e) {
        console.log('err at getListProduct ======>', e)
    }
}

const handleUpdateUser = async (req, res, next) => {
    const userInfo = req?.userInfo;
    const isSuperAdmin = userInfo?.role === 'SuperAdmin';

    const hasPermission = permission('user', userInfo, 'edit');
    if(!hasPermission && isSuperAdmin) {
        res.send(Response(403, 'Unauthentication!'));
        return;
    }

    const body = req.body;
    const id = req?.params.id || body?.id
    try {
      const updateProduct = await User.findByIdAndUpdate(id, {$set: req.body}, {new: true});
      if(updateProduct) {
        res.send(Response(200, "Update Product Successfully"));
      } else {
        res.send(Response(500, "Internal Server !"));
      }

    } catch(e) {
        console.log('err at getListProduct ======>', e)
    }
}

// const handleRemoveProduct = async (req, res, next) => {
//     const userInfo = req.userInfo;

//     const hasPermission = permission('product', userInfo, 'delete');
//     if(!hasPermission) {
//         res.send(Response(403, 'Unauthentication!'));
//         return;
//     }

//     const body = req.body;
//     const id = body?.id
//     try {
//         let removeProduct;
//         if(typeof id === 'string') {
//             removeProduct = await Product.deleteOne({
//                 _id: { $eq: convertId(id) },
//             });
//         } else {
//             const newArrId = (id || []).map(item => convertId(item));
//             removeProduct = await User.deleteMany({
//                 _id: { $eq: newArrId },
//             });
//         }

//         if(removeProduct) {
//             res.send(Response(200, "Remove Product Successfully"));
//         } else {
//             res.send(Response(500, "Internal Server !"));
//         }

//     } catch(e) {
//         console.log('err at getListProduct ======>', e)
//     }
// }


module.exports = {
    getListUser,
    getListUserShort,
    getDetailUser,
    handleCreateNewUser,
    handleUpdateUser
};