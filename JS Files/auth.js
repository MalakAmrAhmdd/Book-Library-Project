// Functionality for password visibility
document.addEventListener("DOMContentLoaded", () => {
    const toggleButtons = document.querySelectorAll('.togglePassword, .togglePassword-sign-up');

    toggleButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const passwordField = button.previousElementSibling;
            const icon = button.querySelector('.fa');

            const type = passwordField.type === 'password' ? 'text' : 'password';
            passwordField.type = type;

            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });
});


function validateSignUpForm() {
    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("Sign-up-pass")?.value.trim();
    const confirmPassword = document.getElementById("Sign-up-confirmPass")?.value.trim();

    if (!username || !password || !confirmPassword) {
        alert("All fields are required. Please fill them out.");
        return false;
    }

    if (username.length < 5) {
        alert("Username must be at least 5 characters long.");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return false;
    }

    return true; // Validation passed
}


document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.getElementById("submit-sign-up");

    if (registerButton) {
        registerButton.addEventListener("click", (event) => {
            event.preventDefault();

            const username = document.getElementById("username")?.value.trim();
            const password = document.getElementById("Sign-up-pass")?.value.trim();

            const confirmPassword = document.getElementById("Sign-up-confirmPass")?.value.trim();
            const role = document.querySelector('input[name="role"]:checked')?.value;

            if (!validateSignUpForm()) {
                return;
            }

            const users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.some(user => user.username === username)) {
                alert("Username already exists. Please choose a different username.");
                return;
            }

            const newUser = { id: users.length + 1, username, password, role };
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));

            alert("Registration successful! You can now log in.");
            window.location.href = "Sign_in.html";

        });
    }

});


function validateSignInForm() {
    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("pass")?.value.trim();

    if (!username || !password) {
        alert("Both username and password are required.");
        return false;
    }


    if (username.length < 5) {
        alert("Username must be at least 5 characters long.");
        return false;
    }

    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("submit-sign-in");

    if (loginButton) {
        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const username = document.getElementById("username")?.value.trim();
            const password = document.getElementById("pass")?.value.trim();

            if (!validateSignInForm()) {
                return;
            }

            const response = await fetch('Users.json');

            const users = await response.json();

            const user = Object.values(users).find(
                user => user.username === username && user.password === password
            );

            if (user) {
                if (user.role === "admin") {
                    window.location.href = "Dashboard.html";
                } else {
                    window.location.href = "User_Homepage.html";
                }
            } else {
                alert("Invalid username or password. Please try again.");
            }
        });
    }
});

