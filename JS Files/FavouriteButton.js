document.addEventListener('DOMContentLoaded', () => {
    const favoritesKey = 'favoriteBooks';

    const loadFavorites = () => {
        return JSON.parse(localStorage.getItem(favoritesKey)) || [];
    };

    const saveFavorites = (favorites) => {
        localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    };

    const toggleFavorite = (bookId) => {
        let favorites = loadFavorites();
        if (favorites.includes(bookId)) {
            favorites = favorites.filter(id => id !== bookId);
        } else {
            favorites.push(bookId);
        }
        saveFavorites(favorites);
    };

    const updateButtonState = (button, isFavorite) => {
        const icon = button.querySelector('i');
        if (isFavorite) {
            icon.classList.add('fas');
            icon.classList.remove('far');
            button.style.color = '#5D1B21';
        } else {
            icon.classList.add('far');
            icon.classList.remove('fas');
            button.style.color = '';
        }
    };

    const initializeFavoriteButtons = () => {
        const favoriteButtons = document.querySelectorAll('.favorite-button');
        const favorites = loadFavorites();

        favoriteButtons.forEach(button => {
            const bookId = button.closest('.table-row').querySelector('.book-title').textContent.trim();
            const isFavorite = favorites.includes(bookId);

            updateButtonState(button, isFavorite);

            button.addEventListener('click', () => {
                toggleFavorite(bookId);
                const updatedFavorites = loadFavorites();
                updateButtonState(button, updatedFavorites.includes(bookId));
                checkFavoritesEmpty();
            });
        });
    };

    const checkFavoritesEmpty = () => {
        const favorites = loadFavorites();
        const bookList = document.querySelector('.book-list');
        const noFavoritesMessage = document.querySelector('.no-favorites-message');

        if (bookList && favorites.length === 0) {
            if (!noFavoritesMessage) {
                const message = document.createElement('div');
                message.className = 'no-favorites-message';
                message.textContent = 'There is no favorites yet';
                message.style.textAlign = 'center';
                message.style.marginTop = '20px';
                message.style.fontSize = '18px';
                message.style.color = '#8a8a8a';
                bookList.innerHTML = '';
                bookList.appendChild(message);
            }
        } else if (noFavoritesMessage) {
            noFavoritesMessage.remove();
        }
    };

    initializeFavoriteButtons();

    const favoritesPage = document.querySelector('.favorites-header');
    if (favoritesPage) {
        const favorites = loadFavorites();
        const bookRows = document.querySelectorAll('.table-row');
        bookRows.forEach(row => {
            const bookId = row.querySelector('.book-title').textContent.trim();
            if (!favorites.includes(bookId)) {
                row.style.display = 'none';
            }
        });
        checkFavoritesEmpty();
    }
});
