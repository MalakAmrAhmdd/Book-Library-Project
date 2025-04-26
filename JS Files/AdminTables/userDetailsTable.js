document.addEventListener("DOMContentLoaded", () => {
    // Borrowed Books Table in User Details
    const borrowedBooksTableBody = document.querySelector(".Borrowed-Books + .Books table tbody");
    const borrowedBooksTableInfo = document.querySelector(".Books + .table-footer .table-info");
    const borrowedPrevButton = document.getElementById("prevButton");
    const borrowedNextButton = document.getElementById("nextButton");

    let borrowedBooks = [];
    let borrowedCurrentPage = 1;
    const rowsPerPage = 5;

    fetch("Books/books.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load borrowed books data.");
            }
            return response.json();
        })
        .then(data => {
            borrowedBooks = data;
            renderBorrowedBooksTable();
        })
        .catch(error => {
            console.error("Error loading borrowed books:", error);
        });

    function renderBorrowedBooksTable() {
        borrowedBooksTableBody.innerHTML = ""; // Clear existing rows

        const startIndex = (borrowedCurrentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, borrowedBooks.length);

        for (let i = startIndex; i < endIndex; i++) {
            const book = borrowedBooks[i];
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${book.id || "N/A"}</td>
                <td>${book.title || "Untitled"}</td>
                <td>${book.category || "Unknown"}</td>
                <td>${book.date || "--"}</td>
            `;
            borrowedBooksTableBody.appendChild(row);
        }

        borrowedBooksTableInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${borrowedBooks.length}`;
        borrowedPrevButton.disabled = borrowedCurrentPage === 1;
        borrowedNextButton.disabled = borrowedCurrentPage === Math.ceil(borrowedBooks.length / rowsPerPage);
    }

    borrowedPrevButton.addEventListener("click", () => {
        if (borrowedCurrentPage > 1) {
            borrowedCurrentPage--;
            renderBorrowedBooksTable();
        }
    });

    borrowedNextButton.addEventListener("click", () => {
        if (borrowedCurrentPage < Math.ceil(borrowedBooks.length / rowsPerPage)) {
            borrowedCurrentPage++;
            renderBorrowedBooksTable();
        }
    });

    // Returned Books Table in User Details
    const returnedBooksTableBody = document.querySelector(".Returned-Books + .Returned table tbody");
    const returnedBooksTableInfo = document.querySelector(".Returned + .table-footer .table-info");
    const returnedPrevButton = document.getElementById("returnedPrevButton");
    const returnedNextButton = document.getElementById("returnedNextButton");

    let returnedBooks = [];
    let returnedCurrentPage = 1;

    fetch("Books/books.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load returned books data.");
            }
            return response.json();
        })
        .then(data => {
            returnedBooks = data;
            renderReturnedBooksTable();
        })
        .catch(error => {
            console.error("Error loading returned books:", error);
        });

    function renderReturnedBooksTable() {
        returnedBooksTableBody.innerHTML = ""; // Clear existing rows

        const startIndex = (returnedCurrentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, returnedBooks.length);

        for (let i = startIndex; i < endIndex; i++) {
            const book = returnedBooks[i];
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${book.id || "N/A"}</td>
                <td>${book.title || "Untitled"}</td>
                <td>${book.category || "Unknown"}</td>
                <td>${book.date || "--"}</td>
            `;
            returnedBooksTableBody.appendChild(row);
        }

        returnedBooksTableInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${returnedBooks.length}`;
        returnedPrevButton.disabled = returnedCurrentPage === 1;
        returnedNextButton.disabled = returnedCurrentPage === Math.ceil(returnedBooks.length / rowsPerPage);
    }

    returnedPrevButton.addEventListener("click", () => {
        if (returnedCurrentPage > 1) {
            returnedCurrentPage--;
            renderReturnedBooksTable();
        }
    });

    returnedNextButton.addEventListener("click", () => {
        if (returnedCurrentPage < Math.ceil(returnedBooks.length / rowsPerPage)) {
            returnedCurrentPage++;
            renderReturnedBooksTable();
        }
    });
});