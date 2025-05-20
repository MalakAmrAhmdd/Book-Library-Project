document.addEventListener("DOMContentLoaded", function () {
  const profilePopupCheckbox = document.getElementById("profilePopup");
  const modalProfile = document.querySelector(".modal-profile");
  const usernameBox = document.getElementById("username");
  const borrowedCount = document.getElementById("borrowed-count");
  const closeProfileBtn = document.getElementById("close-profile");

  function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  const loggedInUsername = getCookie("username");

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
    url: "http://127.0.0.1:8000/dashboard/usersTable/",
    method: "GET",
    contentType: "application/json",
    headers: {
      "X-CSRFToken": csrf
    },
    xhrFields: {
      withCredentials: true
    },
    success: function (data) {
      const users = Array.isArray(data) ? data : Object.values(data);
      const userProfile = users.find(profile => profile.username === loggedInUsername);
      if (userProfile) {
        usernameBox.textContent = userProfile.username;

        $.ajax({
          url: 'http://127.0.0.1:8000/dashboard/userBorrowedBooks/',
          method: 'POST',
          contentType: 'application/json',
          headers: {
            "X-CSRFToken": csrf
          },
          xhrFields: {
            withCredentials: true
          },
          data: JSON.stringify({ user_id: userProfile.id }),
          success: function (data) {
            borrowedCount.textContent = data.count !== undefined ? data.count : "0";
          },
          error: function () {
            borrowedCount.textContent = "Error";
          }
        });

      } else {
        usernameBox.textContent = "Guest";
        borrowedCount.textContent = "0";
      }
    },
    error: function (xhr) {
      usernameBox.textContent = "Guest";
      borrowedCount.textContent = "0";
      console.error("Error loading profile:", xhr);
    }
  });

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

document.addEventListener("borrowingsUpdated", function () {
  let csrf = null;
  let cookies = document.cookie.split(";");
  cookies.forEach(element => {
    let key = element.split("=")[0].trim();
    let value = element.split("=")[1];
    if (key === "csrftoken") {
      csrf = value;
    }
  });

  function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  const loggedInUsername = getCookie("username");
  const usernameBox = document.getElementById("username");
  const borrowedCount = document.getElementById("borrowed-count");

  $.ajax({
    url: "http://127.0.0.1:8000/dashboard/usersTable/",
    method: "GET",
    contentType: "application/json",
    headers: {
      "X-CSRFToken": csrf
    },
    xhrFields: {
      withCredentials: true
    },
    success: function (data) {
      const users = Array.isArray(data) ? data : Object.values(data);
      const userProfile = users.find(profile => profile.username === loggedInUsername);
      if (userProfile) {
        usernameBox.textContent = userProfile.username;
        $.ajax({
          url: 'http://127.0.0.1:8000/dashboard/userBorrowedBooks/',
          method: 'POST',
          contentType: 'application/json',
          headers: {
            "X-CSRFToken": csrf
          },
          xhrFields: {
            withCredentials: true
          },
          data: JSON.stringify({ user_id: userProfile.id }),
          success: function (data) {
            borrowedCount.textContent = data.count !== undefined ? data.count : "0";
          },
          error: function () {
            borrowedCount.textContent = "Error";
          }
        });
      } else {
        usernameBox.textContent = "Guest";
        borrowedCount.textContent = "0";
      }
    },
    error: function (xhr) {
      usernameBox.textContent = "Guest";
      borrowedCount.textContent = "0";
      console.error("Error loading profile:", xhr);
    }
  });
});