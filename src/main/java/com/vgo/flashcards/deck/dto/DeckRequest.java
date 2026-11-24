package com.vgo.flashcards.deck.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@Builder
public class DeckRequest {
    private String title;
}
