document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.querySelector('.search-input');
    const availableBooks = document.getElementById('availableBooksTableBody');

    // Fetch users data from users.json
    let books = [];
    let currentPage = 1;
    const rowsPerPage = 10;

    fetch("Books/books.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load books data.");
            }
            return response.json();
        })
        .then(data => {
            books = Object.values(data);
            renderTable();
        })
        .catch(error => {
            console.error("Error loading books:", error);
        });

    const displayUsers = (filteredUsers) => {
        availableBooks.innerHTML = '';
        filteredUsers.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.category}</td>
                <td></td>
            `;
            availableBooks.appendChild(row);
        });
    };

    const filterBooks = (books) => {
        const filter = searchInput.value.toLowerCase();
        return books.filter(book => book.title.toLowerCase().includes(filter));
    };

    searchInput.addEventListener('input', () => {
        const filteredBooks = filterBooks(books);
        displayUsers(filteredBooks);
    });

    // Display all users initially
    displayUsers(books);
// Ensure all rows are displayed by setting a larger limit or removing any restrictions
// (This function is no longer needed as all users are displayed initially)
});
