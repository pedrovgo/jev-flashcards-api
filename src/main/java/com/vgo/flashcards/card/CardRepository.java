package com.vgo.flashcards.card;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {

    Card findFirstByDeckIdAndDeletedFalseOrderByDueAsc(Long deckId);

    @Modifying
    @Query("UPDATE Card c SET c.deleted = true WHERE c.id = :cardId")
    void softDeleteById(Long cardId);
}
