-- 基础版先使用明文密码，正式项目请改为 bcrypt 哈希存储。
INSERT INTO user (username, password, nickname, role, status)
VALUES
  ('student', '123456', '普通学生', 'STUDENT', 'active'),
  ('admin', '123456', '系统管理员', 'ADMIN', 'active');
