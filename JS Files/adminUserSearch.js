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
            // Placeholder while loading
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
                    // Update the borrowings cell with the count
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