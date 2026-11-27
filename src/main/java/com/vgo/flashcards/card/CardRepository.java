package com.vgo.flashcards.card;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {

    Card findFirstByDeckIdAndDeletedFalseOrderByDueAsc(Long deckId);

    List<Card> findAllByDeckIdAndDeletedFalse(Long deckId);

    @Modifying
    @Query("UPDATE Card c SET c.deleted = true WHERE c.id = :cardId")
    void softDeleteById(Long cardId);
}
