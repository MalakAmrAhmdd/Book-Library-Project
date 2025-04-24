document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("usersTableBody");
    const tableInfo = document.querySelector(".users-table .table-info");
    const prevButton = document.getElementById("usersPrevButton");
    const nextButton = document.getElementById("usersNextButton");

    let users = [];
    let currentPage = 1;
    const rowsPerPage = 10;

    fetch("users.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load users data.");
            }
            return response.json();
        })
        .then(data => {
            users = Object.values(data);
            renderTable();
        })
        .catch(error => {
            console.error("Error loading users:", error);
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
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === Math.ceil(users.length / rowsPerPage);
    }

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(users.length / rowsPerPage)) {
            currentPage++;
            renderTable();
        }
    });
});