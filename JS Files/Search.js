let filteredBooks = []
let currentPage = 1;
const booksPerPage = 10;

export function displayBooks(filteredBooks, bookList) {
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
        const bookStatus = localStorage.getItem(`status_${book.title}`) || "In-Shelf";
        const badgeColor = (bookStatus === "Borrowed") ? "#735E57" : "#214539";

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
                  ${bookStatus}
                </span>
                <button class="favorite-button" data-book-id="${book.id}">
                    <i class="far fa-heart"></i>
                </button>
                <button class="preview-button">Preview</button>
            </div>
        `;
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

    currentPage = 1; // Reset to the first page
    displayBooks(filteredBooks, bookList);
}

function updateSearchFooter() {
    const footerText = document.querySelector(".search-footer-text");
    const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
    footerText.textContent = `Page ${currentPage} of ${totalPages}`;
}

function updateSearchPaginationArrows() {
    const leftArrow = document.querySelector(".search-footer-left-icon");
    const rightArrow = document.querySelector(".search-footer-right-icon");
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    leftArrow.style.color = currentPage === 1 ? "#8A8A8A" : "#5D1B21";
    leftArrow.style.cursor = currentPage === 1 ? "default" : "pointer";

    rightArrow.style.color = currentPage === totalPages ? "#8A8A8A" : "#5D1B21";
    rightArrow.style.cursor = currentPage === totalPages ? "default" : "pointer";
}

export function initializeSearch(books, bookList, searchInput, searchCategory) {
    filteredBooks = books; // Initially display all books
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