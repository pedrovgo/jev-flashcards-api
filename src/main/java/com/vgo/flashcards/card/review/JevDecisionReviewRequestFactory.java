package com.vgo.flashcards.card.review;

import com.vgo.flashcards.card.Card;
import com.vgo.flashcards.openrouter.JevDecisionRequest;
import com.vgo.flashcards.openrouter.JevQuestion;
import com.vgo.flashcards.openrouter.OpenRouterProperties;
import com.vgo.flashcards.openrouter.JevState;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class JevDecisionReviewRequestFactory {

	private final String model;
	private final String instructions;
	private final List<String> criteria;

	public JevDecisionReviewRequestFactory(OpenRouterProperties properties) {
		this.model = properties.model();
		this.instructions = properties.instructions();
		this.criteria = properties.criteria();
	}

	public JevDecisionRequest create(Card card, String userAnswer) {
		return new JevDecisionRequest(model, buildState(card, userAnswer), buildQuestions());
	}

	private JevState buildState(Card card, String userAnswer) {
		return new JevState(
				card.getQuestion(),
				card.getAnswer(),
				userAnswer
		);
	}

	private Map<String, JevQuestion> buildQuestions() {
		Map<String, JevQuestion> questions = new HashMap<>();
		questions.put("assessment", new JevQuestion(
				"score", this.instructions, this.criteria
		));
		return questions;
	}
}
