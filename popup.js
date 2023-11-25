document.addEventListener('DOMContentLoaded', function () {

    loadBannedWords();
    setupAddWordButton();
    setupDeleteButtons();
  
    // Delay before sending the message to allow content script to initialize
    setTimeout(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        console.log("ACTIVEtAB" + activeTab);
        chrome.tabs.sendMessage(activeTab.id, { action: 'invokeContentFunction' });
      });
    }, 1000); // Adjust the delay time as needed
  });
  
  // Listen for messages from content.js
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // Handle messages from content.js
    if (request.action === 'contentFunctionResponse') {
      console.log('Response from content.js:', request.message);
    }
  });
  
  function loadBannedWords() {
    chrome.storage.sync.get({ bannedWords: [] }, function (result) {
      const wordList = document.getElementById('wordList');
      wordList.innerHTML = '';
  
      result.bannedWords.forEach(function (word) {
        const li = createListItem(word);
        wordList.appendChild(li);
      });
    });
  }
  
  function addWord() {
    const newWordInput = document.getElementById('newWord');
    const newWord = newWordInput.value.trim();
  
    if (newWord !== '') {
      chrome.storage.sync.get({ bannedWords: [] }, function (result) {
        const updatedWords = result.bannedWords.concat(newWord);
  
        chrome.storage.sync.set({ bannedWords: updatedWords }, function () {
          loadBannedWords();
          newWordInput.value = '';
        });

        //manipulate dom
        //traverseSubtree(document.body);
      });
    }
  }
  
  function deleteWord(word) {
    chrome.storage.sync.get({ bannedWords: [] }, function (result) {
      const updatedWords = result.bannedWords.filter(w => w !== word);
  
      chrome.storage.sync.set({ bannedWords: updatedWords }, function () {
        loadBannedWords();
      });
    });
  }
  
  function createListItem(word) {
    const li = document.createElement('li');
    li.textContent = word;
  
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash" style="color: #ff0000;"></i>';
    deleteButton.classList.add('deleteButton');
    deleteButton.addEventListener('click', function () {
      deleteWord(word);
    });
  
    li.appendChild(deleteButton);
    return li;
  }
  
  function setupAddWordButton() {
    const addWordButton = document.getElementById('addWordButton');
    addWordButton.addEventListener('click', addWord);
  }
  
  function setupDeleteButtons() {
    const wordList = document.getElementById('wordList');
    wordList.addEventListener('click', function (event) {
      const target = event.target;
      if (target.tagName === 'BUTTON') {
        // If the clicked element is a button, assume it's a delete button
        const listItem = target.parentNode;
        const word = listItem.textContent.trim();
        deleteWord(word);
      }
    });
  }
  