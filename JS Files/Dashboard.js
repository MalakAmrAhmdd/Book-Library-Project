document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("usersTableBody");

    fetch("users.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load users data.");
            }
            return response.json();
        })
        .then(users => {
            Object.values(users).forEach(user => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.numOfBorrowedBooks}</td>
                    <td>${user.numOfReturnedBooks}</td>
                    <td><a href="UserDetails.html?id=${user.id}" class="viewLink">View Details</a></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error loading users:", error);
        });
});


// footer section
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

    // Fetch the user data from users.json
    fetch("users.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load user data.");
            }
            return response.json();
        })
        .then(users => {
            const user = users[userId];
            if (!user) {
                console.error("User not found.");
                return;
            }

            // Populate the username and password fields
            document.getElementById("username").textContent = user.username;
            document.getElementById("password").textContent = user.password;
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
});


document.addEventListener("DOMContentLoaded", () => {
    const dashboardTableBody = document.querySelector(".borrows-table tbody");
    const dashboardTableInfo = document.querySelector(".table-footer .table-info");
    const prevButton = document.getElementById("dashboardPrevButton");
    const nextButton = document.getElementById("dashboardNextButton");

    let books = [];
    let currentPage = 1;
    const rowsPerPage = 8;

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
            renderTable();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(books.length / rowsPerPage)) {
            currentPage++;
            renderTable();
        }
    });
});