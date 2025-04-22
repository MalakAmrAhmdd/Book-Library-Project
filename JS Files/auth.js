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

// validation function for sign-up
function validateSignUpForm() {
    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("Sign-up-pass")?.value.trim();
    const confirmPassword = document.getElementById("Sign-up-confirmPass")?.value.trim();

    // Check if all fields are filled
    if (!username || !password || !confirmPassword) {
        alert("All fields are required. Please fill them out.");
        return false;
    }

    // Check if username is at least 5 characters
    if (username.length < 5) {
        alert("Username must be at least 5 characters long.");
        return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return false;
    }

    return true;
}

// validation function for sign-in
function validateSignInForm() {
    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("pass")?.value.trim();

    // Check if all fields are filled
    if (!username || !password) {
        alert("Both username and password are required.");
        return false;
    }

    // Check if username is at least 5 characters
    if (username.length < 5) {
        alert("Username must be at least 5 characters long.");
        return false;
    }

    return true;
}

// Event listener for sign-up form submission
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

            // Check if username already exists in -> localStorage
            const users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.some(user => user.username === username)) {
                alert("Username already exists. Please choose a different username.");
                return;
            }

            // Save the new user to localStorage
            const newUser = { id: users.length + 1, username, password, role };
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));

            alert("Registration successful! You can now log in.");
            window.location.href = "Sign_in.html";

        });
    }

    const loginButton = document.getElementById("submit-sign-in");

    if (loginButton) {
        loginButton.addEventListener("click", (event) => {
            event.preventDefault();

            const username = document.getElementById("username")?.value.trim();
            const password = document.getElementById("pass")?.value.trim();

            if (!validateSignInForm()) {
                return;
            }

            // Check if the username and password match any stored user
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                 // This says welcome for both admin or user
                alert(`Login successful! Welcome, ${user.role === "admin" ? "Admin" : "User"}.`);
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