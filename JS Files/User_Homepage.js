function loadBooksIntoLocalStorage() {
  fetch(`Books/books.json?timestamp=${new Date().getTime()}`) // Ensure this path matches the actual location of books.json
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        localStorage.setItem('books', JSON.stringify(data));
        renderBooks(data);
      })
      .catch(error => {
        console.error('Error loading books:', error);
        const cachedBooks = JSON.parse(localStorage.getItem("books")) || [];
        if (cachedBooks.length > 0) {
          renderBooks(cachedBooks);
        } else {
          console.error("No books data available");
          document.querySelector(".blocks").innerHTML =
              "<div class='error-message'>No books data available. Please try again later.</div>";
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
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const isFavorite = favorites.includes(book.id.toString());
  
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

  const cachedBooks = JSON.parse(localStorage.getItem("books")) || [];
  if (cachedBooks.length > 0) {
    renderBooks(cachedBooks);
    // Add this line to update favorite buttons after rendering
    if (window.updateFavoriteButtons) window.updateFavoriteButtons();
  }

  loadBooksIntoLocalStorage();
});
