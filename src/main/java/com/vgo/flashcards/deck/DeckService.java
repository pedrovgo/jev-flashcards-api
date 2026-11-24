package com.vgo.flashcards.deck;

import com.vgo.flashcards.deck.dto.DeckRequest;
import com.vgo.flashcards.deck.dto.DeckResponse;
import org.springframework.stereotype.Service;

@Service
public class DeckService {
    final DeckRepository deckRepository;

    public DeckService(DeckRepository deckRepository) {
        this.deckRepository = deckRepository;
    }

    public DeckResponse createDeck(DeckRequest request) {
        Deck deck = Deck.builder()
                .title(request.getTitle())
                .build();
        Deck savedDeck = deckRepository.save(deck);
        return savedDeck.toResponse();
    }
}
