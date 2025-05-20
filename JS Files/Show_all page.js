let currentPage = 1;
const booksPerPage = 24;
let filteredBooks = [];
let favoriteBookIds = [];

// Fetch favorites from backend
function fetchFavorites() {
    let csrf = null;
    document.cookie.split(";").forEach(element => {
        let key = element.split("=")[0].trim();
        let value = element.split("=")[1];
        if (key === "csrftoken") csrf = value;
    });

    return $.ajax({
        url: 'http://127.0.0.1:8000/favorites/get_favs/',
        method: 'GET',
        headers: { "X-CSRFToken": csrf },
        xhrFields: { withCredentials: true },
        contentType: 'application/json'
    });
}

// Add this function to handle favorite button clicks
function handleFavoriteButtonClick(e) {
    if (e.target.closest('.favorite-button')) {
        const button = e.target.closest('.favorite-button');
        const bookId = button.getAttribute('data-book-id');
        const icon = button.querySelector('i');
        let csrf = null;
        document.cookie.split(";").forEach(element => {
            let key = element.split("=")[0].trim();
            let value = element.split("=")[1];
            if (key === "csrftoken") csrf = value;
        });

        const isFavorite = favoriteBookIds.includes(bookId);
        const url = isFavorite
            ? 'http://127.0.0.1:8000/favorites/remove_fav/'
            : 'http://127.0.0.1:8000/favorites/add_to_fav/';
        const method = isFavorite ? 'DELETE' : 'POST';

        $.ajax({
            url: url,
            method: method,
            headers: { "X-CSRFToken": csrf },
            xhrFields: { withCredentials: true },
            contentType: 'application/json',
            data: JSON.stringify({ book_id: bookId }),
            success: function () {
                if (isFavorite) {
                    favoriteBookIds = favoriteBookIds.filter(id => id !== bookId);
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '#8A8A8A';
                } else {
                    favoriteBookIds.push(bookId);
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#5D1B21';
                }
            }
        });
    }
}

function fetchBooks() {
    const urlParams = new URLSearchParams(window.location.search);
    const constraint = decodeURIComponent(urlParams.get('constraint'));
    const title = decodeURIComponent(urlParams.get('title'));

    document.querySelector('.homepage-text').textContent = title;
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
        const isFavorite = favoriteBookIds.includes(book.id.toString());
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
    fetchFavorites().done(function(data) {
        favoriteBookIds = data.map(book => book.id ? book.id.toString() : book.toString());
        fetchBooks();
    });
    document.addEventListener('click', handleFavoriteButtonClick);

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