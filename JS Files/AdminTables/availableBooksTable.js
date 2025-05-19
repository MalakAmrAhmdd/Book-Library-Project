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

document.addEventListener("DOMContentLoaded", () => {
    const booksTableBody = document.querySelector(".books-table tbody");
    const booksTableInfo = document.querySelector(".table-footer .table-info");
    const prevButton = document.getElementById("booksPrevButton");
    const nextButton = document.getElementById("booksNextButton");

    let books = [];
    let currentPage = 1;
    const rowsPerPage = 10;

    function loadBooks() {
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
                renderTable();
            },
            error: function (xhr) {
                let msg = "Failed to load available books.";
                if (xhr.responseJSON && xhr.responseJSON.detail) {
                    msg = xhr.responseJSON.detail;
                }
                booksTableBody.innerHTML = `<tr><td colspan="4">${msg}</td></tr>`;
                booksTableInfo.textContent = msg;
                console.error("Error loading available books:", xhr);
            }
        });
    }

    function renderTable() {
        booksTableBody.innerHTML = "";

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, books.length);

        for (let i = startIndex; i < endIndex; i++) {
            const book = books[i];
            const row = document.createElement("tr");
            row.setAttribute("data-book-id", book.id);

      
            const categoryName = categoryMap[book.category] || book.category;

            row.innerHTML = `
        <td>${book.id || "N/A"}</td>
        <td>${book.title || "Untitled"}</td>
        <td>${categoryName}</td>
        <td>
            <div class="action-icons">
                <label for="editPopup" class="edit-icon"><i class="fa-solid fa-pen"></i></label>
                <label for="deletePopup" class="delete-icon"><i class="fa-solid fa-trash"></i></label>
            </div>
        </td>
    `;
            booksTableBody.appendChild(row);
        }

        booksTableInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${books.length}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === Math.ceil(books.length / rowsPerPage);
    }

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
            updatePaginationArrows(currentPage, Math.ceil(books.length / rowsPerPage), prevButton, nextButton);
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(books.length / rowsPerPage)) {
            currentPage++;
            renderTable();
            updatePaginationArrows(currentPage, Math.ceil(books.length / rowsPerPage), prevButton, nextButton);
        }
    });

    loadBooks();
});

function updatePaginationArrows(currentPage, totalPages, prevButton, nextButton) {
    const leftButton = document.querySelector(".toggle-left-button");
    const rightButton = document.querySelector(".toggle-right-button");

    if (totalPages === 1) {
        prevButton.style.color = "#8A8A8A";
        nextButton.style.color = "#8A8A8A";
        prevButton.style.cursor = "default";
        nextButton.style.cursor = "default";
        leftButton.style.background = "#f9f9f9";
        rightButton.style.background = "#f9f9f9";
    } else if (currentPage === 1) {
        prevButton.style.color = "#8A8A8A";
        nextButton.style.color = "#8c6051";
        prevButton.style.cursor = "default";
        nextButton.style.cursor = "pointer";
        leftButton.style.background = "#f9f9f9";
        rightButton.style.background = "#fff";
    } else if (currentPage === totalPages) {
        prevButton.style.color = "#8c6051";
        nextButton.style.color = "#8A8A8A";
        prevButton.style.cursor = "pointer";
        nextButton.style.cursor = "default";
        leftButton.style.background = "#fff";
        rightButton.style.background = "#f9f9f9";
    } else {
        prevButton.style.color = "#8c6051";
        nextButton.style.color = "#8c6051";
        prevButton.style.cursor = "pointer";
        nextButton.style.cursor = "pointer";
        leftButton.style.background = "#fff";
        rightButton.style.background = "#fff";
    }
}

