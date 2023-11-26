import { defaultBannedWords } from './banned'

let bannedWords = [];

chrome.runtime.onMessage.addListener(function (message) {
  removeThumbnail(document.body, [message.data])
});

// if chrome storage is empty, use defaultBannedWords
chrome.storage.sync.get('bannedWords', function (result) {
  if (!result.bannedWords || result.bannedWords.length === 0) {
    chrome.storage.sync.set({ bannedWords: defaultBannedWords }, function () {
      console.log('Value is set to ' + defaultBannedWords);
    });
  }
  bannedWords = result.bannedWords;
});

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
      for (const node of mutation.addedNodes) {
        removeThumbnail(node, bannedWords)
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

function removeThumbnail(node, bannedWords) {
  const thumbnails = node.querySelectorAll(
    ".tc-tower div, .tw-tower div"
  );

  for (const thumbnail of thumbnails) {
    const title = thumbnail.querySelector("h3");
    if (title) {
      const titleText = title.innerText.toLowerCase();
      const isBanned = bannedWords.some((word) =>
        titleText.includes(word)
      );

      if (isBanned) {
        thumbnail.style.display = "none";
        console.log("banned " + titleText);
      }

    }

  }
}
