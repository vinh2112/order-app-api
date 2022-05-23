import { UserModel } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import randomstring from "randomstring";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

dotenv.config();

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, fullName, phoneNumber } = req.body;

    // Validate User
    if (
      !email.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    )
      return res.status(400).json({ msg: "Email format is incorrect." });

    const user = await UserModel.findOne({ email: email });
    if (user) {
      return res.status(400).json({ msg: "Email is existed" });
    }

    const password = randomstring.generate({ length: 7, capitalization: "lowercase" });
    const passwordHash = await bcrypt.hash(password, 10);

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.PASSWORD_EMAIL,
      },
    });
    var mailOptions = {
      from: "orderapp.lv@gmail.com",
      to: email,
      subject: "WELCOME TO MY APP",
      html: `
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">My App</a>
        </div>
        <p style="font-size:1.1em">Hi ${fullName},</p>
        <p>Thank you for choosing My App. Use the following deafult password to log into My App.</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${password}</h2>
        <p style="font-size:0.9em;">Regards,<br />My App</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Your Brand Inc</p>
          <p>1600 Amphitheatre Parkway</p>
          <p>California</p>
        </div>
      </div>
    </div>
      `,
    };

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        return await res.status(400).json({
          message: "Không thể gửi email ngay bây giờ. Vui lòng thử lại sau",
        });
      } else {
        const newUser = new UserModel({ email, password: passwordHash, fullName, phoneNumber });

        await newUser.save();

        return res.status(200).json({ isSuccess: true});
      }
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      !email.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    )
      return res.status(400).json({ msg: "Email format is incorrect." });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(403).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect Password." });

    return res.status(200).json(true);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

let PINs = [];
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    // Validate User
    if (
      !email.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    )
      return res.status(400).json({ msg: "Email format is incorrect." });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(200).json({isSuccess: false});
    else {
      const pinCode = randomstring.generate({ length: 4, capitalization: "uppercase", charset: "numeric" });
      PINs.push({
        email: email,
        pin: pinCode,
      });

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.PASSWORD_EMAIL,
        },
      });
      var mailOptions = {
        from: "orderapp.lv@gmail.com",
        to: email,
        subject: "RECOVER YOUR PASSWORD",
        html: `
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">My App</a>
          </div>
          <p style="font-size:1.1em">Hi ${user.fullName},</p>
          <p>Use the following PIN code to recover your password.</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${pinCode}</h2>
          <p style="font-size:0.9em;">Regards,<br />My App</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Your Brand Inc</p>
            <p>1600 Amphitheatre Parkway</p>
            <p>California</p>
          </div>
        </div>
      </div>
        `,
      };

      transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
          return await res.status(400).json({
            message: "Không thể gửi email ngay bây giờ. Vui lòng thử lại sau",
          });
        } else {
          return res.status(200).json({isSuccess: true});
        }
      });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const checkPinCode = async (req, res) => {
  try {
    const { email, pin } = req.body;

    const isCorrect = PINs.some((obj) => obj.email === email && obj.pin === pin);

    if (!isCorrect) {
      return res.status(200).json({isSuccess: false});
    } else {
      return res.status(200).json({isSuccess: true});
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const recoverPassword = async (req, res) => {
  try {
    const {email, pin, password} = req.body;
    const isCorrect = PINs.some((obj) => obj.email === email && obj.pin === pin);

    if(isCorrect) {
      if (password.length < 6)
          return res.status(400).json({ msg: "Password must have at least 6 letters." });
      
      const hashPassword = await bcrypt.hash(password, 10);

      await UserModel.findOneAndUpdate({email: email}, {password: hashPassword}, {new: true});

      return res.status(200).json({isSuccess: true});
    } else {
      return res.status(200).json({isSuccess: false});
    }
  } catch (error) {
    return res.status(500).json({msg: error.message})
  }
}

// -------- Create Token Function ------------

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
