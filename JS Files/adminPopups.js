document.addEventListener("DOMContentLoaded", function () {
  let activeRow = null; //  row to be edited or deleted

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
          activeRow.remove(); // Remove the active row from the table.
        }
        activeRow = null;
        hideDeleteModal();
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
          const categorySelect = document.getElementById("category");

          if (bookInput) {
            
            activeRow.children[1].textContent = bookInput.value;
          }
          if (categorySelect) {
          
            activeRow.children[2].textContent = categorySelect.options[categorySelect.selectedIndex].text;
          }
        }
        if (editPopupToggle) {
          editPopupToggle.checked = false;
        }
        activeRow = null;
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

  


  