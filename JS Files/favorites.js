// favorites.js - Shared favorite functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize favorites from localStorage
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  // Function to update => all favorite buttons
  function updateAllFavoriteButtons() {
    document.querySelectorAll('.favorite-button').forEach(button => {
      const bookId = button.getAttribute('data-book-id');
      const icon = button.querySelector('i');
      
      if (favorites.includes(bookId)) {
        icon.classList.replace('far', 'fas');
        icon.style.color = '#5D1B21'; // Filled heart color
      } else {
        icon.classList.replace('fas', 'far');
        icon.style.color = '#8A8A8A'; // Empty heart color
      }
    });
  }
  
  // Update buttons on initial load
  document.addEventListener('DOMContentLoaded', updateAllFavoriteButtons);
  
  // Handle favorite button clicks
  document.addEventListener('click', function(e) {
    const button = e.target.closest('.favorite-button');
    if (!button) return;

    const bookId = button.getAttribute('data-book-id');
    const index = favorites.indexOf(bookId);

    if (index === -1) {
      favorites.push(bookId);
    } else {
      favorites.splice(index, 1);
    }

    // Save updated favorites to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateAllFavoriteButtons();
    
    // Notify other components
    document.dispatchEvent(new CustomEvent('favoritesUpdated'));
  });
  
  // Make function available globally
  window.updateFavoriteButtons = updateAllFavoriteButtons;
});