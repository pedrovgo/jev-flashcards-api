package com.vgo.flashcards.card.dto;

import lombok.*;

@Data
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CardRequest {
    private Long deckId;
    private String question;
    private String answer;
}
