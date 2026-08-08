-- programs 테이블에 가격 관련 컬럼 추가
ALTER TABLE programs ADD COLUMN IF NOT EXISTS price integer DEFAULT 0;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS local_price integer DEFAULT 0;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- 기존 프로그램 가격 초기값 설정
UPDATE programs SET price = 20000, local_price = 20000 WHERE name = '체험승마';
UPDATE programs SET price = 45000, local_price = 38250 WHERE name = '개인레슨';
UPDATE programs SET price = 40000, local_price = 40000 WHERE name = '그룹레슨';
UPDATE programs SET price = 35000, local_price = 31500 WHERE name = '유소년 프로그램';
