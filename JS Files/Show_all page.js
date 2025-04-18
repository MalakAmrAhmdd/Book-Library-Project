const books = [
    // Array of book objects (title, author, image, etc.)
    { title: "Don't Make Me Think", author: "Steve Krug, 2000", image: "Books/English/engBookCovers/don't make me think.jpg" },
    { title: "The Design of Everyday Things", author: "Don Norman, 1988", image: "Books/English/engBookCovers/The design of everyday things.jpg" },
    { title: "Sprint", author: "Jake Knapp, 2000", image: "Books/English/engBookCovers/Sprint.jpg" },
    { title: "Lean UX", author: "Jeff Gothelf, 2016", image: "Books/English/engBookCovers/Lean UX.png" },
    { title: "The Road to React", author: "Steve Krug, 2000", image: "Books/English/engBookCovers/the road to react.jpg" },
    { title: "Rich Dad Poor Dad", author: "Robert T.Kiyosaki, 1997", image: "Books/English/engBookCovers/Rich dad poor dad.jpg" },
    { title: "Harry Potter", author: "J.K. Rowling, 2002", image: "Books/English/engBookCovers/Harry potter.jpg" },

    { title: "Don't Make Me Think", author: "Steve Krug, 2000", image: "Books/English/engBookCovers/don't make me think.jpg" },
    { title: "The Design of Everyday Things", author: "Don Norman, 1988", image: "Books/English/engBookCovers/The design of everyday things.jpg" },
    { title: "Sprint", author: "Jake Knapp, 2000", image: "Books/English/engBookCovers/Sprint.jpg" },
    { title: "Lean UX", author: "Jeff Gothelf, 2016", image: "Books/English/engBookCovers/Lean UX.png" },
    { title: "The Road to React", author: "Steve Krug, 2000", image: "Books/English/engBookCovers/the road to react.jpg" },
    { title: "Rich Dad Poor Dad", author: "Robert T.Kiyosaki, 1997", image: "Books/English/engBookCovers/Rich dad poor dad.jpg" },
    { title: "Harry Potter", author: "J.K. Rowling, 2002", image: "Books/English/engBookCovers/Harry potter.jpg" },

    { title: "Don't Make Me Think", author: "Steve Krug, 2000", image: "Books/English/engBookCovers/don't make me think.jpg" },
    { title: "The Design of Everyday Things", author: "Don Norman, 1988", image: "Books/English/engBookCovers/The design of everyday things.jpg" },
    { title: "Sprint", author: "Jake Knapp, 2000", image: "Books/English/engBookCovers/Sprint.jpg" },
    { title: "Lean UX", author: "Jeff Gothelf, 2016", image: "Books/English/engBookCovers/Lean UX.png" },
    { title: "The Road to React", author: "Steve Krug, 2000", image: "Books/English/engBookCovers/the road to react.jpg" },
    { title: "Rich Dad Poor Dad", author: "Robert T.Kiyosaki, 1997", image: "Books/English/engBookCovers/Rich dad poor dad.jpg" },
    { title: "Harry Potter", author: "J.K. Rowling, 2002", image: "Books/English/engBookCovers/Harry potter.jpg" },

    { title: "Don't Make Me Think", author: "Steve Krug, 2000", image: "Books/English/engBookCovers/don't make me think.jpg" },
    { title: "The Design of Everyday Things", author: "Don Norman, 1988", image: "Books/English/engBookCovers/The design of everyday things.jpg" },
    { title: "Sprint", author: "Jake Knapp, 2000", image: "Books/English/engBookCovers/Sprint.jpg" },
    { title: "Lean UX", author: "Jeff Gothelf, 2016", image: "Books/English/engBookCovers/Lean UX.png" },
    { title: "The Road to React", author: "Steve Krug, 2000", image: "Books/English/engBookCovers/the road to react.jpg" },
    { title: "Rich Dad Poor Dad", author: "Robert T.Kiyosaki, 1997", image: "Books/English/engBookCovers/Rich dad poor dad.jpg" },
    { title: "Harry Potter", author: "J.K. Rowling, 2002", image: "Books/English/engBookCovers/Harry potter.jpg" },

    { title: "Don't Make Me Think", author: "Steve Krug, 2000", image: "Books/English/engBookCovers/don't make me think.jpg" },
    { title: "The Design of Everyday Things", author: "Don Norman, 1988", image: "Books/English/engBookCovers/The design of everyday things.jpg" },
    { title: "Sprint", author: "Jake Knapp, 2000", image: "Books/English/engBookCovers/Sprint.jpg" },
    { title: "Lean UX", author: "Jeff Gothelf, 2016", image: "Books/English/engBookCovers/Lean UX.png" },
    { title: "The Road to React", author: "Steve Krug, 2000", image: "Books/English/engBookCovers/the road to react.jpg" },
    { title: "Rich Dad Poor Dad", author: "Robert T.Kiyosaki, 1997", image: "Books/English/engBookCovers/Rich dad poor dad.jpg" },
    { title: "Harry Potter", author: "J.K. Rowling, 2002", image: "Books/English/engBookCovers/Harry potter.jpg" },

    { title: "Don't Make Me Think", author: "Steve Krug, 2000", image: "Books/English/engBookCovers/don't make me think.jpg" },
    { title: "The Design of Everyday Things", author: "Don Norman, 1988", image: "Books/English/engBookCovers/The design of everyday things.jpg" },
    { title: "Sprint", author: "Jake Knapp, 2000", image: "Books/English/engBookCovers/Sprint.jpg" },
    { title: "Lean UX", author: "Jeff Gothelf, 2016", image: "Books/English/engBookCovers/Lean UX.png" },
    { title: "The Road to React", author: "Steve Krug, 2000", image: "Books/English/engBookCovers/the road to react.jpg" },
    { title: "Rich Dad Poor Dad", author: "Robert T.Kiyosaki, 1997", image: "Books/English/engBookCovers/Rich dad poor dad.jpg" },
    { title: "Harry Potter", author: "J.K. Rowling, 2002", image: "Books/English/engBookCovers/Harry potter.jpg" },

    { title: "Don't Make Me Think", author: "Steve Krug, 2000", image: "Books/English/engBookCovers/don't make me think.jpg" },
    { title: "The Design of Everyday Things", author: "Don Norman, 1988", image: "Books/English/engBookCovers/The design of everyday things.jpg" },
    { title: "Sprint", author: "Jake Knapp, 2000", image: "Books/English/engBookCovers/Sprint.jpg" },
    { title: "Lean UX", author: "Jeff Gothelf, 2016", image: "Books/English/engBookCovers/Lean UX.png" },
    { title: "The Road to React", author: "Steve Krug, 2000", image: "Books/English/engBookCovers/the road to react.jpg" },
    { title: "Rich Dad Poor Dad", author: "Robert T.Kiyosaki, 1997", image: "Books/English/engBookCovers/Rich dad poor dad.jpg" },
    { title: "Harry Potter", author: "J.K. Rowling, 2002", image: "Books/English/engBookCovers/Harry potter.jpg" },
    // Add more books as needed
];

const booksPerPage = 24;
let currentPage = 1;

function renderBooks() {
    const bookContainer = document.querySelector(".table-row");
    bookContainer.innerHTML = "";

    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = Math.min(startIndex + booksPerPage, books.length);

    for (let i = startIndex; i < endIndex; i++) {
        const book = books[i];
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-holder");
        bookElement.innerHTML = `
      <a href="path/to/book-details.html">
        <div class="book-image">
          <img src="${book.image}" alt="Book Cover" class="book-cover">
        </div>
      </a>
      <a href="path/to/book-details.html" class="text-link">
        <span class="book-title">${book.title}</span>
      </a>
      <span class="book-author">${book.author}</span>
    `;
        bookContainer.appendChild(bookElement);
    }

    updateFooter();
    updatePaginationArrows();
}

function updateFooter() {
    const footerText = document.querySelector(".footer-text");
    footerText.textContent = `Page ${currentPage} of ${Math.ceil(books.length / booksPerPage)}`;
}

function updatePaginationArrows() {
    const leftArrow = document.querySelector(".footer-left-icon");
    const rightArrow = document.querySelector(".footer-right-icon");
    const totalPages = Math.ceil(books.length / booksPerPage);

    if (currentPage === 1) {
        leftArrow.style.color = "#8A8A8A";
        rightArrow.style.color = "#5D1B21";
        leftArrow.style.cursor = "default";
        rightArrow.style.cursor = "pointer";
    } else if (currentPage === totalPages) {
        leftArrow.style.color = "#5D1B21";
        rightArrow.style.color = "#8A8A8A";
        leftArrow.style.cursor = "pointer";
        rightArrow.style.cursor = "default";
    } else {
        leftArrow.style.color = "#5D1B21";
        rightArrow.style.color = "#5D1B21";
        leftArrow.style.cursor = "pointer";
        rightArrow.style.cursor = "pointer";
    }
}

document.querySelector(".footer-left-icon").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderBooks();
    }
});

document.querySelector(".footer-right-icon").addEventListener("click", () => {
    if (currentPage * booksPerPage < books.length) {
        currentPage++;
        renderBooks();
    }
});

// Initial render
renderBooks();