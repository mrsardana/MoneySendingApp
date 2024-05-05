const express = require('express');
const zod = require("zod");
const { User, Account } = require('../db')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require('../config');
const { authMiddleware } = require('../middleware/middleware');
const router = express.Router();

const signupBody = zod.object({
    userName: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6)
})

const signinBody = zod.object({
    userName: zod.string().email(),
    password: zod.string().min(6)
})

const updateBody = zod.object({
    password: zod.string().min(6),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

router.post('/signup', async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    const existingUser = await User.findOne({
        userName: req.body.userName
    })
    if (existingUser) {
        return res.status(411).json({
            message: "Email already registered"
        })
    }

    const createHash = async function (plainTextPassword) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(plainTextPassword, salt);
    };
    req.body.password = await createHash(req.body.password)
    const user = await User.create({
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    })

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })
    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        message: "User Created successfully",
        token: token
    })
})

router.post('/signin', async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Incorrect inputs/Not Valid"
        })
    }

    const findUser = await User.findOne({
        userName: req.body.userName
    })

    if (!findUser) {
        res.status(411).json({
            message: "User not found"
        })
    }
    else {
        if (bcrypt.compareSync(req.body.password, findUser.password)) {
            const token = jwt.sign({ userId: findUser._id }, JWT_SECRET)
            return res.status(200).json({
                token: token
            })
        }
        else {
            res.status(411).json({
                message: "Error While Login"
            })
        }
    }

})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        })
    }
    const createHash = async function (plainTextPassword) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(plainTextPassword, salt);
    };
    req.body.password = await createHash(req.body.password)
    await User.updateOne({ _id: req.userId }, req.body)

    res.json({
        message: "Updated successfully"
    })

})

router.get("/bulk", async (req, res) => {

    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }
        ]
    })

    res.json({
        user: users.map(user => ({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })

})

module.exports = router;