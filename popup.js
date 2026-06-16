document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("clipboardList");
    const search = document.getElementById("search");
    const tabs = document.querySelectorAll(".tab");

    let clipboardData = [];
    let currentFilterType = "all";

    function loadClipboard(filterType = "all") {
        chrome.storage.local.get({ clipboardData: [] }, (data) => {
            clipboardData = data.clipboardData;
            currentFilterType = filterType;
            displayClipboard(filterType);
        });
    }

    function displayClipboard(filterType) {
        list.innerHTML = "";

        const filteredData = clipboardData.filter(
            item => filterType === "all" || item.type === filterType
        );

        if (filteredData.length === 0) {
            list.innerHTML = "<li class='empty'>No items yet</li>";
            return;
        }

        filteredData.forEach((item, index) => {
            let li = document.createElement("li");
            li.classList.add(item.type);

            let contentDiv = document.createElement("div");
            contentDiv.classList.add("content");

            if (item.type === "text") {
                contentDiv.textContent = item.content;
                contentDiv.addEventListener("click", () => copyToClipboard(item.content, "Text"));
                contentDiv.style.cursor = "pointer";
            } else if (item.type === "link") {
                let a = document.createElement("a");
                a.href = item.content;
                a.textContent = item.content;
                a.target = "_blank";
                contentDiv.appendChild(a);
                let copyBtn = document.createElement("button");
                copyBtn.classList.add("copy-btn");
                copyBtn.textContent = "Copy URL";
                copyBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    copyToClipboard(item.content, "Link");
                });
                contentDiv.appendChild(copyBtn);
            } else if (item.type === "image") {
                let img = document.createElement("img");
                img.src = item.content;
                img.alt = "Saved Image";
                contentDiv.appendChild(img);
                let copyBtn = document.createElement("button");
                copyBtn.classList.add("copy-btn");
                copyBtn.textContent = "Copy URL";
                copyBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    copyToClipboard(item.content, "Image URL");
                });
                contentDiv.appendChild(copyBtn);
            }

            li.appendChild(contentDiv);

            let deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            deleteBtn.textContent = "✕";
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                deleteItem(index);
            });
            li.appendChild(deleteBtn);

            list.appendChild(li);
        });
    }

    function copyToClipboard(text, type) {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert(`${type} copied to clipboard!`);
            })
            .catch((err) => {
                console.error("Failed to copy:", err);
                alert("Failed to copy. Please try again.");
            });
    }

    function deleteItem(index) {
        const itemToDelete = clipboardData[index];
        clipboardData.splice(index, 1);
        chrome.storage.local.set({ clipboardData }, () => {
            displayClipboard(currentFilterType);
        });
    }

    search.addEventListener("input", () => {
        let term = search.value.toLowerCase();
        const filtered = clipboardData.filter(item => {
            let searchableText = "";
            if (item.type === "text") {
                searchableText = item.content.toLowerCase();
            } else if (item.type === "link") {
                searchableText = item.content.toLowerCase();
            } else if (item.type === "image") {
                searchableText = item.content.toLowerCase();
            }
            return searchableText.includes(term);
        });

        list.innerHTML = "";
        if (filtered.length === 0) {
            list.innerHTML = "<li class='empty'>No results found</li>";
            return;
        }

        filtered.forEach((item, index) => {
            let li = document.createElement("li");
            li.classList.add(item.type);

            let contentDiv = document.createElement("div");
            contentDiv.classList.add("content");

            if (item.type === "text") {
                contentDiv.textContent = item.content;
                contentDiv.addEventListener("click", () => copyToClipboard(item.content, "Text"));
                contentDiv.style.cursor = "pointer";
            } else if (item.type === "link") {
                let a = document.createElement("a");
                a.href = item.content;
                a.textContent = item.content;
                a.target = "_blank";
                contentDiv.appendChild(a);
                let copyBtn = document.createElement("button");
                copyBtn.classList.add("copy-btn");
                copyBtn.textContent = "Copy URL";
                copyBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    copyToClipboard(item.content, "Link");
                });
                contentDiv.appendChild(copyBtn);
            } else if (item.type === "image") {
                let img = document.createElement("img");
                img.src = item.content;
                img.alt = "Saved Image";
                contentDiv.appendChild(img);
                let copyBtn = document.createElement("button");
                copyBtn.classList.add("copy-btn");
                copyBtn.textContent = "Copy URL";
                copyBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    copyToClipboard(item.content, "Image URL");
                });
                contentDiv.appendChild(copyBtn);
            }

            li.appendChild(contentDiv);

            let deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            deleteBtn.textContent = "✕";
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const actualIndex = clipboardData.indexOf(item);
                deleteItem(actualIndex);
            });
            li.appendChild(deleteBtn);

            list.appendChild(li);
        });
    });

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            search.value = "";
            loadClipboard(tab.dataset.type);
        });
    });

    loadClipboard();
});
