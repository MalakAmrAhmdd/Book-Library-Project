export function displayBooks(filteredBooks, bookList) {
    bookList.innerHTML = `
        <div class="table-header">
            <span class="column-title">Title</span>
            <span class="column-category">Category</span>
            <span class="column-status">Status</span>
        </div>
    `;
    filteredBooks.forEach(book => {
        // Retrieve the current borrowing status for this book (default "In-Shelf")
        const bookStatus = localStorage.getItem(`status_${book.title}`) || "In-Shelf";
        // Determine badge color based on status
        const badgeColor = (bookStatus === "Borrowed") ? "#735E57" : "#214539";

        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div class="column-title">
                <img src="${book.image}" alt="Book Cover" class="book-cover">
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
                    <i class="far fa-heart"></i>
                </button>
                <button class="preview-button">Preview</button>
            </div>
        `;
        bookList.appendChild(row);
    });

    // Call updateFavoriteButtons after rendering books
    if (window.updateFavoriteButtons) window.updateFavoriteButtons();
}

function filterBooks(books, bookList, searchInput, searchCategory) {
    const filter = searchInput.value.toLowerCase();
    const category = searchCategory.value;
    const filteredBooks = books.filter(book => {
        if (category === 'All') {
            return (
                book.title.toLowerCase().includes(filter) ||
                book.author.toLowerCase().includes(filter) ||
                book.category.toLowerCase().includes(filter)
            );
        } else if (category === 'Title') {
            return book.title.toLowerCase().includes(filter);
        } else if (category === 'Author') {
            return book.author.toLowerCase().includes(filter);
        } else if (category === 'Category') {
            return book.category.toLowerCase().includes(filter);
        }
    });
    displayBooks(filteredBooks, bookList);
}

export function initializeSearch(books, bookList, searchInput, searchCategory) {
    searchInput.addEventListener('input', () => filterBooks(books, bookList, searchInput, searchCategory));
    searchCategory.addEventListener('change', () => filterBooks(books, bookList, searchInput, searchCategory));

    // Display all books initially
    displayBooks(books, bookList);

    document.addEventListener('borrowingsUpdated', () => {
        // Re-run the filter so that the displayBooks function refreshes each row.
        filterBooks(books, bookList, searchInput, searchCategory);
      });
    
}
