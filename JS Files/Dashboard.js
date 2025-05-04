// footer section of users page
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("usersTableBody");
    const tableInfo = document.querySelector(".table-info");
    const toggleButtons = document.querySelectorAll(".toggle-button");

    let users = [];
    let currentPage = 1;
    const rowsPerPage = 10;

    fetch("users.json")
        .then(response => {
            return response.json();
        })
        .then(data => {
            users = Object.values(data);
            renderTable();
        });

    function renderTable() {
        tableBody.innerHTML = "";

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, users.length);

        for (let i = startIndex; i < endIndex; i++) {
            const user = users[i];
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.numOfBorrowedBooks}</td>
                <td>${user.numOfReturnedBooks}</td>
                <td><a href="UserDetails.html?id=${user.id}" class="viewLink">View Details</a></td>
            `;

            tableBody.appendChild(row);
        }
        tableInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${users.length}`;
    }

    toggleButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (button.querySelector("i").classList.contains("fa-angle-left")) {
                // Previous page
                if (currentPage > 1) {
                    currentPage--;
                    renderTable();

                }
            } else {
                // Next page
                if (currentPage < Math.ceil(users.length / rowsPerPage)) {
                    currentPage++;
                    renderTable();
                }
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Get the user ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");

    if (!userId) {
        console.error("No user ID found in the URL.");
        return;
    }

    // Fetch the user data from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.id === parseInt(userId));

    if (!user) {
        console.error("User not found.");
        return;
    }

    // Populate the username and password fields
    document.getElementById("username").textContent = user.username;
    document.getElementById("password").textContent = user.password;
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

    // Fetch books data
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

    // Fetch users data from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Count Admins and Users
    const adminCount = users.filter(user => user.role.toLowerCase() === "admin").length;
    const userCount = users.filter(user => user.role.toLowerCase() === "user").length;

    // Update the containers
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

    // Fetch books data from localStorage
    const localStorageBooks = JSON.parse(localStorage.getItem("books")) || [];
    const totalBooks = localStorageBooks.length;

    if (booksNum) {
        booksNum.textContent = totalBooks; // Update the displayed total books count
    } else {
        console.error("Element with id 'books-number' not found!");
    }

    // Placeholder values for borrows and returns (update logic as needed)
    if (borrowsNum) {
        borrowsNum.textContent = 0; // Update this logic if you track borrows in localStorage
    } else {
        console.error("Element with id 'borrows-number' not found!");
    }

    if (returnsNum) {
        returnsNum.textContent = 0; // Update this logic if you track returns in localStorage
    } else {
        console.error("Element with id 'returns-number' not found!");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submit_button");

    if (submitButton) {
        submitButton.addEventListener("click", (event) => {
            event.preventDefault();

            // Get form values
            const bookName = document.getElementById("book-name").value.trim();
            const authorName = document.getElementById("author-name").value.trim();
            const description = document.getElementById("description").value.trim();
            const categorySelect = document.getElementById("category");
            const category = categorySelect.options[categorySelect.selectedIndex].text; // Get category name
            const languageSelect = document.getElementById("lang");
            const language = languageSelect.options[languageSelect.selectedIndex].text; // Get language name
            const fileInput = document.getElementById("file-upload");
            const image = fileInput.files[0] ? URL.createObjectURL(fileInput.files[0]) : "";

            // Validate required fields
            if (!bookName || !authorName || !category || !language) {
                alert("Please fill in all required fields.");
                return;
            }

            // Get existing books from local storage or initialize an empty array
            const books = JSON.parse(localStorage.getItem("books")) || [];

            // Generate a new ID based on the existing books
            const newId = books.length > 0 ? books[books.length - 1].id + 1 : 1;

            // Create a new book object
            const newBook = {
                id: newId,
                title: bookName,
                author: authorName,
                category,
                description,
                language,
                image,
            };

            // Add the new book to the array
            books.push(newBook);

            // Save the updated array back to local storage
            localStorage.setItem("books", JSON.stringify(books));

            // Update the total books count dynamically
            const booksNum = document.getElementById("books-number");
            if (booksNum) {
                booksNum.textContent = books.length; // Update the displayed total books count from local storage
            } else {
                console.error("Element with id 'books-number' not found!");
            }

            alert("Book added successfully!");

            // Clear the form
            document.querySelector("form.book").reset();
        });
    }

    // Update the total books count on page load
    const booksNum = document.getElementById("books-number");
    if (booksNum) {
        const books = JSON.parse(localStorage.getItem("books")) || [];
        booksNum.textContent = books.length;
    } else {
        console.error("Element with id 'books-number' not found!");
    }
});
