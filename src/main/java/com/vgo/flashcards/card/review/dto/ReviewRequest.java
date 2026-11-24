package com.vgo.flashcards.card.review.dto;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class ReviewRequest {
    private Long cardId;
    private String answer;
}
