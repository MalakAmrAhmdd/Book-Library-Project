document.addEventListener("DOMContentLoaded", () => {
    const booksTableBody = document.querySelector(".books-table tbody");
    const booksTableInfo = document.querySelector(".books-table .table-info");
    const prevButton = document.getElementById("booksPrevButton");
    const nextButton = document.getElementById("booksNextButton");

    let books = [];
    let currentPage = 1;
    const rowsPerPage = 10;

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
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(books.length / rowsPerPage)) {
            currentPage++;
            renderTable();
        }
    });
});