document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("usersTableBody");
    const tableInfo = document.querySelector(".user-table-info");
    const prevButton = document.getElementById("usersPrevButton");
    const nextButton = document.getElementById("usersNextButton");

    let users = [];
    let currentPage = 1;
    const rowsPerPage = 10;

    function loadUsers() {
    $.ajax({
        url: 'http://127.0.0.1:8000/dashboard/usersTable/',
        method: 'GET',
        contentType: 'application/json',
        success: function (data) {
            users = Array.isArray(data) ? data : Object.values(data);
            renderTable();
        },
        error: function (xhr) {
            let msg = "Failed to load users.";
            if (xhr.responseJSON && xhr.responseJSON.detail) {
                msg = xhr.responseJSON.detail;
            }
            alert(msg);
            console.error("Error loading users:", xhr);
        }
    });
}

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
                <td>${user.total_borrowings}</td>
                <td>${user.total_returns}</td>
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


    loadUsers();
    console.log("Ana t3bt");
});