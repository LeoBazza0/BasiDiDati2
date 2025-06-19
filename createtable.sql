/* qui ho il file con tutti i CREATE TABLE 
cose da mettere eventualmente 
CHECK (XXXXXX) 
UNIQUE(XXXXXX) 
Ospedale CHAR(5) NOT NULL REFERENCES Ospedale(Codice) ON UPDATE CASCADE 
FOREIGN KEY(CF) REFERENCES Personale(CF) ON UPDATE CASCADE 
PRIMARY KEY (XXX, XXX, XXX),

*/

CREATE TABLE post {
IdPost CHAR (32) PRIMARY KEY
Utente CHAR(64) NOT NULL REFERENCES utente(Username, Mail) ON UPDATE CASCADE,
DataPubblicazione DATE NOT NULL,
Moderato BOOLEAN NOT NULL,
-- Descrizione VARCHAR(200), 

}