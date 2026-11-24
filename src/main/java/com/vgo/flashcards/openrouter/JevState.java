package com.vgo.flashcards.openrouter;

public record JevState(
		String question,
		String correctAnswer,
		String userAnswer
) {
}
