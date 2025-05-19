document.addEventListener("DOMContentLoaded", function () {
  let activeRow = null;

  const deletePopupToggle = document.getElementById("deletePopup");
  const deleteModal = deletePopupToggle ? deletePopupToggle.nextElementSibling : null;

  function showDeleteModal() {
    if (deletePopupToggle) {
      deletePopupToggle.checked = true;
    }
  }
  function hideDeleteModal() {
    if (deletePopupToggle) {
      deletePopupToggle.checked = false;
    }
  }

  const booksTableBody = document.querySelector(".books-table tbody");
  if (booksTableBody) {
    booksTableBody.addEventListener("click", function (e) {
      const deleteIcon = e.target.closest(".delete-icon");
      if (deleteIcon) {
        e.preventDefault();
        activeRow = deleteIcon.closest("tr");
        showDeleteModal();
        return;
      }
      const editIcon = e.target.closest(".edit-icon");
      if (editIcon) {
        e.preventDefault();
        activeRow = editIcon.closest("tr");
        openEditPopup();
      }
    });
  }

  if (deleteModal) {
    const yesBtn = deleteModal.querySelector(".yes-btn");
    const noBtn = deleteModal.querySelector(".no-btn");

    if (yesBtn) {
      yesBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (activeRow) {
          const bookId = activeRow.getAttribute("data-book-id");
          if (bookId) {
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
              url: "http://127.0.0.1:8000/books/deletebook/",
              method: "DELETE",
              contentType: "application/json",
              headers: {
                "X-CSRFToken": csrf
              },
              xhrFields: {
                withCredentials: true
              },
              data: JSON.stringify({ book_id: bookId }),
              success: function (data) {
                if (data.message) {
                  activeRow.remove();
                } else {
                  alert(data.error || "Failed to delete book.");
                }
                activeRow = null;
                hideDeleteModal();
              },
              error: function () {
                alert("Error deleting book.");
                activeRow = null;
                hideDeleteModal();
              }
            });
          }
        } else {
          activeRow = null;
          hideDeleteModal();
        }
      });
    }
    if (noBtn) {
      noBtn.addEventListener("click", function (e) {
        e.preventDefault();
        activeRow = null;
        hideDeleteModal();
      });
    }
  }

  const editPopupToggle = document.getElementById("editPopup");
  const editModal = editPopupToggle ? editPopupToggle.nextElementSibling : null;

  function openEditPopup() {
    const bookInput = document.getElementById("book-name");
    const categorySelect = document.getElementById("category");

    if (activeRow) {
      if (bookInput) {
        bookInput.value = activeRow.children[1].textContent.trim();
      }
      if (categorySelect && activeRow.children[2]) {
        let currentCategory = activeRow.children[2].textContent.trim();
        let found = false;
        for (let i = 0; i < categorySelect.options.length; i++) {
          if (categorySelect.options[i].text === currentCategory) {
            categorySelect.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found) {
          categorySelect.selectedIndex = 0;
        }
      }
    }

    if (editPopupToggle) {
      editPopupToggle.checked = true;
    }
  }

  if (editModal) {
    const saveBtn = editModal.querySelector(".save-btn");
    const cancelBtn = editModal.querySelector(".close-btn");

    if (saveBtn) {
      saveBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (activeRow) {
          const bookInput = document.getElementById("book-name");
          const authorInput = document.getElementById("author-name");
          const descriptionInput = document.getElementById("description");
          const categorySelect = document.getElementById("category");
          const langSelect = document.getElementById("lang");
          const bookId = activeRow.getAttribute("data-book-id");

          if (bookId) {
            let updateData = { book_id: bookId };

            if (bookInput && bookInput.value.trim() !== "") {
              updateData.title = bookInput.value.trim();
            }
            if (authorInput && authorInput.value.trim() !== "") {
              updateData.author = authorInput.value.trim();
            }
            if (descriptionInput && descriptionInput.value.trim() !== "") {
              updateData.description = descriptionInput.value.trim();
            }
            if (categorySelect && categorySelect.value !== "") {
              updateData.category = categorySelect.value;
            }
            if (langSelect && langSelect.value !== "") {
              updateData.language = langSelect.value;
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
              url: 'http://127.0.0.1:8000/books/editbook/',
              method: 'PUT',
              contentType: 'application/json',
              data: JSON.stringify(updateData),
              headers: {
                "X-CSRFToken": csrf
              },
              xhrFields: {
                withCredentials: true
              },
              success: function (data) {
                if (data.message) {
                  if (updateData.title) activeRow.children[1].textContent = updateData.title;
                  if (updateData.category) {
                    const selectedOption = categorySelect.querySelector(`option[value="${updateData.category}"]`);
                    activeRow.children[2].textContent = selectedOption ? selectedOption.textContent : updateData.category;
                  }
                } else {
                  alert(data.error || "Failed to update book.");
                }
                if (editPopupToggle) {
                  editPopupToggle.checked = false;
                }
                activeRow = null;
              },
              error: function () {
                alert("Error updating book.");
                if (editPopupToggle) {
                  editPopupToggle.checked = false;
                }
                activeRow = null;
              }
            });
          }
        }
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (editPopupToggle) {
          editPopupToggle.checked = false;
        }
        activeRow = null;
      });
    }
  }
});