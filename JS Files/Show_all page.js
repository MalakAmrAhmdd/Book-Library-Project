let currentPage = 1;
const booksPerPage = 24;
let filteredBooks = [];

function fetchBooks() {
    const urlParams = new URLSearchParams(window.location.search);
    const constraint = urlParams.get('constraint');
    const title = urlParams.get('title');

    document.querySelector('.homepage-text').textContent = title;

    const books = JSON.parse(localStorage.getItem('books')) || [];

    if(constraint === 'all') {
        filteredBooks = books;
    } else if(constraint.startsWith('category:')) {
        const category = constraint.split(':')[1];
        filteredBooks = books.filter(book => book.category === category);
    } else if(constraint.startsWith('language:')) {
        const language = constraint.split(':')[1];
        filteredBooks = books.filter(book => book.language === language);
    }

    renderBooks();
}

function renderBooks() {
    const bookContainer = document.querySelector(".table-row");
    bookContainer.innerHTML = "";

    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const currentBooks = filteredBooks.slice(startIndex, endIndex);

    currentBooks.forEach(book => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-holder");
        bookElement.innerHTML = `
            <div class="book-image">
                <img src="${book.image}" alt="${book.title}" class="book-cover">
            </div>
            <span class="book-title">${book.title}</span>
            <span class="book-author">${book.author}</span>
        `;
        bookContainer.appendChild(bookElement);
    });

    updateFooter();
    updatePaginationArrows();
}

document.addEventListener("DOMContentLoaded", () => {
    fetchBooks();
});

function updateFooter() {
    const footerText = document.querySelector(".footer-text");
    const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
    footerText.textContent = `Page ${currentPage} of ${totalPages}`;
}

function updatePaginationArrows() {
    const leftArrow = document.querySelector(".footer-left-icon");
    const rightArrow = document.querySelector(".footer-right-icon");
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    if (totalPages === 1) {
        leftArrow.style.color = "#8A8A8A";
        rightArrow.style.color = "#8A8A8A";
        leftArrow.style.cursor = "default";
        rightArrow.style.cursor = "default";
    } else if (currentPage === 1) {
        leftArrow.style.color = "#8A8A8A";
        rightArrow.style.color = "#5D1B21";
        leftArrow.style.cursor = "default";
        rightArrow.style.cursor = "pointer";
    } else if (currentPage === totalPages) {
        leftArrow.style.color = "#5D1B21";
        rightArrow.style.color = "#8A8A8A";
        leftArrow.style.cursor = "pointer";
        rightArrow.style.cursor = "default";
    } else {
        leftArrow.style.color = "#5D1B21";
        rightArrow.style.color = "#5D1B21";
        leftArrow.style.cursor = "pointer";
        rightArrow.style.cursor = "pointer";
    }
}

document.querySelector(".footer-left-icon").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderBooks();
    }
});

document.querySelector(".footer-right-icon").addEventListener("click", () => {
    if (currentPage * booksPerPage < filteredBooks.length) {
        currentPage++;
        renderBooks();
    }
});


function fetchBooks() {
    const urlParams = new URLSearchParams(window.location.search);
    const constraint = decodeURIComponent(urlParams.get('constraint'));
    const title = decodeURIComponent(urlParams.get('title'));

    document.querySelector('.homepage-text').textContent = title;

    const books = JSON.parse(localStorage.getItem('books')) || [];

    if(constraint === 'all') {
        filteredBooks = books;
    } else if(constraint.startsWith('category:')) {
        const category = constraint.split(':')[1];
        filteredBooks = books.filter(book => book.category === category);
    } else if(constraint.startsWith('language:')) {
        const language = constraint.split(':')[1];
        filteredBooks = books.filter(book => book.language === language);
    }

    renderBooks();
}