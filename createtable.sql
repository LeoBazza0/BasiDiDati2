/* qui ho il file con tutti i CREATE TABLE 
aggiunto CHECK (XXXXXX)
UNIQUE(XXXXXX)
GRANT/REVOKE di esempio
*/

-- su questo ci dovremmo essere

CREATE TABLE utente (
    Username VARCHAR(32) PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE, -- Email unica per ogni utente
    Password VARCHAR(64) NOT NULL CHECK (char_length(Password) >= 8), -- almeno 8 caratteri
    FotoProfilo BYTEA -- BYTEA in PostgreSQL, BLOB in MySQL oppure memorizzo il path a file salvati nel filesystem come VARCHAR -- se funziona il tipo image FOLLIA
);

-- secondo me può fare qualcosa con il GRANT e DELETE, per eliminare i post
CREATE TABLE moderatore (
    Username VARCHAR(32) PRIMARY KEY,
    DataNomina DATE NOT NULL CHECK (DataNomina <= CURRENT_DATE), -- non può essere nel futuro
    FOREIGN KEY (Username) REFERENCES utente (Username) ON UPDATE CASCADE
);

-- secondo me può fare qualcosa con il GRANT e DELETE, per eliminare i post
CREATE TABLE amministratore (
    Username VARCHAR(32) PRIMARY KEY,
    FOREIGN KEY (Username) REFERENCES utente (Username) ON UPDATE CASCADE
);

CREATE TABLE post (
    IdPost VARCHAR(32) PRIMARY KEY,
    Utente VARCHAR(64) NOT NULL REFERENCES utente (Username) ON UPDATE CASCADE,
    DataPubblicazione DATE NOT NULL CHECK (
        DataPubblicazione <= CURRENT_DATE
    ), -- non nel futuro
    Moderato BOOLEAN NOT NULL
);

CREATE TABLE immagine (
    IdPost VARCHAR(32) PRIMARY KEY,
    pic BYTEA, -- BYTEA in PostgreSQL, BLOB in MySQL oppure memorizzo il path a file salvati nel filesystem come VARCHAR
    FOREIGN KEY (IdPost) REFERENCES post (IdPost) ON UPDATE CASCADE
);

CREATE TABLE testo (
    IdPost VARCHAR(32) PRIMARY KEY,
    txt VARCHAR(280),
    FOREIGN KEY (IdPost) REFERENCES post (IdPost) ON UPDATE CASCADE
);

CREATE TABLE mipiace ( -- rinominato per evitare conflitto con parola riservata 'like'
    Utente VARCHAR(64) NOT NULL REFERENCES utente (Username) ON UPDATE CASCADE,
    Post VARCHAR(32) NOT NULL REFERENCES post (IdPost) ON UPDATE CASCADE,
    PRIMARY KEY (Utente, Post)
);

CREATE TABLE follow (
    Utente1 VARCHAR(64) NOT NULL REFERENCES utente (Username) ON UPDATE CASCADE,
    Utente2 VARCHAR(64) NOT NULL REFERENCES utente (Username) ON UPDATE CASCADE,
    PRIMARY KEY (Utente1, Utente2),
    CHECK (Utente1 <> Utente2) -- non puoi seguire te stesso
);

-- non so se ha senso avere questa
CREATE TABLE moderare (
    Utente VARCHAR(64) NOT NULL REFERENCES moderatore (Username) ON UPDATE CASCADE,
    Post VARCHAR(32) NOT NULL REFERENCES post (IdPost) ON UPDATE CASCADE,
    PRIMARY KEY (Utente, Post)
);

CREATE TABLE flaggare (
    Utente VARCHAR(64) NOT NULL REFERENCES utente (Username) ON UPDATE CASCADE,
    Post VARCHAR(32) NOT NULL REFERENCES post (IdPost) ON UPDATE CASCADE,
    PRIMARY KEY (Utente, Post)
);

-- Esempi di GRANT: concedere permessi a moderatori e amministratori
-- Creo ruoli specifici se non esistono (opzionale)

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'moderator_role') THEN
        CREATE ROLE moderator_role;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'admin_role') THEN
        CREATE ROLE admin_role;
    END IF;
END
$$;

-- GRANT di esempio: i moderatori possono cancellare post
GRANT DELETE ON post TO moderator_role;

-- Gli amministratori possono fare tutto
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_role;

-- E revoco a PUBLIC (chiunque) i privilegi di scrittura sui post per sicurezza
REVOKE INSERT , UPDATE, DELETE ON post FROM PUBLIC;