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
        document.getElementById("alert-container").innerHTML = `
        <dialog id="alert-dialog">
            <article>
                <header>
                    <button
                            aria-label="Close"
                            rel="prev"
                            data-target="alert-dialog"
                            onclick="REVIEW_MODAL_VALUES.onAlertClose(${review.deckId})"
                    ></button>
                    <p>
                        <strong>Card reviewed.</strong>
                    </p>
                </header>
                <h3>Score: ${review.score}</h3><br>
                <h5>Answer:<br><br> ${review.answer}</h5>
            </article>
        </dialog>`;
        const modal = document.getElementById('alert-dialog');
        openModal(modal, {}, SECTIONS.REVIEW, null, null);
    },
    onAlertClose: (deckId) => {
        const modal = document.getElementById('alert-dialog');
        closeModal(modal);
        setTimeout(() => {
            DECK_TABLE_ACTIONS.reviewDeck.action(deckId);
        }, animationDuration);
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