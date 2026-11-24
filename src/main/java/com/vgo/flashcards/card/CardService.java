package com.vgo.flashcards.card;

import com.vgo.flashcards.card.dto.CardRequest;
import com.vgo.flashcards.card.dto.CardResponse;
import com.vgo.flashcards.card.review.ReviewService;
import com.vgo.flashcards.card.review.dto.ReviewRequest;
import com.vgo.flashcards.deck.Deck;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class CardService {

    final CardRepository cardRepository;
    final ReviewService reviewService;

    public CardService(
            CardRepository  cardRepository,
            ReviewService reviewService
    ) {
        this.cardRepository = cardRepository;
        this.reviewService = reviewService;
    }

    public CardResponse getNextCard(Long deckId) {
        final Card card = cardRepository.findFirstByDeckIdAndDeletedFalseOrderByDueAsc(deckId);
        return card.toResponse();
    }

    public CardResponse createCard(CardRequest cardRequest) {
        final Card card = new Card();
        final io.github.openspacedrepetition.Card fsrsCard = card.toFsrsCard();

        card.updateFromFsrsCard(fsrsCard);
        card.setDeck(Deck.builder().id(cardRequest.getDeckId()).build());
        card.setQuestion(cardRequest.getQuestion());
        card.setAnswer(cardRequest.getAnswer());
        card.setDeleted(false);

        cardRepository.save(card);
        return card.toResponse();
    }

    public CardResponse reviewFlashcard(ReviewRequest reviewRequest) {
        Card card = cardRepository.findById(reviewRequest.getCardId()).orElseThrow();
        Card updatedCard = reviewService.reviewFlashcard(card, reviewRequest.getAnswer());
        cardRepository.save(updatedCard);
        return updatedCard.toResponse();
    }

    @Transactional
    public void deleteCard(Long cardId) {
        cardRepository.softDeleteById(cardId);
    }
}
