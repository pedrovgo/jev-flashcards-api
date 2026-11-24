package com.vgo.flashcards.openrouter;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties("openrouter")
public record OpenRouterProperties(
		String apiKey,
		String model,
		String instructions,
		List<String> criteria
) {
}
