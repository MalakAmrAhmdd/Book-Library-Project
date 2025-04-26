document.addEventListener('DOMContentLoaded', () => {
    const sidebarRows = document.querySelectorAll('.sidebar-row');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    // Retrieve the active link from localStorage
    const activePath = localStorage.getItem('activeSidebarLink');

    // Apply the active class to the saved link
    if (activePath) {
        sidebarLinks.forEach(link => {
            if (link.getAttribute('href') === activePath) {
                link.querySelector('.sidebar-row').classList.add('active');
            }
        });
    }

    // Add click event listeners to sidebar rows
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove 'active' class from all rows
            sidebarRows.forEach(row => row.classList.remove('active'));

            // Add 'active' class to the clicked row
            link.querySelector('.sidebar-row').classList.add('active');

            // Save the active link to localStorage
            localStorage.setItem('activeSidebarLink', link.getAttribute('href'));
        });
    });
});