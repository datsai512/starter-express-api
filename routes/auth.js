const express = require('express');
const router = express.Router();
const {
    Response,
    generateToken,
  } = require("../utils"); 
const User = require("../models/user");


router.post('/register', async (req, res) => {
    const body = req.body;
    const isExistedUser = req?.isExistedUser;

    if(isExistedUser) {
        res.send(Response(200, "Succesfully"));
        return;
    }

    try {
       
        const newUser = await User.create({ ...body });
        if(newUser) {
            res.send(Response(200, "Succesfully", {sucess: true}));
            res.e
        } else {
            res.send(Response(500, "Internal Server!", {sucess: false}));
        }
    } catch(e) {
        throw e
    }
});

router.post('/login', async (req, res) => {
    const body = req.body;
    const username = body?.username || "";
    const password = body?.username || "";
    const email = body?.email || "";
    const phoneNumber = body?.phoneNumber || "";

    try {
        const checkUser = await User.aggregate([
            {
              $match: {
                $or: [
                    {
                        $and: [
                          { username: { $eq: username } },
                          { password: { $eq: password } },
                        ],
                    },
                    {
                        $and: [
                          { email: { $eq: email } },
                          { password: { $eq: password } },
                        ],
                    },
                    {
                        $and: [
                          { phoneNumber: { $eq: phoneNumber } },
                          { password: { $eq: password } },
                        ],
                    },
                ]
              },
            },
            {
              $project: {
                createdAt: 0,
                updatedAt: 0,
              },
            },
        ]);

        if(checkUser.length === 0) {
            res.send(Response(403, "Authentication Failure!", {sucess: true}));
            return;
        }

        const token = await generateToken(16);
        let user = checkUser[0];
        user = {...user, token};

        if(!user?.hasO2Auth) {
            await cached.set(token, JSON.stringify(user));
            res.send(Response(200, "Login Succesfully!", {sucess: true, ...user}));
            return;
        }
    } catch(e) {
        throw e
    }
});

module.exports = router;
