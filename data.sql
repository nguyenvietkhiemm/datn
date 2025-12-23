-- Init data: subjects + topics
-- Idempotent inserts (won't duplicate existing rows)
BEGIN;

-- Subjects
INSERT INTO subject (subject_name)
SELECT 'Toán'
WHERE NOT EXISTS (SELECT 1 FROM subject WHERE subject_name = 'Toán');

INSERT INTO subject (subject_name)
SELECT 'Vật Lý'
WHERE NOT EXISTS (SELECT 1 FROM subject WHERE subject_name = 'Vật Lý');

INSERT INTO subject (subject_name)
SELECT 'Hóa Học'
WHERE NOT EXISTS (SELECT 1 FROM subject WHERE subject_name = 'Hóa Học');

INSERT INTO subject (subject_name)
SELECT 'Ngữ Văn'
WHERE NOT EXISTS (SELECT 1 FROM subject WHERE subject_name = 'Ngữ Văn');

INSERT INTO subject (subject_name)
SELECT 'Tiếng Anh'
WHERE NOT EXISTS (SELECT 1 FROM subject WHERE subject_name = 'Tiếng Anh');

INSERT INTO subject (subject_name)
SELECT 'Sinh Học'
WHERE NOT EXISTS (SELECT 1 FROM subject WHERE subject_name = 'Sinh Học');

INSERT INTO subject (subject_name)
SELECT 'Lịch Sử'
WHERE NOT EXISTS (SELECT 1 FROM subject WHERE subject_name = 'Lịch Sử');

INSERT INTO subject (subject_name)
SELECT 'Địa Lý'
WHERE NOT EXISTS (SELECT 1 FROM subject WHERE subject_name = 'Địa Lý');

-- Topics for Toán
INSERT INTO topic (title, description, subject_id)
SELECT 'Đại số', 'Các phương trình, bất đẳng thức, đa thức và tính chất đại số cơ bản.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Toán'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Đại số' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Hình học', 'Hình học phẳng và không gian: tam giác, tứ giác, đường tròn và mối quan hệ hình học.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Toán'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Hình học' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Giải tích', 'Đạo hàm, tích phân, giới hạn và các ứng dụng cơ bản.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Toán'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Giải tích' AND t.subject_id = s.subject_id
  );

-- Topics for Vật Lý
INSERT INTO topic (title, description, subject_id)
SELECT 'Cơ học', 'Chuyển động, lực và định luật Newton.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Vật Lý'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Cơ học' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Điện học', 'Dòng điện, điện áp, điện trở và mạch điện cơ bản.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Vật Lý'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Điện học' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Quang học', 'Ánh sáng, phản xạ, khúc xạ và thấu kính.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Vật Lý'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Quang học' AND t.subject_id = s.subject_id
  );

-- Topics for Hóa Học
INSERT INTO topic (title, description, subject_id)
SELECT 'Hữu cơ', 'Hợp chất cacbon và các phản ứng hữu cơ cơ bản.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Hóa Học'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Hữu cơ' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Vô cơ', 'Nguyên tố, hợp chất vô cơ và phản ứng liên quan.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Hóa Học'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Vô cơ' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Hóa phân tích & vật lý hóa', 'Cân bằng, phương pháp phân tích và khái niệm nhiệt động học.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Hóa Học'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Hóa phân tích & vật lý hóa' AND t.subject_id = s.subject_id
  );

-- Topics for Ngữ Văn
INSERT INTO topic (title, description, subject_id)
SELECT 'Văn học', 'Phân tích tác phẩm, tác giả và bối cảnh văn học.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Ngữ Văn'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Văn học' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Ngữ pháp & kỹ năng viết', 'Ngữ pháp tiếng Việt, chính tả và kỹ năng viết cơ bản.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Ngữ Văn'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Ngữ pháp & kỹ năng viết' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Phong cách văn bản', 'Thuyết minh, nghị luận, tự sự và cách triển khai ý.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Ngữ Văn'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Phong cách văn bản' AND t.subject_id = s.subject_id
  );

-- Topics for Tiếng Anh
INSERT INTO topic (title, description, subject_id)
SELECT 'Ngữ pháp', 'Cấu trúc câu, các thì và mệnh đề trong tiếng Anh.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Tiếng Anh'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Ngữ pháp' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Từ vựng', 'Học từ mới theo chủ đề, collocations và cách dùng.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Tiếng Anh'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Từ vựng' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Kỹ năng nghe/nói', 'Luyện nghe, phát âm, hội thoại và phản xạ giao tiếp.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Tiếng Anh'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Kỹ năng nghe/nói' AND t.subject_id = s.subject_id
  );

-- Topics for Sinh Học
INSERT INTO topic (title, description, subject_id)
SELECT 'Sinh học tế bào', 'Cấu trúc và chức năng tế bào, phân bào và sinh học phân tử.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Sinh Học'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Sinh học tế bào' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Di truyền học', 'Gen, ADN, di truyền và luật Mendel.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Sinh Học'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Di truyền học' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Sinh thái học', 'Hệ sinh thái, mối quan hệ sinh học và chu trình vật chất.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Sinh Học'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Sinh thái học' AND t.subject_id = s.subject_id
  );

-- Topics for Lịch Sử
INSERT INTO topic (title, description, subject_id)
SELECT 'Lịch sử Việt Nam', 'Các giai đoạn, sự kiện và nhân vật quan trọng của lịch sử Việt Nam.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Lịch Sử'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Lịch sử Việt Nam' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Lịch sử Thế giới', 'Sự hình thành các nền văn minh, chiến tranh và biến cố toàn cầu.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Lịch Sử'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Lịch sử Thế giới' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Cận đại & Hiện đại', 'Sự kiện từ thế kỷ XIX đến nay và ảnh hưởng của chúng.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Lịch Sử'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Cận đại & Hiện đại' AND t.subject_id = s.subject_id
  );

-- Topics for Địa Lý
INSERT INTO topic (title, description, subject_id)
SELECT 'Địa lý tự nhiên', 'Địa hình, khí hậu, thủy văn và các yếu tố tự nhiên.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Địa Lý'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Địa lý tự nhiên' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Địa lý kinh tế - dân cư', 'Phân bố dân cư, tài nguyên và hoạt động kinh tế.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Địa Lý'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Địa lý kinh tế - dân cư' AND t.subject_id = s.subject_id
  );

INSERT INTO topic (title, description, subject_id)
SELECT 'Bản đồ học & kỹ năng', 'Đọc bản đồ, tọa độ và kỹ năng biểu diễn không gian.', s.subject_id
FROM subject s
WHERE s.subject_name = 'Địa Lý'
  AND NOT EXISTS (
    SELECT 1 FROM topic t WHERE t.title = 'Bản đồ học & kỹ năng' AND t.subject_id = s.subject_id
  );

COMMIT;


