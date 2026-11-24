package com.vgo.flashcards.openrouter;

import java.util.List;

public record JevQuestion(
		String type,
		String instructions,
		List<String> criteria
) {
}
