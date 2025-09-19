-- Phải chắc rằng pgvector đã được cài trong instance Postgres (docker image ankane/pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

-- Roles
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);

-- Users
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(200) UNIQUE,
    password_hash VARCHAR(200),
    birthday DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    role_id INT DEFAULT 1,
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);

-- User update history
CREATE TABLE user_update (
    user_update_id SERIAL PRIMARY KEY,
    user_name VARCHAR(100),
    email VARCHAR(200),
    password_hash VARCHAR(200),
    birthday DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    role_id INT,
    updated_by INT, -- người thực hiện update
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES "user"(user_id) ON DELETE SET NULL
);

-- Subjects & topics
CREATE TABLE subject (
    subject_id SERIAL PRIMARY KEY,
    subject_name VARCHAR(50) NOT NULL
);

CREATE TABLE topic (
    topic_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    subject_id INT,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON DELETE SET NULL
);

-- Roadmap steps + user mapping
CREATE TABLE roadmap_step (
    roadmap_step_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    topic_id INT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id) ON DELETE SET NULL
);

-- enum: (gợi ý: đổi 'in process' -> 'in_process' sau nếu muốn)
CREATE TYPE roadmap_status AS ENUM ('pending', 'done', 'skip', 'in process');

CREATE TABLE user_roadmap_step (
    user_roadmap_step_id SERIAL PRIMARY KEY,
    status roadmap_status DEFAULT 'pending',
    roadmap_step_id INT,
    user_id INT,
    FOREIGN KEY (roadmap_step_id) REFERENCES roadmap_step(roadmap_step_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE
);

-- Documents
CREATE TABLE document (
    document_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    link VARCHAR(250),
    embedding vector(768),  -- chỉnh dimension cho phù hợp
    created_at TIMESTAMPTZ DEFAULT now(),
    topic_id INT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id) ON DELETE SET NULL
);

CREATE TABLE roadmap_step_document (
    roadmap_step_id INT NOT NULL,
    document_id INT NOT NULL,
    PRIMARY KEY (roadmap_step_id, document_id),
    FOREIGN KEY (roadmap_step_id) REFERENCES roadmap_step(roadmap_step_id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES document(document_id) ON DELETE CASCADE
);

CREATE TABLE document_history (
    document_history_id SERIAL PRIMARY KEY,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    user_id INT,
    document_id INT,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES document(document_id) ON DELETE CASCADE
);

-- Study schedule
CREATE TYPE study_status AS ENUM ('pending', 'done', 'miss');

CREATE TABLE study_schedule (
    study_schedule_id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    status study_status DEFAULT 'pending',
    target_question INT,
    created_at TIMESTAMPTZ DEFAULT now(),
    update_at TIMESTAMPTZ DEFAULT now(), -- bạn có thể đổi tên thành updated_at nếu muốn
    subject_id INT,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON DELETE SET NULL
);

-- Flashcards
CREATE TABLE flashcard_deck (
    flashcard_deck_id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE
);

CREATE TYPE flashcard_status AS ENUM ('pending', 'done', 'miss');

CREATE TABLE flashcard (
    flashcard_id SERIAL PRIMARY KEY,
    front TEXT NOT NULL,
    back TEXT,
    example TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    status flashcard_status DEFAULT 'pending',
    flashcard_deck_id INT,
    FOREIGN KEY (flashcard_deck_id) REFERENCES flashcard_deck(flashcard_deck_id) ON DELETE CASCADE
);

-- Chat history (partitioning recommended later)
CREATE TABLE chat_history (
    chat_history_id SERIAL PRIMARY KEY,
    is_user BOOLEAN,
    message TEXT,
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE
);

-- Progress & goals
CREATE TABLE current_progress (
    current_progress_id SERIAL PRIMARY KEY,
    current_progress DECIMAL(4,2),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE
);

CREATE TABLE user_goal (
    user_goal_id SERIAL PRIMARY KEY,
    target_score DECIMAL(4,2),
    deadline TIMESTAMPTZ,
    user_id INT,
    subject_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON DELETE SET NULL
);

-- Exams
CREATE TABLE exam_schedule (
    exam_schedule_id SERIAL PRIMARY KEY,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE exam (
    exam_id SERIAL PRIMARY KEY,
    exam_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    time_limit INT,
    topic_id INT,
    exam_schedule_id INT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id) ON DELETE SET NULL,
    FOREIGN KEY (exam_schedule_id) REFERENCES exam_schedule(exam_schedule_id) ON DELETE SET NULL
);

CREATE TABLE user_exam_answer (
    user_exam_answer_id SERIAL PRIMARY KEY,
    score DECIMAL(4,2),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id INT,
    exam_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exam(exam_id) ON DELETE CASCADE
);

-- Questions & answers
CREATE TABLE question (
    question_id SERIAL PRIMARY KEY,
    question_name VARCHAR(100) NOT NULL,
    question_content TEXT
);

CREATE TABLE answer (
    answer_id SERIAL PRIMARY KEY,
    question_id INT NOT NULL,
    answer_content TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE
);

CREATE TABLE question_exam (
    question_id INT,
    exam_id INT,
    PRIMARY KEY (question_id, exam_id),
    FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exam(exam_id) ON DELETE CASCADE
);

-- Bank & mappings
CREATE TABLE bank (
    bank_id SERIAL PRIMARY KEY,
    description VARCHAR(200),
    topic_id INT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id) ON DELETE SET NULL
);

CREATE TABLE question_bank (
    question_id INT,
    bank_id INT,
    PRIMARY KEY (question_id, bank_id),
    FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE,
    FOREIGN KEY (bank_id) REFERENCES bank(bank_id) ON DELETE CASCADE
);

CREATE TABLE user_bank_answer (
    user_bank_answer_id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    bank_id INT,
    user_id INT,
    answer_id INT,
    FOREIGN KEY (bank_id) REFERENCES bank(bank_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES answer(answer_id) ON DELETE SET NULL
);

-- Indexes (tạo index cho các FK / cột thường truy vấn)
CREATE INDEX idx_topic_subject ON topic(subject_id);
CREATE INDEX idx_document_topic ON document(topic_id);
CREATE INDEX idx_document_history_user ON document_history(user_id);
CREATE INDEX idx_document_history_document ON document_history(document_id);
CREATE INDEX idx_chat_history_user ON chat_history(user_id);
CREATE INDEX idx_answer_question ON answer(question_id);
CREATE INDEX idx_question_exam_exam ON question_exam(exam_id);
CREATE INDEX idx_bank_topic ON bank(topic_id);
CREATE INDEX idx_user_goal_user ON user_goal(user_id);

-- (Optional) pgvector ANN index example (chạy sau khi có dữ liệu và tuning)
-- CREATE INDEX ON document USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
-- CREATE INDEX ON chat_history USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
-- CREATE INDEX ON question USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
