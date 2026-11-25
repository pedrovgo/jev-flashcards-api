const API_URL = "http://localhost:8080/api/v1";
const ACTION_COLUMN_CLASS = 'table-action-column';
const SECTIONS = {
    DECKS: 'decks-section',
    GROUPS: 'groups-section',
};
const SECTION_CONFIG = {
    [SECTIONS.DECKS]: { apiPath: 'decks' },
    [SECTIONS.GROUPS]: { apiPath: 'groups' },
};

const hideSections = () => {
    Object.values(SECTIONS).forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) section.style.display = 'none';
    });
};

const showSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (!section) throw new Error(`Section not found: ${sectionId}`);

    hideSections();
    section.style.display = 'block';
    return section;
};

const request = async (url, options) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    return response;
};

const getSectionConfig = (sectionId) => {
    const config = SECTION_CONFIG[sectionId];
    if (!config) throw new Error(`Section configuration not found: ${sectionId}`);
    return config;
};

const getSectionApiUrl = (sectionId) => `${API_URL}/${getSectionConfig(sectionId).apiPath}`;

const populateTable = async (sectionName, fields, actions) => {
    const section = showSection(sectionName);
    const response = await request(getSectionApiUrl(sectionName));
    const entities = await response.json();
    const table = section.querySelector('table');
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const tableBody = document.createElement('tbody');

    Object.values(fields).forEach(label => {
        const headerCell = document.createElement('th');
        headerCell.textContent = label;
        headerRow.appendChild(headerCell);
    });

    Object.keys(actions).forEach(() => {
        const headerCell = document.createElement('th');
        headerCell.classList.add(ACTION_COLUMN_CLASS);
        headerRow.appendChild(headerCell);
    });
    const deleteHeaderCell = document.createElement('th');
    deleteHeaderCell.classList.add(ACTION_COLUMN_CLASS);
    headerRow.appendChild(deleteHeaderCell);

    tableHeader.appendChild(headerRow);
    entities.forEach(entity => appendTableRow(tableBody, sectionName, fields, entity, actions));
    table.replaceChildren(tableHeader, tableBody);
};

const appendTable = (sectionName, fields, entity, actions) => {
    const section = document.getElementById(sectionName);
    if (!section) throw new Error(`Section not found: ${sectionName}`);

    const tableBody = section.querySelector('table tbody');
    if (!tableBody) throw new Error(`Table body not found in section: ${sectionName}`);

    appendTableRow(tableBody, sectionName, fields, entity, actions);
};

const appendTableRow = (tableBody, sectionName, fields, entity, actions) => {
    const row = document.createElement('tr');
    row.dataset.id = String(entity.id);

    Object.keys(fields).forEach(field => {
        const cell = document.createElement('td');
        cell.textContent = entity[field] ?? '';
        row.appendChild(cell);
    });

    Object.values(actions).forEach(action => {
        const cell = document.createElement('td');
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', action.label);
        button.className = 'outline';
        button.textContent = action.label;
        cell.classList.add(ACTION_COLUMN_CLASS);
        cell.style.textAlign = 'center';
        cell.appendChild(button);
        row.appendChild(cell);
    });

    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.setAttribute('aria-label', 'Delete');
    deleteButton.className = 'outline';
    deleteButton.addEventListener('click', () => deleteEntity(sectionName, entity.id));
    deleteButton.appendChild(createDeleteIcon());
    deleteCell.classList.add(ACTION_COLUMN_CLASS);
    deleteCell.style.textAlign = 'center';
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    tableBody.appendChild(row);
};

const createDeleteIcon = () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const icon = document.createElementNS(namespace, 'svg');
    icon.setAttribute('width', '20');
    icon.setAttribute('height', '20');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    icon.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS(namespace, 'path');
    path.setAttribute('d', 'M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v7m6-7v7');
    icon.appendChild(path);
    return icon;
};

const deleteEntity = async (sectionName, entityId) => {
    await request(`${getSectionApiUrl(sectionName)}/${entityId}`, {
        method: 'DELETE',
    });

    const section = document.getElementById(sectionName);
    const rowToDelete = [...(section?.querySelectorAll('tr[data-id]') ?? [])]
        .find(row => row.dataset.id === String(entityId));
    rowToDelete?.remove();
};