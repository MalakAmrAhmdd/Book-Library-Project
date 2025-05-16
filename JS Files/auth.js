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
    const role = document.querySelector('input[name="role"]:checked')?.value;

    if (!username || !password || !confirmPassword || !role) {
        alert("All fields are required, including selecting a role. Please fill them out.");
        return false;
    }

    if (username.length < 5) {
        alert("Username must be at least 5 characters long.");
        return false;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return false;
    }

    return true; // Validation passed
}

//
document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.getElementById("submit-sign-up");

    if (registerButton) {
        registerButton.addEventListener("click", function (event) {
            event.preventDefault();
            if (!validateSignUpForm()) {
                return;
            }
            const username = document.getElementById("username")?.value.trim();
            const password = document.getElementById("Sign-up-pass")?.value.trim();
            const confirmPassword = document.getElementById("Sign-up-confirmPass")?.value.trim();
            const role = document.querySelector('input[name="role"]:checked')?.value;
            const email = document.getElementById("email")?.value.trim();

            const is_staff = role === "admin" ? true : false;
            const jsonForm = {
                username: username,
                password: password,
                confirm_password: confirmPassword,
                email: email,
                is_staff: is_staff
            };

            $.ajax({
                url: 'http://127.0.0.1:8000/users/register/',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(jsonForm),
                success: function (response) {
                    alert("Registration successful! You can now log in.");
                    window.location.href = "Sign_in.html";
                },
                error: function (xhr) {
                    let msg = "Registration failed.";
                    if (xhr.responseJSON && xhr.responseJSON.detail) {
                        msg = xhr.responseJSON.detail;
                    }
                    alert(msg);
                }
            });
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
        loginButton.addEventListener("click", function (event) {
            event.preventDefault();

            if (!validateSignInForm()) {
                return;
            }

            const username = document.getElementById("username")?.value.trim();
            const password = document.getElementById("pass")?.value.trim();

            let csrf = null;
            let cookies = document.cookie.split(";");
            cookies.forEach(element => {
                let key = element.split("=")[0].trim();
                let value = element.split("=")[1];
                if (key === "csrftoken") {
                    csrf = value;
                }
            });

            const jsonForm = {
                username: username,
                password: password
            };

            $.ajax({
                url: 'http://127.0.0.1:8000/users/login/',
                method: 'POST',
                headers: {
                    "X-CSRFToken": csrf 
                },
                contentType: 'application/json',
                data: JSON.stringify(jsonForm),
                xhrFields: {
                    withCredentials: true
                },
                success: function (response) {
                    if (response.is_staff === 1 || response.is_staff === true) {
                        window.location.href = "Dashboard.html";
                    } else {
                        window.location.href = "User_Homepage.html";
                    }
                },
                error: function (xhr) {
                    let msg = "Invalid username or password.";
                    if (xhr.responseJSON && xhr.responseJSON.detail) {
                        msg = xhr.responseJSON.detail;
                    }
                    alert(msg);
                }
            });
        });
    }
});