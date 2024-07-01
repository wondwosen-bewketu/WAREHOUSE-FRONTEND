const admin = require("../models/admin"); // Assuming this imports the admin schema
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth"); // Adjust the import path as necessary
const nodemailer = require("nodemailer");
const uuid = require("uuid"); // Import uuid library
const Company = require("../models/company");
const Celebrity = require("../models/celebrity");

//signup super admin
const signupAdmin = async (req, res) => {
  try {
    const { userName, Password } = req.body;
    if (!userName || !Password) {
      return res
        .status(400)
        .send({ message: "Username and password are required." });
    }

    const existingUser = await admin.findOne({ userName }); // Using userName for lookup
    if (existingUser) {
      return res.status(400).send({ message: "Username already taken." });
    }

    const newUser = new admin({
      baseUser: {
        fullName: "Admin",
        email: "admin@example.com", // Placeholder email, adjust as necessary
        role: "Admin",
      },
      userName,
      Password,
    });

    await newUser.save();

    const token = await auth.createToken({
      userId: user._id,
      role: user.role,
    });

    res.status(201).send({
      message: "Admin signed up successfully!",
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

// Sign in admin
const signinAdmin = async (req, res) => {
  try {
    const { userName, Password } = req.body;

    if (!userName || !Password) {
      return res
        .status(400)
        .send({ message: "Username and password are required." });
    }

    const user = await admin.findOne({ userName });
    if (!user) {
      return res.status(404).send({ message: "Username not found." });
    }

    const validPassword = await bcrypt.compare(Password, user.Password); // Note the capitalization
    if (!validPassword) {
      return res.status(400).send({ message: "Incorrect password." });
    }

    const token = await auth.createToken({
      userId: user._id,
      role: user.baseUser.role,
    });

    res.status(200).json({
      message: "Signin successful!",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.example.com", // SMTP host
  port: 587, // Port
  secure: false, // false for TLS; true for SSL
  auth: {
    user: "your_email@example.com", // SMTP username
    pass: "your_password", // SMTP password
  },
});

// Function to generate a unique invitation link
const generateInvitationLink = () => {
  const uniqueToken = uuid.v4(); // Generate a unique token
  return `https://example.com/invitation/${uniqueToken}`; // Replace with your actual domain and endpoint
};

// Send invitation to companies
const sendInvitationToCompanies = async (req, res) => {
  try {
    const companies = await Company.find({}).populate("baseUser"); // Fetch list of companies with baseUser details

    if (!companies || companies.length === 0) {
      return res.status(404).send({ message: "No companies found." });
    }

    // Prepare email content for companies
    const mailOptions = {
      from: "your_email@example.com",
      subject: "Invitation to Join the Petition",
      // Common email content for companies
      html: `
        <p>Dear Company,</p>
        <p>We invite you to join our petition for a cause.</p>
        <p>Click <a href="${generateInvitationLink()}">here</a> to check your membership status.</p>
        <p>Thank you!</p>
      `,
    };

    // Send individual emails to companies and update their status
    const promises = companies.map(async (company) => {
      mailOptions.to = company.baseUser.email;
      await transporter.sendMail(mailOptions);

      // Update membership status to 'seen' for companies
      company.membershipStatus = "seen";
      await company.save();
    });

    await Promise.all(promises);

    res.status(200).send({ message: "Emails sent to companies successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

// Send invitation to celebrities
const sendInvitationToCelebrities = async (req, res) => {
  try {
    const celebrities = await Celebrity.find({}).populate("baseUser"); // Fetch list of celebrities with baseUser details

    if (!celebrities || celebrities.length === 0) {
      return res.status(404).send({ message: "No celebrities found." });
    }

    // Prepare email content for celebrities
    const mailOptions = {
      from: "your_email@example.com",
      subject: "Invitation to Join the Petition",
      // Common email content for celebrities
      html: `
        <p>Dear Celebrity,</p>
        <p>We invite you to join our petition for a cause.</p>
        <p>Click <a href="${generateInvitationLink()}">here</a> to check your membership status.</p>
        <p>Thank you!</p>
      `,
    };

    // Send individual emails to celebrities and update their status
    const promises = celebrities.map(async (celebrity) => {
      mailOptions.to = celebrity.baseUser.email;
      await transporter.sendMail(mailOptions);

      // Update membership status to 'seen' for celebrities
      celebrity.membershipStatus = "seen";
      await celebrity.save();
    });

    await Promise.all(promises);

    res
      .status(200)
      .send({ message: "Emails sent to celebrities successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  signupAdmin,
  signinAdmin,
  sendInvitationToCompanies,
  sendInvitationToCelebrities,
};
