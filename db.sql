
CREATE TABLE role (
    role_id INT PRIMARY KEY,
    role_name VARCHAR(50)
);

CREATE TABLE "user" (
    user_id INT PRIMARY KEY,
    user_name VARCHAR(100),
    email VARCHAR(200),
    password_hash VARCHAR(200),
    birthday DATE,
    created_at TIMESTAMP,
    role_id INT DEFAULT 1,
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);

CREATE TABLE user_update (
    user_name VARCHAR(100),
    email VARCHAR(200),
    password_hash VARCHAR(200),
    birthday DATE,
    created_at TIMESTAMP,
    role_id INT,
    updated_by INT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id),
    FOREIGN KEY (updated_by) REFERENCES "user"(user_id)
);

CREATE TABLE subject (
    subject_id INT PRIMARY KEY,
    subject_name VARCHAR(50)
);

CREATE TABLE topic (
    topic_id INT PRIMARY KEY,
    title TEXT,
    description TEXT,
    subject_id INT,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id)
);

CREATE TABLE roadmap_step (
    roadmap_step_id INT PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    topic_id INT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);

CREATE TYPE roadmap_status AS ENUM ('pending', 'done', 'skip', 'in process');

CREATE TABLE user_roadmap_step (
    user_roadmap_step_id INT PRIMARY KEY,
    status roadmap_status,
    roadmap_step_id INT,
    user_id INT,
    FOREIGN KEY (roadmap_step_id) REFERENCES roadmap_step(roadmap_step_id),
    FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

CREATE TABLE document (
    document_id INT PRIMARY KEY,
    title TEXT,
    link VARCHAR(250),
    embedding FLOAT8[],
    created_at TIMESTAMP,
    topic_id INT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);

CREATE TABLE roadmap_step_document (
    roadmap_step_id INT,
    document_id INT,
    PRIMARY KEY (roadmap_step_id, document_id),
    FOREIGN KEY (roadmap_step_id) REFERENCES roadmap_step(roadmap_step_id),
    FOREIGN KEY (document_id) REFERENCES document(document_id)
);

CREATE TABLE document_history (
    document_history_id INT PRIMARY KEY,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    user_id INT,
    document_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id),
    FOREIGN KEY (document_id) REFERENCES document(document_id)
);

CREATE TYPE study_status AS ENUM ('pending', 'done', 'miss');

CREATE TABLE study_schedule (
    study_schedule_id INT PRIMARY KEY,
    title VARCHAR(500),
    description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status study_status,
    created_at TIMESTAMP,
    update_at TIMESTAMP,
    subject_id INT,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id)
);

CREATE TABLE flashcard_deck (
    flashcard_deck_id INT PRIMARY KEY,
    title VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

CREATE TYPE flashcard_status AS ENUM ('pending', 'done', 'miss');

CREATE TABLE flashcard (
    flashcard_id INT PRIMARY KEY,
    front TEXT,
    back TEXT,
    example TEXT,
    created_at TIMESTAMP,
    status flashcard_status,
    flashcard_deck_id INT,
    FOREIGN KEY (flashcard_deck_id) REFERENCES flashcard_deck(flashcard_deck_id)
);

CREATE TABLE chat_history (
    chat_history_id INT PRIMARY KEY,
    is_user BOOLEAN,
    message TEXT,
    embedding FLOAT8[],
    created_at TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

CREATE TABLE current_progress (
    current_progress_id INT PRIMARY KEY,
    current_progress DECIMAL(4,2),
    created_at TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

CREATE TABLE user_goal (
    user_goal_id INT PRIMARY KEY,
    target_score DECIMAL(4,2),
    deadline TIMESTAMP,
    user_id INT,
    subject_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id)
);

CREATE TABLE exam_schedule (
    exam_schedule_id INT PRIMARY KEY,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE exam (
    exam_id INT PRIMARY KEY,
    exam_name VARCHAR(100),
    created_at TIMESTAMP,
    time_limit INT,
    topic_id INT,
    exam_schedule_id INT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id),
    FOREIGN KEY (exam_schedule_id) REFERENCES exam_schedule(exam_schedule_id)
);

CREATE TABLE user_exam_answer (
    user_exam_answer_id INT PRIMARY KEY,
    score DECIMAL(4,2),
    created_at TIMESTAMP,
    user_id INT,
    exam_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id),
    FOREIGN KEY (exam_id) REFERENCES exam(exam_id)
);

CREATE TABLE question (
    question_id INT PRIMARY KEY,
    question_name VARCHAR(100),
    question_content TEXT
);

CREATE TABLE answer (
    answer_id INT PRIMARY KEY,
    question_id INT,
    answer_content TEXT,
    is_correct BOOLEAN,
    FOREIGN KEY (question_id) REFERENCES question(question_id)
);

CREATE TABLE question_exam (
    question_id INT,
    exam_id INT,
    PRIMARY KEY (question_id, exam_id),
    FOREIGN KEY (question_id) REFERENCES question(question_id),
    FOREIGN KEY (exam_id) REFERENCES exam(exam_id)
);

CREATE TABLE bank (
    bank_id INT PRIMARY KEY,
    description VARCHAR(200),
    topic_id INT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);

CREATE TABLE question_bank (
    question_id INT,
    bank_id INT,
    PRIMARY KEY (question_id, bank_id),
    FOREIGN KEY (question_id) REFERENCES question(question_id),
    FOREIGN KEY (bank_id) REFERENCES bank(bank_id)
);CREATE TABLE user_bank_answer (
    user_bank_answer_id INT PRIMARY KEY,
    created_at TIMESTAMP,
    bank_id INT,
    user_id INT,
    answer_id INT,
    FOREIGN KEY (bank_id) REFERENCES bank(bank_id),
    FOREIGN KEY (user_id) REFERENCES "user"(user_id),
    FOREIGN KEY (answer_id) REFERENCES answer(answer_id)
);





