-- booking_participants에 신체/건강 정보 추가
alter table booking_participants
  add column if not exists gender      text,
  add column if not exists weight_kg   numeric(5,1),
  add column if not exists height_cm   numeric(5,1),
  add column if not exists allergy     bool not null default false,
  add column if not exists allergy_desc text,
  add column if not exists condition   bool not null default false,
  add column if not exists condition_desc text,
  add column if not exists notes       text;

-- bookings에 참가자 수 컬럼 추가
alter table bookings
  add column if not exists participants int not null default 1;
