/* qui metto un po di INSERT INTO per popolare le varie tabelle */
/* dati immaginari */

INSERT INTO
    utente (
        Username,
        Email,
        Password,
        FotoProfilo
    )
VALUES (
        'user01',
        'user01@mail.com',
        'hashpwd01',
        NULL
    ),
    (
        'user02',
        'user02@mail.com',
        'hashpwd02',
        NULL
    ),
    (
        'user03',
        'user03@mail.com',
        'hashpwd03',
        NULL
    ),
    (
        'user04',
        'user04@mail.com',
        'hashpwd04',
        NULL
    ),
    (
        'user05',
        'user05@mail.com',
        'hashpwd05',
        NULL
    ),
    (
        'user06',
        'user06@mail.com',
        'hashpwd06',
        NULL
    ),
    (
        'user07',
        'user07@mail.com',
        'hashpwd07',
        NULL
    ),
    (
        'user08',
        'user08@mail.com',
        'hashpwd08',
        NULL
    ),
    (
        'user09',
        'user09@mail.com',
        'hashpwd09',
        NULL
    ),
    (
        'user10',
        'user10@mail.com',
        'hashpwd10',
        NULL
    ),
    (
        'user11',
        'user11@mail.com',
        'hashpwd11',
        NULL
    ),
    (
        'user12',
        'user12@mail.com',
        'hashpwd12',
        NULL
    ),
    (
        'user13',
        'user13@mail.com',
        'hashpwd13',
        NULL
    ),
    (
        'user14',
        'user14@mail.com',
        'hashpwd14',
        NULL
    ),
    (
        'user15',
        'user15@mail.com',
        'hashpwd15',
        NULL
    ),
    (
        'user16',
        'user16@mail.com',
        'hashpwd16',
        NULL
    ),
    (
        'user17',
        'user17@mail.com',
        'hashpwd17',
        NULL
    ),
    (
        'user18',
        'user18@mail.com',
        'hashpwd18',
        NULL
    ),
    (
        'user19',
        'user19@mail.com',
        'hashpwd19',
        NULL
    ),
    (
        'user20',
        'user20@mail.com',
        'hashpwd20',
        NULL
    ),
    (
        'user21',
        'user21@mail.com',
        'hashpwd21',
        NULL
    ),
    (
        'user22',
        'user22@mail.com',
        'hashpwd22',
        NULL
    ),
    (
        'user23',
        'user23@mail.com',
        'hashpwd23',
        NULL
    ),
    (
        'user24',
        'user24@mail.com',
        'hashpwd24',
        NULL
    ),
    (
        'user25',
        'user25@mail.com',
        'hashpwd25',
        NULL
    ),
    (
        'user26',
        'user26@mail.com',
        'hashpwd26',
        NULL
    ),
    (
        'user27',
        'user27@mail.com',
        'hashpwd27',
        NULL
    ),
    (
        'user28',
        'user28@mail.com',
        'hashpwd28',
        NULL
    ),
    (
        'user29',
        'user29@mail.com',
        'hashpwd29',
        NULL
    ),
    (
        'user30',
        'user30@mail.com',
        'hashpwd30',
        NULL
    ),
    (
        'user31',
        'user31@mail.com',
        'hashpwd31',
        NULL
    ),
    (
        'user32',
        'user32@mail.com',
        'hashpwd32',
        NULL
    ),
    (
        'user33',
        'user33@mail.com',
        'hashpwd33',
        NULL
    ),
    (
        'user34',
        'user34@mail.com',
        'hashpwd34',
        NULL
    ),
    (
        'user35',
        'user35@mail.com',
        'hashpwd35',
        NULL
    );

--  amministratori (user01 -> user05)
INSERT INTO
    amministratore (Username)
VALUES ('user01'),
    ('user02'),
    ('user03'),
    ('user04'),
    ('user05');

-- moderatori (user06 -> user10)
INSERT INTO
    moderatore (Username, DataNomina)
VALUES ('user06', '2023-05-01'),
    ('user07', '2023-06-01'),
    ('user08', '2023-07-15'),
    ('user09', '2023-08-20'),
    ('user10', '2023-09-10');

INSERT INTO
    post (
        Idpost,
        Utente,
        DataPubblicazione,
        Moderato
    )
VALUES (
        'post001',
        'user01',
        '2024-05-10',
        TRUE
    ),
    (
        'post002',
        'user02',
        '2024-05-11',
        FALSE
    ),
    (
        'post003',
        'user03',
        '2024-05-11',
        FALSE
    ),
    (
        'post004',
        'user04',
        '2024-05-12',
        TRUE
    ),
    (
        'post005',
        'user05',
        '2024-05-13',
        FALSE
    ),
    (
        'post006',
        'user11',
        '2024-05-14',
        FALSE
    ),
    (
        'post007',
        'user12',
        '2024-05-14',
        TRUE
    ),
    (
        'post008',
        'user13',
        '2024-05-15',
        FALSE
    ),
    (
        'post009',
        'user14',
        '2024-05-16',
        TRUE
    ),
    (
        'post010',
        'user15',
        '2024-05-17',
        FALSE
    ),
    (
        'post011',
        'user16',
        '2024-05-18',
        TRUE
    ),
    (
        'post012',
        'user17',
        '2024-05-19',
        FALSE
    ),
    (
        'post013',
        'user18',
        '2024-05-20',
        FALSE
    ),
    (
        'post014',
        'user19',
        '2024-05-21',
        FALSE
    ),
    (
        'post015',
        'user20',
        '2024-05-21',
        FALSE
    ),
    (
        'post016',
        'user21',
        '2024-05-22',
        FALSE
    ),
    (
        'post017',
        'user22',
        '2024-05-23',
        FALSE
    ),
    (
        'post018',
        'user23',
        '2024-05-24',
        FALSE
    ),
    (
        'post019',
        'user24',
        '2024-05-25',
        FALSE
    ),
    (
        'post020',
        'user25',
        '2024-05-26',
        FALSE
    );

INSERT INTO
    "mipiace" (Utente, post)
VALUES ('user01', 'post002'),
    ('user02', 'post001'),
    ('user03', 'post004'),
    ('user04', 'post003'),
    ('user05', 'post005'),
    ('user06', 'post006'),
    ('user07', 'post007'),
    ('user08', 'post008'),
    ('user09', 'post009'),
    ('user10', 'post010'),
    ('user11', 'post001'),
    ('user12', 'post003'),
    ('user13', 'post002'),
    ('user14', 'post005'),
    ('user15', 'post004'),
    ('user16', 'post006'),
    ('user17', 'post007'),
    ('user18', 'post008'),
    ('user19', 'post009'),
    ('user20', 'post010'),
    ('user26', 'post001'),
    ('user26', 'post002'),
    ('user27', 'post003'),
    ('user27', 'post004'),
    ('user28', 'post005'),
    ('user28', 'post006'),
    ('user29', 'post007'),
    ('user29', 'post008'),
    ('user30', 'post009'),
    ('user30', 'post010'),
    ('user31', 'post002'),
    ('user31', 'post004'),
    ('user32', 'post006'),
    ('user32', 'post008'),
    ('user33', 'post003'),
    ('user33', 'post005'),
    ('user34', 'post007'),
    ('user34', 'post009'),
    ('user35', 'post001'),
    ('user35', 'post010');

INSERT INTO
    follow (Utente1, Utente2)
VALUES ('user01', 'user02'),
    ('user01', 'user03'),
    ('user02', 'user01'),
    ('user03', 'user04'),
    ('user05', 'user06'),
    ('user07', 'user08'),
    ('user09', 'user10'),
    ('user11', 'user12'),
    ('user13', 'user14'),
    ('user20', 'user01'),
    ('user26', 'user01'),
    ('user26', 'user10'),
    ('user26', 'user15'),
    ('user27', 'user02'),
    ('user27', 'user03'),
    ('user28', 'user04'),
    ('user28', 'user06'),
    ('user29', 'user05'),
    ('user29', 'user07'),
    ('user30', 'user08'),
    ('user30', 'user09'),
    ('user31', 'user01'),
    ('user31', 'user20'),
    ('user32', 'user18'),
    ('user33', 'user19'),
    ('user33', 'user25'),
    ('user34', 'user21'),
    ('user34', 'user22'),
    ('user35', 'user23'),
    ('user35', 'user24'),
    ('user05', 'user26'),
    ('user10', 'user27'),
    ('user15', 'user28'),
    ('user20', 'user29'),
    ('user25', 'user30'),
    ('user01', 'user31'),
    ('user02', 'user32'),
    ('user03', 'user33'),
    ('user04', 'user34'),
    ('user06', 'user35');

INSERT INTO
    flaggare (Utente, post)
VALUES ('user15', 'post003'),
    ('user16', 'post007'),
    ('user17', 'post009');

-- non so se ha senso avere questa
INSERT INTO
    moderare (Utente, post)
VALUES ('user06', 'post001'),
    ('user07', 'post004'),
    ('user08', 'post007'),
    ('user09', 'post009'),
    ('user10', 'post011');