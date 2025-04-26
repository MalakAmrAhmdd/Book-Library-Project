document.addEventListener("DOMContentLoaded", function () {
    const profilePopupCheckbox = document.getElementById("profilePopup");
    const modalProfile = document.querySelector(".modal-profile");
    const usernameBox = document.getElementById("username");
    const borrowedCount = document.getElementById("borrowed-count");
    const returnedCount = document.getElementById("returned-count");
    const closeProfileBtn = document.getElementById("close-profile");
  
    // for testing 
    const loggedInUsername = "hazem-user";
  
    // Fetch user data from users.json
    fetch("users.json")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        //  obtain array of the object keys
        const profiles = Object.values(data);
        const userProfile = profiles.find(profile => profile.username === loggedInUsername);
        if (userProfile) {
          usernameBox.textContent = userProfile.username;
          borrowedCount.textContent = userProfile.numOfBorrowedBooks;
          returnedCount.textContent = userProfile.numOfReturnedBooks;
        } else {
          
          usernameBox.textContent = "Guest";
          borrowedCount.textContent = "0";
          returnedCount.textContent = "0";
        }
      })
      .catch(error => console.error("Error loading profile:", error));
  
    const profileIcon = document.querySelector(".profile");
    if (profileIcon) {
      profileIcon.addEventListener("click", function () {
        profilePopupCheckbox.checked = true;
        modalProfile.style.display = "flex";
      });
    }
  
    closeProfileBtn.addEventListener("click", function () {
      profilePopupCheckbox.checked = false;
      modalProfile.style.display = "none";
    });
  });
