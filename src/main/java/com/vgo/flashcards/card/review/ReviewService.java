package com.vgo.flashcards.card.review;

import com.vgo.flashcards.card.Card;
import com.vgo.flashcards.openrouter.JevDecisionClient;
import com.vgo.flashcards.openrouter.JevDecisionRequest;
import com.vgo.flashcards.openrouter.JevDecisionResponse;
import io.github.openspacedrepetition.CardAndReviewLog;
import io.github.openspacedrepetition.Rating;
import io.github.openspacedrepetition.Scheduler;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    private final JevDecisionClient jevDecisionClient;
    private final JevDecisionReviewRequestFactory jevDecisionReviewRequestFactory;
    private final Scheduler scheduler;

    public ReviewService(
            JevDecisionClient jevDecisionClient,
            JevDecisionReviewRequestFactory jevDecisionReviewRequestFactory,
            Scheduler scheduler
    ) {
        this.jevDecisionClient = jevDecisionClient;
        this.jevDecisionReviewRequestFactory = jevDecisionReviewRequestFactory;
        this.scheduler = scheduler;
    }

    public Card reviewFlashcard(Card card, String userAnswer) {
        final io.github.openspacedrepetition.Card fsrsCard = card.toFsrsCard();
        final Pair<Rating,Double> ratingScorePair = this.classifyReview(card, userAnswer);
        final CardAndReviewLog cardReview = scheduler.reviewCard(fsrsCard, ratingScorePair.getFirst());

        card.setScore(ratingScorePair.getSecond());

        return card.updateFromFsrsCard(cardReview.card());
    }

    private Pair<Rating, Double> classifyReview(Card card, String userAnswer) {
        JevDecisionRequest request = this.jevDecisionReviewRequestFactory.create(card, userAnswer);
        JevDecisionResponse response = jevDecisionClient.classify(request);
        JevDecisionResponse.JevAnswer assessment = response.answers().get("assessment");

        final int legendCount = assessment.legend().size() - 1;
        final Double result = (assessment.score() * 100) / legendCount;

        return Pair.of(mapScoreToRating(result), result);
    }

    private Rating mapScoreToRating(Double score) {
        if (score >= 90) {
            return Rating.EASY;
        } else if (score >= 80) {
            return Rating.GOOD;
        } else if (score >= 70) {
            return Rating.HARD;
        }
        return Rating.AGAIN;
    }
}
