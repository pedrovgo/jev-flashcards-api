const CARDS_MODAL_VALUES = {
    title: 'Add Card',
    submitButtonText: 'Submit',
    fields: [
        {
            label: 'Deck ID',
            name: 'deckId',
            type: 'number',
            required: true,
            disabled: true,
        },
        {
            label: 'Question',
            name: 'question',
            type: 'textarea',
            required: true,
        },
        {
            label: 'Answer',
            name: 'answer',
            type: 'textarea',
            required: true,
        },
    ],
};

const REVIEW_MODAL_VALUES = {
    title: 'Review Card',
    submitButtonText: 'Submit',
    onSuccess: (review) => {
        alert(`Card reviewed.\nScore: ${review.score}\nAnswer: ${review.answer}`);
        DECK_TABLE_ACTIONS.reviewDeck.action(review.deckId);
    },
    fields: [
        {
            label: 'Card ID',
            name: 'id',
            type: 'number',
            required: true,
            disabled: true,
        },
        {
            label: 'Question',
            name: 'question',
            type: 'textarea',
            disabled: true,
        },
        {
            label: 'Answer',
            name: 'answer',
            type: 'textarea',
            required: true,
        },
    ],
};