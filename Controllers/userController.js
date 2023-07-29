const userModel = require("../Models/userModels");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');


const createToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY
    return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" })
}


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await userModel.findOne({ email })
        if (user) {
            return res.status(400).json("User with the given email already exist...")
        }

        if (!name || !password || !name) {
            return res.status(400).json("All fields are required")
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json("Invalid email")
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json("Password must be a strong one")
        }

        user = new userModel({
            name,
            email,
            password
        })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        await user.save();
        const token = createToken(user._id)
        res.status(200).json({
            _id: user._id,
            name,
            email,
            token
        })
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await userModel.findOne({ email })
        if (!user) return res.status(400).json("Invalid user or password");

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) return res.status(400).json("Invalid email or password");

        const token = createToken(user._id);
        res.status(200).json({ _id: user.id, name: user.name, email, token })
    } catch (error) {

    }
}

module.exports = { registerUser, loginUser }