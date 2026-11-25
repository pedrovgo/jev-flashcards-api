package com.vgo.flashcards.deck;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeckRepository extends JpaRepository<Deck, Long> {
    List<Deck> findByDeletedFalse();

    @Modifying
    @Query("UPDATE Deck d SET d.deleted = true WHERE d.id = :deckId")
    void softDeleteById(Long deckId);
}
