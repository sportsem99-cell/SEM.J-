-- 쿠폰 보유 테이블 (관리자가 전화번호 기준으로 등록)
CREATE TABLE IF NOT EXISTS user_coupons (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL,
  phone        text NOT NULL,
  holder_name  text,
  program_id   uuid REFERENCES programs(id) ON DELETE SET NULL,
  total_count  integer NOT NULL DEFAULT 1,
  used_count   integer NOT NULL DEFAULT 0,
  expires_at   date,
  notes        text,
  created_at   timestamptz DEFAULT now(),
  CONSTRAINT user_coupons_used_lte_total CHECK (used_count <= total_count),
  CONSTRAINT user_coupons_total_positive  CHECK (total_count > 0),
  CONSTRAINT user_coupons_used_nonneg     CHECK (used_count >= 0)
);

-- 쿠폰 사용 내역 (예약 1건당 1행)
CREATE TABLE IF NOT EXISTS coupon_usages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_coupon_id  uuid NOT NULL REFERENCES user_coupons(id) ON DELETE CASCADE,
  booking_id      uuid REFERENCES bookings(id) ON DELETE SET NULL,
  used_at         timestamptz DEFAULT now()
);

-- bookings에 결제 방법 컬럼 추가
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'card';

-- 원자적 쿠폰 사용 함수 (FOR UPDATE 락으로 이중 차감 방지)
CREATE OR REPLACE FUNCTION use_coupon(p_coupon_id uuid, p_booking_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_coupon user_coupons;
BEGIN
  -- 행 락 획득
  SELECT * INTO v_coupon FROM user_coupons WHERE id = p_coupon_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('error', '쿠폰을 찾을 수 없습니다.');
  END IF;
  IF v_coupon.used_count >= v_coupon.total_count THEN
    RETURN json_build_object('error', '쿠폰 잔여 횟수가 없습니다.');
  END IF;
  IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < CURRENT_DATE THEN
    RETURN json_build_object('error', '만료된 쿠폰입니다.');
  END IF;

  -- 사용 횟수 증가 + 내역 기록
  UPDATE user_coupons SET used_count = used_count + 1 WHERE id = p_coupon_id;
  INSERT INTO coupon_usages (user_coupon_id, booking_id) VALUES (p_coupon_id, p_booking_id);

  RETURN json_build_object('ok', true);
END;
$$;
