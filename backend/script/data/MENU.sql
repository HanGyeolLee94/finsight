DELETE FROM MENU; 
INSERT INTO MENU (MENU_ID, P_MENU_ID, PATH, ORDER_NUM)
VALUES
('dashboard', NULL, '/', 1),
('example', NULL, NULL, 2),
--('checkout', 'example', '/example/checkout', 10),
--('checkout2', 'example', '/example/checkout2', 20),
--('table', 'example', '/example/table', 30),
('datatable', 'example', '/example/datatable', 40),
--('example-dashboard', 'example', '/example/dashboard', 50),
('stock', NULL, NULL, 6),
('stock-list', 'stock', '/stock/stock-list', 10),
('market-overview', 'stock', '/stock/market-overview', 20),
('stock-data-file-management', 'stock', '/stock/data-file-management', 30),
('stock-technical-analysis', 'stock', '/stock/technical-analysis', 40),
('system', NULL, NULL, 7),
('user-info', 'system', '/system/user-info', 10),
('menu-info', 'system', '/system/menu-info', 20),
('role-info', 'system', '/system/role-info', 30);
('schedule', 'system', '/system/schedule', 40);

COMMIT;