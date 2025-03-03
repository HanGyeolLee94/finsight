-- Add foreign key between P_MENU_ID in MENU table and MENU_ID in the same table
ALTER TABLE MENU
ADD CONSTRAINT FK_MENU_PARENT
FOREIGN KEY (P_MENU_ID) REFERENCES MENU(MENU_ID)
ON DELETE CASCADE;