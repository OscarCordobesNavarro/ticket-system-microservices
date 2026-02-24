CREATE TABLE IF NOT EXISTS bookings (
    id           BIGSERIAL    PRIMARY KEY,
    event_id     BIGINT       NOT NULL,
    ticket_type_id BIGINT     NOT NULL,
    user_id      BIGINT       NOT NULL,
    quantity     INTEGER      NOT NULL,
    status       VARCHAR(50),
    created_at   TIMESTAMP,
    expires_at   TIMESTAMP
);
