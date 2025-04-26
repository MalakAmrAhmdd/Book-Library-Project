document.addEventListener("DOMContentLoaded", () => {
    const dashboardTableBody = document.querySelector(".borrows-table tbody");
    const dashboardTableInfo = document.querySelector(".table-footer .table-info");
    const prevButton = document.getElementById("dashboardPrevButton");
    const nextButton = document.getElementById("dashboardNextButton");
    var usersNum = document.getElementById("users-number");

    let books = [];
    let users = [];
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
    
    function numOFBooks(){
        if (usersNum) {
            usersNum.textContent = users.length;
        } else {
            console.error("Element with id 'users-number' not found!");
        }
    }

    // Event listeners for pagination buttons
    // prevButton.addEventListener("click", () => {
    //     if (currentPage > 1) {
    //         currentPage--;
    //         renderTable();
    //     }
    // });

    // nextButton.addEventListener("click", () => {
    //     if (currentPage < Math.ceil(books.length / rowsPerPage)) {
    //         currentPage++;
    //         renderTable();
    //     }
    // });
});