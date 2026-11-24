package com.vgo.flashcards.openrouter;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public record JevDecisionResponse(
		String model,
		Map<String, JevAnswer> answers,
		JevUsage usage,
		String id,
		String provider
) {
	public record JevAnswer(
			String type,
			Double score,
			Map<String, String> legend,
			Map<String, Double> probabilities,
			double confidence
	) {
	}

	public record JevUsage(
			@JsonProperty("input_tokens")
			int inputTokens,
			@JsonProperty("output_tokens")
			int outputTokens,
			double cost
	) {
	}
}
