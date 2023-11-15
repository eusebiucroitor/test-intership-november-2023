

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');

    searchInput.addEventListener('input', function () {
        // Allow only letters
        this.value = this.value.replace(/[^A-Za-z]/g, '');

        if (this.value.length > 100) {
            this.value = this.value.slice(0, 100);}
    });
});




/////////////////////////
let searchHistory = [];





function displayResults(data) {
    const resultContainer = document.getElementById('result-container');

    // Clear previous results
    resultContainer.innerHTML = '';

    if (Array.isArray(data) && data.length > 0) {
        // Display the results
        const definition = data[0]?.meanings[0]?.definitions[0]?.definition;

        const resultElement = document.createElement('div');
        resultElement.innerHTML = `<p><strong>Definition:</strong> ${definition}</p>`;
        resultContainer.appendChild(resultElement);
    } else {
        resultContainer.innerHTML = '<p>No results found.</p>';
    }
}

function addToSearchHistory(word) {
    const datetime = new Date().toLocaleString();
    searchHistory.push({ word, datetime });
}

function displaySearchHistory() {
    const searchHistoryBody = document.getElementById('search-history-body');

    // Clear previous search history
    searchHistoryBody.innerHTML = '';

    // Display the updated search history
    searchHistory.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.word}</td>
            <td>${entry.datetime}</td>
            <td>
                <button onclick="viewEntry('${entry.word}')">View</button>
                <button onclick="deleteEntry('${entry.word}')">Delete</button>
            </td>
        `;
        searchHistoryBody.appendChild(row);
    });
}

function viewEntry(word) {
    // Logic to handle view button click
    console.log(`Viewing entry: ${word}`);
}

function deleteEntry(word) {
    // Logic to handle delete button click
    console.log(`Deleting entry: ${word}`);

    // Remove the entry from search history
    searchHistory = searchHistory.filter(entry => entry.word !== word);

    // Update the displayed search history
    displaySearchHistory();
}

/*modal logic*/
function viewEntry(word) {
    const entry = searchHistory.find(entry => entry.word === word);

    if (entry) {
        const modalResult = document.getElementById('modal-result');
        modalResult.innerHTML = `<p><strong>Word:</strong> ${entry.word}</p><p><strong>Datetime:</strong> ${entry.datetime}</p>`;

        const modal = document.getElementById('modal');
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

/*logic for deleted button */
function deleteEntry(word) {
    const entry = searchHistory.find(entry => entry.word === word);

    if (entry) {
        const confirmationModal = document.getElementById('confirmationModal');
        const confirmationText = document.getElementById('confirmationText');

        confirmationText.textContent = `Are you sure you want to delete the session for the word "${word}"?`;

        confirmationModal.style.display = 'block';
        
        // Store the current entry in a variable for use in confirmDeleteEntry
        currentEntryToDelete = entry;
    }
}

function closeConfirmationModal() {
    const confirmationModal = document.getElementById('confirmationModal');
    confirmationModal.style.display = 'none';
}

function confirmDeleteEntry() {
    if (currentEntryToDelete) {
        // Remove the entry from search history
        searchHistory = searchHistory.filter(e => e.word !== currentEntryToDelete.word);

        // Update the displayed search history
        displaySearchHistory();

        // Close the confirmation modal
        closeConfirmationModal();
    }
}

//////


function searchDictionary(event){ 
    const searchInput = document.getElementById('search').value;
    

    if (searchInput.trim() !== '') {
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchInput)}`;

        // Make the API call using fetch
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                saveSearchHistory(searchInput);
                displaySearchHistory();
                displayResults(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }
    event.preventDefault();
}

function saveSearchHistory(word) {
    const datetime = new Date().toLocaleString();
    searchHistory.push({ word, datetime });
    
    // Save the search history locally (e.g., in localStorage)
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function displaySearchHistory() {
    const searchHistoryBody = document.getElementById('search-history-body');

    // Clear previous search history
    searchHistoryBody.innerHTML = '';

    // Display the updated search history
    searchHistory.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.word}</td>
            <td>${entry.datetime}</td>
            <td>
                <button onclick="viewEntry('${entry.word}')">View</button>
                <button onclick="deleteEntry('${entry.word}')">Delete</button>
            </td>
        `;
        searchHistoryBody.appendChild(row);
    });
}

// Initialize search history from local storage (if available)
const storedSearchHistory = localStorage.getItem('searchHistory');
searchHistory = storedSearchHistory ? JSON.parse(storedSearchHistory) : [];
