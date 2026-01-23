const sh256 = require("js-sha256");
const User = require("../model/user_model");

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