-- 既存 DB をアップグレードする場合（新規は schema.sql に含まれる）
ALTER TABLE polls ADD COLUMN organizerToken TEXT;
ALTER TABLE schedules ADD COLUMN organizerToken TEXT;
