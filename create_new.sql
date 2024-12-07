BEGIN;

-- Drop all tables
DROP TABLE IF EXISTS public.pokemon CASCADE;
DROP TABLE IF EXISTS public.species CASCADE;
DROP TABLE IF EXISTS public.types CASCADE;
DROP TABLE IF EXISTS public.pokemon_types CASCADE;
DROP TABLE IF EXISTS public.moves CASCADE;
DROP TABLE IF EXISTS public.pokemon_moves CASCADE;
DROP TABLE IF EXISTS public.abilities CASCADE;
DROP TABLE IF EXISTS public.pokemon_abilities CASCADE;
DROP TABLE IF EXISTS public.evolutions CASCADE;
DROP TABLE IF EXISTS public.pokemon_base_stats CASCADE;
DROP TABLE IF EXISTS public.type_effectiveness CASCADE;
DROP TABLE IF EXISTS public.natures CASCADE;

-- Create tables
CREATE TABLE public.pokemon (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    species_id INTEGER NOT NULL,
    height INTEGER,
    weight INTEGER,
    base_experience INTEGER,
    description TEXT
);

CREATE TABLE public.species (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE public.types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
		color VARCHAR(7) NOT NULL
);

CREATE TABLE public.pokemon_types (
    pokemon_id INTEGER NOT NULL,
    type_id INTEGER NOT NULL,
    PRIMARY KEY (pokemon_id, type_id)
);

CREATE TABLE public.moves (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    types_id INTEGER NOT NULL,
    power INTEGER,
    accuracy INTEGER,
    power_point SMALLINT
);

CREATE TABLE public.pokemon_moves (
    pokemon_id INTEGER NOT NULL,
    move_id INTEGER NOT NULL,
    PRIMARY KEY (pokemon_id, move_id)
);

CREATE TABLE public.abilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE public.pokemon_abilities (
    pokemon_id INTEGER NOT NULL,
    ability_id INTEGER NOT NULL,
    PRIMARY KEY (pokemon_id, ability_id)
);

CREATE TABLE public.evolutions (
    base_pokemon_id INTEGER NOT NULL,
    evolved_pokemon_id INTEGER NOT NULL,
    method VARCHAR(100),
    PRIMARY KEY (base_pokemon_id, evolved_pokemon_id)
);

CREATE TABLE public.pokemon_base_stats (
    pokemon_id INTEGER PRIMARY KEY,
    hp SMALLINT NOT NULL,
    attack SMALLINT NOT NULL,
    defense SMALLINT NOT NULL,
    special_attack SMALLINT NOT NULL,
    special_defense SMALLINT NOT NULL,
    speed SMALLINT NOT NULL
);

CREATE TABLE public.type_effectiveness (
    attacking_type_id INTEGER NOT NULL,
    defending_type_id INTEGER NOT NULL,
    effectiveness REAL NOT NULL,
    PRIMARY KEY (attacking_type_id, defending_type_id)
);

CREATE TABLE public.natures (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    increased_stat VARCHAR(50) NOT NULL,
    decreased_stat VARCHAR(50) NOT NULL,
    description TEXT
);

-- Add foreign key constraints
ALTER TABLE public.pokemon
    ADD CONSTRAINT fk_species FOREIGN KEY (species_id)
    REFERENCES public.species (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE public.pokemon_types
    ADD CONSTRAINT fk_pokemon_types_pokemon FOREIGN KEY (pokemon_id)
    REFERENCES public.pokemon (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE public.pokemon_types
    ADD CONSTRAINT fk_pokemon_types_type FOREIGN KEY (type_id)
    REFERENCES public.types (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE public.moves
    ADD CONSTRAINT fk_moves_type FOREIGN KEY (types_id)
    REFERENCES public.types (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE public.pokemon_moves
    ADD CONSTRAINT fk_pokemon_moves_pokemon FOREIGN KEY (pokemon_id)
    REFERENCES public.pokemon (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE public.pokemon_moves
    ADD CONSTRAINT fk_pokemon_moves_move FOREIGN KEY (move_id)
    REFERENCES public.moves (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE public.pokemon_abilities
    ADD CONSTRAINT fk_pokemon_abilities_pokemon FOREIGN KEY (pokemon_id)
    REFERENCES public.pokemon (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE public.pokemon_abilities
    ADD CONSTRAINT fk_pokemon_abilities_ability FOREIGN KEY (ability_id)
    REFERENCES public.abilities (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE public.evolutions
    ADD CONSTRAINT fk_evolutions_base FOREIGN KEY (base_pokemon_id)
    REFERENCES public.pokemon (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE public.evolutions
    ADD CONSTRAINT fk_evolutions_evolved FOREIGN KEY (evolved_pokemon_id)
    REFERENCES public.pokemon (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE public.pokemon_base_stats
    ADD CONSTRAINT fk_pokemon_base_stats_pokemon FOREIGN KEY (pokemon_id)
    REFERENCES public.pokemon (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE public.type_effectiveness
    ADD CONSTRAINT fk_type_effectiveness_attacking FOREIGN KEY (attacking_type_id)
    REFERENCES public.types (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE public.type_effectiveness
    ADD CONSTRAINT fk_type_effectiveness_defending FOREIGN KEY (defending_type_id)
    REFERENCES public.types (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

COMMIT;
