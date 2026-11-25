const API_URL = "http://localhost:8080/api/v1";
const SECTIONS = {
    DECKS: 'decks-section',
    GROUPS: 'groups-section',
};

const hideSections = () => {
    Object.values(SECTIONS).forEach(sectionId => {
        const section = document.getElementById(sectionId);
        section.style.display = 'none';
    });
}

const showSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section.style.display === 'block') return null;

    hideSections();
    section.style.display = 'block';
    return section;
}

const populateTable = async (sectionName, domainPath, fields) => {
    const section = showSection(sectionName);
    if (section) {
        const entities = await fetch(`${API_URL}/${domainPath}`).then(res => res.json());

        const table = section.querySelector('table');
        const tableHeader = document.createElement('thead');
        const tableBody = document.createElement('tbody');
        const headerRow = document.createElement('tr');

        table.innerHTML = '';
        headerRow.innerHTML = Object.keys(fields).map(field => `<th>${fields[field]}</th>`).join('');
        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);
        entities.forEach(entity => appendTableRow(tableBody, fields, entity));
        table.appendChild(tableBody);
    }
}

const appendTable = (sectionName, fields, entity) => {
    const section = document.getElementById(sectionName);
    if (section) {
        const table = section.querySelector('table');
        const tableBody = table.querySelector('tbody');
        appendTableRow(tableBody, fields, entity);
    }
}

const appendTableRow = (tableBody, fields, entity) => {
    const row = document.createElement('tr');
    row.innerHTML = Object.keys(fields).map(field => `<td>${entity[field]}</td>`).join('');
    tableBody.appendChild(row);
}