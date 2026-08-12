const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Password Strength Checker Backend is Running!"
    });
});

app.post("/api/check-password", (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({
            success: false,
            message: "Password is required"
        });
    }

    const hasMinimumLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

    let score = 0;

    if (hasMinimumLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecialCharacter) score++;

    let strength;

    if (score <= 2) {
        strength = "WEAK";
    } else if (score <= 4) {
        strength = "MEDIUM";
    } else {
        strength = "STRONG";
    }

    res.json({
        success: true,
        strength: strength,
        score: score,
        criteria: {
            minimumLength: hasMinimumLength,
            uppercase: hasUppercase,
            lowercase: hasLowercase,
            number: hasNumber,
            specialCharacter: hasSpecialCharacter
        }
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
