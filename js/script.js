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

function toggleMenu() {
    const menu = document.getElementById('menu');
    const menuButton = document.getElementById('menuButton');
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
        menuButton.innerHTML = '<img src="../svg/x.svg" width="18" height="18" />';
    } else {
        menu.style.display = "none";
        menuButton.innerHTML = '<img src="../svg/menu.svg" width="20" height="20" />';
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
