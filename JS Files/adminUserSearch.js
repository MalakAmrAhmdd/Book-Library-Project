document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const usersTableBody = document.getElementById('usersTableBody');

    let users = [];

    $.ajax({
        url: 'http://127.0.0.1:8000/dashboard/usersTable/',
        method: 'GET',
        contentType: 'application/json',
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
                <td>${user.total_borrowings ?? 0}</td>
                <td>${user.total_returns ?? 0}</td>
                <td><a href="UserDetails.html?id=${user.id}" class="viewLink">View Details</a></td>
`;
            usersTableBody.appendChild(row);
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