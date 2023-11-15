

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');

    searchInput.addEventListener('input', function () {
        // Allow only letters
        this.value = this.value.replace(/[^A-Za-z]/g, '');

        if (this.value.length > 100) {
            this.value = this.value.slice(0, 100);}
    });
});

// app.js
function searchDictionary() {
    const searchInput = document.getElementById('search').value;
    

    if (searchInput.trim() !== '') {
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchInput)}`;

        // Make the API call using fetch
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displayResults(data))
            .catch(error => console.error('Error fetching data:', error));
    }
}

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

/////////////////////////
let searchHistory = [];


function searchDictionary(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const searchInput = document.getElementById('search').value;

    if (searchInput.trim() !== '') {
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchInput)}`;

        // Make the API call using fetch
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayResults(data);
                addToSearchHistory(searchInput);
                displaySearchHistory();
            })
            .catch(error => console.error('Error fetching data:', error));
    }
}


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
