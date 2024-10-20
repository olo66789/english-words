const originalOrder = [];

function saveOriginalOrder() {
    const table = document.getElementById('translationTable');
    const tr = table.getElementsByTagName('tr');
    for (let i = 0; i < tr.length; i++) {
        originalOrder.push(tr[i]);
    }
}

function restoreOriginalOrder() {
    const table = document.getElementById('translationTable');
    originalOrder.forEach(row => table.appendChild(row));
}

function filterList() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const table = document.getElementById('translationTable');
    const tr = Array.from(table.getElementsByTagName('tr'));

    let filteredRows = [];

    for (let i = 0; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName('td');
        if (td.length > 1) {
            const textValue = (td[0].textContent || td[0].innerText) + (td[1].textContent || td[1].innerText);
            if (textValue.toLowerCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
                filteredRows.push(tr[i]);
            } else {
                tr[i].style.display = "none";
            }
        }
    }

    if (filter) {
        filteredRows.sort((a, b) => {
            const aText = (a.getElementsByTagName('td')[0].textContent || a.getElementsByTagName('td')[0].innerText) + (a.getElementsByTagName('td')[1].textContent || a.getElementsByTagName('td')[1].innerText);
            const bText = (b.getElementsByTagName('td')[0].textContent || b.getElementsByTagName('td')[0].innerText) + (b.getElementsByTagName('td')[1].textContent || b.getElementsByTagName('td')[1].innerText);
            const aMatchIndex = aText.toLowerCase().indexOf(filter);
            const bMatchIndex = bText.toLowerCase().indexOf(filter);

            if (aMatchIndex !== bMatchIndex) {
                return aMatchIndex - bMatchIndex;
            } else {
                return aText.length - bText.length;
            }
        });

        filteredRows.forEach(row => table.appendChild(row));
    } else {
        restoreOriginalOrder();
    }

    const categoryRows = document.querySelectorAll('.category-row');
    categoryRows.forEach(row => {
        row.style.display = filter ? "none" : "";
    });
}

document.addEventListener('DOMContentLoaded', saveOriginalOrder);

document.addEventListener("DOMContentLoaded", function() {
    const testDates = document.querySelectorAll(".test-date");
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let closestDate = null;
    let closestElement = null;
    testDates.forEach((element) => {
        const dateText = element.textContent.trim();
        const testDate = new Date(dateText.split('.').reverse().join('-'));
        testDate.setHours(0, 0, 0, 0);
        if (testDate >= now && (!closestDate || testDate <= closestDate)) {
            closestDate = testDate;
            closestElement = element;
        }
    });
    if (closestElement) {
        closestElement.parentElement.classList.add("SpecialDate");
    }
});

function toggleMenu() {
    const menu = document.getElementById('menu');
    const menuButton = document.getElementById('menuButton');
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
        menuButton.innerHTML = "✖";
    } else {
        menu.style.display = "none";
        menuButton.innerHTML = "☰";
    }
}

function swapColumns() {
    const table = document.getElementById('translationTable');
    const rows = table.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const cols = rows[i].getElementsByTagName('td');
        if (cols.length > 1) {
            const temp = cols[0].innerHTML;
            cols[0].innerHTML = cols[1].innerHTML;
            cols[1].innerHTML = temp;
        }
    }
    toggleMenu();
}

function swapCategoryRowData() {
    const rows = document.querySelectorAll('.category-row td');
    rows.forEach(td => {
        const dataEn = td.getAttribute('data-en');
        const dataPl = td.getAttribute('data-pl');
        const currentText = td.innerText;
        td.setAttribute('data-en', dataPl);
        td.setAttribute('data-pl', dataEn);
        td.innerText = currentText === dataEn ? dataPl : dataEn;
    });
}

function goBack() {
    window.location.href = "../index.html";
}

const headerHTML = `
    <div class="search-container">
        <input type="text" id="searchInput" onkeyup="filterList()" placeholder="Wyszukaj słówka...">
		<button id="clearButton" onclick="clearSearch()">✖</button>
        <button id="menuButton" onclick="toggleMenu()">☰</button>
    </div>
    <div id="menu">
        <button id="swapButton" onclick="swapColumns(); swapCategoryRowData();"></button>
        <button id="backButton" onclick="goBack()">↩</button>
    </div>`;
document.getElementById('header-container').innerHTML = headerHTML;

const searchInput = document.getElementById('searchInput');
const clearButton = document.getElementById('clearButton');

searchInput.addEventListener('input', function() {
  if (searchInput.value) {
    clearButton.style.display = 'inline';
  } else {
    clearButton.style.display = 'none';
  }
});

function clearSearch() {
  searchInput.value = '';
  clearButton.style.display = 'none';
  searchInput.focus();
  filterList(); 
}

document.addEventListener("DOMContentLoaded", function () {
    const files = [
        'foc&antw.html',
        'pice&trac&mm.html',
        'tos&se.html',
        'unit11.html',
        'unit12.html',
        'unit13.html',
        'unit14.html'
    ];
    
    const mainTable = document.getElementById("allWordsTable");

    files.forEach(file => {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const table = doc.querySelector("#translationTable");
                if (table) {
                    mainTable.innerHTML += table.innerHTML;
                }
            })
            .catch(error => console.error('Error loading file:', file, error));
    });
});
