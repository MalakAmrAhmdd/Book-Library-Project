document.addEventListener('DOMContentLoaded', function() {
  const bookList = document.querySelector('.book-list');
  console.log("FavoriteBooks.js loaded");

  const getCsrfToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; csrftoken=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  function makeAjaxRequest(url, method, data, successCallback, errorCallback) {
    const csrf = getCsrfToken();
    console.log("Using CSRF token:", csrf);

    const csrfOptions = {
      url: url,
      method: method,
      data: data ? JSON.stringify(data) : undefined,
      contentType: data ? 'application/json' : undefined,
      headers: { 
        "X-CSRFToken": csrf,
        "X-Requested-With": "XMLHttpRequest"
      },
      xhrFields: { 
        withCredentials: true 
      },
      crossDomain: true,
      success: successCallback,
      error: function(xhr, status, error) {
        console.error(`Error in ${method} request to ${url}:`, status, error);
        console.error("Response:", xhr.responseText);
        if (xhr.status === 403 && xhr.responseText.includes("CSRF")) {
          console.error("CSRF verification failed. Try refreshing the page to get a new token.");
        }
        if (errorCallback) errorCallback(xhr, status, error);
      }
    };

    console.log("Making AJAX request:", {
      url: csrfOptions.url,
      method: csrfOptions.method,
      headers: csrfOptions.headers
    });

    $.ajax(csrfOptions);
  }

  function renderFavorites() {
    console.log("Rendering favorites, window.favorites =", window.favorites);
    
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

    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'loading-favorites';
    loadingMessage.textContent = 'Loading your favorite books...';
    bookList.appendChild(loadingMessage);

    console.log("Fetching books for favorites...");
    makeAjaxRequest(
      'http://127.0.0.1:8000/books/getbook/',
      'GET',
      null,
      function(books) {
        console.log("Books fetched successfully:", books);
        bookList.removeChild(loadingMessage);
        
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
      function(xhr, status, error) {
        console.error("Error loading books:", status, error);
        console.error("Response:", xhr.responseText);
        bookList.removeChild(loadingMessage);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Error loading favorite books. Please try again later.';
        bookList.appendChild(errorMessage);
      }
    );
  }

  document.addEventListener('favoritesUpdated', function() {
    console.log("favoritesUpdated event received");
    renderFavorites();
  });

  if (window.favorites) {
    console.log("window.favorites already exists:", window.favorites);
    renderFavorites();
  } else {
    console.log("Waiting for favorites to be loaded...");
    const waitingMessage = document.createElement('div');
    waitingMessage.className = 'loading-favorites';
    waitingMessage.textContent = 'Loading your favorite books...';
    bookList.appendChild(waitingMessage);
  }
});
