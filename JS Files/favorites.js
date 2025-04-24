document.addEventListener('DOMContentLoaded', function() {
  // Initialize favorites from localStorage
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  // Function to update all favorite buttons
  function updateFavoriteButtons() {
    document.querySelectorAll('.favorite-button').forEach(button => {
      const bookId = button.getAttribute('data-book-id');
      const icon = button.querySelector('i');
      
      if (bookId && favorites.includes(bookId)) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#5D1B21'; // Filled heart color
      } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '#8A8A8A'; // Empty heart color
      }
    });
  }
  
  // Update buttons on initial load
  updateFavoriteButtons();
  
  // Handle favorite button clicks
  document.addEventListener('click', function(e) {
    if (e.target.closest('.favorite-button')) {
      const button = e.target.closest('.favorite-button');
      const bookId = button.getAttribute('data-book-id');
      const icon = button.querySelector('i');
      
      if (!bookId) return;
      
      // Toggle favorite status
      const index = favorites.indexOf(bookId);
      if (index === -1) {
        favorites.push(bookId);
      } else {
        favorites.splice(index, 1);
      }
      
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(favorites));
      
      // Update button appearance
      updateFavoriteButtons();
    }
  });
});