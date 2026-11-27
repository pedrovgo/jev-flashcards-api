package com.vgo.flashcards.card;

import com.vgo.flashcards.card.dto.CardResponse;
import com.vgo.flashcards.deck.Deck;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Data
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "deck_id", nullable = false)
    private Deck deck;

    @Column(nullable = false, length = 512)
    private String question;

    @Column(nullable = false, length = 4096)
    private String answer;

    private Integer fsrsId;

    @Enumerated(EnumType.STRING)
    private CardState state;

    private Integer step;

    private Double stability;

    private Double difficulty;

    private Instant due;

    private Instant lastReview;

    private Double score;

    private Boolean deleted;

    public io.github.openspacedrepetition.Card toFsrsCard() {
        return this.fsrsId != null ? io.github.openspacedrepetition.Card.builder()
                .cardId(this.fsrsId)
                .state(this.state.toFsrsState())
                .step(this.step)
                .stability(this.stability)
                .difficulty(this.difficulty)
                .due(this.due)
                .lastReview(this.lastReview)
                .build() : io.github.openspacedrepetition.Card.builder().build();
    }

    public CardResponse toResponse() {
        return CardResponse.builder()
                .id(this.id)
                .question(this.question)
                .answer(this.answer)
                .score(this.score)
                .build();
    }

    public Card updateFromFsrsCard(io.github.openspacedrepetition.Card fsrsCard) {
        this.fsrsId = fsrsCard.getCardId();
        this.state = CardState.fromFsrsState(fsrsCard.getState());
        this.step = fsrsCard.getStep();
        this.stability = fsrsCard.getStability();
        this.difficulty = fsrsCard.getDifficulty();
        this.due = fsrsCard.getDue();
        this.lastReview = fsrsCard.getLastReview();
        this.score = null;
        return this;
    }
}
