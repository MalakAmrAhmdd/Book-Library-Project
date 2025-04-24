document.addEventListener("DOMContentLoaded", function () {
    let activeRow = null;


    const modalBook = document.querySelector(".modal-Book");
    const popupImg = document.querySelector(".pop-up-img");
    const popupTitle = document.querySelector(".pop-up-book-title");
    const popupAuthor = document.querySelector(".pop-up-author");
    const popupBorrows = document.querySelector(".borrows");
    const popupDescription = document.querySelector(".pop-up-text");
    const popupStatus = document.querySelector(".status-btn");
    const borrowBtn = document.querySelector(".borrow-btn");
    const favButton = document.querySelector(".favorite-button");

    
    const previewButtons = document.querySelectorAll(".preview-button");


    previewButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            activeRow = button.closest(".table-row");

            
            const bookCover = activeRow.querySelector(".book-cover").src;
            const bookTitle = activeRow.querySelector(".book-title").textContent.trim();
            const bookAuthor = activeRow.querySelector(".book-author").textContent.trim();
            const borrowCount = localStorage.getItem(`borrows_${bookTitle}`) || "0 Borrows";
            const description = localStorage.getItem(`description_${bookTitle}`) || "No description available.";

            // 7atet el data gowa el modal
            popupImg.src = bookCover;
            popupTitle.textContent = bookTitle;
            popupAuthor.textContent = bookAuthor;
            popupBorrows.textContent = borrowCount;
            popupDescription.textContent = description;

            // retrieve saved borrow status 
            const storedStatus = localStorage.getItem(`status_${bookTitle}`) || "In-Shelf";
            const storedBorrowText = storedStatus === "Borrowed" ? "Give Back" : "Borrow";

            popupStatus.textContent = storedStatus;
            popupStatus.style.backgroundColor = storedStatus === "Borrowed" ? "#735E57" : "#214539";
            borrowBtn.textContent = storedBorrowText;
            borrowBtn.style.backgroundColor = storedBorrowText === "Give Back" ? "#214539" : "#5D1B21";

            
            modalBook.style.display = "flex";
        });
    });

    
    borrowBtn.addEventListener("click", function () {
        if (!activeRow) return;

        const currentStatus = popupStatus.textContent;
        if (currentStatus === "In-Shelf") {
            popupStatus.textContent = "Borrowed";
            popupStatus.style.backgroundColor = "#735E57";
            borrowBtn.textContent = "Give Back";
            borrowBtn.style.backgroundColor = "#214539";
            localStorage.setItem(`status_${popupTitle.textContent}`, "Borrowed");
        } else {
            popupStatus.textContent = "In-Shelf";
            popupStatus.style.backgroundColor = "#214539";
            borrowBtn.textContent = "Borrow";
            borrowBtn.style.backgroundColor = "#5D1B21";
            localStorage.setItem(`status_${popupTitle.textContent}`, "In-Shelf");
        }

        
        setTimeout(() => {
            modalBook.style.display = "none";
        }, 400);
    });

    modalBook.addEventListener("click", function (event) {
        if (event.target === modalBook) {
            modalBook.style.display = "none";
        }
    });
});
