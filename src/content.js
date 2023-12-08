import { defaultBannedWords } from './banned'

let bannedWords = [];
let bannedTags = [];

// MutationObserver to detect when new thumbnails are added to the page
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations)
    if (mutation.type === 'childList')
      for (const node of mutation.addedNodes){
        setBannedThumbnails(node, bannedWords)
        setBannedTags(node, bannedTags)
      }
});
observer.observe(document.body, { childList: true, subtree: true });


// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message) {
  if(message.isTag){
    setBannedTags(document.body, message.tags);
  }
  else{
    setBannedThumbnails(document.body, message.titles);
  }
});


chrome.storage.sync.get('bannedWords', function (result) {
  if (!result.bannedWords || result.bannedWords.length === 0)
    chrome.storage.sync.set({ bannedWords: defaultBannedWords }, function () {
      console.log('Value is set to ' + defaultBannedWords);
      bannedWords = defaultBannedWords;
    });
  else bannedWords = result.bannedWords;
});

chrome.storage.sync.get('bannedTags', function (result) {
    bannedTags = result.bannedTags
});


function setBannedThumbnails(node, bannedWords) {
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
      else {
        thumbnail.style.display = "block";
      }
    }
  }
}

function setBannedTags(node, bannedTags) {
  const shelfCardDivs = node.querySelectorAll('div[data-test-selector="shelf-card-selector"]');

  shelfCardDivs.forEach((shelfCard) => {
    const anchorTags = shelfCard.querySelectorAll('a[aria-label^="Tag"]');
    anchorTags.forEach((anchor) => {
      const tag = anchor.getAttribute('data-a-target');
  
      console.log("Tag:" + tag)
      const isBanned = bannedTags.some((word) =>
          //tag.toLowerCase().includes(word.toLowerCase()) || word.toLowerCase().includes(tag.toLowerCase())
          tag.includes(word)
        );
 
      const thumbnails = node.querySelectorAll(
        ".tc-tower div, .tw-tower div"
      );
      for (const thumbnail of thumbnails) {
        if (isBanned) {
          thumbnail.style.display = "none";
          console.log("banned " + tag);
        }
        else {
          thumbnail.style.display = "block";
        }
    }
    });
  });
}
