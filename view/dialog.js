document.getElementById("modal-container").innerHTML = `
<dialog id="modal-dialog">
    <article>
        <header>
            <button
                    aria-label="Close"
                    rel="prev"
                    data-target="modal-dialog"
                    onclick="toggleModal(event)"
            ></button>
            <p>
                <strong></strong>
            </p>
        </header>
        <form oninput="handleDialogFormInput(event)">

        </form>
        <footer>
            <button
                    role="button"
                    class="secondary"
                    data-target="modal-dialog"
                    onclick="toggleModal(event)"
            >
                Cancel</button
            ><button autofocus class="primary" data-target="modal-dialog" onclick="submitForm(event)" disabled>
        </button>
        </footer>
    </article>
</dialog>`;

const isOpenClass = "modal-is-open";
const openingClass = "modal-is-opening";
const closingClass = "modal-is-closing";
const scrollbarWidthCssVar = "--pico-scrollbar-width";
const animationDuration = 300; // ms
let visibleModal = null;

const toggleModal = (event, modalValues, sectionName, tableFields, sectionActions) => {
    event.preventDefault();
    const modal = document.getElementById(event.currentTarget.dataset.target);
    if (!modal) return;
    modal && (modal.open ? closeModal(modal) : openModal(modal, modalValues, sectionName, tableFields, sectionActions));
};

const openModal = (modal, modalValues, sectionName, tableFields, sectionActions) => {
    const { documentElement: html } = document;
    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth) {
        html.style.setProperty(scrollbarWidthCssVar, `${scrollbarWidth}px`);
    }
    html.classList.add(isOpenClass, openingClass);

    modal.querySelector('header p strong').textContent = modalValues.title;

    let submitButton = modal.querySelector('footer .primary');
    if (submitButton) {
        submitButton.textContent = modalValues.submitButtonText;
    }

    const form = modal.querySelector('form');
    if (form) {
        form.innerHTML = '';

        modalValues.fields.forEach(field => {
            form.innerHTML += field.type === 'textarea' ? `
                <label for="${field.name}">${field.label}
                    <textarea name="${field.name}" ${field.required ? 'required' : ''} ${field.disabled ? 'readonly' : ''}>${field.value || ''}</textarea>
                </label>` :
            `   <label for="${field.name}">${field.label}
                    <input name="${field.name}" type="${field.type}" ${field.required ? 'required' : ''} ${field.disabled ? 'readonly' : ''} value="${field.value || ''}">
                </label>
            `;
        });

        form.setAttribute('action', getSectionApiUrl(sectionName));
        window.sectionValues = new WeakMap();
        window.sectionValues.set(form, {tableFields: tableFields, sectionName});
        window.sectionActions = new WeakMap();
        window.sectionActions.set(form, sectionActions);
        window.modalValues = new WeakMap();
        window.modalValues.set(form, modalValues);
    }

    setTimeout(() => {
        visibleModal = modal;
        html.classList.remove(openingClass);
    }, animationDuration);
    modal.showModal();
};

const closeModal = (modal) => {
  visibleModal = null;
  const { documentElement: html } = document;
  html.classList.add(closingClass);
  setTimeout(() => {
    html.classList.remove(closingClass, isOpenClass);
    html.style.removeProperty(scrollbarWidthCssVar);
    modal.close();
  }, animationDuration);
};

const getScrollbarWidth = () => {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  return scrollbarWidth;
};

const handleDialogFormInput = (event) => {
    const submitButton = event.currentTarget.parentElement.querySelector('footer .primary');
    submitButton.disabled = !event.currentTarget.checkValidity();
}

const submitForm = async (event) => {
    event.preventDefault();
    const form = event.currentTarget.parentElement.parentElement.querySelector('form');
    if (!form.checkValidity()) return;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const sectionValues = window.sectionValues.get(form);
    const sectionActions = window.sectionActions.get(form);
    const modalValues = window.modalValues.get(form);
    const url = form.getAttribute('action');
    const id = form.elements.namedItem('id')?.value;

    const response = await request(id ? url.replace('{id}', id) : url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    closeModal(visibleModal);

    setTimeout(() => {
        if (sectionValues.tableFields) {
            appendTable(sectionValues.sectionName, sectionValues.tableFields, result, sectionActions);
        } else if (modalValues.onSuccess) {
            modalValues.onSuccess({...result, ...modalValues.onSuccessData});
        } else {
            alert('Success! Form submitted successfully.');
        }
    }, animationDuration);

    window.sectionValues.delete(form);
    window.sectionActions.delete(form);
    window.modalValues.delete(form);
};