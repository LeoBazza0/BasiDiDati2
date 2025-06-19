/* qui ho il file con tutti i CREATE TABLE 
cose da mettere eventualmente 
CHECK (XXXXXX) 
UNIQUE(XXXXXX) 
Ospedale CHAR(5) NOT NULL REFERENCES Ospedale(Codice) ON UPDATE CASCADE 
FOREIGN KEY(CF) REFERENCES Personale(CF) ON UPDATE CASCADE 
PRIMARY KEY (XXX, XXX, XXX),

*/

CREATE TABLE utente {
Username CHAR(32) PRIMARY KEY,
Email CHAR(64) NOT NULL,
Password CHAR (64) NOT NULL,
FotoProfilo IMAGE -- non so se va boolean o no -- se funziona il tipo image FOLLIA
}

CREATE TABLE moderatore{
Username CHAR(32) PRIMARY KEY,
Email CHAR(64) NOT NULL, -- serve anche questa?
DataNomina DATE NOT NULL, 
FOREIGN KEY(Username) REFERENCES utente(Username) ON UPDATE CASCADE,
}

CREATE TABLE amministratore { 
Username CHAR(32) PRIMARY KEY,
-- Email CHAR(64) NOT NULL, -- serve anche questa?
FOREIGN KEY(Username) REFERENCES utente(Username) ON UPDATE CASCADE,
}

CREATE TABLE post {
IdPost CHAR (32) PRIMARY KEY
Utente CHAR(64) NOT NULL REFERENCES utente(Username) ON UPDATE CASCADE,
DataPubblicazione DATE NOT NULL,
Moderato BOOLEAN NOT NULL,
}

CREATE TABLE immagine {
IdPost CHAR (32) PRIMARY KEY,
pic IMAGE, -- non funzionerà mai, ma l'idea è carina
FOREIGN KEY(IdPost) REFERENCES post(IdPost) ON UPDATE CASCADE,
}

CREATE TABLE testo {
IdPost CHAR (32) PRIMARY KEY,
txt VARCHAR(280),
FOREIGN KEY(IdPost) REFERENCES post(IdPost) ON UPDATE CASCADE,
}

CREATE TABLE like {
Utente CHAR (64) NOT NULL REFERENCES utente(Username) ON UPDATE CASCADE,
Post CHAR (32) NOT NULL REFERENCES post(IdPost) ON UPDATE CASCADE,
PRIMARY KEY (Utente, Post), -- serve?
}

CREATE TABLE follow { 
Utente1 CHAR (64) NOT NULL REFERENCES utente(Username) ON UPDATE CASCADE,
Utente2 CHAR (64) NOT NULL REFERENCES utente(Username) ON UPDATE CASCADE,
PRIMARY KEY (Utente1, Utente2), -- serve?
}

-- non so se ha senso avere questa
CREATE TABLE pubblica { 
Utente CHAR (64) NOT NULL REFERENCES utente(Username) ON UPDATE CASCADE,
Post CHAR (32) NOT NULL REFERENCES post(IdPost) ON UPDATE CASCADE,
PRIMARY KEY (Utente, Post), -- serve?
}

-- non so se ha senso avere questa
CREATE TABLE moderare {
Utente CHAR (64) NOT NULL REFERENCES moderatore(Username) ON UPDATE CASCADE,
Post CHAR (32) NOT NULL REFERENCES post(IdPost) ON UPDATE CASCADE,
PRIMARY KEY (Utente, Post), -- serve?
}

-- non so se ha senso avere questa
CREATE TABLE flaggare {
Utente CHAR (64) NOT NULL REFERENCES utente(Username) ON UPDATE CASCADE,
Post CHAR (32) NOT NULL REFERENCES post(IdPost) ON UPDATE CASCADE,
PRIMARY KEY (Utente, Post), -- serve?
}