CREATE DATABASE IF NOT EXISTS idms_db;
USE idms_db;
-- Spring Data JPA creates/updates the batches and interns tables on startup.
-- interns.batch_id is a NOT NULL foreign key referencing batches.id.
