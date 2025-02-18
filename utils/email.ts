import nodemail from "nodemailer";
import { google } from "googleapis";
import path from "path";
import ejs from "ejs";
import jwt from "jsonwebtoken";
import env from "dotenv";
import schoolModel from "../model/schoolModel";
env.config();

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
const GOOGLE_REFRESH = process.env.GOOGLE_REFRESH;

const oAuth = new google.auth.OAuth2(
  GOOGLE_ID,
  GOOGLE_SECRET,
  GOOGLE_REDIRECT_URL
);

oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH });

const url: string = process.env.APP_URL_DEPLOY!;

export const verifiedEmail = async (user: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;

    const transporter = nodemail.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "codelabbest@gmail.com",
        clientSecret: GOOGLE_SECRET,
        clientId: GOOGLE_ID,
        refreshToken: GOOGLE_REFRESH,
        accessToken,
      },
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      "secretCode",
      {
        expiresIn: "5m",
      }
    );

    const timer = setTimeout(async () => {
      const getSchool: any = await schoolModel.findById(user._id);

      if (!getSchool.verify) {
        await schoolModel.findByIdAndDelete(getSchool._id);
      }
      clearTimeout(timer);
    }, 5 * 60 * 1000);

    let frontEndURL: string = `${url}/${token}/sign-in`;
    let devURL: string = `${url}/auth/api/verify-user/${token}`;

    const myPath = path.join(__dirname, "../views/index.ejs");
    const html = await ejs.renderFile(myPath, {
      link: devURL,
      tokenCode: user?.enrollmentID,
      userName: user?.userName,
    });

    const mailerOption = {
      from: "NEXT🟦🟦🟦 <codelabbest@gmail.com>",
      to: user.email,
      subject: "Account Verification",
      html,
    };

    await transporter.sendMail(mailerOption);
  } catch (error) {
    console.error();
  }
};

export const hospitalVerifiedEmail = async (user: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;

    const transporter = nodemail.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "codelabbest@gmail.com",
        clientSecret: GOOGLE_SECRET,
        clientId: GOOGLE_ID,
        refreshToken: GOOGLE_REFRESH,
        accessToken,
      },
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      "weCareHospital"
    );

    let frontEndURL: string = `${url}/${token}/sign-in`;
    let devURL: string = `${url}/api/verify-hospital/${user._id}`;

    const myPath = path.join(__dirname, "../views/hospitalCreated.ejs");
    const html = await ejs.renderFile(myPath, {
      link: devURL,
      token: user.token,
      hospitalName: user.hospitalName,
    });

    const mailerOption = {
      from: "wecareHMO❤️⛑️🚑 <codelabbest@gmail.com>",
      to: user.email,
      subject: "Hospital's Account Verification",
      html,
    };

    await transporter.sendMail(mailerOption);
  } catch (error) {
    console.error();
  }
};

export const addMemberEmail = async (member: any, getUser: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;

    const transporter = nodemail.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "codelabbest@gmail.com",
        clientSecret: GOOGLE_SECRET,
        clientId: GOOGLE_ID,
        refreshToken: GOOGLE_REFRESH,
        accessToken,
      },
    });

    let devURL: string = `${url}/api/verify-user/${getUser._id}`;

    const myPath = path.join(__dirname, "../views/memberAdded.ejs");

    const html = await ejs.renderFile(myPath, {
      relationship: member.relationship,
      firstName: member.firstName,
    });

    const mailerOption = {
      from: "wecareHMO❤️⛑️🚑 <codelabbest@gmail.com>",
      to: getUser.email,
      subject: "Family Member added Notification",
      html,
    };

    await transporter.sendMail(mailerOption);
  } catch (error) {
    console.error();
  }
};

export const changeTokenEmail = async (getUser: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;

    const transporter = nodemail.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "codelabbest@gmail.com",
        clientSecret: GOOGLE_SECRET,
        clientId: GOOGLE_ID,
        refreshToken: GOOGLE_REFRESH,
        accessToken,
      },
    });

    let devURL: string = `${url}/api/verify-user/${getUser._id}`;

    const myPath = path.join(__dirname, "../views/resetToken.ejs");

    const html = await ejs.renderFile(myPath, {
      token: getUser.firstName,
      link: devURL,
    });

    const mailerOption = {
      from: "wecareHMO❤️⛑️🚑 <codelabbest@gmail.com>",
      to: getUser.email,
      subject: "Token reset Notification",
      html,
    };

    await transporter.sendMail(mailerOption);
  } catch (error) {
    console.error();
  }
};

export const verifySchoolFees = async (user: any, term: number) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;

    const transporter = nodemail.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "codelabbest@gmail.com",
        clientSecret: GOOGLE_SECRET,
        clientId: GOOGLE_ID,
        refreshToken: GOOGLE_REFRESH,
        accessToken,
      },
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.parentEmail,
      },
      "weCareHospital"
    );

    let frontEndURL: string = `${url}/${token}/sign-in`;
    let devURL: string = `${url}/api/verify-hospital/${user._id}`;

    const myPath = path.join(__dirname, "../views/feesMail.ejs");
    const html = await ejs.renderFile(myPath, {
      link: devURL,
      token: user.token,
      hospitalName: user.studentFirstName,
    });

    const mailerOption = {
      from: "NEXT Team❤️⛑️🚑 <codelabbest@gmail.com>",
      to: user.parentEmail,
      subject: `${term} Term School Fees Payment`,
      html,
    };

    await transporter.sendMail(mailerOption);
  } catch (error) {
    console.error();
  }
};
