document.addEventListener('DOMContentLoaded', function() {
  const bookList = document.querySelector('.book-list');

  // Function to render the favorites list
  function renderFavorites() {
    // Clear existing dynamic content while preserving the header (assumed to be the first child)
    while (bookList.children.length > 1) {
      bookList.removeChild(bookList.lastChild);
    }

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-favorites';
      emptyMessage.textContent = 'You have no favorite books yet.';
      bookList.appendChild(emptyMessage);
      return;
    }

    // Fetch books data
    fetch('Books/books.json') // Ensure the path is correct
      .then(response => response.json())
      .then(books => {
        // Filter to include only favorite books
        const favoriteBooks = books.filter(book => favorites.includes(book.id.toString()));
        
        favoriteBooks.forEach(book => {
          const isFavorite = favorites.includes(book.id.toString());
          // Retrieve the current borrowing status for this book (default "In-Shelf")
          const bookStatus = localStorage.getItem(`status_${book.title}`) || "In-Shelf";
          // Determine badge color based on status
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

  // Listen for a custom event to re-render the favorites when a book's status changes.
  document.addEventListener('borrowingsUpdated', function() {
    renderFavorites();
  });

  // Handle removing a favorite from the favorites page
  bookList.addEventListener('click', function(e) {
    const button = e.target.closest('.favorite-button');
    if (button) {
      const bookId = button.getAttribute('data-book-id');
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const index = favorites.indexOf(bookId);
      if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites();
      }
    }
  });
});