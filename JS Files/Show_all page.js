let currentPage = 1;
let books = [];
const booksPerPage = 24;
function fetchBooks() {
    fetch('Books/books.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch books data');
            }
            return response.json();
        })
        .then(data => {
            books = data;
            localStorage.setItem('books', JSON.stringify(data));
            renderBooks();
        })
        .catch(error => {
            console.error('Error fetching books:', error);
        });
}

function renderBooks() {
    const bookContainer = document.querySelector(".table-row");
    bookContainer.innerHTML = "";

    const books = JSON.parse(localStorage.getItem('books'));
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = Math.min(startIndex + booksPerPage, books.length);

    for (let i = startIndex; i < endIndex; i++) {
        const book = books[i];
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-holder");
        bookElement.innerHTML = `
            <a href="path/to/book-details.html">
                <div class="book-image">
                    <img src="${book.image}" alt="Book Cover" class="book-cover">
                </div>
            </a>
            <a href="path/to/book-details.html" class="text-link">
                <span class="book-title">${book.title}</span>
            </a>
            <span class="book-author">${book.author}</span>
        `;
        bookContainer.appendChild(bookElement);
    }

    updateFooter();
    updatePaginationArrows();
}

    fetchBooks();

function updateFooter() {
    const footerText = document.querySelector(".footer-text");
    const totalPages = Math.max(1, Math.ceil(books.length / booksPerPage));
    footerText.textContent = `Page ${currentPage} of ${totalPages}`;
}

function updatePaginationArrows() {
    const leftArrow = document.querySelector(".footer-left-icon");
    const rightArrow = document.querySelector(".footer-right-icon");
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const totalPages = Math.ceil(books.length / booksPerPage);

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
    if (currentPage * booksPerPage < books.length) {
        currentPage++;
        renderBooks();
    }
});
