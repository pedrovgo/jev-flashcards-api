package com.vgo.flashcards.card;

import com.vgo.flashcards.card.dto.CardRequest;
import com.vgo.flashcards.card.dto.CardResponse;
import com.vgo.flashcards.card.review.dto.ReviewRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cards")
public class CardController {
    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @PostMapping
    public CardResponse createCard(@RequestBody CardRequest request) {
        return cardService.createCard(request);
    }

    @PostMapping(path = "/{id}/review")
    public CardResponse processCard(@PathVariable Long id, @RequestBody ReviewRequest request) {
        request.setCardId(id);
        return cardService.reviewFlashcard(request);
    }
}
