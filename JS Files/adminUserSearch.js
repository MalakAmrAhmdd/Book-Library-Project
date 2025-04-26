// adminUserSearch.js

// Function to highlight the active page in the sidebar
function highlightActivePage() {
    // Get the current page's filename
    const currentPage = window.location.pathname.split('/').pop();

    // Select all sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    // Loop through each link and add the 'active' class to the matching link
    sidebarLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', highlightActivePage);