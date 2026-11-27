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
        card.setDeck(Deck.builder().id(cardRequest.getDeckId()).build());
        card.setQuestion(cardRequest.getQuestion());
        card.setAnswer(cardRequest.getAnswer());
        card.setDeleted(false);

        return resetAndSaveCard(card).toResponse();
    }

    private Card resetAndSaveCard(Card card) {
        card.setFsrsId(null);
        card.updateFromFsrsCard(card.toFsrsCard());
        cardRepository.save(card);
        return card;
    }

    @Transactional
    public void resetCards(Long deckId) {
        cardRepository.findAllByDeckIdAndDeletedFalse(deckId).forEach(this::resetAndSaveCard);
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
