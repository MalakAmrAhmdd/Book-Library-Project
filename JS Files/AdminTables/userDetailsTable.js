document.addEventListener("DOMContentLoaded", () => {

    const borrowedBooksTableBody = document.querySelector(".Borrowed-Books + .Books table tbody");
    const borrowedBooksTableInfo = document.querySelector(".Books + .table-footer .table-info");
    const borrowedPrevButton = document.getElementById("prevButton");
    const borrowedNextButton = document.getElementById("nextButton");

    let borrowedBooks = [];
    let borrowedCurrentPage = 1;
    const rowsPerPage = 5;

    // Get user_id from URL
    function getUserIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function loadBorrowedBooks() {
        const userId = getUserIdFromUrl();
        if (!userId) {
            borrowedBooksTableBody.innerHTML = `<tr><td colspan="4">User ID not found in URL.</td></tr>`;
            borrowedBooksTableInfo.textContent = "User ID not found.";
            return;
        }

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
            url: 'http://127.0.0.1:8000/dashboard/userBorrowedBooks/',
            method: 'POST',
            contentType: 'application/json',
            headers: {
                "X-CSRFToken": csrf
            },
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify({ user_id: userId }),
            success: function (data) {
                borrowedBooks = data.books || [];
                renderBorrowedBooksTable();
            },
            error: function (xhr) {
                let msg = "Failed to load borrowed books.";
                if (xhr.responseJSON && xhr.responseJSON.detail) {
                    msg = xhr.responseJSON.detail;
                }
                borrowedBooksTableBody.innerHTML = `<tr><td colspan="4">${msg}</td></tr>`;
                borrowedBooksTableInfo.textContent = msg;
                console.error("Error loading borrowed books:", xhr);
            }
        });
    }

    function renderBorrowedBooksTable() {
        borrowedBooksTableBody.innerHTML = "";

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

    loadBorrowedBooks();

    // ...existing code for returned books...
});