document.addEventListener('DOMContentLoaded', function () {
    loadBannedWords();
  
    // Add event listener for the button click
    const addWordButton = document.getElementById('addWordButton');
    addWordButton.addEventListener('click', addWord);
  });
  
  function loadBannedWords() {
    chrome.storage.sync.get({ bannedWords: [] }, function (result) {
      const wordList = document.getElementById('wordList');
      wordList.innerHTML = '';
  
      result.bannedWords.forEach(function (word) {
        const li = document.createElement('li');
        li.textContent = word;
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
      });
    }
  }
  