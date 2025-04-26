document.addEventListener('DOMContentLoaded', () => {
    const sidebarRows = document.querySelectorAll('.sidebar-row');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    // Retrieve the active link from localStorage
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

// comment