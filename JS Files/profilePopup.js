document.addEventListener("DOMContentLoaded", function () {
    
    const profilePopupToggle = document.getElementById("profilePopup");
    const modalProfile = document.querySelector(".modal-profile");
    
    const closeProfileBtn = document.getElementById("close-profile");

    const profileRow = document.querySelector(".profile");

 
    if (profileRow) {
        profileRow.addEventListener("click", function () {
            profilePopupToggle.checked = true; // Toggle the checkbox
            modalProfile.style.display = "flex"; // Show modal
            
           
        });
    }

    
    if (closeProfileBtn) {
        closeProfileBtn.addEventListener("click", function () {
            profilePopupToggle.checked = false; 
            modalProfile.style.display = "none";
        });
    }
});
