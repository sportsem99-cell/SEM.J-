-- =============================================
-- 예약 불가 날짜 테이블
-- =============================================
create table blocked_dates (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references organizations(id) on delete cascade,
  date       date not null,
  reason     text,
  created_at timestamptz not null default now(),
  unique(org_id, date)
);

alter table blocked_dates enable row level security;

-- 누구나 조회 가능 (예약 시 막힘 여부 확인)
create policy "blocked_dates are public" on blocked_dates
  for select using (true);

-- 관리자만 등록/삭제 가능 (서비스 롤로 처리)
