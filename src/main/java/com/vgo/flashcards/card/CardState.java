package com.vgo.flashcards.card;

public enum CardState {
    LEARNING(1),
    REVIEW(2),
    RELEARNING(3);

    private final int value;

    private CardState(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public io.github.openspacedrepetition.State toFsrsState() {
        return switch (this) {
            case LEARNING -> io.github.openspacedrepetition.State.LEARNING;
            case REVIEW -> io.github.openspacedrepetition.State.REVIEW;
            case RELEARNING -> io.github.openspacedrepetition.State.RELEARNING;
        };
    }

    public static CardState fromFsrsState(io.github.openspacedrepetition.State fsrsState) {
        return switch (fsrsState) {
            case LEARNING -> LEARNING;
            case REVIEW -> REVIEW;
            case RELEARNING -> RELEARNING;
        };
    }
}
