function loadBooksFromBackend() {
  $.ajax({
    url: 'http://127.0.0.1:8000/books/getbook/',
    method: 'GET',
    contentType: 'application/json',
    success: function (data) {
      const books = Array.isArray(data) ? data : Object.values(data);
      renderBooks(books);
    },
    error: function (xhr) {
      console.error('Error fetching books:', xhr);
      document.querySelector(".blocks").innerHTML =
          "<div class='error-message'>Failed to load books. Please try again later.</div>";
    }
  });
}

function fetchBooks() {
    const urlParams = new URLSearchParams(window.location.search);
    const constraint = decodeURIComponent(urlParams.get('constraint') || 'all');
    const title = decodeURIComponent(urlParams.get('title') || 'All Books');

    const titleElement = document.querySelector('.homepage-text');
    if (titleElement) {
        titleElement.textContent = title;
    }

    // Fetch books from backend
    $.ajax({
        url: 'http://127.0.0.1:8000/books/getbook/',
        method: 'GET',
        contentType: 'application/json',
        success: function(data) {
            const books = Array.isArray(data) ? data : Object.values(data);
            
            // Filter books based on constraint
            let filteredBooks = books;
            if (constraint !== 'all') {
                const [filterType, filterValue] = constraint.split(':');
                if (filterType === 'category') {
                    filteredBooks = books.filter(book => book.category === filterValue);
                } else if (filterType === 'language') {
                    filteredBooks = books.filter(book => book.language === filterValue);
                }
            }
            
            // Display the filtered books
            renderFilteredBooks(filteredBooks);
        },
        error: function(xhr) {
            console.error('Error fetching books:', xhr);
            document.querySelector(".books-container").innerHTML = 
                "<div class='error-message'>Failed to load books. Please try again later.</div>";
        }
    });
}

function renderBooks(books) {
  const homepageContainer = document.querySelector(".blocks");
  if (!homepageContainer) {
    console.error("Could not find .blocks container");
    return;
  }

  homepageContainer.innerHTML = "";

  // Create All Books row
  if (books.length > 0) {
    homepageContainer.innerHTML += createSectionRow("All Books", books.slice(0, 12), "all");

    // Create Category rows
    const categories = [...new Set(books.map(book => book.category))];
    categories.forEach(category => {
      const categoryBooks = books.filter(book => book.category === category).slice(0, 12);
      if (categoryBooks.length > 0) {
        homepageContainer.innerHTML += createSectionRow(category, categoryBooks, `category:${category}`);
      }
    });

    // Create Language rows
    const languages = ["English", "Arabic"];
    languages.forEach(language => {
      const languageBooks = books.filter(book => book.language === language).slice(0, 12);
      if (languageBooks.length > 0) {
        homepageContainer.innerHTML += createSectionRow(language, languageBooks, `language:${language}`);
      }
    });

    document.querySelectorAll(".show-all-button").forEach(button => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const constraint = button.getAttribute("data-constraint");
        window.location.href = `Show_all page.html?constraint=${encodeURIComponent(constraint)}&title=${encodeURIComponent(
            button.parentElement.querySelector('.row-title').textContent
        )}`;
      });
    });
  } else {
    homepageContainer.innerHTML = "<div class='no-books-message'>No books found</div>";
  }
}

function createBookCard(book) {
  const isFavorite = window.FavoritesModule.isFavorite(book.id);
  
  return `
    <div class="book-holder">
        <label for="BookPopUp-${book.id}" class="Book-icon">
            <div class="book-image">
                <img src="${book.image}" alt="${book.title}" class="book-cover">
            </div>
        </label>
        <span class="book-title">${book.title}</span>
        <span class="book-author">${book.author}</span>
        <div class="favorite-container">
            <button class="favorite-button" data-book-id="${book.id}">
                <i class="${isFavorite ? 'fas' : 'far'} fa-heart" style="color: ${isFavorite ? '#5D1B21' : '#8A8A8A'}"></i>
            </button>
        </div>
    </div>
  `;
}

function createSectionRow(title, books, constraint) {
  const bookCards = books.map(createBookCard).join("");
  return `
        <div class="book-section">
            <div class="row-title-container">
                <div class="row-title">${title}</div>
                <button class="show-all-button" data-constraint="${constraint}">Show All</button>
            </div>
            <div class="table-row">${bookCards}</div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  loadBooksFromBackend();
  
  // Listen for favorites updates (e.g. from other parts of the page)
  document.addEventListener('favoritesUpdated', () => {
    // If you need to refresh the whole display
    // loadBooksFromBackend();
    
    // Or just update button states
    window.FavoritesModule.updateAllButtons();
  });
});
