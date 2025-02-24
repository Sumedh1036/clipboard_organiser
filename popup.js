document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("clipboardList");
    const search = document.getElementById("search");
    const tabs = document.querySelectorAll(".tab");

    let clipboardData = [];

    function loadClipboard(filterType = "all") {
        chrome.storage.local.get({ clipboardData: [] }, (data) => {
            clipboardData = data.clipboardData;
            displayClipboard(filterType);
        });
    }

    function displayClipboard(filterType) {
        list.innerHTML = "";

        clipboardData
            .filter(item => filterType === "all" || item.type === filterType)
            .forEach((item, index) => {
                let li = document.createElement("li");
                li.classList.add(item.type);

                if (item.type === "text") {
                    li.textContent = item.content;
                    li.addEventListener("click", () => copyToClipboard(item.content));
                } else if (item.type === "link") {
                    let a = document.createElement("a");
                    a.href = item.content;
                    a.textContent = item.content;
                    a.target = "_blank";
                    li.appendChild(a);
                } else if (item.type === "image") {
                    let img = document.createElement("img");
                    img.src = item.content;
                    img.alt = "Saved Image";
                    li.appendChild(img);
                }

                list.appendChild(li);
            });
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => alert("Copied!"));
    }

    search.addEventListener("input", () => {
        let term = search.value.toLowerCase();
        Array.from(list.children).forEach((li) => {
            li.style.display = li.textContent.toLowerCase().includes(term) ? "block" : "none";
        });
    });

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            loadClipboard(tab.dataset.type);
        });
    });

    loadClipboard();
});
