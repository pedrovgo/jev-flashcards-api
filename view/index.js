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
        headerRow.innerHTML = Object.keys(fields).map(field => `<th>${fields[field]}</th><th></th>`).join('');
        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);
        entities.forEach(entity => appendTableRow(tableBody, sectionName, fields, entity));
        table.appendChild(tableBody);
    }
}

const appendTable = (sectionName, fields, entity) => {
    const section = document.getElementById(sectionName);
    if (section) {
        const table = section.querySelector('table');
        const tableBody = table.querySelector('tbody');
        appendTableRow(tableBody, sectionName, fields, entity);
    }
}

const appendTableRow = (tableBody, sectionName, fields, entity) => {
    const sectionKey = Object.entries(SECTIONS).find(([, value]) => value === sectionName)?.[0].toLowerCase();
    const row = document.createElement('tr');
    row.setAttribute('data-id', entity.id);
    row.innerHTML = Object.keys(fields).map(field => `<td>${entity[field]}</td><td style="text-align: center;">
        <button type="button" aria-label="Delete" class="outline"
                onclick="deleteEntity('${sectionName}', '${sectionKey}', '${entity.id}')">
          <svg xmlns="http://www.w3.org/2000/svg"
               width="20" height="20" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round"
               aria-hidden="true">
            <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v7m6-7v7"/>
          </svg>
        </button>
    </td>`).join('');
    tableBody.appendChild(row);
}

const deleteEntity = async (sectionName, domainPath, entityId) => {
    console.log(sectionName, domainPath, entityId);
    const response = await fetch(`${API_URL}/${domainPath}/${entityId}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        const section = document.getElementById(sectionName);
        if (section) {
            const table = section.querySelector('table');
            const tableBody = table.querySelector('tbody');
            const rowToDelete = tableBody.querySelector(`tr[data-id="${entityId}"]`);
            if (rowToDelete) {
                tableBody.removeChild(rowToDelete);
            }
        }
    } else {
        console.error('Failed to delete entity:', response.statusText);
    }
};