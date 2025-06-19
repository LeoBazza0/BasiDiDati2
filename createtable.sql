/* qui ho il file con tutti i CREATE TABLE 
cose da mettere eventualmente 
CHECK (XXXXXX) 
UNIQUE(XXXXXX) 
*/

CREATE TABLE utente {
Username VARCHAR(32) PRIMARY KEY,
Email VARCHAR(255) NOT NULL,
Password VARCHAR (64) NOT NULL,
FotoProfilo BYTEA, -- BYTEA in PostgreSQL, BLOB in MySQL oppure memorizzo il path a file salvati nel filesystem come VARCHAR -- se funziona il tipo image FOLLIA
}

CREATE TABLE moderatore{
Username VARCHAR(32) PRIMARY KEY,
DataNomina DATE NOT NULL, 
FOREIGN KEY(Username) REFERENCES utente(Username) ON UPDATE CASCADE,
}

CREATE TABLE amministratore { 
Username VARCHAR(32) PRIMARY KEY,
FOREIGN KEY(Username) REFERENCES utente(Username) ON UPDATE CASCADE,
}

CREATE TABLE post {
IdPost VARCHAR (32) PRIMARY KEY,
Utente VARCHAR(64) NOT NULL REFERENCES utente(Username) ON UPDATE CASCADE,
DataPubblicazione DATE NOT NULL,
Moderato BOOLEAN NOT NULL,
}

CREATE TABLE immagine {
IdPost VARCHAR (32) PRIMARY KEY,
pic BYTEA, -- BYTEA in PostgreSQL, BLOB in MySQL oppure memorizzo il path a file salvati nel filesystem come VARCHAR
FOREIGN KEY(IdPost) REFERENCES post(IdPost) ON UPDATE CASCADE,
}

CREATE TABLE testo {
IdPost VARCHAR (32) PRIMARY KEY,
txt VARCHAR(280),
FOREIGN KEY(IdPost) REFERENCES post(IdPost) ON UPDATE CASCADE,
}

CREATE TABLE like {
Utente VARCHAR (64) NOT NULL REFERENCES utente(Username) ON UPDATE CASCADE,
Post VARCHAR (32) NOT NULL REFERENCES post(IdPost) ON UPDATE CASCADE,
PRIMARY KEY (Utente, Post),
}

CREATE TABLE follow { 
Utente1 VARCHAR (64) NOT NULL REFERENCES utente(Username) ON UPDATE CASCADE,
Utente2 VARCHAR (64) NOT NULL REFERENCES utente(Username) ON UPDATE CASCADE,
PRIMARY KEY (Utente1, Utente2), 
}

-- non so se ha senso avere questa
CREATE TABLE moderare {
Utente VARCHAR (64) NOT NULL REFERENCES moderatore(Username) ON UPDATE CASCADE,
Post VARCHAR (32) NOT NULL REFERENCES post(IdPost) ON UPDATE CASCADE,
PRIMARY KEY (Utente, Post),
}

CREATE TABLE flaggare {
Utente VARCHAR (64) NOT NULL REFERENCES utente(Username) ON UPDATE CASCADE,
Post VARCHAR (32) NOT NULL REFERENCES post(IdPost) ON UPDATE CASCADE,
PRIMARY KEY (Utente, Post),
}