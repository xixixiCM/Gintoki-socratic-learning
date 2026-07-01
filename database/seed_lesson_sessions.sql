-- 前 3 节已完成课时的 session 记录
INSERT INTO lesson_session (id, lesson_id, started_at, ended_at, duration_seconds, status, end_type)
VALUES
  (1, 1, '2026-06-15 10:00:00', '2026-06-15 10:31:00', 1860, 'completed', 'normal_finish'),
  (2, 2, '2026-06-18 14:00:00', '2026-06-18 14:28:00', 1680, 'completed', 'normal_finish'),
  (3, 3, '2026-06-22 09:00:00', '2026-06-22 09:35:00', 2100, 'completed', 'normal_finish');
