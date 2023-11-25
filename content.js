console.log('hello');
let bannedWords = '';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'invokeContentFunction') {
        traversePage(); // Call your function
        sendResponse({ action: 'contentFunctionResponse', message: 'Function invoked in content.js' });
    }
});

traversePage();

function traversePage() {
    // Load the bannedWords from storage
    chrome.storage.sync.get({ bannedWords: [] }, function (result) {
        if (!result.bannedWords || result.bannedWords.length === 0) {
            // Default list of banned words
            const defaultBannedWords = ["step", "girl", "body", "asmr", "anime", "paint", "shower", "bath", "bed", "pool", "hottub", "hot", "swim", "bikini", "underwear", "uwu", "kiss", "sex"];

            // Save the default list to storage
            chrome.storage.sync.set({ bannedWords: defaultBannedWords }, function () {
                console.log("Default list of banned words loaded into storage.");
            });
        } else {
            // Use the bannedWords array from storage
            bannedWords = result.bannedWords;

            // Create a MutationObserver and start observing
            const observer = new MutationObserver(handleMutations);

            // Specify the target node and the type of mutations to observe
            const targetNode = document.body; // You can change this to a more specific container if needed
            const config = { childList: true, subtree: true };

            // Start observing the target node for mutations
            observer.observe(targetNode, config);

            console.log(bannedWords);
        }
    });
}

// Recursive function to traverse the subtree of a node
function traverseSubtree(node) {
    if (node instanceof HTMLElement && (node.dataset.aTarget === "preview-card-image-link")) {
        //console.log('Found and manipulated element:', node);
        const img = node.querySelector('img');
        const imgAlt = img.getAttribute("alt");

        if (imgAlt) {
            for (var i = 0; i < bannedWords.length; i++) {
                if (imgAlt.toLowerCase().includes(bannedWords[i].toLowerCase())) {
                    console.log(imgAlt);
                    img.src = 'https://i.imgflip.com/1ytgsy.jpg';
                    //node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
                }
            }
        }
    }

    // Recursively check the children
    for (const childNode of node.children) {
        traverseSubtree(childNode);
    }
}

// Function to handle the mutation events
function handleMutations(mutationsList, observer) {
    // Iterate over the mutations
    for (const mutation of mutationsList) {
        // Check if nodes were added
        if (mutation.type === 'childList') {
            // Check each added node
            mutation.addedNodes.forEach(node => {
                // Check if it's a div with the specified attribute
                traverseSubtree(node);
            });
        }
    }
}
