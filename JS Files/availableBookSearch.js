const categoryMap = {
    "1": "Technology",
    "2": "Finance",
    "3": "Fantasy",
    "4": "Fiction",
    "5": "Science Fiction",
    "6": "Romance",
    "7": "Psychology",
    "8": "Adventure",
    "9": "Non-Fiction",
    "10": "Horror",
    "11": "Self-Help",
    "12": "History",
    "13": "Social",
    "14": "Philosophy",
    "15": "Thriller"
};

document.addEventListener('DOMContentLoaded', () => {
    const bookSearchInput = document.querySelector('#searchBar');
    const booksTableBody = document.querySelector('#availableBooksTableBody');
    let books = [];
    let csrf = null;
    let cookies = document.cookie.split(";");
    cookies.forEach(element => {
        let key = element.split("=")[0].trim();
        let value = element.split("=")[1];
        if (key === "csrftoken") {
            csrf = value;
        }
    });
    console.log("Script loaded");
    console.log("CSRF token:", csrf);

    $.ajax({
        url: 'http://127.0.0.1:8000/dashboard/availableBooksTable/',
        method: 'GET',
        contentType: 'application/json',
        headers: {
            "X-CSRFToken": csrf
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            books = Array.isArray(data) ? data : Object.values(data);
            displayBooks(books);
        },
        error: function (xhr) {
            console.error("Error loading books:", xhr);
        }
    });

    const displayBooks = (filteredBooks) => {
        booksTableBody.innerHTML = '';
        filteredBooks.forEach(book => {
            const row = document.createElement('tr');
            row.setAttribute('data-book-id', book.id);
            row.innerHTML = `
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${categoryMap[book.category] || book.category}</td>
                    <td>
                        <div class="action-icons">
                            <label for="editPopup" class="edit-icon"><i class="fa-solid fa-pen"></i></label>
                            <label for="deletePopup" class="delete-icon"><i class="fa-solid fa-trash"></i></label>
                        </div>
                    </td>
                `;
            booksTableBody.appendChild(row);
        });
    };

    const filterBooks = (books) => {
        const filter = bookSearchInput.value.toLowerCase();
        return books.filter(book =>
            (book.title && book.title.toLowerCase().includes(filter)) ||
            (categoryMap[book.category] && categoryMap[book.category].toLowerCase().includes(filter)) ||
            String(book.id).includes(filter)
        );
    };

    bookSearchInput.addEventListener('input', () => {
        const filteredBooks = filterBooks(books);
        displayBooks(filteredBooks);
    });
}
);