document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-container");
    const searchResults = document.getElementById("search-results");

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        if (query) {
            fetch(`/search?query=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    searchResults.innerHTML = "";
                    data.results.forEach(result => {
                        const resultItem = document.createElement("div");
                        resultItem.classList.add("result-item");
                        resultItem.textContent = result.name; // Adjust based on your data structure
                        searchResults.appendChild(resultItem);
                    });
                })
                .catch(error => console.error("Error fetching search results:", error));
        } else {
            searchResults.innerHTML = "";
        }
    });
});
// This code listens for input events on the search input field and fetches search results from the server.