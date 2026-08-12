/* =========================================================
   PASSWORD STRENGTH CHECKER
   Frontend + Backend API
   ========================================================= */


/* ---------------------------------------------------------
   GET HTML ELEMENTS
--------------------------------------------------------- */

const passwordInput = document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const checkPasswordButton =
    document.getElementById("checkPassword");

const strengthText =
    document.getElementById("strengthText");

const strengthIcon =
    document.getElementById("strengthIcon");

const strengthBar =
    document.getElementById("strengthBar");

const strengthMessage =
    document.getElementById("strengthMessage");


/* ---------------------------------------------------------
   PASSWORD CRITERIA
--------------------------------------------------------- */

const lengthCriteria =
    document.getElementById("lengthCriteria");

const uppercaseCriteria =
    document.getElementById("uppercaseCriteria");

const lowercaseCriteria =
    document.getElementById("lowercaseCriteria");

const numberCriteria =
    document.getElementById("numberCriteria");

const specialCriteria =
    document.getElementById("specialCriteria");


/* =========================================================
   SHOW / HIDE PASSWORD
========================================================= */

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.textContent = "🙈";

    } else {

        passwordInput.type = "password";

        togglePassword.textContent = "👁";

    }

});


/* =========================================================
   CHECK PASSWORD
========================================================= */

checkPasswordButton.addEventListener("click", async function () {

    const password = passwordInput.value;


    /* -----------------------------------------------------
       EMPTY PASSWORD
    ----------------------------------------------------- */

    if (password.length === 0) {

        resetChecker();

        strengthMessage.textContent =
            "Please enter a password.";

        return;
    }


    /* -----------------------------------------------------
       SEND PASSWORD TO BACKEND
    ----------------------------------------------------- */

    try {

        const response = await fetch(
          "https://secure-password-checker-2.onrender.com/api/check-password",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    password: password
                })
            }
        );


        /* -------------------------------------------------
           GET BACKEND RESPONSE
        ------------------------------------------------- */

        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Something went wrong"
            );

        }


        /* -------------------------------------------------
           UPDATE CRITERIA
        ------------------------------------------------- */

        updateCriteria(
            lengthCriteria,
            data.criteria.minimumLength
        );

        updateCriteria(
            uppercaseCriteria,
            data.criteria.uppercase
        );

        updateCriteria(
            lowercaseCriteria,
            data.criteria.lowercase
        );

        updateCriteria(
            numberCriteria,
            data.criteria.number
        );

        updateCriteria(
            specialCriteria,
            data.criteria.specialCharacter
        );


        /* -------------------------------------------------
           UPDATE STRENGTH
        ------------------------------------------------- */

        if (data.strength === "WEAK") {

            setStrength(
                "WEAK",
                "⚠",
                "Your password is weak. Try adding more character types.",
                "35%"
            );

        }

        else if (data.strength === "MEDIUM") {

            setStrength(
                "MEDIUM",
                "⚡",
                "Your password is getting better. Add the missing requirements.",
                "70%"
            );

        }

        else {

            setStrength(
                "STRONG",
                "🛡",
                "Your password is strong. Great job!",
                "100%"
            );

        }


    }

    /* -----------------------------------------------------
       BACKEND CONNECTION ERROR
    ----------------------------------------------------- */

    catch (error) {

        console.error("Backend Error:", error);

        strengthText.textContent = "ERROR";

        strengthText.style.color = "#ff3434";

        strengthMessage.textContent =
            "Unable to connect to the backend server.";

    }

});


/* =========================================================
   UPDATE CRITERIA
========================================================= */

function updateCriteria(criteriaElement, isValid) {

    const status =
        criteriaElement.querySelector(".criteria-status");


    if (isValid) {

        status.textContent = "✓";

        status.style.color = "#39ff73";

        criteriaElement.style.borderColor =
            "#39ff73";

        criteriaElement.style.background =
            "rgba(57, 255, 115, 0.05)";

    }

    else {

        status.textContent = "○";

        status.style.color = "#657384";

        criteriaElement.style.borderColor =
            "#28333f";

        criteriaElement.style.background =
            "#050b11";

    }

}


/* =========================================================
   SET STRENGTH
========================================================= */

function setStrength(
    strength,
    icon,
    message,
    percentage
) {

    strengthText.textContent = strength;

    strengthIcon.textContent = icon;

    strengthMessage.textContent = message;

    strengthBar.style.width = percentage;


    if (strength === "WEAK") {

        strengthText.style.color = "#ff3434";

        strengthIcon.style.color = "#ff3434";

        strengthBar.style.background =
            "#ff3434";

    }

    else if (strength === "MEDIUM") {

        strengthText.style.color = "#ffb300";

        strengthIcon.style.color = "#ffb300";

        strengthBar.style.background =
            "#ffb300";

    }

    else {

        strengthText.style.color = "#39ff73";

        strengthIcon.style.color = "#39ff73";

        strengthBar.style.background =
            "#39ff73";

    }

}


/* =========================================================
   RESET
========================================================= */

function resetChecker() {

    const criteriaList = [
        lengthCriteria,
        uppercaseCriteria,
        lowercaseCriteria,
        numberCriteria,
        specialCriteria
    ];


    criteriaList.forEach(function (criteria) {

        const status =
            criteria.querySelector(".criteria-status");

        status.textContent = "○";

        status.style.color = "#657384";

        criteria.style.borderColor =
            "#28333f";

        criteria.style.background =
            "#050b11";

    });


    strengthText.textContent = "—";

    strengthText.style.color = "#687585";

    strengthIcon.textContent = "🛡";

    strengthIcon.style.color = "#687585";

    strengthBar.style.width = "0%";

    strengthBar.style.background =
        "#101820";

    strengthMessage.textContent =
        "Enter a password to check its strength.";

}


/* =========================================================
   RESET WHEN USER TYPES A NEW PASSWORD
========================================================= */

passwordInput.addEventListener("input", function () {

    resetChecker();

});
