DELETE FROM MENU_NAME; 
-- Insert Menu Name for both English and Korean
INSERT INTO MENU_NAME (MENU_ID, LANG_CODE, MENU_NAME)
VALUES
-- Home Menu
('dashboard', 'en', 'Dashboard'),
('dashboard', 'ko', '대시보드'),

-- Example Menu
('example', 'en', 'Example'),
('example', 'ko', '예시'),

-- Checkout Menu
('checkout', 'en', 'Checkout'),
('checkout', 'ko', '체크아웃'),

-- Checkout2 Menu
('checkout2', 'en', 'Checkout2'),
('checkout2', 'ko', '체크아웃2'),

-- Table Menu
('table', 'en', 'Table'),
('table', 'ko', '테이블'),

-- DataTable Menu
('datatable', 'en', 'Data Table'),
('datatable', 'ko', '데이터 테이블'),

('example-dashboard', 'en', 'Dashboard'),
('example-dashboard', 'ko', '대시보드'),

-- Stock Menu
('stock', 'en', 'Stock'),
('stock', 'ko', '주식'),

-- Ticker Menu
('stock-list', 'en', 'Stock List'),
('stock-list', 'ko', '주식 목록'),

('market-overview', 'en', 'Market Overview'),
('market-overview', 'ko', '시장 개요'),

('stock-data-file-management', 'en', 'Data File Management'),
('stock-data-file-management', 'ko', '데이터 파일 관리'),

('stock-technical-analysis', 'en', 'Technical Analysis'),
('stock-technical-analysis', 'ko', '기술적 분석'),
-- Reference Info Menu
('system', 'en', 'System'),
('system', 'ko', '시스템'),

-- User Info Menu
('user-info', 'en', 'User Management'),
('user-info', 'ko', '사용자 관리'),

-- Menu Info Menu
('menu-info', 'en', 'Menu Management'),
('menu-info', 'ko', '메뉴 관리'),

-- Role Info Menu
('role-info', 'en', 'Role Management'),
('role-info', 'ko', '권한 관리');
('schedule', 'en', 'Scheduled Tasks'),
('schedule', 'ko', '스케줄 작업');
COMMIT;
