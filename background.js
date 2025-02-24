chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "saveClipboard",
        title: "Save to Clipboard Organizer",
        contexts: ["selection", "image", "link"]
    });
});

chrome.contextMenus.onClicked.addListener((info) => {
    let type, content;

    if (info.menuItemId === "saveClipboard") {
        if (info.selectionText) {
            type = "text";
            content = info.selectionText;
        } else if (info.linkUrl) {
            type = "link";
            content = info.linkUrl;
        } else if (info.srcUrl) {
            type = "image";
            content = info.srcUrl;
        }

        if (content) {
            saveToClipboard(type, content);
        }
    }
});

function saveToClipboard(type, content) {
    chrome.storage.local.get({ clipboardData: [] }, (data) => {
        let clipboardData = data.clipboardData;
        clipboardData.unshift({ type, content, timestamp: new Date().toISOString() });
        chrome.storage.local.set({ clipboardData });
    });
}
