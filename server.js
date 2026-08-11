const express = require("express");
const cors = require("cors");

const app = express();

// Allow frontend to communicate with backend
app.use(cors());

// Allow JSON data from frontend
app.use(express.json());


// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Password Strength Checker Backend is Running!"
    });
});


// Password strength API
app.post("/api/check-password", (req, res) => {

    const { password } = req.body;

    // Check if password was received
    if (!password) {
        return res.status(400).json({
            success: false,
            message: "Password is required"
        });
    }


    // Password requirements
    const hasMinimumLength = password.length >= 8;

    const hasUppercase = /[A-Z]/.test(password);

    const hasLowercase = /[a-z]/.test(password);

    const hasNumber = /[0-9]/.test(password);

    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);


    // Calculate score
    let score = 0;

    if (hasMinimumLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecialCharacter) score++;


    // Determine strength
    let strength;

    if (score <= 2) {
        strength = "WEAK";
    }
    else if (score <= 4) {
        strength = "MEDIUM";
    }
    else {
        strength = "STRONG";
    }


    // Send result back to frontend
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


// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});