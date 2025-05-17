let currentPage = 1;
const booksPerPage = 24;
let filteredBooks = [];

// Add this early in your JS code to ensure FavoritesModule always exists
window.FavoritesModule = window.FavoritesModule || {
    isFavorite: function(id) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.includes(id.toString());
    },
    updateAllButtons: function() {
        // Simplified version or empty implementation
        console.log("FavoritesModule.updateAllButtons called");
    }
};

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
    const constraint = decodeURIComponent(urlParams.get('constraint') || 'all');
    const title = decodeURIComponent(urlParams.get('title') || 'All Books');

    const titleElement = document.querySelector('.homepage-text');
    if (titleElement) {
        titleElement.textContent = title;
    } else {
        console.error("Could not find .homepage-text element");
    }

    $.ajax({
        url: 'http://127.0.0.1:8000/books/getbook/',
        method: 'GET',
        contentType: 'application/json',
        success: function (data) {
            const books = Array.isArray(data) ? data : Object.values(data);

            if (constraint === 'all') {
                filteredBooks = books;
            } else if (constraint.startsWith('category:')) {
                const category = constraint.split(':')[1];
                filteredBooks = books.filter(book => book.category === category);
            } else if (constraint.startsWith('language:')) {
                const language = constraint.split(':')[1];
                filteredBooks = books.filter(book => book.language === language);
            }

            renderBooks();
        },
        error: function (xhr) {
            console.error('Error fetching books:', xhr);
            document.querySelector(".table-row").innerHTML =
                "<div class='error-message'>Failed to load books. Please try again later.</div>";
        }
    });
}

function renderBooks() {
    const bookContainer = document.querySelector(".table-row");
    bookContainer.innerHTML = "";

    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const currentBooks = filteredBooks.slice(startIndex, endIndex);

    currentBooks.forEach(book => {
        // Check if FavoritesModule exists before using it
        const isFavorite = window.FavoritesModule && 
                          typeof window.FavoritesModule.isFavorite === 'function' ? 
                          window.FavoritesModule.isFavorite(book.id) : false;
        
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
                    <i class="${isFavorite ? 'fas' : 'far'} fa-heart" 
                       style="color: ${isFavorite ? '#5D1B21' : '#8A8A8A'}; 
                       font-size: 18px; padding: 5px;"></i>
                </button>
            </div>
        `;
        bookContainer.appendChild(bookElement);
    });

    updateFooter();
    updatePaginationArrows();
}

function updateFooter() {
    const footerText = document.querySelector(".footer-text");
    const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
    footerText.textContent = `Page ${currentPage} of ${totalPages}`;
}

function updatePaginationArrows() {
    const leftArrow = document.querySelector(".footer-left-icon");
    const rightArrow = document.querySelector(".footer-right-icon");
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    leftArrow.style.color = currentPage === 1 ? "#8A8A8A" : "#5D1B21";
    rightArrow.style.color = currentPage === totalPages ? "#8A8A8A" : "#5D1B21";

    leftArrow.style.cursor = currentPage === 1 ? "default" : "pointer";
    rightArrow.style.cursor = currentPage === totalPages ? "default" : "pointer";
}

document.addEventListener("DOMContentLoaded", () => {
    fetchBooks();

    // Listen for favorite updates
    document.addEventListener('favoritesUpdated', () => {
        window.FavoritesModule.updateAllButtons();
    });

    // Add event listener for favorite button clicks using event delegation
    document.querySelector(".table-row").addEventListener("click", handleFavoriteButtonClick);

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
});
