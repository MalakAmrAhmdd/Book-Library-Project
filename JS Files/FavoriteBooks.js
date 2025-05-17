document.addEventListener('DOMContentLoaded', function() {
  const bookList = document.querySelector('.book-list');
  
  // Make sure the element exists
  if (!bookList) {
    console.error("Could not find .book-list element");
    return;
  }
  
  function renderFavorites() {
    // Clear existing dynamic content while preserving the header (assumed to be the first child)
    while (bookList.children.length > 1) {
      bookList.removeChild(bookList.lastChild);
    }

    const favorites = window.FavoritesModule.getFavorites();

    if (favorites.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-favorites';
      emptyMessage.textContent = 'You have no favorite books yet.';
      bookList.appendChild(emptyMessage);
      return;
    }

    // Fetch books data
    fetch('http://127.0.0.1:8000/books/getbook/')
      .then(response => response.json())
      .then(data => {
        const books = Array.isArray(data) ? data : Object.values(data);
        // Filter to include only favorite books
        const favoriteBooks = books.filter(book => favorites.includes(book.id.toString()));
        
        favoriteBooks.forEach(book => {
          const bookStatus = localStorage.getItem(`status_${book.title}`) || "In-Shelf";
          const badgeColor = (bookStatus === "Borrowed") ? "#735E57" : "#214539";

          const bookRow = document.createElement('div');
          bookRow.className = 'table-row';
          bookRow.setAttribute('data-book-id', book.id);
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
                <i class="fas fa-heart" style="color: #5D1B21"></i>
              </button>
              <button class="preview-button" data-book-id="${book.id}">Preview</button>
            </div>
          `;
          bookList.appendChild(bookRow);
        });
      })
      .catch(error => {
        console.error('Error loading books:', error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Error loading favorite books. Please try again later.';
        bookList.appendChild(errorMessage);
      });
  }

  // Initial render on page load
  renderFavorites();

  // Listen for favorite updates with animation for removal
  document.addEventListener('favoritesUpdated', function(event) {
    if (event.detail && !event.detail.isFavorite) {
      // Find the row with this book ID
      const row = bookList.querySelector(`.table-row[data-book-id="${event.detail.bookId}"]`);
      if (row) {
        // Add fade-out animation
        row.style.transition = 'opacity 0.3s ease-out';
        row.style.opacity = '0';
        
        // Remove after animation completes
        setTimeout(() => {
          renderFavorites(); 
        }, 300);
      } else {
        renderFavorites();
      }
    }
  });
  
  // Listen for a custom event to re-render the favorites when a book's status changes
  document.addEventListener('borrowingsUpdated', function() {
    renderFavorites();
  });
});
