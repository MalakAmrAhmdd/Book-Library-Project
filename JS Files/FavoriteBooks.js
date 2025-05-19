document.addEventListener('DOMContentLoaded', function() {
  const bookList = document.querySelector('.book-list');

  function renderFavorites() {
    while (bookList.children.length > 1) {
      bookList.removeChild(bookList.lastChild);
    }

    const favorites = window.favorites || [];

    if (favorites.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-favorites';
      emptyMessage.textContent = 'You have no favorite books yet.';
      bookList.appendChild(emptyMessage);
      return;
    }

    let csrf = null;
    document.cookie.split(";").forEach(element => {
      let key = element.split("=")[0].trim();
      let value = element.split("=")[1];
      if (key === "csrftoken") csrf = value;
    });

    $.ajax({
      url: 'http://127.0.0.1:8000/books/getbook/',
      method: 'GET',
      headers: { "X-CSRFToken": csrf },
      xhrFields: { withCredentials: true },
      success: function(books) {
        const favoriteBooks = books.filter(book => favorites.includes(book.id.toString()));
        
        favoriteBooks.forEach(book => {
          const isFavorite = favorites.includes(book.id.toString());
          const bookStatus = localStorage.getItem(`status_${book.title}`) || "In-Shelf";
          const badgeColor = (bookStatus === "Borrowed") ? "#735E57" : "#214539";

          const bookRow = document.createElement('div');
          bookRow.className = 'table-row';
          bookRow.innerHTML = `
            <div class="column-title">
              <img src="${book.image}" alt="${book.title}" class="book-cover">
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
                <i class="${isFavorite ? 'fas' : 'far'} fa-heart" style="color: ${isFavorite ? '#5D1B21' : '#8A8A8A'}"></i>
              </button>
              <button class="preview-button" data-book-id="${book.id}">Preview</button>
            </div>
          `;
          bookList.appendChild(bookRow);
        });

        if (window.updateFavoriteButtons) window.updateFavoriteButtons();
      },
      error: function() {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Error loading favorite books. Please try again later.';
        bookList.appendChild(errorMessage);
      }
    });
  }

  renderFavorites();

  document.addEventListener('favoritesUpdated', function() {
    renderFavorites();
  });
});
