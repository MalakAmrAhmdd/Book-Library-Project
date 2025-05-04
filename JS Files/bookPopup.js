document.addEventListener("DOMContentLoaded", function () {
  let activeBook = null;

  // Get popup elements
  const modalBook = document.querySelector(".modal-Book");
  const popupImg = document.querySelector(".pop-up-img");
  const popupTitle = document.querySelector(".pop-up-book-title");
  const popupAuthor = document.querySelector(".pop-up-author");
  const popupBorrows = document.querySelector(".borrows");
  const popupDescription = document.querySelector(".pop-up-text");
  const popupStatus = document.querySelector(".status-btn");
  const borrowBtn = document.querySelector(".borrow-btn");
  

  // Fetch books data from JSON
  fetch("Books/books.json")
      .then(response => response.json())
      .then(books => {
          document.addEventListener("click", function (event) {
              const previewButton = event.target.closest(".preview-button");
              const bookIcon = event.target.closest(".book-image");
              if (!previewButton && !bookIcon) return;

              event.preventDefault();
              let bookTitle;

              if (previewButton) {
                  const bookRow = previewButton.closest(".table-row");
                  bookTitle = bookRow.querySelector(".book-title").textContent.trim();
              } else if (bookIcon) {
                  const bookHolder = bookIcon.closest(".book-holder");
                  bookTitle = bookHolder.querySelector(".book-title").textContent.trim();
                  
              }

              activeBook = books.find(book => book.title === bookTitle);
              

              if (!activeBook) return;

              // Populate modal with book details
              popupImg.src = activeBook.image;
              popupTitle.textContent = activeBook.title;
              popupAuthor.textContent = activeBook.author;
              popupBorrows.textContent = localStorage.getItem(`borrows_${activeBook.title}`) || "0 Borrows";
              popupDescription.textContent = localStorage.getItem(`description_${activeBook.title}`) || activeBook.description;

              // Retrieve saved borrow status
              const storedStatus = localStorage.getItem(`status_${activeBook.title}`) || "In-Shelf";
              const storedBorrowText = storedStatus === "Borrowed" ? "Give Back" : "Borrow";

              popupStatus.textContent = storedStatus;
              popupStatus.style.backgroundColor = storedStatus === "Borrowed" ? "#735E57" : "#214539";
              borrowBtn.textContent = storedBorrowText;
              borrowBtn.style.backgroundColor = storedBorrowText === "Give Back" ? "#214539" : "#5D1B21";

              modalBook.style.display = "flex";
          });

          
          borrowBtn.addEventListener("click", function () {
              if (!activeBook) return;
      
              
              const currentStatus = localStorage.getItem(`status_${activeBook.title}`) || "In-Shelf";
              let newStatus = "";
              
              let borrowings = [];
              try {
                borrowings = JSON.parse(localStorage.getItem("borrowings") || "[]");
              } catch (e) {
                borrowings = [];
              }
      
              if (currentStatus === "In-Shelf") {
                newStatus = "Borrowed";
                // Add the book's ID to the borrowings array if not already included
                if (!borrowings.includes(activeBook.id)) {
                  borrowings.push(activeBook.id);
                }
              } else {
                newStatus = "In-Shelf";
                // Remove the book's ID from the borrowings array
                borrowings = borrowings.filter(id => id.toString() !== activeBook.id.toString());
              }
      
              // Save the new status and updated borrowings array into localStorage
              localStorage.setItem(`status_${activeBook.title}`, newStatus);
              localStorage.setItem("borrowings", JSON.stringify(borrowings));
      
              
              popupStatus.textContent = newStatus;
              popupStatus.style.backgroundColor = newStatus === "Borrowed" ? "#735E57" : "#214539";
              const newBtnText = newStatus === "Borrowed" ? "Give Back" : "Borrow";
              borrowBtn.textContent = newBtnText;
              borrowBtn.style.backgroundColor = newBtnText === "Give Back" ? "#214539" : "#5D1B21";
      
              

              document.dispatchEvent(new Event("borrowingsUpdated"));
              setTimeout(() => {
                modalBook.style.display = "none";
              }, 400);
            });


          
          modalBook.addEventListener("click", function (event) {
              if (event.target === modalBook) {
                  modalBook.style.display = "none";
              }
          });
      })
      .catch(error => console.error("Error loading book data:", error));
});