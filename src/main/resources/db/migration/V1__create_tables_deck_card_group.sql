CREATE TABLE public.deck (
	id SERIAL PRIMARY KEY,
	title varchar(60) NOT NULL,
	CONSTRAINT deck_title_unique UNIQUE (title)
);

CREATE TABLE public.card (
	id SERIAL PRIMARY KEY,
	answer varchar(4096) NOT NULL,
	difficulty float8 NULL,
	due timestamptz(6) NOT NULL,
	fsrs_id int4 NOT NULL,
	last_review timestamptz(6) NULL,
	question varchar(512) NOT NULL,
	score float8 NULL,
	stability float8 NULL,
	state varchar(255) NOT NULL,
	step int4 NOT NULL,
	deck_id int8 NOT NULL,
	CONSTRAINT card_state_check CHECK (((state)::text = ANY ((ARRAY['LEARNING'::character varying, 'REVIEW'::character varying, 'RELEARNING'::character varying])::text[]))),
	CONSTRAINT card_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.deck(id)
);