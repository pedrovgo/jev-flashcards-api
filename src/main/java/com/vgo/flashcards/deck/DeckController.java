package com.vgo.flashcards.deck;

import com.vgo.flashcards.deck.dto.DeckRequest;
import com.vgo.flashcards.deck.dto.DeckResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/decks")
public class DeckController {
    private final DeckService deckService;

    public DeckController(DeckService deckService) {
        this.deckService = deckService;
    }

    @PostMapping
    public DeckResponse createDeck(@RequestBody DeckRequest request) {
        return deckService.createDeck(request);
    }
}
