document.addEventListener("DOMContentLoaded", () => {
    const borrowedTableBody = document.querySelector(".borrowed-books-table tbody");
    const borrowedTableInfo = document.querySelector(".borrowed-books-table .table-info");
    const prevButton = document.getElementById("borrowedPrevButton");
    const nextButton = document.getElementById("borrowedNextButton");

    let books = [];
    let currentPage = 1;
    const rowsPerPage = 8;

    fetch("Books/books.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load books data.");
            }
            return response.json();
        })
        .then(data => {
            books = data;
            renderTable();
        })
        .catch(error => {
            console.error("Error loading books:", error);
        });

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
                <td>--</td> <!-- Placeholder for Date -->
                <td>--</td> <!-- Placeholder for Borrowed By -->
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
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(books.length / rowsPerPage)) {
            currentPage++;
            renderTable();
        }
    });
});