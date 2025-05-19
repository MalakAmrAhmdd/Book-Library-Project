document.addEventListener('DOMContentLoaded', function() {
  let favorites = [];

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

  function fetchFavoritesFromBackend() {
    console.log("Fetching favorites from backend...");
    makeAjaxRequest(
      'http://127.0.0.1:8000/favorites/get_favs/',
      'GET',
      null,
      function(data) {
        console.log("Favorites fetched successfully:", data);
        favorites = data.map(book => book.id.toString());
        window.favorites = favorites; 
        console.log("window.favorites set to:", window.favorites);
        updateAllFavoriteButtons();
        document.dispatchEvent(new CustomEvent('favoritesUpdated'));
      },
      function(xhr, status, error) {
        console.error("Error fetching favorites:", status, error);
        console.error("Response:", xhr.responseText);
        favorites = [];
        window.favorites = favorites;
        document.dispatchEvent(new CustomEvent('favoritesUpdated'));
      }
    );
  }

  function updateAllFavoriteButtons() {
    document.querySelectorAll('.favorite-button').forEach(button => {
      const bookId = button.getAttribute('data-book-id');
      const icon = button.querySelector('i');
      if (favorites.includes(bookId)) {
        icon.classList.replace('far', 'fas');
        icon.style.color = '#5D1B21';
      } else {
        icon.classList.replace('fas', 'far');
        icon.style.color = '#8A8A8A';
      }
    });
  }

  document.addEventListener('click', function(e) {
    const button = e.target.closest('.favorite-button');
    if (!button) return;

    const bookId = button.getAttribute('data-book-id');
    const index = favorites.indexOf(bookId);

    if (index === -1) {
      makeAjaxRequest(
        'http://127.0.0.1:8000/favorites/add_to_fav/',
        'POST',
        { book_id: bookId },
        function() {
          favorites.push(bookId);
          window.favorites = favorites;
          updateAllFavoriteButtons();
          document.dispatchEvent(new CustomEvent('favoritesUpdated'));
        }
      );
    } else {
      makeAjaxRequest(
        'http://127.0.0.1:8000/favorites/remove_fav/',
        'DELETE',
        { book_id: bookId },
        function() {
          favorites.splice(index, 1);
          window.favorites = favorites;
          updateAllFavoriteButtons();
          document.dispatchEvent(new CustomEvent('favoritesUpdated'));
        }
      );
    }
  });

  window.updateFavoriteButtons = updateAllFavoriteButtons;
  window.fetchFavoritesFromBackend = fetchFavoritesFromBackend;

  fetchFavoritesFromBackend();
});
