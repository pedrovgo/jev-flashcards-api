# Flashcards API

A REST API for creating decks and flashcards, and reviewing answers with spaced repetition (FSRS). During a review, the model configured in OpenRouter compares the user's answer with the saved answer by meaning, considering key concepts and factual correctness rather than exact wording. Paraphrases and omissions that do not change the meaning should not be penalized. The resulting score determines the rating used by FSRS.

## Technologies

- Java 21 and Spring Boot
- PostgreSQL 16
- Spring Data JPA and Flyway
- FSRS
- OpenRouter (required for card reviews)

## Requirements

- JDK 21
- Docker and Docker Compose
- An OpenRouter API key to review cards

## Configuration

Create a `.env` file in the project root. It is ignored by Git:

```dotenv
POSTGRES_USER=flashcards
POSTGRES_PASSWORD=change-this-password
POSTGRES_DB=flashcards
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
OPENROUTER_API_KEY=your-openrouter-api-key
```

`POSTGRES_HOST` and `POSTGRES_PORT` are used by the application; their default values are `localhost` and `5432`. `OPENROUTER_API_KEY` can be left empty to start the application and use endpoints that do not perform reviews. Reviews fail if a valid key is not configured.

## Run

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Start the API in another terminal:

```bash
./mvnw spring-boot:run
```

The application is available at `http://localhost:8080`. Flyway applies database migrations automatically at startup.

To use the web interface, start the API and open `view/index.html` in a browser. Use **Add Deck** to open the deck-creation modal. Each deck row has **Add Card**, **Review**, and **Delete** controls. **Add Card** opens a form for the selected deck; **Review** loads its next card and opens a form for the answer. After submission, a result dialog displays the score and saved answer. Closing the result dialog loads the next card in that deck.

To run the tests:

```bash
./mvnw test
```

## Endpoints

All endpoints accept and return JSON.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/decks` | Lists decks that have not been deleted |
| `POST` | `/api/v1/decks` | Creates a deck |
| `POST` | `/api/v1/decks/{deckId}/reset` | Resets the review state of active cards in a deck |
| `DELETE` | `/api/v1/decks/{deckId}` | Soft-deletes a deck |
| `GET` | `/api/v1/cards/next?deckId={deckId}` | Gets the next non-deleted card in a deck, ordered by due date |
| `POST` | `/api/v1/cards` | Creates a card in a deck |
| `POST` | `/api/v1/cards/{id}/review` | Reviews a card's answer |
| `DELETE` | `/api/v1/cards/{id}` | Soft-deletes a card |

### List decks

```bash
curl http://localhost:8080/api/v1/decks
```

### Create a deck

```bash
curl -X POST http://localhost:8080/api/v1/decks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Biology"}'
```

Response:

```json
{
  "id": 1,
  "title": "Biology"
}
```

### Create a card

Use the ID of the created deck as `deckId`.

```bash
curl -X POST http://localhost:8080/api/v1/cards \
  -H 'Content-Type: application/json' \
  -d '{
    "deckId": 1,
    "question": "What is the basic unit of life?",
    "answer": "The cell."
  }'
```

### Get the next card in a deck

```bash
curl 'http://localhost:8080/api/v1/cards/next?deckId=1'
```

### Review a card

Send the user's answer. The card `id` is specified in the URL path.

```bash
curl -X POST http://localhost:8080/api/v1/cards/1/review \
  -H 'Content-Type: application/json' \
  -d '{"answer":"The cell"}'
```

The response includes the card data and the semantic review score (`score`). In the browser interface, the review result is shown in a dialog with the score and the card's saved answer.

### Delete a card

Card deletion is soft: the card remains in the database but is excluded from the next-card lookup.

```bash
curl -X DELETE http://localhost:8080/api/v1/cards/1
```

### Delete a deck

Deck deletion is soft: the deck is hidden from `GET /api/v1/decks` but remains in the database.

```bash
curl -X DELETE http://localhost:8080/api/v1/decks/1
```

### Reset a deck

Resetting a deck returns all non-deleted cards to their initial FSRS review state and clears their previous review scores. Card questions and answers are preserved.

```bash
curl -X POST http://localhost:8080/api/v1/decks/1/reset
```

Deck titles do not need to be unique.

## Project structure

```text
src/main/java/com/vgo/flashcards/
├── card/       # Cards and reviews
├── deck/       # Decks
├── config/     # FSRS configuration
└── openrouter/ # Semantic evaluation integration
src/main/resources/
└── db/migration/ # Flyway migrations
view/              # Browser-based interface
```
