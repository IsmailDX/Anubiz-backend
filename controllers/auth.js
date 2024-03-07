const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

//The transporter object will be used to send the emails in the signup function
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    const url = `http://localhost:3000/auth/api/v1/verify/${token}`;

    transporter.sendMail({
      to: user.email,
      subject: "Verify Anubiz Account",
      html: `<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
    <table style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; padding: 40px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="text-align: center;">
                <img src="https://scontent.ffjr1-5.fna.fbcdn.net/v/t39.30808-6/431622392_6958317874280205_5274981637888368039_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=3635dc&_nc_ohc=sb5MslAcndUAX9rcSFL&_nc_ht=scontent.ffjr1-5.fna&oh=00_AfAx3Fn3P179em-Ep6w9Vk3Dgu1r275mmvmyR_Eir4D9ag&oe=65EC0F09" style="max-width: 120px;" />
                <h2 style="color: #333;">Click <a href='${url}'>here</a> to confirm your email.</h2>
                <h3>Please refrain from clicking the link if you did not register on Anubiz.</h3>
            </td>
        </tr>
    </table>
</body>`,
    });

    res.status(StatusCodes.CREATED).json({
      user: {
        name: user.name,
        message: `Sent a verification email to ${user.email}`,
      },
      token,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("User does not exists");
  }

  if (!user.verified) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "Verify your Account.",
    });
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const verify = async (req, res) => {
  const { token } = req.params;

  try {
    if (!token) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message: "Missing Token",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: payload.userID,
    });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User does not exist" });
    }

    user.verified = true;
    await user.save();

    return res.status(StatusCodes.OK).send(
      `<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">

      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; padding: 40px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <img src="https://www.stg.ssl.com/wp-content/uploads/2023/10/bluecheck.png" style="max-width: 120px;" />
          <h2 style="color: #333; text-align: center;">Email Verified</h2>
  
          <p style="color: #333; font-size: 16px; line-height: 1.5; text-align: center;">You can go back to the website and sign in!</p>
  
      </div>
  
  </body>`
    );
  } catch (error) {
    console.error("Error during verification:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to verify account",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Please provide email");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("User does not exist");
  }

  // Generate reset token
  const resetToken = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  // Save reset token in the user document
  user.resetToken = resetToken;
  await user.save();

  // Send reset email
  const resetUrl = `http://localhost:3001/resetPass/${resetToken}`;
  transporter.sendMail({
    to: user.email,
    subject: "Reset Password",
    text: `You are receiving this email because you (or someone else) has requested the reset of a password. Please click this link to reset password:\n\n${resetUrl}`,
  });

  res.status(StatusCodes.OK).json({
    message: "Reset password email sent successfully",
  });
};

const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  try {
    if (!resetToken || !newPassword) {
      throw new BadRequestError("Reset token and new password are required");
    }

    // Verify and decode reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    // Find user by user ID from decoded token
    const user = await User.findById(decoded.userID);

    if (!user) {
      throw new UnauthenticatedError("Invalid reset token");
    }

    // Ensure the reset token matches the one saved in the user document
    if (user.resetToken !== resetToken) {
      throw new UnauthenticatedError("Invalid reset token");
    }

    // Update user's password
    user.password = newPassword;

    // Clear reset token
    user.resetToken = undefined;
    await user.save();

    res.status(StatusCodes.OK).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    throw new UnauthenticatedError("Invalid reset token");
  }
};

module.exports = { register, login, verify, forgotPassword, resetPassword };
