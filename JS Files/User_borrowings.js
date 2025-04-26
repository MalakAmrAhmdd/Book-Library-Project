document.addEventListener("DOMContentLoaded", function() {
    // Global function to render the borrowings page dynamically
  window.renderBorrowingsPage = function () {
    const borrowingsContainer = document.querySelector(".book-list");
    if (!borrowingsContainer) return;

    // Retrieve borrowed book IDs from localStorage
    let borrowedBooksIDs = [];
    try {
      borrowedBooksIDs = JSON.parse(localStorage.getItem("borrowings") || "[]");
    } catch (e) {
      borrowedBooksIDs = [];
    }

    // Retrieve full books list from localStorage (populated earlier via your books loader)
    let books = [];
    const storedBooks = localStorage.getItem("books");
    if (storedBooks) {
      try {
        books = JSON.parse(storedBooks);
      } catch (e) {
        books = [];
      }
    }
      
      //  the header row
      let html = `
        <div class="table-header">
          <span class="column-title">Title</span>
          <span class="column-category">Category</span>
          <span class="column-status">Actions</span>
        </div>
      `;
      
      // If no borrowed books
      if (borrowedBooksIDs.length === 0) {
        html += `<div class="no-borrowings">No borrowings yet</div>`;
      } else {
        // iterate over borrowed bookids and build rows
        borrowedBooksIDs.forEach(bookId => {
          const book = books.find(b => b.id.toString() === bookId.toString());
          if (book) {
            // Here you can customize the structure as needed.
            // Get the current status of this book, defaulting to "Borrowed".
          const status = localStorage.getItem(`status_${book.title}`) || "Borrowed";
          // Check if this book is in the favorites list.
          const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
          const isFavorite = favorites.includes(book.id.toString());
            html += `
              <div class="table-row" data-book-id="${book.id}">
                <div class="column-title">
                  <img src="${book.image}" alt="${book.title}" class="book-cover">
                  <div class="book-info">
                    <span class="book-title">${book.title}</span>
                    <span class="book-author">${book.author}</span>
                  </div>
                </div>
                <div class="column-category">
                  <span class="category-text">${book.category}</span>
                  <span class="subcategory-text"></span>
                </div>
                <div class="column-status">
                  <button class="remove-borrowing-btn give-back-btn" data-book-id="${book.id}">Give Back</button>
                  <button class="favorite-button" data-book-id="${book.id}" style="background:transparent; border:none; margin-right:5px;">
                    <i class="${isFavorite ? "fas" : "far"} fa-heart" style="color: ${isFavorite ? "#5D1B21" : "#8A8A8A"};"></i>
                  </button>
                  <button class="preview-button" data-book-id="${book.id}">Preview</button>
                </div>
              </div>
            `;
          }
        });
      }
      
      borrowingsContainer.innerHTML = html;
    }
  
    // Initial render of borrowings on page load
    window.renderBorrowingsPage();

    //  custom event in the popup to update the list when give back inside it is clicked
    document.addEventListener("borrowingsUpdated", function () {
        if (typeof window.renderBorrowingsPage === "function") {
          window.renderBorrowingsPage();
        }
    });
  
    
    document.addEventListener("click", function(event){
      const btn = event.target.closest(".remove-borrowing-btn");
      if (!btn) return;
      
      const bookId = btn.getAttribute("data-book-id");
      let borrowings = JSON.parse(localStorage.getItem("borrowings") || "[]");
      // Remove the book from the borrowings list
      borrowings = borrowings.filter(id => id.toString() !== bookId.toString());
      localStorage.setItem("borrowings", JSON.stringify(borrowings));
      
      //  update the status of the book to "In-Shelf"
      const storedBooks = localStorage.getItem("books");
      if (storedBooks) {
        const books = JSON.parse(storedBooks);
        const book = books.find(b => b.id.toString() === bookId.toString());
        if (book) {
          localStorage.setItem(`status_${book.title}`, "In-Shelf");
        }
      }
      
      
      window.renderBorrowingsPage();
    });
  

  });