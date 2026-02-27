import { Request, Response } from "express";
import { sha256 } from "js-sha256";
import User from "../model/user_model";
import * as generateHelper from "../../../helpers/generate";
import ForgotPassword from "../model/forgot_password_model";
import sendMailHelper from "../../../helpers/sendMail";

export const register = async (req: Request, res: Response) => {
    req.body.password = sha256(req.body.password);

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
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            token: generateHelper.generateRandomString(20)

        });
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

export const login = async (req: Request, res: Response) => {
    const user = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (user) {
        if (user.password === sha256(req.body.password)) {
            const token = user.token;
            res.cookie("token", token);

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

export const detail = async (req: Request, res: Response) => {
    res.json({
        code: 200,
        data: req["user"],
    })
}

// export const forgotPassword = async (req: Request, res: Response) => {
//     const email = req.body.email;
//     const user = await User.findOne({
//         email: email,
//         deleted: false
//     });

//     if (!user) {
//         res.json({
//             code: 400,
//             message: "Email không tồn tại!"
//         });
//         return;
//     }

//     const otp = generateHelper.generateRandomNumber(7);

//     const objectForgotPassword = {
//         email: email,
//         otp: otp,
//         expireAt: Date.now()
//     };

//     const forgotPassword = new ForgotPassword(objectForgotPassword);
//     await forgotPassword.save();

//     // Send OTP to user of email 
//     const subject = "Mã OTP xác minh lấy lại mật khẩu";
//     const html = `
//     Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b>. (Mã sẽ hết hạn sau 5 phút)
//     Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
//     `;

//     sendMailHelper.sendMail(email, subject, html);

//     res.json({
//         code: 200,
//         message: "Đã gửi mã OTP quan email"
//     });
// }

// // [POST] api/v1/users/password/otp
// module.exports.otpPassword = async (req, res) => {
//     const result = await ForgotPassword.findOne({
//         email: req.body.email,
//         otp: req.body.otp
//     });

//     if (!result) {
//         res.json({
//             code: 400,
//             message: "Mã OTP không hợp lệ!"
//         });
//     }

//     const user = await User.findOne({
//         email: req.body.email
//     });

//     const token = user.token;
//     res.cookie("token", token);
//     res.json({
//         code: 200,
//         message: "Xác thức thành công",
//         token: token
//     })
// }

// // [POST] api/v1/user/password/reset
// module.exports.resetPassword = async (req, res) => {
//     await User.updateOne({ token: req.body.token }, {
//         password: sha256(req.body.password)
//     });

//     res.json({
//         code: 200,
//         message: "Reset success!"
//     });
// }

// [GET] /api/v1/users/list

export const list = async (req: Request, res: Response) => {
    const users = await User.find({
        deleted: false
    }).select("fullName email");

    res.json({
        code: 200,
        message: "Thành công!",
        users: users
    })
}
