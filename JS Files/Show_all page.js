let currentPage = 1;
const booksPerPage = 24;
let filteredBooks = [];

// Add this function to handle favorite button clicks
function handleFavoriteButtonClick(e) {
    if (e.target.closest('.favorite-button')) {
        const button = e.target.closest('.favorite-button');
        const bookId = button.getAttribute('data-book-id');
        const icon = button.querySelector('i');
        
        // Get current favorites from localStorage
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        // Toggle favorite status
        const index = favorites.indexOf(bookId);
        if (index === -1) {
            favorites.push(bookId);
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#5D1B21';
        } else {
            favorites.splice(index, 1);
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '#8A8A8A';
        }
        
        // Save to localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

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

function renderBooks() {
    const bookContainer = document.querySelector(".table-row");
    bookContainer.innerHTML = "";

    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const currentBooks = filteredBooks.slice(startIndex, endIndex);

    // Get current favorites
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    currentBooks.forEach(book => {
        const isFavorite = favorites.includes(book.id.toString());
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-holder");
        bookElement.innerHTML = `
            <div class="book-image">
                <img src="${book.image}" alt="${book.title}" class="book-cover">
            </div>
            <span class="book-title">${book.title}</span>
            <span class="book-author">${book.author}</span>
            <div class="favorite-container">
                <button class="favorite-button" data-book-id="${book.id}">
                    <i class="${isFavorite ? 'fas' : 'far'} fa-heart" style="color: ${isFavorite ? '#5D1B21' : '#8A8A8A'}; font-size: 18px; padding: 5px;"></i>
                </button>
            </div>
        `;
        bookContainer.appendChild(bookElement);
    });

    updateFooter();
    updatePaginationArrows();
}

document.addEventListener("DOMContentLoaded", () => {
    fetchBooks();
    // Add event listener for favorite button clicks
    document.addEventListener('click', handleFavoriteButtonClick);
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
