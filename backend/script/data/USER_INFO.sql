TRUNCATE TABLE USER_INFO; 
INSERT INTO USER_INFO (USERNAME, EMAIL, PASSWORD_HASH, ROLE_ID, DEFAULT_PAGE)
VALUES 
('John Doe', 'example@example.com', '$2a$10$uLfhv7VGXzFiHHhTcs2T.egQSkzibZ4SOQImhO6lKCASHCSYYOdqa', 'admin', 'dashboard');

COMMIT;
