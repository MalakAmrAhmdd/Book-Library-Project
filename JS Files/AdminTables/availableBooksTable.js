document.addEventListener("DOMContentLoaded", () => {
    const booksTableBody = document.querySelector(".books-table tbody");
    const booksTableInfo = document.querySelector(".table-footer .table-info");
    const prevButton = document.getElementById("booksPrevButton");
    const nextButton = document.getElementById("booksNextButton");

    let books = [];
    let currentPage = 1;
    const rowsPerPage = 10;

    function loadBooks() {
        const addedBooks = JSON.parse(localStorage.getItem("books")) || [];
    
        if (addedBooks.length > 0) {
            books = addedBooks;
            setTimeout(() => renderTable(), 0);
        } else {
            fetch("books.json")
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to load static books data");
                    }
                    return response.json();
                })
                .then((staticBooks) => {
                    books = staticBooks;
                    renderTable();
                })
                .catch((error) => {
                    console.error(error);
                    booksTableBody.innerHTML = `<tr><td colspan="4">Error loading books</td></tr>`;
                    booksTableInfo.textContent = "Error loading books";
                });
        }
    }

    function renderTable() {
        booksTableBody.innerHTML = "";

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, books.length);

        for (let i = startIndex; i < endIndex; i++) {
            const book = books[i];
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${book.id || "N/A"}</td>
                <td>${book.title || "Untitled"}</td>
                <td>${book.category || "Unknown"}</td>
                <td>
                    <div class="action-icons">
                        <label for="editPopup" class="edit-icon"><i class="fa-solid fa-pen"></i></label>
                        <label for="deletePopup" class="delete-icon"><i class="fa-solid fa-trash"></i></label>
                    </div>
                </td>
            `;
            booksTableBody.appendChild(row);
        }

        booksTableInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${books.length}`;
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

    loadBooks(); 
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

