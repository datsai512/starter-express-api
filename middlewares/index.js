const User = require("../models/user");
const {
    Response
} = require('../utils')
 
const getUser =  async (req, res, next) => {
    const token = req.header("User-Token");
    if(!token) {
        res.end();
        return;
    }
    let user = await cached.get(token);
    if(!user) {
        res.send(Response('403', 'Unauthentication', {sucess: false}));
        return;
    };
    req.userInfo = JSON.parse(user);
    next(); 
}

const checkExistUser = async (req, res, next) => {
    const body = req.body;
    const username = body?.username;
    const email = body?.email;
    const phoneNumber = body?.phoneNumber;

    try {
        const checkExits = await User.aggregate([
            {
              $match: {
                $or: [
                  { username: { $eq: username } },
                  { email: { $eq: email } },
                  { phoneNumber: { $eq: phoneNumber } },
                ],
              },
            },
        ]);

        checkExits.length > 0 ? req.isExistedUser = true : req.isExistedUser = false;
        next();

    } catch(e) {
        throw e
    }
}


module.exports = {
    getUser,
    checkExistUser,
};
