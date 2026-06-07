-- =============================================
-- SEM.J 승마교육원 예약 시스템 초기 스키마
-- =============================================

-- 리소스 충돌 방지용 확장
create extension if not exists btree_gist;

-- =============================================
-- 1. 멀티테넌트 (조직)
-- =============================================
create table organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  settings    jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

-- SEM.J 기본 조직 삽입
insert into organizations (id, name, slug) values
  ('00000000-0000-0000-0000-000000000001', 'SEM.J 승마교육원', 'semj');

-- =============================================
-- 2. 사용자 프로필 (auth.users 확장)
-- =============================================
create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  name        text,
  phone       text,
  birth_date  date,
  kakao_id    text,
  created_at  timestamptz not null default now()
);

-- auth.users 생성 시 자동으로 profile 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data ->> 'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================
-- 3. 조직 멤버 & 역할
-- =============================================
create table org_members (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations(id) on delete cascade,
  user_id     uuid not null references auth.users on delete cascade,
  role        text not null default 'member',
  created_at  timestamptz not null default now(),
  unique(org_id, user_id),
  constraint valid_role check (role in ('owner','admin','instructor','member'))
);

-- =============================================
-- 4. 리소스 (강사 / 말 / 마장 통합)
-- =============================================
create table resources (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations(id) on delete cascade,
  type        text not null,
  name        text not null,
  status      text not null default 'active',
  attributes  jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  constraint valid_type   check (type in ('instructor','horse','arena')),
  constraint valid_status check (status in ('active','rest','maintenance'))
);

-- =============================================
-- 5. 프로그램
-- =============================================
create table programs (
  id                  uuid primary key default gen_random_uuid(),
  org_id              uuid not null references organizations(id) on delete cascade,
  type                text not null,
  name                text not null,
  description         text,
  duration_min        int not null default 60,
  capacity            int not null default 1,
  base_price          int not null,
  required_resources  jsonb not null default '{"instructor":1,"horse":1,"arena":1}',
  voucher_eligible    bool not null default false,
  age_min             int,
  age_max             int,
  is_active           bool not null default true,
  created_at          timestamptz not null default now(),
  constraint valid_program_type check (type in ('experience','private','group','youth'))
);

-- 기본 프로그램 삽입
insert into programs (org_id, type, name, description, duration_min, capacity, base_price) values
  ('00000000-0000-0000-0000-000000000001', 'experience', '체험승마', '처음 타시는 분도 OK! 안전하게 말과 교감하는 체험', 60, 6, 30000),
  ('00000000-0000-0000-0000-000000000001', 'private',    '개인레슨', '1:1 맞춤 지도로 실력을 빠르게 향상', 60, 1, 60000),
  ('00000000-0000-0000-0000-000000000001', 'group',      '그룹레슨', '소그룹(최대 6명) 함께 배우는 즐거움', 60, 6, 40000),
  ('00000000-0000-0000-0000-000000000001', 'youth',      '유소년 프로그램', '어린이·청소년을 위한 맞춤 승마 교육', 60, 6, 35000);

-- =============================================
-- 6. 예약
-- =============================================
create table bookings (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references organizations(id),
  user_id         uuid not null references auth.users,
  program_id      uuid not null references programs(id),
  status          text not null default 'pending',
  start_at        timestamptz not null,
  end_at          timestamptz not null,
  total_amount    int not null,
  paid_amount     int not null default 0,
  qr_token        text unique,
  cancelled_at    timestamptz,
  cancel_reason   text,
  created_at      timestamptz not null default now(),
  constraint valid_booking_status check (
    status in ('pending','confirmed','checked_in','completed','cancelled','no_show')
  )
);

-- 예약 참가자 (그룹/가족 체험)
create table booking_participants (
  id                  uuid primary key default gen_random_uuid(),
  booking_id          uuid not null references bookings(id) on delete cascade,
  name                text not null,
  birth_date          date,
  phone               text,
  is_account_holder   bool not null default false
);

-- =============================================
-- 7. 리소스 슬롯 (★ 핵심: 더블부킹 방지)
-- =============================================
create table booking_resource_slots (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations(id),
  booking_id  uuid not null references bookings(id) on delete cascade,
  resource_id uuid not null references resources(id),
  time_range  tstzrange not null,
  status      text not null default 'reserved',
  created_at  timestamptz not null default now(),

  -- ★ 핵심 제약: 같은 리소스가 겹치는 시간에 중복 점유 불가
  -- cancelled 상태는 제외 (예약 취소 시 슬롯 해제)
  exclude using gist (
    resource_id with =,
    time_range  with &&
  ) where (status <> 'cancelled'),

  constraint valid_slot_status check (status in ('reserved','confirmed','cancelled'))
);

-- =============================================
-- 8. 결제
-- =============================================
create table payments (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references organizations(id),
  booking_id    uuid not null references bookings(id),
  user_id       uuid not null references auth.users,
  provider      text not null default 'toss',
  order_id      text not null unique,
  payment_key   text unique,
  amount        int not null,
  status        text not null default 'ready',
  method        text,
  raw_response  jsonb,
  approved_at   timestamptz,
  cancelled_at  timestamptz,
  created_at    timestamptz not null default now(),
  constraint valid_payment_status check (
    status in ('ready','in_progress','done','cancelled','partial_cancelled','failed')
  )
);

-- =============================================
-- 9. RLS 활성화
-- =============================================
alter table organizations           enable row level security;
alter table profiles                enable row level security;
alter table org_members             enable row level security;
alter table resources               enable row level security;
alter table programs                enable row level security;
alter table bookings                enable row level security;
alter table booking_participants    enable row level security;
alter table booking_resource_slots  enable row level security;
alter table payments                enable row level security;

-- 프로필: 본인만 읽기/수정
create policy "users read own profile"   on profiles for select using (id = auth.uid());
create policy "users update own profile" on profiles for update using (id = auth.uid());

-- 프로그램: 누구나 조회 가능 (공개)
create policy "programs are public" on programs for select using (is_active = true);

-- 예약: 본인 예약만
create policy "users manage own bookings" on bookings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 결제: 본인 결제만
create policy "users view own payments" on payments
  for select using (user_id = auth.uid());
