ALTER TABLE public.card
ADD COLUMN deleted boolean NOT NULL DEFAULT false;

CREATE INDEX idx_card_due_active
ON card (due)
WHERE deleted = false;