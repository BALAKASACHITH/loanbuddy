const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const User=require("./modules/users.js");
const Otp=require("./modules/otp.js");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app=express();
const port=8080;
app.use(cors());
mongoose.connect("mongodb://127.0.0.1:27017/loanbuddy")
    .then(()=>{
        console.log("Connected to Database");
    })
    .catch((e)=>{
        console.log("Error in connecting to Database error : "+e);
    });
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/", (req, res) => res.render("home"));
app.get("/signup", (req, res) => res.render("signup"));
app.get("/signin", (req, res) => res.render("signin"));
app.get("/about", (req, res) => res.render("about"));
app.get("/dashboard/:username",(req,res)=>{
    const {username}=req.params;
    res.render("dashboard",{username});
})
app.get("/checkform/:username",(req,res)=>{
    const {username}=req.params;
    res.render("checkform",{username});
})
const sendOTP = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "sachithbalaka@gmail.com",
            pass: "vmpx iqoj jnzl vhhv"
        }
    });
    let mailOptions = {
        from: "LoanBuddy <your-email@gmail.com>",
        to: email,
        subject: "LoanBuddy Sign-Up OTP Verrification",
        text: `Hey Buddy Your OTP is: ${otp}. It will expire in 5 minutes.`
    };

    return transporter.sendMail(mailOptions);
};
app.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.json({ success: false, message: "Invalid email format" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.json({ success: false, message: "Email already registered" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.findOneAndUpdate({ email }, { otp }, { upsert: true, new: true });
    try {
        await sendOTP(email, otp);
        return res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error sending OTP" });
    }
});
app.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
    if (!/^\d{6}$/.test(otp)) {
        return res.json({ success: false, message: "OTP must be a 6-digit number." });
    }
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
        return res.json({ success: false, message: "Invalid OTP" });
    }
    return res.json({ success: true, message: "OTP Verified" });
});

app.post('/predict', (req, res) => {
    const pythonProcess = spawn('python', ['one.py']);

    let output = '';

    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });

    pythonProcess.on('close', () => {
        try {
            const jsonResponse = JSON.parse(output);
            res.json(jsonResponse);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Invalid JSON response' });
        }
    });
});

app.post("/sign-up", async (req, res) => {
    const { email, password } = req.body; 
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.json({ success: false, message: "Email already registered" });
    }
    const newUser = new User({ email, password });
    await newUser.save();
    return res.json({ success: true, message: "User registered successfully!" });
});
app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: "All fields are required." });
    }
    const user = await User.findOne({ email, password });
    if (!user) {
        return res.json({ success: false, message: "Invalid email or password." });
    }
    res.json({ success: true });
});
app.listen(port,()=>{
    console.log(`Server is running on port : ${port}`);
})