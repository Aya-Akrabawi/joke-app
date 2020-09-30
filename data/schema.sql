DROP TABLE IF EXISTS jdwal;

CREATE TABLE jdwal (
    ids serial PRIMARY KEY,
    id VARCHAR(255) ,
    type VARCHAR(255) ,
    setup VARCHAR(255) ,
    punchline VARCHAR(255) 
);