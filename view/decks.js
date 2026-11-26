const DECK_MODAL_VALUES = {
    title: 'Add Deck',
    submitButtonText: 'Submit',
    fields: [
        {
            label: 'Title',
            name: 'title',
            type: 'text',
            required: true,
        },
    ],
};

const DECK_TABLE_FIELDS = {
    title: 'Deck'
};

const DECK_TABLE_ACTIONS = {
    reviewDeck: {
        label: 'Review',
        action: async (deckId) => {
            const response = await fetch(`${API_URL}/cards/next?deckId=${deckId}`).then(response => response.json());
            let modalValues = { ...REVIEW_MODAL_VALUES, onSuccessData: {deckId}};
            modalValues.fields[0].value = response.id;
            modalValues.fields[1].value = response.question;
            const modal = document.getElementById('modal-dialog');
            openModal(modal, modalValues, SECTIONS.REVIEW, null, null);
        }
    },
    addCard: {
        label: 'Add Card',
        action: (deckId) => {
            let modalValues = { ...CARDS_MODAL_VALUES };
            modalValues.fields[0].value = deckId;
            const modal = document.getElementById('modal-dialog');
            openModal(modal, modalValues, SECTIONS.CARDS, null, null);
        }
    }
};