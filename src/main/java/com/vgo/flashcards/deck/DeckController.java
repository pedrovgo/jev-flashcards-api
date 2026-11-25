package com.vgo.flashcards.deck;

import com.vgo.flashcards.deck.dto.DeckRequest;
import com.vgo.flashcards.deck.dto.DeckResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/decks")
public class DeckController {
    private final DeckService deckService;

    public DeckController(DeckService deckService) {
        this.deckService = deckService;
    }

    @GetMapping
    public List<DeckResponse> getDecks() {
        return deckService.getDecks();
    }

    @PostMapping
    public DeckResponse createDeck(@RequestBody DeckRequest request) {
        return deckService.createDeck(request);
    }

    @DeleteMapping("/{deckId}")
    public void deleteDeck(@PathVariable Long deckId) {
        deckService.deleteDeck(deckId);
    }
}
