document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("usersTableBody");
    const tableInfo = document.querySelector(".user-table-info");
    const prevButton = document.getElementById("usersPrevButton");
    const nextButton = document.getElementById("usersNextButton");

    let users = [];
    let currentPage = 1;
    const rowsPerPage = 10;
    const borrowingsCache = {}; // userId -> count

    function loadUsers() {
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
                <td class="borrowings-cell">${borrowingsCache[user.id] !== undefined ? borrowingsCache[user.id] : "Loading..."}</td>
                <td><a href="UserDetails.html?id=${user.id}" class="viewLink">View Details</a></td>
            `;

            tableBody.appendChild(row);

            // Only fetch if not cached
            if (borrowingsCache[user.id] === undefined) {
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
                    url: 'http://127.0.0.1:8000/dashboard/userBorrowedBooks/',
                    method: 'POST',
                    contentType: 'application/json',
                    headers: {
                        "X-CSRFToken": csrf
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    data: JSON.stringify({ user_id: user.id }),
                    success: function (data) {
                        borrowingsCache[user.id] = data.count;
                        row.querySelector('.borrowings-cell').textContent = data.count;
                    },
                    error: function () {
                        row.querySelector('.borrowings-cell').textContent = "Error";
                    }
                });
            }
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

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const usersTableBody = document.getElementById('usersTableBody');

    let users = [];

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
            users = Array.isArray(data) ? data : Object.values(data);
            displayUsers(users);
        },
        error: function (xhr) {
            console.error("Error loading users:", xhr);
        }
    });

    const displayUsers = (filteredUsers) => {
        usersTableBody.innerHTML = '';
        filteredUsers.forEach(user => {
            const row = document.createElement('tr');

            row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td class="borrowings-cell">Loading...</td>
            <td><a href="UserDetails.html?id=${user.id}" class="viewLink">View Details</a></td>
        `;
            usersTableBody.appendChild(row);

            $.ajax({
                url: 'http://127.0.0.1:8000/dashboard/userBorrowedBooks/',
                method: 'POST',
                contentType: 'application/json',
                headers: {
                    "X-CSRFToken": csrf
                },
                xhrFields: {
                    withCredentials: true
                },
                data: JSON.stringify({ user_id: user.id }),
                success: function (data) {
                    row.querySelector('.borrowings-cell').textContent = data.count;
                },
                error: function () {
                    row.querySelector('.borrowings-cell').textContent = "Error";
                }
            });
        });
    };

    const filterUsers = (users) => {
        const filter = searchInput.value.toLowerCase();
        return users.filter(user =>
            user.username.toLowerCase().includes(filter) ||
            String(user.id).includes(filter)
        );
    };

    searchInput.addEventListener('input', () => {
        const filteredUsers = filterUsers(users);
        displayUsers(filteredUsers);
    });
});