document.addEventListener("DOMContentLoaded", function () {
    let activeRow = null;

    // Get popup elements
    const modalBook = document.querySelector(".modal-Book");
    const popupImg = document.querySelector(".pop-up-img");
    const popupTitle = document.querySelector(".pop-up-book-title");
    const popupAuthor = document.querySelector(".pop-up-author");
    const popupBorrows = document.querySelector(".borrows");
    const popupDescription = document.querySelector(".pop-up-text");
    const popupStatus = document.querySelector(".status-btn");
    const borrowBtn = document.querySelector(".borrow-btn");
    const favButton = document.querySelector(".favorite-button");

    // Get all preview buttons
    const previewButtons = document.querySelectorAll(".preview-button");

    // Handle Preview Button Clicks
    previewButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            activeRow = button.closest(".table-row");

            // Extract book details from the active row
            const bookCover = activeRow.querySelector(".book-cover").src;
            const bookTitle = activeRow.querySelector(".book-title").textContent.trim();
            const bookAuthor = activeRow.querySelector(".book-author").textContent.trim();
            const borrowCount = localStorage.getItem(`borrows_${bookTitle}`) || "0 Borrows";
            const description = localStorage.getItem(`description_${bookTitle}`) || "No description available.";

            // Populate modal with data
            popupImg.src = bookCover;
            popupTitle.textContent = bookTitle;
            popupAuthor.textContent = bookAuthor;
            popupBorrows.textContent = borrowCount;
            popupDescription.textContent = description;

            // Retrieve saved borrow status
            const storedStatus = localStorage.getItem(`status_${bookTitle}`) || "In-Shelf";
            const storedBorrowText = storedStatus === "Borrowed" ? "Give Back" : "Borrow";

            popupStatus.textContent = storedStatus;
            popupStatus.style.backgroundColor = storedStatus === "Borrowed" ? "#735E57" : "#214539";
            borrowBtn.textContent = storedBorrowText;
            borrowBtn.style.backgroundColor = storedBorrowText === "Give Back" ? "#214539" : "#5D1B21";

            // Show modal
            modalBook.style.display = "flex";
        });
    });

    // Handle Borrow Button Click
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

        // Close modal ba3d 7abet seconds
        setTimeout(() => {
            modalBook.style.display = "none";
        }, 400);
    });

    // Handle Favorite Button Click
    /*
    favButton.addEventListener("click", function () {
        const isFavorite = favButton.classList.contains("favorite-button");

        if (isFavorite) {
            favButton.classList.remove("favorite-button");
            favButton.classList.add("notfav-button");
            favButton.innerHTML = '<i class="far fa-heart"></i>';
            localStorage.setItem(`favorite_${popupTitle.textContent}`, "false");
        } else {
            favButton.classList.remove("notfav-button");
            favButton.classList.add("favorite-button");
            favButton.innerHTML = '<i class="fas fa-heart"></i>';
            localStorage.setItem(`favorite_${popupTitle.textContent}`, "true");
        }
    });
    */
    // Close Modal when clicking outside
    modalBook.addEventListener("click", function (event) {
        if (event.target === modalBook) {
            modalBook.style.display = "none";
        }
    });
});
