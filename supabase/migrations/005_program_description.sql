-- programs 테이블에 설명 컬럼 추가
ALTER TABLE programs ADD COLUMN IF NOT EXISTS description text DEFAULT '';

UPDATE programs SET description = '처음이어도 괜찮습니다. 말과의 첫 교감을 전문 강사와 안전하게 경험해보세요.' WHERE name = '체험승마';
UPDATE programs SET description = '1:1 전담 지도로 균형감각과 자세를 집중적으로 향상시킵니다.' WHERE name = '개인레슨';
UPDATE programs SET description = '어린이·청소년의 정서 발달과 체력 향상을 위한 맞춤 승마 교육 과정입니다.' WHERE name = '유소년 프로그램';
UPDATE programs SET description = '그룹으로 함께 즐기는 승마 레슨입니다.' WHERE name = '그룹레슨';
