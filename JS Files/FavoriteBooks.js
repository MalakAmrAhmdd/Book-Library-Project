document.addEventListener('DOMContentLoaded', function() {
  const bookList = document.querySelector('.book-list');
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  // Clear any existing content except the header
  while (bookList.children.length > 1) {
    bookList.removeChild(bookList.lastChild);
  }
  
  if (favorites.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-favorites';
    emptyMessage.textContent = 'You have no favorite books yet.';
    bookList.appendChild(emptyMessage);
    return;
  }
  
  // Fetch books data
  fetch('Books/books.json') // Ensure this path matches the actual location of books.json
    .then(response => response.json())
    .then(books => {
      // Filter to only favorite books
      const favoriteBooks = books.filter(book => favorites.includes(book.id.toString()));
      
      // Display favorite books
      favoriteBooks.forEach(book => {
        const isFavorite = favorites.includes(book.id.toString());
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
            <span class="status-badge in-shelf">In Shelf</span>
            <button class="favorite-button" data-book-id="${book.id}">
              <i class="${isFavorite ? 'fas' : 'far'} fa-heart" style="color: ${isFavorite ? '#5D1B21' : '#8A8A8A'}"></i>
              </button>
            <button class="preview-button">Preview</button>             
            </div>
            `;
        bookList.appendChild(bookRow);
      });

      // Add this line after appending all book rows
      if (window.updateFavoriteButtons) window.updateFavoriteButtons();
    })
    .catch(error => {
      console.error('Error loading books:', error);
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.textContent = 'Error loading favorite books. Please try again later.';
      bookList.appendChild(errorMessage);
    });
  
  // Handle removing favorites from the favorites page
  bookList.addEventListener('click', function(e) {
    if (e.target.closest('.favorite-button')) {
      const button = e.target.closest('.favorite-button');
      const bookId = button.getAttribute('data-book-id');
      
      // Remove from favorites
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const index = favorites.indexOf(bookId);
      if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Remove the book row from UI
        button.closest('.table-row').remove();
        
        // If no more favorites, show empty message
        if (favorites.length === 0) {
          const emptyMessage = document.createElement('div');
          emptyMessage.className = 'empty-favorites';
          emptyMessage.textContent = 'You have no favorite books yet.';
          bookList.appendChild(emptyMessage);
        }
      }
    }
  });
});