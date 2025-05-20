let filteredBooks = [];
let currentPage = 1;
const booksPerPage = 10;

function ensureSearchUI() {
    let bookList = document.getElementById('bookList');
    let searchInput = document.getElementById('searchInput');
    let searchCategory = document.getElementById('searchCategory');
    return {
        bookList,
        searchInput,
        searchCategory
    };
}

function displayBooks(filteredBooks, bookList) {
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    bookList.innerHTML = `
        <div class="table-header">
            <span class="column-title">Title</span>
            <span class="column-category">Category</span>
            <span class="column-status">Status</span>
        </div>
    `;
    paginatedBooks.forEach(book => {
        // --- Begin: Status logic from bookPopup.js ---
        let statusText = "In-Shelf";
        let buttonText = "Preview";
        let buttonCursor = "pointer";
        let badgeColor = "#214539";

        if (book.user) {
            statusText = "Borrowed";
            badgeColor = "#735E57";
            buttonText = "Preview";
            buttonCursor = "pointer";
        }


        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div class="column-title">
                <img src="${book.image}" alt="Book Cover" class="book-cover">
                <div class="book-info">
                    <span class="book-title">${book.title}</span>
                    <span class="book-author">${book.author}</span>
                    <span class="book-edition">${book.language}</span>
                </div>
            </div>
            <div class="column-category">
                <span class="category-text">${book.category}</span>
            </div>
            <div class="column-status">
                <span class="status-badge" style="background-color: ${badgeColor};">
                  ${statusText}
                </span>
                
                <button class="preview-button">${buttonText}</button>
            </div>
        `;

        row.querySelector('.preview-button').style.cursor = buttonCursor;
        bookList.appendChild(row);
    });
    updateSearchFooter();
    updateSearchPaginationArrows();
}

function filterBooks(books, bookList, searchInput, searchCategory) {
    const filter = searchInput.value.toLowerCase();
    const category = searchCategory.value;

    filteredBooks = books.filter(book => {
        if (category === 'All') {
            return (
                book.title.toLowerCase().includes(filter) ||
                book.author.toLowerCase().includes(filter) ||
                book.category.toLowerCase().includes(filter)
            );
        } else if (category === 'Title') {
            return book.title.toLowerCase().includes(filter);
        } else if (category === 'Author') {
            return book.author.toLowerCase().includes(filter);
        } else if (category === 'Category') {
            return book.category.toLowerCase().includes(filter);
        }
    });

    currentPage = 1;
    displayBooks(filteredBooks, bookList);
}

function updateSearchFooter() {
    const footerText = document.querySelector(".search-footer-text");
    const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
    if (footerText) footerText.textContent = `Page ${currentPage} of ${totalPages}`;
}

function updateSearchPaginationArrows() {
    const leftArrow = document.querySelector(".search-footer-left-icon");
    const rightArrow = document.querySelector(".search-footer-right-icon");
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    if (leftArrow) {
        leftArrow.style.color = currentPage === 1 ? "#8A8A8A" : "#5D1B21";
        leftArrow.style.cursor = currentPage === 1 ? "default" : "pointer";
    }
    if (rightArrow) {
        rightArrow.style.color = currentPage === totalPages ? "#8A8A8A" : "#5D1B21";
        rightArrow.style.cursor = currentPage === totalPages ? "default" : "pointer";
    }
}

function initializeSearch(books, bookList, searchInput, searchCategory) {
    filteredBooks = books;
    displayBooks(filteredBooks, bookList);

    searchInput.addEventListener('input', () => filterBooks(books, bookList, searchInput, searchCategory));
    searchCategory.addEventListener('change', () => filterBooks(books, bookList, searchInput, searchCategory));

    document.querySelector(".search-footer-left-icon").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayBooks(filteredBooks, bookList);
        }
    });

    document.querySelector(".search-footer-right-icon").addEventListener("click", () => {
        const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayBooks(filteredBooks, bookList);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const { bookList, searchInput, searchCategory } = ensureSearchUI();

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
        url: 'http://127.0.0.1:8000/books/getbook/',
        method: 'GET',
        contentType: 'application/json',
        headers: {
            "X-CSRFToken": csrf
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            const books = Array.isArray(data) ? data : Object.values(data);
            if (searchInput && searchCategory) {
                initializeSearch(books, bookList, searchInput, searchCategory);
            } else {
                filteredBooks = books;
                displayBooks(filteredBooks, bookList);
            }
        },
        error: function (xhr) {
            bookList.innerHTML = '<div style="color:red;">Failed to load books.</div>';
            console.error("Failed to load books:", xhr);
        }
    });
});

document.addEventListener("borrowingsUpdated", function () {

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
        url: 'http://127.0.0.1:8000/books/getbook/',
        method: 'GET',
        contentType: 'application/json',
        headers: {
            "X-CSRFToken": csrf
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            const books = Array.isArray(data) ? data : Object.values(data);
            if (searchInput && searchCategory) {
                initializeSearch(books, bookList, searchInput, searchCategory);
            } else {
                filteredBooks = books;
                displayBooks(filteredBooks, bookList);
            }
        },
        error: function (xhr) {
            bookList.innerHTML = '<div style="color:red;">Failed to load books.</div>';
            console.error("Failed to load books:", xhr);
        }
    });
});