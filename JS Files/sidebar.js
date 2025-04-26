document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".nav-rows a");

    let currentPage = window.location.pathname.split("/").pop();
    console.log("Current page:", currentPage);

    links.forEach(link => {
        const linkHref = link.getAttribute("href").toLowerCase();
        if (linkHref === currentPage) {
            link.classList.add("active");
        }
    });
});
