-- =============================================================================
-- Choisur / D1 単一スキーマ定義（新規 DB はこのファイルのみ適用）
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Customers
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- Polls & options
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS polls (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  duration INTEGER,
  endDateTime TEXT,
  createdBy TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  isClosed INTEGER DEFAULT 0,
  password TEXT,
  organizerToken TEXT
);

CREATE TABLE IF NOT EXISTS poll_options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pollId TEXT NOT NULL,
  optionId INTEGER NOT NULL,
  url TEXT NOT NULL,
  title TEXT DEFAULT '候補リストを取得中...',
  description TEXT DEFAULT '説明を取得中...',
  image TEXT,
  votes INTEGER DEFAULT 0,
  voters TEXT DEFAULT '[]',
  FOREIGN KEY (pollId) REFERENCES polls (id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- Contacts
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  isRead INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_contacts_createdAt ON contacts(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_isRead ON contacts(isRead);

-- -----------------------------------------------------------------------------
-- Schedules & responses
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schedules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  dates TEXT NOT NULL,
  endDateTime TEXT,
  confirmedDateTime TEXT,
  createdBy TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  isClosed INTEGER DEFAULT 0,
  organizerToken TEXT
);

CREATE TABLE IF NOT EXISTS schedule_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scheduleId TEXT NOT NULL,
  respondentId TEXT NOT NULL,
  name TEXT NOT NULL,
  availability TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (scheduleId) REFERENCES schedules (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_schedule_responses_scheduleId ON schedule_responses(scheduleId);
CREATE INDEX IF NOT EXISTS idx_schedule_responses_respondentId ON schedule_responses(respondentId);

-- -----------------------------------------------------------------------------
-- Summary comments（サマリーページ掲示板）
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS summary_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scheduleId TEXT NOT NULL,
  authorName TEXT NOT NULL,
  body TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (scheduleId) REFERENCES schedules (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_summary_comments_scheduleId ON summary_comments(scheduleId);
CREATE INDEX IF NOT EXISTS idx_summary_comments_createdAt ON summary_comments(createdAt DESC);

-- =============================================================================
-- 開発用サンプルデータ（INSERT OR IGNORE）
-- =============================================================================

INSERT OR IGNORE INTO Customers (name, email) VALUES
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com'),
  ('Charlie', 'charlie@example.com');

INSERT OR IGNORE INTO polls (id, title, duration, endDateTime, createdBy, createdAt, isClosed, password) VALUES
  ('sample-poll-1', '今日のランチはどこで食べますか？', 30, NULL, 'user1', '2025-10-05T07:00:00.000Z', 0, NULL);

INSERT OR IGNORE INTO poll_options (pollId, optionId, url, title, description, votes, voters) VALUES
  ('sample-poll-1', 1, 'https://example.com/restaurant1', 'レストランA', '美味しいイタリアン', 3, '["user1", "user2", "user3"]'),
  ('sample-poll-1', 2, 'https://example.com/restaurant2', 'レストランB', '人気の和食', 2, '["user4", "user5"]'),
  ('sample-poll-1', 3, 'https://example.com/restaurant3', 'レストランC', '安い定食屋', 1, '["user6"]');

-- =============================================================================
-- デモ用固定 ID（/polls/demo ・ /schedule/demo）— 再実行時は削除して挿入し直し
-- （D1 リモートは SQL の BEGIN/COMMIT を受け付けないためトランザクションで囲まない）
-- =============================================================================

DELETE FROM schedule_responses WHERE scheduleId = 'demo';
DELETE FROM polls WHERE id = 'demo';
DELETE FROM schedules WHERE id = 'demo';

INSERT INTO polls (
  id,
  title,
  duration,
  endDateTime,
  createdBy,
  createdAt,
  isClosed,
  password
) VALUES (
  'demo',
  '飲み会のお店はどこにする？',
  NULL,
  NULL,
  'user',
  '2026-01-01T00:00:00.000Z',
  0,
  NULL
);

INSERT INTO poll_options (pollId, optionId, url, title, description, image, votes, voters) VALUES
  (
    'demo',
    1,
    'https://maps.google.com/?q=35.665498,139.759637',
    '寿司',
    'にぎり中心・カウンター席あり',
    NULL,
    2,
    '[{"id":"voter-1","name":"太郎"},{"id":"voter-2","name":"花子"}]'
  ),
  (
    'demo',
    2,
    'https://maps.google.com/?q=35.6938,139.7034',
    '焼肉',
    '個室あり・飲み放題プランあり',
    NULL,
    1,
    '[{"id":"voter-3","name":"次郎"}]'
  );

INSERT INTO schedules (
  id,
  title,
  dates,
  endDateTime,
  confirmedDateTime,
  createdBy,
  createdAt,
  isClosed
) VALUES (
  'demo',
  '忘年会はいつにする？',
  '[{"date":"2026-06-15","times":["19:00"]},{"date":"2026-06-16","times":["19:00"]},{"date":"2026-06-17","times":["12:00"]},{"date":"2026-06-18","times":["19:00"]},{"date":"2026-06-19","times":["19:00"]},{"date":"2026-06-20","times":["18:00"]},{"date":"2026-06-21","times":["12:00"]}]',
  NULL,
  NULL,
  'user',
  '2026-01-01T00:00:00.000Z',
  0
);

INSERT INTO schedule_responses (scheduleId, respondentId, name, availability, createdAt) VALUES
  (
    'demo',
    'demo-rsp-1',
    '北川',
    '{"2026-06-15-19:00":"available","2026-06-16-19:00":"available","2026-06-17-12:00":"maybe","2026-06-18-19:00":"available","2026-06-19-19:00":"unavailable","2026-06-20-18:00":"available","2026-06-21-12:00":"maybe"}',
    '2026-01-01T10:00:00.000Z'
  ),
  (
    'demo',
    'demo-rsp-2',
    '鈴木',
    '{"2026-06-15-19:00":"maybe","2026-06-16-19:00":"available","2026-06-17-12:00":"available","2026-06-18-19:00":"available","2026-06-19-19:00":"available","2026-06-20-18:00":"maybe","2026-06-21-12:00":"available"}',
    '2026-01-01T10:05:00.000Z'
  ),
  (
    'demo',
    'demo-rsp-3',
    '高橋',
    '{"2026-06-15-19:00":"unavailable","2026-06-16-19:00":"maybe","2026-06-17-12:00":"available","2026-06-18-19:00":"unavailable","2026-06-19-19:00":"available","2026-06-20-18:00":"available","2026-06-21-12:00":"unavailable"}',
    '2026-01-01T10:10:00.000Z'
  );

