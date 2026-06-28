-- 基础版先使用明文密码，正式项目请改为 bcrypt 哈希存储。
INSERT INTO user (username, password, role, nickname)
VALUES
  ('student', '123456', 'STUDENT', '学生'),
  ('admin', '123456', 'ADMIN', '管理员');
