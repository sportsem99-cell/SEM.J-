export interface JotForm {
  id: string
  title: string
  url: string
  icon: string
}

export interface FormCategory {
  key: string
  label: string
  icon: string
  forms: JotForm[]
  adminOnly?: boolean
}

export const FORM_CATEGORIES: FormCategory[] = [
  // ── 공개 카테고리 ──────────────────────────────────
  {
    key: 'membership',
    label: '회원·참가자 신청',
    icon: '📝',
    forms: [
      { id: '260860952011047', title: '일반승마 회원등록', url: 'https://form.jotform.com/260860952011047', icon: '🏇' },
      { id: '260017680386458', title: '괴산군 유소년 승마단 가입 신청', url: 'https://form.jotform.com/260017680386458', icon: '👦' },
      { id: '250431984275461', title: '승마 & 워터피아 캠프 참가신청', url: 'https://form.jotform.com/250431984275461', icon: '🏕️' },
      { id: '260874220384053', title: '재활승마 대상자 신청', url: 'https://form.jotform.com/260874220384053', icon: '♿' },
      { id: '260871184377061', title: '체험승마 신청', url: 'https://form.jotform.com/260871184377061', icon: '🐴' },
      { id: '260874195065060', title: '실버승마 참여 신청', url: 'https://form.jotform.com/260874195065060', icon: '👴' },
    ],
  },
  {
    key: 'booking',
    label: '예약·변경·취소',
    icon: '📅',
    forms: [
      { id: '260860782042052', title: '승마 예약 신청', url: 'https://form.jotform.com/260860782042052', icon: '📅' },
      { id: '260874510120043', title: '예약 변경 및 취소 요청', url: 'https://form.jotform.com/260874510120043', icon: '🔄' },
      { id: '260874855745068', title: '결석 및 보강 신청', url: 'https://form.jotform.com/260874855745068', icon: '📋' },
      { id: '260893743699477', title: '결석 및 보강 신청 (바우처 전용)', url: 'https://form.jotform.com/260893743699477', icon: '🎫' },
      { id: '241198490683062', title: '말산업 운영요원 등록 요청', url: 'https://form.jotform.com/241198490683062', icon: '👷' },
      { id: '241214533192044', title: '운영요원 제공 요청', url: 'https://form.jotform.com/241214533192044', icon: '🙋' },
      { id: '240683696390467', title: '마필 운송차량 예약 신청', url: 'https://form.jotform.com/240683696390467', icon: '🚛' },
    ],
  },
  {
    key: 'consult',
    label: '상담·문의·민원',
    icon: '💬',
    forms: [
      { id: '260874638593068', title: '승마 프로그램 상담 신청', url: 'https://form.jotform.com/260874638593068', icon: '💬' },
      { id: '260874223453053', title: '1:1 문의하기', url: 'https://form.jotform.com/260874223453053', icon: '✉️' },
      { id: '260859010993059', title: '고객 고충 및 민원 접수', url: 'https://form.jotform.com/260859010993059', icon: '📣' },
      { id: '243494756980472', title: '슈퍼키즈 승마서비스 상담·고충', url: 'https://form.jotform.com/243494756980472', icon: '👶' },
    ],
  },
  {
    key: 'survey',
    label: '설문·만족도 조사',
    icon: '📊',
    forms: [
      { id: '251583213616454', title: '승마 프로그램 만족도 설문 (힐링 승마 교실)', url: 'https://form.jotform.com/251583213616454', icon: '⭐' },
      { id: '243494756980472', title: '슈퍼키즈 이용자 설문', url: 'https://form.jotform.com/243494756980472', icon: '📝' },
    ],
  },
  {
    key: 'consent',
    label: '동의서',
    icon: '✍️',
    forms: [
      { id: '260963914006053', title: '승마장 이용 동의서 (학생용)', url: 'https://form.jotform.com/260963914006053', icon: '✍️' },
      { id: '241194658945065', title: '승마 인력 지원 신청', url: 'https://form.jotform.com/241194658945065', icon: '🤝' },
    ],
  },

  // ── 관리자 전용 ─────────────────────────────────────
  {
    key: 'attendance',
    label: '출결·근태 / 일지 관리',
    icon: '📋',
    adminOnly: true,
    forms: [
      { id: '253338880251055', title: '출근부', url: 'https://form.jotform.com/253338880251055', icon: '🕐' },
      { id: '261090468559062', title: '직원 일일 업무 기록지', url: 'https://form.jotform.com/261090468559062', icon: '📓' },
      { id: '260865330859062', title: '회원 일지', url: 'https://form.jotform.com/260865330859062', icon: '📔' },
      { id: '260894600996066', title: '말 상태 일일 보고표', url: 'https://form.jotform.com/260894600996066', icon: '🐴' },
      { id: '260895369747073', title: '말 상태 월간 보고표', url: 'https://form.jotform.com/260895369747073', icon: '📈' },
      { id: '260965038994068', title: '주간 안전관리 기록표', url: 'https://form.jotform.com/260965038994068', icon: '🦺' },
      { id: '260864920330050', title: '승마 코치 수업 내용 기록', url: 'https://form.jotform.com/260864920330050', icon: '🏫' },
    ],
  },
  {
    key: 'finance',
    label: '정산·지출 / 행정서류',
    icon: '💰',
    adminOnly: true,
    forms: [
      { id: '241042021843038', title: '정산 신청서', url: 'https://form.jotform.com/241042021843038', icon: '🧾' },
      { id: '253303485634457', title: '지출결의서 (SEM.J)', url: 'https://form.jotform.com/253303485634457', icon: '💸' },
      { id: '260904338849063', title: '업무서류 업로드', url: 'https://form.jotform.com/260904338849063', icon: '📤' },
    ],
  },
]

export const PUBLIC_CATEGORIES = FORM_CATEGORIES.filter(c => !c.adminOnly)
export const ADMIN_CATEGORIES = FORM_CATEGORIES.filter(c => c.adminOnly)
