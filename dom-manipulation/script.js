let quotes = loadQuotes() || [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Life is short. Smile while you still have teeth.", category: "Humor" },
  { text: "To be or not to be.", category: "Philosophy" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const quoteFormContainer = document.getElementById('quoteFormContainer');
const importFileInput = document.getElementById('importFile');
const exportBtn = document.getElementById('exportBtn');
const categoryFilter = document.getElementById('categoryFilter');

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
  const data = localStorage.getItem('quotes');
  return data ? JSON.parse(data) : null;
}


function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes in this category.</p>";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>Category: ${quote.category}</em></p>
  `;

  sessionStorage.setItem('lastViewedQuote', quote.text);
}

function createAddQuoteForm() {
  const quoteInput = document.createElement('input');
  quoteInput.type = 'text';
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  quoteFormContainer.appendChild(quoteInput);
  quoteFormContainer.appendChild(categoryInput);
  quoteFormContainer.appendChild(addButton);
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const lastFilter = localStorage.getItem('lastCategoryFilter') || 'all';
  categoryFilter.value = lastFilter;
}

function filterQuotes() {
  localStorage.setItem('lastCategoryFilter', categoryFilter.value);
  showRandomQuote();
}

function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories(); 
  alert("Quote added!");
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

function exportToJsonFile() {
  const jsonStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error parsing JSON.");
    }
  };
  reader.readAsText(file);
}

newQuoteButton.addEventListener('click', showRandomQuote);
importFileInput.addEventListener('change', importFromJsonFile);
exportBtn.addEventListener('click', exportToJsonFile);
categoryFilter.addEventListener('change', filterQuotes);

createAddQuoteForm();
populateCategories();
showRandomQuote();
