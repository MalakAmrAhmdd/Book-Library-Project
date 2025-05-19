document.addEventListener('DOMContentLoaded', () => {
    const sidebarRows = document.querySelectorAll('.sidebar-row');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

   
    const activePath = localStorage.getItem('activeSidebarLink');

    if (activePath) {
        sidebarLinks.forEach(link => {
            if (link.getAttribute('href') === activePath) {
                link.querySelector('.sidebar-row').classList.add('active');
            }
        });
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebarRows.forEach(row => row.classList.remove('active'));

            link.querySelector('.sidebar-row').classList.add('active');

            localStorage.setItem('activeSidebarLink', link.getAttribute('href'));
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const logoutRow = document.getElementById('logout-row');
    if (logoutRow) {
        logoutRow.addEventListener('click', function () {
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
                url: 'http://127.0.0.1:8000/users/logout/',
                method: 'POST',
                headers: {
                    "X-CSRFToken": csrf
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function () {
                    window.location.href = "Sign_in.html";
                },
                error: function () {
                    alert("Logout failed.");
                }
            });
        });
    }
});

// comment