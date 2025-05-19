// This Function returns the username and email in the user details page
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");

    if (!userId) {
        console.error("No user ID found in the URL.");
        return;
    }
    let csrf = null;
    let cookies = document.cookie.split(";");
    cookies.forEach(element => {
        let key = element.split("=")[0].trim();
        let value = element.split("=")[1];
        if (key === "csrftoken") {
            csrf = value;
        }
    });
    $.ajax({
        url: 'http://127.0.0.1:8000/dashboard/usersTable/',
        method: 'GET',
        contentType: 'application/json',
        headers: {
            "X-CSRFToken": csrf
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            const users = Array.isArray(data) ? data : Object.values(data);
            const user = users.find(user => String(user.id) === String(userId));
            if (!user) {
                console.error("User not found.");
                return;
            }
            document.getElementById("username").textContent = user.username;
            document.getElementById("email").textContent = user.email;
        },
        error: function (xhr) {
            alert("Failed to load user data.");
            console.error("Error loading user:", xhr);
        }
    });
});
// Function to return Latest Borrows in the Dashboard
document.addEventListener("DOMContentLoaded", () => {
    const dashboardTableBody = document.querySelector(".borrows-table tbody");

    function loadLatestBorrows() {
        let csrf = null;
        let cookies = document.cookie.split(";");
        cookies.forEach(element => {
            let key = element.split("=")[0].trim();
            let value = element.split("=")[1];
            if (key === "csrftoken") {
                csrf = value;
            }
        });
        $.ajax({
            url: 'http://127.0.0.1:8000/dashboard/latestBorrows/',
            method: 'GET',
            contentType: 'application/json',
            headers: {
                "X-CSRFToken": csrf
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                dashboardTableBody.innerHTML = "";
                data.forEach(borrow => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${borrow.id || "N/A"}</td>
                        <td>${borrow.book_title || borrow.title || "Untitled"}</td>
                        <td>${borrow.category || "Unknown"}</td>
                        <td>${borrow.borrow_date || borrow.date || "--"}</td>
                        <td>${borrow.user?.username || borrow.user || "--"}</td>
                    `;
                    dashboardTableBody.appendChild(row);
                });
            },
            error: function (xhr) {
                let msg = "Failed to load latest borrows.";
                if (xhr.responseJSON && xhr.responseJSON.detail) {
                    msg = xhr.responseJSON.detail;
                }
                alert(msg);
                console.error("Error loading latest borrows:", xhr);
            }
        });
    }

    loadLatestBorrows();
});
// Function to return total (Users,Admins,Borrows)
document.addEventListener("DOMContentLoaded", () => {
    const usersNum = document.getElementById("users-number");
    const adminsNum = document.getElementById("admins-number");
    const booksNum = document.getElementById("books-number");
    const borrowsNum = document.getElementById("borrows-number");
    const returnsNum = document.getElementById("returns-number");

    let csrf = null;
    let cookies = document.cookie.split(";");
    cookies.forEach(element => {
        let key = element.split("=")[0].trim();
        let value = element.split("=")[1];
        if (key === "csrftoken") {
            csrf = value;
        }
    });

    $.ajax({
        url: 'http://127.0.0.1:8000/dashboard/usersTable/',
        method: 'GET',
        contentType: 'application/json',
        headers: {
            "X-CSRFToken": csrf
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            const users = Array.isArray(data) ? data : Object.values(data);

            const adminCount = users.filter(user => user.is_staff === 1 || user.is_staff === true).length;
            const userCount = users.filter(user => user.is_staff === 0 || user.is_staff === false).length;
            const totalBorrows = users.reduce((sum, user) => sum + (user.total_borrowings || 0), 0);

            if (adminsNum) {
                adminsNum.textContent = adminCount;
            } else {
                console.error("Element with id 'admins-number' not found!");
            }

            if (usersNum) {
                usersNum.textContent = userCount;
            } else {
                console.error("Element with id 'users-number' not found!");
            }

            if (borrowsNum) {
                borrowsNum.textContent = totalBorrows;
            } else {
                console.error("Element with id 'borrows-number' not found!");
            }
        },
        error: function (xhr) {
            alert("Failed to load users for counting.");
            console.error("Error loading users:", xhr);
        }
    });

    $.ajax({
        url: 'http://127.0.0.1:8000/books/getbook/',
        method: 'GET',
        contentType: 'application/json',
        headers: {
            "X-CSRFToken": csrf
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            const books = Array.isArray(data) ? data : Object.values(data);
            const totalBooks = books.length;
            if (booksNum) {
                booksNum.textContent = totalBooks;
            } else {
                console.error("Element with id 'books-number' not found!");
            }
        },
        error: function (xhr) {
            console.error("Failed to load books for counting:", xhr);
            if (booksNum) {
                booksNum.textContent = "0";
            }
        }
    });
});
// Function to Add new Book
document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submit_button");

    if (submitButton) {
        submitButton.addEventListener("click", function (event) {
            event.preventDefault();

            const bookName = document.getElementById("book-name").value.trim();
            const authorName = document.getElementById("author-name").value.trim();
            const description = document.getElementById("description").value.trim();
            const categorySelect = document.getElementById("category");
            const category = categorySelect.options[categorySelect.selectedIndex].text;
            const languageSelect = document.getElementById("lang");
            const language = languageSelect.options[languageSelect.selectedIndex].text;
            const imageUrl = document.getElementById("image-url").value.trim();

            if (!bookName || !authorName || !category || !language) {
                alert("Please fill in all required fields.");
                return;
            }

            const formData = new FormData();
            formData.append("title", bookName);
            formData.append("author", authorName);
            formData.append("category", category);
            formData.append("description", description);
            formData.append("language", language);
            if (imageUrl) {
                formData.append("image", imageUrl);
            }
            let csrf = null;
            let cookies = document.cookie.split(";");
            cookies.forEach(element => {
                let key = element.split("=")[0].trim();
                let value = element.split("=")[1];
                if (key === "csrftoken") {
                    csrf = value;
                }
            });
            $.ajax({
                url: "http://127.0.0.1:8000/books/addbook/",
                method: "POST",
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    "X-CSRFToken": csrf
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    alert("Book added successfully!");
                    document.querySelector("form.book").reset();
                },
                error: function (xhr) {
                    let msg = "Failed to add book.";
                    if (xhr.responseJSON && xhr.responseJSON.detail) {
                        msg = xhr.responseJSON.detail;
                    }
                    alert(msg);
                    console.error("Error adding book:", xhr);
                }
            });
        });
    }
});

