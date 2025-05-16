
document.addEventListener("DOMContentLoaded", () => {
    // Get ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");

    if (!userId) {
        console.error("No user ID found in the URL.");
        return;
    }

    $.ajax({
        url: 'http://127.0.0.1:8000/dashboard/usersTable/',
        method: 'GET',
        contentType: 'application/json',
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

document.addEventListener("DOMContentLoaded", () => {
    const dashboardTableBody = document.querySelector(".borrows-table tbody");
    const dashboardTableInfo = document.querySelector(".table-footer .table-info");
    const prevButton = document.getElementById("dashboardPrevButton");
    const nextButton = document.getElementById("dashboardNextButton");


    let books = [];
    let currentPage = 1;
    const rowsPerPage = 10;

    // Fetch books data
    fetch("Books/books.json")
        .then(response => {
            console.log("Fetching books.json...");
            if (!response.ok) {
                throw new Error("Failed to load books data.");
            }
            return response.json();
        })
        .then(data => {
            console.log("Books data loaded:", data);
            books = data;
            renderTable();
        })
        .catch(error => {
            console.error("Error loading books:", error);
        });


    fetch("users.json")
        .then(response => {
            console.log("Fetching users.json...");
            if (!response.ok) {
                throw new Error("Failed to load users data.");
            }
            return response.json();
        })
        .then(data => {
            console.log("users data loaded:", data);
            users = data.users;
            if (usersNum) {
                usersNum.textContent = users.length.toLocaleString(); // makes 40689 look like 40,689
            } else {
                console.error("users-number element not found!");
            }
        })
        .catch(error => {
            console.error("Error loading users:", error);
        });

    // Render table for dashboard
    function renderTable() {
        dashboardTableBody.innerHTML = ""; // Clear existing rows

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, books.length);

        for (let i = startIndex; i < endIndex; i++) {
            const book = books[i];
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${book.id || "N/A"}</td>
                <td>${book.title || "Untitled"}</td>
                <td>${book.category || "Unknown"}</td>
                <td>--</td> <!-- Placeholder for Date -->
                <td>--</td> <!-- Placeholder for Borrowed By -->
            `;
            dashboardTableBody.appendChild(row);
        }

        dashboardTableInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${books.length}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === Math.ceil(books.length / rowsPerPage);
    }

    // Event listeners for pagination buttons
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            // const totalPages = Math.ceil(books.length / booksPerPage);
            renderTable();
            // updatePaginationArrows(currentPage,totalPages, prevButton, nextButton); // Update the pagination arrows
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(books.length / rowsPerPage)) {
            currentPage++;
            // const totalPages = Math.ceil(books.length / booksPerPage);
            renderTable();
            // updatePaginationArrows(currentPage, totalPages, prevButton, nextButton); // Update the pagination arrows
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const usersNum = document.getElementById("users-number");
    const adminsNum = document.getElementById("admins-number");
    const booksNum = document.getElementById("books-number");
    const borrowsNum = document.getElementById("borrows-number");
    const returnsNum = document.getElementById("returns-number");

    $.ajax({
        url: 'http://127.0.0.1:8000/dashboard/usersTable/',
        method: 'GET',
        contentType: 'application/json',
        success: function (data) {
            const users = Array.isArray(data) ? data : Object.values(data);

            const adminCount = users.filter(user => user.is_staff === 1 || user.is_staff === true).length;
            const userCount = users.filter(user => user.is_staff === 0 || user.is_staff === false).length;

            const totalBorrows = users.reduce((sum, user) => sum + (user.total_borrowings || 0), 0);
            const totalReturns = users.reduce((sum, user) => sum + (user.total_returns || 0), 0);

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

            if (returnsNum) {
                returnsNum.textContent = totalReturns;
            } else {
                console.error("Element with id 'returns-number' not found!");
            }
        },
        error: function (xhr) {
            alert("Failed to load users for counting.");
            console.error("Error loading users:", xhr);
        }
    });

    const localStorageBooks = JSON.parse(localStorage.getItem("books")) || [];
    const totalBooks = localStorageBooks.length;

    if (booksNum) {
        booksNum.textContent = totalBooks;
    } else {
        console.error("Element with id 'books-number' not found!");
    }
});

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
                formData.append("cover_image", imageUrl);
            }

            $.ajax({
                url: "http://127.0.0.1:8000/books/addbook/",
                method: "POST",
                data: formData,
                processData: false,
                contentType: false,
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

