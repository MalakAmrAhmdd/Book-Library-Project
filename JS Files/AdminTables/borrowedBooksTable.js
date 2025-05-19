document.addEventListener("DOMContentLoaded", () => {
    const borrowedTableBody = document.querySelector(".borrowed-books-table tbody");
    const borrowedTableInfo = document.querySelector(".table-footer .table-info");
    const prevButton = document.getElementById("borrowedPrevButton");
    const nextButton = document.getElementById("borrowedNextButton");

    let books = [];
    let currentPage = 1;
    const rowsPerPage = 8;

    function loadBorrowedBooks() {
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
            url: 'http://127.0.0.1:8000/dashboard/borrowedBooksTable/',
            method: 'GET',
            contentType: 'application/json',
            headers: {
                "X-CSRFToken": csrf
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                books = Array.isArray(data) ? data : Object.values(data);
                renderTable();
            },
            error: function (xhr) {
                let msg = "Failed to load borrowed books.";
                if (xhr.responseJSON && xhr.responseJSON.detail) {
                    msg = xhr.responseJSON.detail;
                }
                borrowedTableBody.innerHTML = `<tr><td colspan="5">${msg}</td></tr>`;
                borrowedTableInfo.textContent = msg;
                console.error("Error loading borrowed books:", xhr);
            }
        });
    }

    function renderTable() {
        borrowedTableBody.innerHTML = "";

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, books.length);

        for (let i = startIndex; i < endIndex; i++) {
            const book = books[i];
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${book.id || "N/A"}</td>
                <td>${book.title || "Untitled"}</td>
                <td>${book.category || "Unknown"}</td>
                <td>${book.borrow_date || book.date || "--"}</td>
                <td>${book.user?.username || book.user || "--"}</td>
            `;
            borrowedTableBody.appendChild(row);
        }

        borrowedTableInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${books.length}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === Math.ceil(books.length / rowsPerPage);
    }

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
            updatePaginationArrows(currentPage, Math.ceil(books.length / rowsPerPage), prevButton, nextButton);
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(books.length / rowsPerPage)) {
            currentPage++;
            renderTable();
            updatePaginationArrows(currentPage, Math.ceil(books.length / rowsPerPage), prevButton, nextButton);
        }
    });

    loadBorrowedBooks();
});