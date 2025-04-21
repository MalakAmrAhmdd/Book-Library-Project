// deletePopup
document.addEventListener('DOMContentLoaded', function () {
    let activeRow = null;
  
    // use the delete toggle checkbox (by id)  w el modal element el fi el html el ba3do
    const deletePopupToggle = document.getElementById('deletePopup');

    const deleteModal = deletePopupToggle.nextElementSibling;
  
    function showDeleteModal() {
        deletePopupToggle.checked = true;
    }
    function hideDeleteModal() {
        deletePopupToggle.checked = false;
    }
  
    // for every delete icon on the page
    const deleteIcons = document.querySelectorAll('.delete-icon');
    deleteIcons.forEach((icon) => {
      icon.addEventListener('click', function (event) {
        event.preventDefault();
        // find the closest table row and store it for deletion
        const row = event.target.closest('tr');
        if (row) {
          activeRow = row;
        }
        showDeleteModal();
      });
    });
  

    if (deleteModal) {
      const yesBtn = deleteModal.querySelector('.yes-btn');
      const noBtn = deleteModal.querySelector('.no-btn');
  
      if (yesBtn) {
        yesBtn.addEventListener('click', function (event) {
          event.preventDefault();
          // remove the active row from the table
          if (activeRow) {
            activeRow.remove();
          }
          activeRow = null;
          hideDeleteModal();
        });
      }
  
      if (noBtn) {
        noBtn.addEventListener('click', function (event) {
          event.preventDefault();
          activeRow = null;
          hideDeleteModal();
        });
      }
    }
  });


  //edit popup
document.addEventListener('DOMContentLoaded', function () {
    let activeRow = null;
    // use the edit toggle checkbox (by id)  w el modal element el fi el html el ba3do
    const editPopupToggle = document.getElementById('editPopup');
    const editModal = editPopupToggle.nextElementSibling;
  
    // for every "edit-icon" on the page
    const editIcons = document.querySelectorAll('.edit-icon');
    editIcons.forEach((icon) => {
      icon.addEventListener('click', function (event) {
        event.preventDefault();
        const row = event.target.closest('tr');
        if (row) {
          activeRow = row;
        }
  
        // pre-fill the modal's input fields with data from the selected row
        const bookInput = document.getElementById('book-name');
        //const authorInput = document.getElementById('author-name');
        //const descriptionInput = document.getElementById('description');
        const categorySelect = document.getElementById('category');
        //const langSelect = document.getElementById('lang');
  
        if (activeRow) {
          if (bookInput) {
            bookInput.value = activeRow.children[1].textContent.trim();
          }
          // For the category, try to set the select value to match the current cell.
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
              categorySelect.selectedIndex = 0; // Default to the first option if not found
            }
         }
          // pre-fill author, description, or lang el mafrod 3ala 7asab el ktab 3la 7asab hya mt5zna fen ma3rf4
          //if (authorInput) authorInput.value = ''; 
          //if (descriptionInput) descriptionInput.value = '';
          //if (langSelect) langSelect.value = '';
        }
  
        // Show the edit modal
        if (editPopupToggle) {
          editPopupToggle.checked = true;
        }
      });
    });
  
    if (editModal) {
      const saveBtn = editModal.querySelector('.save-btn');
      const cancelBtn = editModal.querySelector('.close-btn');
  
      if (saveBtn) {
        saveBtn.addEventListener('click', function (event) {
          event.preventDefault();
          if (activeRow) {
            // update the row's data with the values from the modal.
            const bookInput = document.getElementById('book-name');
            const categorySelect = document.getElementById('category');
  
            if (bookInput) {
              activeRow.children[1].textContent = bookInput.value;
            }
            if (categorySelect) {
              activeRow.children[2].textContent = categorySelect.options[categorySelect.selectedIndex].text;
            }
            // law ha save author, description, lang
          }
          // Close the modal.
          if (editPopupToggle) {
            editPopupToggle.checked = false;
          }
          activeRow = null;
        });
      }
  
      if (cancelBtn) {
        cancelBtn.addEventListener('click', function (event) {
          event.preventDefault();
          if (editPopupToggle) {
            editPopupToggle.checked = false;
          }
          activeRow = null;
        });
      }
    }
  });
  


  