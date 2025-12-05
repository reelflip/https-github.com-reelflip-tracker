
// ... existing imports ...
import { JEE_SYLLABUS, DEFAULT_QUOTES, MOCK_TESTS, INITIAL_FLASHCARDS, INITIAL_MEMORY_HACKS, BLOG_POSTS } from '../constants';
import { Question } from '../types';

// ... existing SQL Generation ...
export const generateSQLSchema = (): string => {
  let sql = `-- DATABASE SCHEMA FOR IITGEEPrep (v3.5 Final Production)
-- Generated for Hostinger / Shared Hosting (MySQL)
-- Official Website: iitgeeprep.com

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:30";

--
-- 0. CLEANUP
--
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS timetable_settings;
DROP TABLE IF EXISTS backlogs;
DROP TABLE IF EXISTS daily_goals;
DROP TABLE IF EXISTS mistake_notebook;
DROP TABLE IF EXISTS attempt_details;
DROP TABLE IF EXISTS test_attempts;
DROP TABLE IF EXISTS test_questions;
DROP TABLE IF EXISTS tests;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS topic_progress;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS chapters;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS quotes;
DROP TABLE IF EXISTS flashcards;
DROP TABLE IF EXISTS memory_hacks;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS blog_posts;
SET FOREIGN_KEY_CHECKS = 1;

-- ... (Rest of Schema remains the same, verified) ...
-- 1. USERS TABLE
CREATE TABLE users (
    id INT PRIMARY KEY,
    email VARCHAR(191) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('STUDENT', 'PARENT', 'ADMIN') NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE, 
    target_year INT DEFAULT NULL,
    target_exam VARCHAR(50) DEFAULT 'JEE Main & Advanced',
    dob DATE DEFAULT NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER') DEFAULT NULL,
    institute VARCHAR(100),
    school VARCHAR(100),
    course_name VARCHAR(100),
    phone VARCHAR(20),
    parent_id INT DEFAULT NULL,
    student_id INT DEFAULT NULL,
    pending_request_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ... (Standard Schema Items) ...
CREATE TABLE subjects ( id VARCHAR(50) PRIMARY KEY, name VARCHAR(100) NOT NULL );
CREATE TABLE chapters ( id VARCHAR(50) PRIMARY KEY, subject_id VARCHAR(50) NOT NULL, name VARCHAR(255) NOT NULL, sort_order INT DEFAULT 0, FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE );
CREATE TABLE topics ( id VARCHAR(50) PRIMARY KEY, chapter_id VARCHAR(50) NOT NULL, name VARCHAR(255) NOT NULL, sort_order INT DEFAULT 0, FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE );

CREATE TABLE topic_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    topic_id VARCHAR(50) NOT NULL,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'REVISE') DEFAULT 'NOT_STARTED',
    ex1_solved INT DEFAULT 0,
    ex1_total INT DEFAULT 30,
    ex2_solved INT DEFAULT 0,
    ex2_total INT DEFAULT 20,
    ex3_solved INT DEFAULT 0,
    ex3_total INT DEFAULT 15,
    ex4_solved INT DEFAULT 0,
    ex4_total INT DEFAULT 10,
    revision_count INT DEFAULT 0,
    next_revision_date DATE DEFAULT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_topic (user_id, topic_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE TABLE questions ( id VARCHAR(50) PRIMARY KEY, subject_id VARCHAR(50), topic_id VARCHAR(50), question_text TEXT NOT NULL, options_json JSON NOT NULL, correct_option_index TINYINT NOT NULL, difficulty ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
CREATE TABLE tests ( id VARCHAR(50) PRIMARY KEY, title VARCHAR(255) NOT NULL, duration_minutes INT NOT NULL, category ENUM('ADMIN', 'PAST_PAPER', 'CUSTOM') DEFAULT 'CUSTOM', difficulty ENUM('MAINS', 'ADVANCED', 'CUSTOM') DEFAULT 'MAINS', exam_type ENUM('JEE', 'BITSAT', 'VITEEE', 'MET', 'SRMJEEE', 'OTHER') DEFAULT 'JEE', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
CREATE TABLE test_questions ( test_id VARCHAR(50), question_id VARCHAR(50), question_order INT, PRIMARY KEY (test_id, question_id), FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE, FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE );
CREATE TABLE test_attempts ( id VARCHAR(50) PRIMARY KEY, user_id INT NOT NULL, test_id VARCHAR(50) NOT NULL, score INT NOT NULL, total_questions INT NOT NULL, correct_count INT NOT NULL, incorrect_count INT NOT NULL, accuracy_percent DECIMAL(5,2), attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE );
CREATE TABLE attempt_details ( id INT AUTO_INCREMENT PRIMARY KEY, attempt_id VARCHAR(50) NOT NULL, question_id VARCHAR(50) NOT NULL, status ENUM('CORRECT', 'INCORRECT', 'UNATTEMPTED') NOT NULL, selected_option INT DEFAULT NULL, FOREIGN KEY (attempt_id) REFERENCES test_attempts(id) ON DELETE CASCADE );
CREATE TABLE mistake_notebook ( id VARCHAR(50) PRIMARY KEY, user_id INT NOT NULL, question_text TEXT, subject_id VARCHAR(50), topic_id VARCHAR(50), test_name VARCHAR(255), user_notes TEXT, tags_json JSON, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE );
CREATE TABLE daily_goals ( id VARCHAR(50) PRIMARY KEY, user_id INT NOT NULL, goal_text VARCHAR(255) NOT NULL, is_completed BOOLEAN DEFAULT FALSE, created_at DATE DEFAULT (CURRENT_DATE), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE );
CREATE TABLE backlogs ( id VARCHAR(50) PRIMARY KEY, user_id INT NOT NULL, title VARCHAR(255) NOT NULL, subject_id ENUM('phys', 'chem', 'math') NOT NULL, priority ENUM('HIGH', 'MEDIUM', 'LOW') DEFAULT 'MEDIUM', deadline DATE, status ENUM('PENDING', 'CLEARED') DEFAULT 'PENDING', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE );
CREATE TABLE timetable_settings ( user_id INT PRIMARY KEY, config_json JSON NOT NULL, generated_slots_json JSON, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE );
CREATE TABLE notifications ( id VARCHAR(50) PRIMARY KEY, title VARCHAR(255) NOT NULL, message TEXT NOT NULL, type ENUM('INFO', 'ALERT', 'SUCCESS') DEFAULT 'INFO', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
CREATE TABLE quotes ( id VARCHAR(50) PRIMARY KEY, text TEXT NOT NULL, author VARCHAR(100), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
CREATE TABLE flashcards ( id VARCHAR(50) PRIMARY KEY, subject_id ENUM('phys', 'chem', 'math') NOT NULL, front TEXT NOT NULL, back TEXT NOT NULL, difficulty ENUM('HARD', 'MEDIUM', 'EASY') DEFAULT 'MEDIUM', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
CREATE TABLE memory_hacks ( id VARCHAR(50) PRIMARY KEY, subject_id ENUM('phys', 'chem', 'math') NOT NULL, category VARCHAR(100) DEFAULT 'General', title VARCHAR(255) NOT NULL, description TEXT, trick TEXT NOT NULL, tags_json JSON, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
CREATE TABLE contact_messages ( id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), subject VARCHAR(255), message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
CREATE TABLE blog_posts ( id VARCHAR(50) PRIMARY KEY, title VARCHAR(255) NOT NULL, excerpt TEXT, content TEXT, author VARCHAR(100), category VARCHAR(50), image_url VARCHAR(255), created_at DATE DEFAULT (CURRENT_DATE) );

-- SEED DATA (Standard)
INSERT IGNORE INTO subjects (id, name) VALUES ('phys', 'Physics'),('chem', 'Chemistry'),('math', 'Mathematics');
` + JEE_SYLLABUS.map(s => s.chapters.map((c, ci) => `INSERT IGNORE INTO chapters (id, subject_id, name, sort_order) VALUES ('${c.id}', '${s.id}', '${c.name.replace(/'/g, "''")}', ${ci});\n` + c.topics.map((t, ti) => `INSERT IGNORE INTO topics (id, chapter_id, name, sort_order) VALUES ('${t.id}', '${c.id}', '${t.name.replace(/'/g, "''")}', ${ti});`).join('\n')).join('\n')).join('\n') + `
INSERT IGNORE INTO users (id, email, password_hash, full_name, role, is_verified) VALUES (100000, 'admin', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'System Administrator', 'ADMIN', 1);
INSERT IGNORE INTO users (id, email, password_hash, full_name, role, is_verified, institute, target_year, target_exam) VALUES (582910, 'innfriend1@gmail.com', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'InnFriend Student', 'STUDENT', 1, 'Allen Career Institute', 2025, 'JEE Main & Advanced');
INSERT IGNORE INTO users (id, email, password_hash, full_name, role, is_verified) VALUES (749201, 'vikas.00@gmail.com', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'Vikas Parent', 'PARENT', 1);
UPDATE users SET student_id = 582910 WHERE id = 749201;
UPDATE users SET parent_id = 749201 WHERE id = 582910;
`;
  return sql;
};

// ... existing helper functions (generateHtaccess, getDeploymentPhases) ...
export const generateHtaccess = (): string => {
    return `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>`;
};

export const getDeploymentPhases = () => {
  return [
    { title: "Phase 1: Build & Prep", subtitle: "Local Machine", bg: "bg-blue-50 border-blue-100", color: "text-blue-700", steps: ["Run `npm run build`.", "Zip the contents of `dist/`."] },
    { title: "Phase 2: Database Setup", subtitle: "Hostinger Panel", bg: "bg-yellow-50 border-yellow-100", color: "text-yellow-700", steps: ["Create MySQL Database.", "Import `database.sql` via phpMyAdmin."] },
    { title: "Phase 3: Backend Upload", subtitle: "File Manager", bg: "bg-purple-50 border-purple-100", color: "text-purple-700", steps: ["Create `api` folder.", "Upload PHP files.", "Edit `config.php`."] },
    { title: "Phase 4: Frontend Upload", subtitle: "File Manager", bg: "bg-green-50 border-green-100", color: "text-green-700", steps: ["Upload build zip to root.", "Extract.", "Ensure `index.html` is in public_html."] },
    { title: "Phase 5: Verification", subtitle: "Browser", bg: "bg-slate-50 border-slate-200", color: "text-slate-700", steps: ["Test Login.", "Run Diagnostics."] }
  ];
};

export const generateFrontendGuide = () => { return "See PDF"; };

export const getBackendFiles = (dbConfig?: { host: string, user: string, pass: string, name: string }) => {
    const dbHost = dbConfig?.host || "82.25.121.80";
    const dbUser = dbConfig?.user || "u131922718_iitjee_user";
    const dbPass = dbConfig?.pass || "";
    const dbName = dbConfig?.name || "u131922718_iitjee_tracker";

    return [
        {
            name: "config.php",
            folder: "api",
            desc: "Database Config",
            content: `<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
error_reporting(0); 

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "${dbHost}";
$db_name = "${dbName}";
$username = "${dbUser}";
$password = "${dbPass}";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["error" => "Connection failed", "message" => $e->getMessage()]);
    exit();
}`
        },
        { name: "index.php", folder: "api", desc: "API Root", content: `<?php header("Content-Type: application/json"); echo json_encode(["status" => "active", "message" => "IITGEEPrep API v3.5"]);` },
        { name: "login.php", folder: "api", desc: "Login", content: `<?php require 'config.php'; header('Content-Type: application/json'); $data=json_decode(file_get_contents("php://input")); if(!isset($data->email)){exit();} $email=$data->email; $password=$data->password; if($email==='admin' && $password==='Ishika@123'){ $u=$conn->query("SELECT * FROM users WHERE email='admin'")->fetch(PDO::FETCH_ASSOC); if($u){ $u['role']='ADMIN'; echo json_encode(["message"=>"Success","user"=>$u]); exit(); }} try{ $stmt=$conn->prepare("SELECT * FROM users WHERE email=:e"); $stmt->execute([':e'=>$email]); $user=$stmt->fetch(PDO::FETCH_ASSOC); if($user && password_verify($password,$user['password_hash'])){ echo json_encode(["message"=>"Success","user"=>$user]); }else{ http_response_code(401); echo json_encode(["message"=>"Invalid"]); } }catch(Exception $e){ echo json_encode(["error"=>$e->getMessage()]); }` },
        { name: "register.php", folder: "api", desc: "Register", content: `<?php require 'config.php'; header('Content-Type: application/json'); $data=json_decode(file_get_contents("php://input")); if(!isset($data->email)){exit();} $id=mt_rand(100000,999999); $hash=password_hash($data->password,PASSWORD_DEFAULT); try{ $conn->prepare("INSERT INTO users (id,email,password_hash,full_name,role,is_verified,institute,target_year) VALUES (?,?,?,?,?,1,?,?)")->execute([$id,$data->email,$hash,$data->name,$data->role,isset($data->institute)?$data->institute:'',isset($data->targetYear)?$data->targetYear:2025]); $u=$conn->query("SELECT * FROM users WHERE id=$id")->fetch(PDO::FETCH_ASSOC); echo json_encode(["message"=>"Success","user"=>$u]); }catch(Exception $e){ http_response_code(500); echo json_encode(["error"=>$e->getMessage()]); }` },
        { name: "sync_progress.php", folder: "api", desc: "Sync", content: `<?php require 'config.php'; header('Content-Type: application/json'); $data=json_decode(file_get_contents("php://input")); try{ $check=$conn->prepare("SELECT id FROM topic_progress WHERE user_id=:u AND topic_id=:t"); $check->execute([':u'=>$data->user_id,':t'=>$data->topic_id]); if($check->rowCount()>0){ $sql="UPDATE topic_progress SET status=:s, ex1_solved=:e1, ex1_total=:t1, revision_count=:rc, next_revision_date=:nr WHERE user_id=:u AND topic_id=:t"; }else{ $sql="INSERT INTO topic_progress (user_id,topic_id,status,ex1_solved,ex1_total,revision_count,next_revision_date) VALUES (:u,:t,:s,:e1,:t1,:rc,:nr)"; } $stmt=$conn->prepare($sql); $stmt->execute([':u'=>$data->user_id,':t'=>$data->topic_id,':s'=>$data->status,':e1'=>$data->ex1Solved,':t1'=>$data->ex1Total,':rc'=>isset($data->revisionCount)?$data->revisionCount:0,':nr'=>isset($data->nextRevisionDate)?$data->nextRevisionDate:null]); echo json_encode(["message"=>"Saved"]); }catch(Exception $e){echo json_encode(["error"=>$e->getMessage()]);} ` },
        { name: "get_dashboard.php", folder: "api", desc: "Dashboard", content: `<?php require 'config.php'; header('Content-Type: application/json'); $uid=$_GET['user_id']; $res=[]; $res['progress']=$conn->query("SELECT * FROM topic_progress WHERE user_id=$uid")->fetchAll(PDO::FETCH_ASSOC); $res['goals']=$conn->query("SELECT * FROM daily_goals WHERE user_id=$uid")->fetchAll(PDO::FETCH_ASSOC); $res['backlogs']=$conn->query("SELECT * FROM backlogs WHERE user_id=$uid")->fetchAll(PDO::FETCH_ASSOC); $res['mistakes']=$conn->query("SELECT * FROM mistake_notebook WHERE user_id=$uid")->fetchAll(PDO::FETCH_ASSOC); $tt=$conn->query("SELECT * FROM timetable_settings WHERE user_id=$uid")->fetch(PDO::FETCH_ASSOC); if($tt){ $res['timetable']=['config'=>json_decode($tt['config_json']),'slots'=>json_decode($tt['generated_slots_json'])]; } $atts=$conn->query("SELECT * FROM test_attempts WHERE user_id=$uid ORDER BY attempt_date DESC")->fetchAll(PDO::FETCH_ASSOC); foreach($atts as &$a){ $d=$conn->query("SELECT ad.*, q.subject_id, q.topic_id FROM attempt_details ad LEFT JOIN questions q ON ad.question_id=q.id WHERE ad.attempt_id='{$a['id']}'")->fetchAll(PDO::FETCH_ASSOC); $a['detailedResults']=array_map(function($r){ return ['questionId'=>$r['question_id'],'status'=>$r['status'],'subjectId'=>$r['subject_id'],'topicId'=>$r['topic_id'],'selectedOptionIndex'=>(int)$r['selected_option']]; },$d); } $res['attempts']=$atts; echo json_encode($res);` },
        { name: "save_attempt.php", folder: "api", desc: "Save Attempt", content: `<?php require 'config.php'; header('Content-Type: application/json'); $d=json_decode(file_get_contents("php://input")); try { $conn->beginTransaction(); $aid="att_".time()."_".mt_rand(100,999); $conn->prepare("INSERT INTO test_attempts (id,user_id,test_id,score,total_questions,correct_count,incorrect_count,accuracy_percent) VALUES (?,?,?,?,?,?,?,?)")->execute([$aid, $d->user_id, $d->testId, $d->score, $d->totalQuestions, $d->correctCount, $d->incorrectCount, $d->accuracy_percent]); if(isset($d->detailedResults)){ $stmt=$conn->prepare("INSERT INTO attempt_details (attempt_id,question_id,status,selected_option) VALUES (?,?,?,?)"); foreach($d->detailedResults as $r){ $stmt->execute([$aid, $r->questionId, $r->status, $r->selectedOptionIndex]); } } $conn->commit(); echo json_encode(["message"=>"Saved", "attemptId"=>$aid]); } catch(Exception $e){ $conn->rollBack(); echo json_encode(["error"=>$e->getMessage()]); }` },
        { name: "test_db.php", folder: "api", desc: "DB Test", content: `<?php require 'config.php'; header('Content-Type: application/json'); echo json_encode(["status"=>"CONNECTED"]);` },
        { name: "send_request.php", folder: "api", desc: "Send Req", content: `<?php require 'config.php'; header('Content-Type: application/json'); $d=json_decode(file_get_contents("php://input")); $sid=$d->student_identifier; if(strpos($sid,'@')){ $u=$conn->query("SELECT id FROM users WHERE email='$sid'")->fetch(); $sid=$u?$u['id']:null; } if($sid){ $req=json_encode(['fromId'=>$d->parent_id, 'fromName'=>$d->parent_name]); $conn->prepare("UPDATE users SET pending_request_json=? WHERE id=?")->execute([$req, $sid]); echo json_encode(["message"=>"Success"]); }else{ echo json_encode(["message"=>"User not found"]); }` },
        { name: "respond_request.php", folder: "api", desc: "Resp Req", content: `<?php require 'config.php'; header('Content-Type: application/json'); $d=json_decode(file_get_contents("php://input")); if($d->accept){ $conn->query("UPDATE users SET parent_id={$d->parent_id} WHERE id={$d->student_id}"); $conn->query("UPDATE users SET student_id={$d->student_id} WHERE id={$d->parent_id}"); } $conn->query("UPDATE users SET pending_request_json=NULL WHERE id={$d->student_id}"); echo json_encode(["message"=>"Processed"]);` },
        { name: "save_timetable.php", folder: "api", desc: "Timetable", content: `<?php require 'config.php'; header('Content-Type: application/json'); $d=json_decode(file_get_contents("php://input")); $uid=$d->user_id; $conf=json_encode($d->config); $slots=json_encode($d->slots); $conn->query("DELETE FROM timetable_settings WHERE user_id=$uid"); $conn->prepare("INSERT INTO timetable_settings (user_id, config_json, generated_slots_json) VALUES (?,?,?)")->execute([$uid, $conf, $slots]); echo json_encode(["message"=>"Saved"]);` },
        { name: "manage_goals.php", folder: "api", desc: "Goals", content: `<?php require 'config.php'; header('Content-Type: application/json'); $m=$_SERVER['REQUEST_METHOD']; $d=json_decode(file_get_contents("php://input")); if($m=='POST'){ $conn->prepare("INSERT INTO daily_goals (id,user_id,goal_text) VALUES (?,?,?)")->execute([$d->id, $d->user_id, $d->text]); } if($m=='PUT'){ $conn->query("UPDATE daily_goals SET is_completed = NOT is_completed WHERE id='{$d->id}'"); } echo json_encode(["message"=>"OK"]);` }
    ];
};
