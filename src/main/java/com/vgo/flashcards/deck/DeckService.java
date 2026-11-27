package com.vgo.flashcards.deck;

import com.vgo.flashcards.card.CardService;
import com.vgo.flashcards.deck.dto.DeckRequest;
import com.vgo.flashcards.deck.dto.DeckResponse;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeckService {
    final DeckRepository deckRepository;
    final CardService cardService;

    public DeckService(DeckRepository deckRepository, CardService cardService) {
        this.deckRepository = deckRepository;
        this.cardService = cardService;
    }

    public List<DeckResponse> getDecks() {
        return deckRepository.findByDeletedFalse().stream().map(Deck::toResponse).toList();
    }

    public DeckResponse createDeck(DeckRequest request) {
        Deck deck = Deck.builder()
                .title(request.getTitle())
                .deleted(false)
                .build();
        Deck savedDeck = deckRepository.save(deck);
        return savedDeck.toResponse();
    }

    public void resetDeck(Long deckId){
        cardService.resetCards(deckId);
    }

    @Transactional
    public void deleteDeck(Long deckId) {
        deckRepository.softDeleteById(deckId);
    }
}
