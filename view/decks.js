const DECK_MODAL_VALUES = {
    title: 'Add Deck',
    submitButtonText: 'Submit',
    submitUrl: `${API_URL}/decks`,
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