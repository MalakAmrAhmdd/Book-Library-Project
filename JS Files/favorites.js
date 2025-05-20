function getwishlist(){
  let csrf = null;
  let cookies = document.cookie.split(";");
  cookies.forEach(element => {
      let key = element.split("=")[0].trim();
      let value = element.split("=")[1];
      if (key === "csrftoken") {
          csrf = value;
      }
  });

  return $.ajax({
    url : 'http://127.0.0.1:8000/favorites/get_favs/',
    method : 'GET',
    headers: {
      "X-CSRFToken": csrf 
    },
    xhrFields: {
      withCredentials: true
    },
    contentType: 'application/json',
  });
}

let favoriteBookIds = [];

// Fetch favorites from backend and update UI
function loadFavoritesAndUpdateUI() {
  getwishlist().done(function(data) {
    // Assuming data is a list of book objects or IDs
    favoriteBookIds = data.map(book => book.id ? book.id.toString() : book.toString());
    updateFavoriteButtons();
  });
}

// Update all favorite buttons on the page
function updateFavoriteButtons() {
  document.querySelectorAll('.favorite-button').forEach(button => {
    const bookId = button.getAttribute('data-book-id');
    const icon = button.querySelector('i');
    console.log(icon);
    if (favoriteBookIds.includes(bookId)) {
      icon.classList.remove('far');
      icon.classList.add('fas');
      icon.style.color = '#5D1B21';
    } else {
      icon.classList.remove('fas');
      icon.classList.add('far');
      icon.style.color = '#8A8A8A';
    }
  });
}

// Toggle favorite status for a book
function togglewishlist(bookId) {
  let csrf = null;
  document.cookie.split(";").forEach(element => {
    let key = element.split("=")[0].trim();
    let value = element.split("=")[1];
    if (key === "csrftoken") csrf = value;
  });

  const isFavorite = favoriteBookIds.includes(bookId.toString());
  const url = isFavorite
    ? 'http://127.0.0.1:8000/favorites/remove_fav/'
    : 'http://127.0.0.1:8000/favorites/add_to_fav/';
  const method = isFavorite ? 'DELETE' : 'POST';
  
  $.ajax({
    url: url,
    method: method,
    headers: { "X-CSRFToken": csrf },
    xhrFields: { withCredentials: true },
    contentType: 'application/json',
    data: JSON.stringify({ book_id: bookId }),
    success: function(response) {
      // Update local favoriteBookIds and UI
      if (isFavorite) {
        favoriteBookIds = favoriteBookIds.filter(id => id !== bookId.toString());
      } else {
        favoriteBookIds.push(bookId.toString());
      }
      updateFavoriteButtons();
      getFavorites();
    }
  });
}

// Call this on page load to initialize
document.addEventListener('DOMContentLoaded', loadFavoritesAndUpdateUI);

// Example: Attach event listeners to favorite buttons
document.addEventListener('click', function(e) {
  if (e.target.closest('.favorite-button')) {
    const button = e.target.closest('.favorite-button');
    const bookId = button.getAttribute('data-book-id');
    togglewishlist(bookId);
  }
});


let curpage = 1;
const wishlistPerPage = 16;
let filteredwishlist = [];

function renderwishlist(wishlist) {
  const favoriteContainer = document.querySelector(".book-list");
  if (!favoriteContainer) return;

  filteredwishlist = wishlist;
  const startIndex = (curpage - 1) * wishlistPerPage;
  const endIndex = startIndex + wishlistPerPage;
  const currentwishlist = filteredwishlist.slice(startIndex, endIndex);

  let html = `
    <div class="table-header">
      <span class="column-title">Title</span>
      <span class="column-category-header">Category</span>
      <span class="column-status">Actions</span>
    </div>
  `;

  if (currentwishlist.length === 0) {
    html += `<div class="no-wishlist">No wishlist yet</div>`;
  } else {
    currentwishlist.forEach(wishlisted => {
      const book = wishlisted;
      const isFavorite = favoriteBookIds.includes(book.id.toString());
      if (book) {
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
            <div class="favorite-container">
            <button class="favorite-button" data-book-id="${book.id}">
                <i class="${isFavorite ? 'fas' : 'far'} fa-heart" style="color: ${isFavorite ? '#5D1B21' : '#8A8A8A'}"></i>
            </button>
        </div>
          </div>
        `;
      }
    });
  }

  favoriteContainer.innerHTML = html;
  updateFooter();
  updatePaginationArrows();
}

function updateFooter() {
  const footerText = document.querySelector(".footer-text");
  const totalPages = Math.max(1, Math.ceil(filteredwishlist.length / wishlistPerPage));
  footerText.textContent = `Page ${curpage} of ${totalPages}`;
}

function updatePaginationArrows() {
  const leftArrow = document.querySelector(".footer-left-icon");
  const rightArrow = document.querySelector(".footer-right-icon");
  const totalPages = Math.ceil(filteredwishlist.length / wishlistPerPage);

  leftArrow.style.color = curpage === 1 ? "#8A8A8A" : "#5D1B21";
  rightArrow.style.color = curpage === totalPages ? "#8A8A8A" : "#5D1B21";

  leftArrow.style.cursor = curpage === 1 ? "default" : "pointer";
  rightArrow.style.cursor = curpage === totalPages ? "default" : "pointer";
}

function getFavorites() {
  let csrf = null;
  let cookies = document.cookie.split(";");
  cookies.forEach(element => {
    let key = element.split("=")[0].trim();
    let value = element.split("=")[1];
    if (key === "csrftoken") {
      csrf = value;
    }
  });

  $.ajax({
    url: 'http://127.0.0.1:8000/favorites/get_favs/',
    method: "GET",
    contentType: 'application/json',
    headers: {
      "X-CSRFToken": csrf
    },
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      renderwishlist(data);
    },
    error: function(xhr, status, error) {
      console.error("Error fetching borrowed books:", error);
    }
  })
}

document.addEventListener("DOMContentLoaded", function() {
  const favoriteContainer = document.querySelector(".book-list");
  if (!favoriteContainer) return;

  getFavorites();

  document.querySelector(".footer-left-icon").addEventListener("click", () => {
    if (curpage > 1) {
      curpage--;
      renderwishlist(filteredwishlist);
    }
  });

  document.querySelector(".footer-right-icon").addEventListener("click", () => {
    if (curpage * wishlistPerPage < filteredwishlist.length) {
      curpage++;
      renderwishlist(filteredwishlist);
    }
  });
});
