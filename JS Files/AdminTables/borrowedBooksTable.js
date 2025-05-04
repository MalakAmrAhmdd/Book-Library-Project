document.addEventListener("DOMContentLoaded", () => {
    const borrowedTableBody = document.querySelector(".borrowed-books-table tbody");
    const borrowedTableInfo = document.querySelector(".table-footer .table-info");
    const prevButton = document.getElementById("borrowedPrevButton");
    const nextButton = document.getElementById("borrowedNextButton");

    let books = JSON.parse(localStorage.getItem("books")) || [];
    let currentPage = 1;
    const rowsPerPage = 8;

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

    renderTable();
});

function updatePaginationArrows(currentPage, totalPages, prevButton, nextButton) {
    const leftButton = document.querySelector(".toggle-left-button");
    const rightButton = document.querySelector(".toggle-right-button");

    if (totalPages === 1) {
        prevButton.style.color = "#8A8A8A";
        nextButton.style.color = "#8A8A8A";
        prevButton.style.cursor = "default";
        nextButton.style.cursor = "default";
        leftButton.style.background = "#f9f9f9";
        rightButton.style.background = "#f9f9f9";
    } else if (currentPage === 1) {
        prevButton.style.color = "#8A8A8A";
        nextButton.style.color = "#8c6051";
        prevButton.style.cursor = "default";
        nextButton.style.cursor = "pointer";
        leftButton.style.background = "#f9f9f9";
        rightButton.style.background = "#fff";
    } else if (currentPage === totalPages) {
        prevButton.style.color = "#8c6051";
        nextButton.style.color = "#8A8A8A";
        prevButton.style.cursor = "pointer";
        nextButton.style.cursor = "default";
        leftButton.style.background = "#fff";
        rightButton.style.background = "#f9f9f9";
    } else {
        prevButton.style.color = "#8c6051";
        nextButton.style.color = "#8c6051";
        prevButton.style.cursor = "pointer";
        nextButton.style.cursor = "pointer";
        leftButton.style.background = "#fff";
        rightButton.style.background = "#fff";
    }
}