// favorites.js - Centralized favorite functionality
(function() {
  window.FavoritesModule = {
    getFavorites: function() {
      return JSON.parse(localStorage.getItem('favorites')) || [];
    },

    isFavorite: function(bookId) {
      return this.getFavorites().includes(bookId.toString());
    },

    toggleFavorite: function(bookId) {
      const favorites = this.getFavorites();
      const stringId = bookId.toString();
      const index = favorites.indexOf(stringId);
      
      if (index === -1) {
        favorites.push(stringId);
      } else {
        favorites.splice(index, 1);
      }
      
      localStorage.setItem('favorites', JSON.stringify(favorites));
      this.updateAllButtons();
      
      // Notify other components
      document.dispatchEvent(new CustomEvent('favoritesUpdated', {
        detail: { 
          bookId: bookId, 
          isFavorite: index === -1 
        }
      }));
      
      // Try to sync with backend when it's available
      this.syncWithBackend(stringId, index === -1);
      
      return index === -1;
    },
    
    syncWithBackend: function(bookId, isAdding) {
      if (!bookId) return; // Just sync all if no specific book
      
      const url = isAdding ? 
        'http://127.0.0.1:8000/favorites/addfavorites/' :
        'http://127.0.0.1:8000/favorites/deletefavorites/';
        
      fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id: bookId })
      }).catch(err => {
        console.log('Working in offline mode');
      });
    },

    updateAllButtons: function() {
      const favorites = this.getFavorites();
      document.querySelectorAll('.favorite-button').forEach(button => {
        if (!button) return;
        
        const bookId = button.getAttribute('data-book-id');
        const icon = button.querySelector('i');
        if (!icon) return;
        
        const isFav = favorites.includes(bookId);
        
        icon.className = isFav ? 'fas fa-heart' : 'far fa-heart';
        icon.style.color = isFav ? '#5D1B21' : '#8A8A8A';
      });
    },

    init: function() {
      document.addEventListener('click', (e) => {
        const button = e.target.closest('.favorite-button');
        if (button) {
          const bookId = button.getAttribute('data-book-id');
          this.toggleFavorite(bookId);
        }
      });
      
      this.updateAllButtons();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.FavoritesModule.init();
  });
})();
