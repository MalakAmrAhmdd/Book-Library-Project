document.addEventListener("DOMContentLoaded", function () {
  let activeBook = null;

    const modalBook = document.querySelector(".modal-Book");
    const popupImg = document.querySelector(".pop-up-img");
    const popupTitle = document.querySelector(".pop-up-book-title");
    const popupAuthor = document.querySelector(".pop-up-author");
    const popupBorrows = document.querySelector(".borrows");
    const popupDescription = document.querySelector(".pop-up-text");
    const popupStatus = document.querySelector(".status-btn");
    const borrowBtn = document.querySelector(".borrow-btn");

    function fetchBookDetails(book) {

            console.log("Received book data:", book);
            activeBook = book;
            popupImg.src = book.image;
            console.log("Book image source:", book.image);
            popupTitle.textContent = book.title;
            popupAuthor.textContent = book.author;
            popupDescription.textContent = book.description;
            popupStatus.textContent = book.user ? "Borrowed" : "In-Shelf";
            // borrowBtn.textContent = book.user ? "Give Back" : "Borrow";
            if (book.user) {
                if (book.requested_by==book.user){
                    borrowBtn.textContent = "Give Back";
                    borrowBtn.style.cursor = "pointer";
                }
                else{
                    borrowBtn.textContent = "Borrowed";
                    borrowBtn.style.cursor = "not-allowed";
                }
            }
            else {
                borrowBtn.textContent = "Borrow";
                borrowBtn.style.cursor = "pointer";
            }

            modalBook.style.display = "flex";

    };

    document.addEventListener("click", function (event) {
        const previewButton = event.target.closest(".preview-button");
        const bookIcon = event.target.closest(".book-image");

        if (previewButton || bookIcon) {
            let bookTitle;
            if (previewButton) {
                const bookRow = previewButton.closest(".table-row");
                bookTitle = bookRow.querySelector(".book-title").textContent.trim();
            } else if (bookIcon) {
                const bookHolder = bookIcon.closest(".book-holder");
                bookTitle = bookHolder.querySelector(".book-title").textContent.trim();
            }

            $.ajax({
                url: "http://127.0.0.1:8000/books/getbook/",
                method: "GET",
                contentType: "application/json",
                xhrFields: { withCredentials: true },
                success: function (books) {
                    const book = books.find((b) => b.title === bookTitle);
                    if (book) {
                        fetchBookDetails(book);
                    }
                },
                error: function () {
                    console.error("Error fetching book list");
                },
            });
        }
    });

    borrowBtn.addEventListener("click", function () {
        if (!activeBook) return;

        let csrf = document.cookie.split(";").reduce((acc, element) => {
            let [key, value] = element.split("=");
            return key.trim() === "csrftoken" ? value : acc;
        }, null);

        let url = activeBook.user ? "http://127.0.0.1:8000/borrowings/return_book/" : "http://127.0.0.1:8000/borrowings/borrow_book/";
        let requestData = { book_id: activeBook.id };

        $.ajax({
            url: url,
            method: "POST",
            contentType: "application/json",
            headers: { "X-CSRFToken": csrf },
            data: JSON.stringify(requestData),
            xhrFields: { withCredentials: true },
            success: function () {
                fetchBookDetails(activeBook);
                document.dispatchEvent(new Event("borrowingsUpdated"));
                setTimeout(() => {
                    modalBook.style.display = "none";
                }, 400);
            },
            error: function () {
                console.error("Error updating book status");
            },
        });
    });

    modalBook.addEventListener("click", function (event) {
        if (event.target === modalBook) {
            modalBook.style.display = "none";
        }
    });

});
