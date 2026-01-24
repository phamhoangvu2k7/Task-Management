const sh256 = require("js-sha256");
const generateHelper = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");
const User = require("../model/user_model");
const ForgotPassword = require("../model/forgot_password_model");

// [POST] api/v1/users/register
module.exports.register = async (req, res) => {
    req.body.password = sh256(req.body.password);

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (existEmail) {
        res.json({
            code: 400,
            message: "Email đã tồn tại!"
        });
    } else {
        const user = new User(req.body);
        await user.save()

        const token = user.token;
        res.cookie("token", token);

        res.json({
            code: 200,
            message: "Đăng ký thành công!",
            token: token
        });
    }

}

// [POST] api/v1/users/login
module.exports.login = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (user) {
        if (user.password === sh256(req.body.password)) {
            const token = user.token;
            res.cookie = token;

            res.json({
                code: 200,
                message: "Đăng nhập thành công!",
                token: token
            });
        }
        else {
            res.json({
                code: 400,
                message: "Mật khẩu sai!"
            });
        }
    } else {
        res.json({
            code: 400,
            message: "Email không tồn tại!"
        });
    }
}

// [POST] api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại!"
        });
        return;
    }

    const otp = generateHelper.generateRandomNumber(7);

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Send OTP to user of email 
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
    Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b>. (Mã sẽ hết hạn sau 5 phút)
    Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
    `;

    sendMailHelper.sendMail(email, subject, html);

    res.json({
        code: 200,
        message: "Đã gửi mã OTP quan email"
    });
}

// [POST] api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
    const result = await ForgotPassword.findOne({
        email: req.body.email,
        otp: req.body.otp
    });

    if (!result) {
        res.json({
            code: 400,
            message: "Mã OTP không hợp lệ!"
        });
    }

    const user = await User.findOne({
        email: req.body.email
    });

    const token = user.token;
    res.cookie("token", token);
    res.json({
        code: 200,
        message: "Xác thức thành công",
        token: token
    })
}

// [POST] api/v1/user/password/reset
module.exports.resetPassword = async (req, res) => {
    await User.updateOne({ token: req.body.token }, {
        password: sh256(req.body.password)
    });

    res.json({
        code: 200,
        message: "Reset success!"
    });
}