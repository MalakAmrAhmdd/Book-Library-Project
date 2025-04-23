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




