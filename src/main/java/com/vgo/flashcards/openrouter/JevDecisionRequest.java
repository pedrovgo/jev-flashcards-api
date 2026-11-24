package com.vgo.flashcards.openrouter;

import java.util.Map;

public record JevDecisionRequest(
		String model,
		JevState state,
		Map<String, JevQuestion> questions
) {
}
