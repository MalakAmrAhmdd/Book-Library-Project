document.addEventListener('DOMContentLoaded', function() {
  let favorites = [];

  function fetchFavoritesFromBackend() {
    let csrf = null;
    document.cookie.split(";").forEach(element => {
      let key = element.split("=")[0].trim();
      let value = element.split("=")[1];
      if (key === "csrftoken") csrf = value;
    });

    $.ajax({
      url: 'http://127.0.0.1:8000/favorites/get_favs/',
      method: 'GET',
      headers: { "X-CSRFToken": csrf },
      xhrFields: { withCredentials: true },
      success: function(data) {
        favorites = data.map(book => book.id.toString());
        updateAllFavoriteButtons();
        document.dispatchEvent(new CustomEvent('favoritesUpdated'));
      }
    });
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

    let csrf = null;
    document.cookie.split(";").forEach(element => {
      let key = element.split("=")[0].trim();
      let value = element.split("=")[1];
      if (key === "csrftoken") csrf = value;
    });

    if (index === -1) {
      $.ajax({
        url: 'http://127.0.0.1:8000/favorites/add_to_fav/',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ book_id: bookId }),
        headers: { "X-CSRFToken": csrf },
        xhrFields: { withCredentials: true },
        success: function() {
          favorites.push(bookId);
          updateAllFavoriteButtons();
          document.dispatchEvent(new CustomEvent('favoritesUpdated'));
        }
      });
    } else {
      $.ajax({
        url: 'http://127.0.0.1:8000/favorites/remove_fav/',
        method: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({ book_id: bookId }),
        headers: { "X-CSRFToken": csrf },
        xhrFields: { withCredentials: true },
        success: function() {
          favorites.splice(index, 1);
          updateAllFavoriteButtons();
          document.dispatchEvent(new CustomEvent('favoritesUpdated'));
        }
      });
    }
  });

  window.updateFavoriteButtons = updateAllFavoriteButtons;
  window.fetchFavoritesFromBackend = fetchFavoritesFromBackend;

  fetchFavoritesFromBackend();
});
