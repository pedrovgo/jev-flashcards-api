package com.vgo.flashcards.card.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@Builder
public class CardResponse {
    private Long id;
    private String question;
    private String answer;
    private Double score;
}
