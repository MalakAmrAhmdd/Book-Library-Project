let currentPage = 1;
const borrowingsPerPage = 16;
let filteredBorrowings = [];

function renderBorrowings(borrowings) {
  const borrowingsContainer = document.querySelector(".book-list");
  if (!borrowingsContainer) return;

  filteredBorrowings = borrowings;
  const startIndex = (currentPage - 1) * borrowingsPerPage;
  const endIndex = startIndex + borrowingsPerPage;
  const currentBorrowings = filteredBorrowings.slice(startIndex, endIndex);

  let html = `
    <div class="table-header">
      <span class="column-title">Title</span>
      <span class="column-category">Category</span>
      <span class="column-status">Actions</span>
    </div>
  `;

  if (currentBorrowings.length === 0) {
    html += `<div class="no-borrowings">No borrowings yet</div>`;
  } else {
    currentBorrowings.forEach(borrowing => {
      const book = borrowing;
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
            <div class="column-status">
              <button class="preview-button" data-book-id="${book.id}">Preview</button>
            </div>
          </div>
        `;
      }
    });
  }

  borrowingsContainer.innerHTML = html;
  updateFooter();
  updatePaginationArrows();
}

function updateFooter() {
  const footerText = document.querySelector(".footer-text");
  const totalPages = Math.max(1, Math.ceil(filteredBorrowings.length / borrowingsPerPage));
  footerText.textContent = `Page ${currentPage} of ${totalPages}`;
}

function updatePaginationArrows() {
  const leftArrow = document.querySelector(".footer-left-icon");
  const rightArrow = document.querySelector(".footer-right-icon");
  const totalPages = Math.ceil(filteredBorrowings.length / borrowingsPerPage);

  leftArrow.style.color = currentPage === 1 ? "#8A8A8A" : "#5D1B21";
  rightArrow.style.color = currentPage === totalPages ? "#8A8A8A" : "#5D1B21";

  leftArrow.style.cursor = currentPage === 1 ? "default" : "pointer";
  rightArrow.style.cursor = currentPage === totalPages ? "default" : "pointer";
}

function getBorrowedBooks() {
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
    url: 'http://127.0.0.1:8000/borrowings/borrowed_books/',
    method: "GET",
    contentType: 'application/json',
    headers: {
      "X-CSRFToken": csrf
    },
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      renderBorrowings(data);
    },
    error: function(xhr, status, error) {
      console.error("Error fetching borrowed books:", error);
    }
  })
}

document.addEventListener("DOMContentLoaded", function() {
  const borrowingsContainer = document.querySelector(".book-list");
  if (!borrowingsContainer) return;

  getBorrowedBooks();

  document.querySelector(".footer-left-icon").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderBorrowings(filteredBorrowings);
    }
  });

  document.querySelector(".footer-right-icon").addEventListener("click", () => {
    if (currentPage * borrowingsPerPage < filteredBorrowings.length) {
      currentPage++;
      renderBorrowings(filteredBorrowings);
    }
  });
});
document.addEventListener("borrowingsUpdated", function () {
    getBorrowedBooks();
});