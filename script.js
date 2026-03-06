// --- CẤU HÌNH HỆ THỐNG ---
const EXAM_TIME_MINUTES = 20; 
const TOTAL_QUESTIONS_TO_SHOW = 30; // Đã đặt định dạng 30 câu
const PASS_SCORE = 25; 
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyFfsbggthMpC4mCJJAVjVgiVbbPG1SaquMKDhZZlbWXa0H9hAz4-6YPnFBA0zxtgQ0/exec";

// --- BIẾN TOÀN CỤC ---
let rawData = []; // Chứa toàn bộ câu hỏi từ Sheets
let examQuestions = [];
let currentIndex = 0;
let userScore = 0;
let timerInterval;
let timeLeft = EXAM_TIME_MINUTES * 60;
let studentName = "";

// Tự động tải dữ liệu ngay khi mở web
window.onload = async () => {
    try {
        const response = await fetch(WEB_APP_URL);
        rawData = await response.json();
        console.log("Đã tải ngân hàng đề!");
    } catch (e) {
        console.error("Lỗi tải đề:", e);
    }
};

function startExam() {
    studentName = document.getElementById('student-name').value.trim();
    if (!studentName) {
        alert("Vui lòng nhập Họ tên học viên!");
        return;
    }

    if (rawData.length === 0) {
        alert("Đang tải dữ liệu, thầy đợi 3 giây rồi bấm lại nhé!");
        return;
    }

    // Trộn và lấy đúng 30 câu từ dữ liệu thật
    examQuestions = shuffleArray([...rawData]).slice(0, TOTAL_QUESTIONS_TO_SHOW);
    
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');

    renderQuestion();
    startTimer();
}

function renderQuestion() {
    const q = examQuestions[currentIndex];
    document.getElementById('progress').innerText = `Câu ${currentIndex + 1}/${TOTAL_QUESTIONS_TO_SHOW}`;
    
    // Khớp với tên cột trong Sheets của thầy
    document.getElementById('question-text').innerText = q["Nội dung câu hỏi"];

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    // Gom các cột đáp án A, B, C, D vào
    const choices = [
        { key: "A", text: q["Đáp án A"] },
        { key: "B", text: q["Đáp án B"] },
        { key: "C", text: q["Đáp án C"] },
        { key: "D", text: q["Đáp án D"] }
    ];

    choices.forEach(opt => {
        if (opt.text) {
            const btn = document.createElement('button');
            btn.className = 'opt-btn btn btn-outline-primary d-block w-100 mb-2 text-start';
            btn.innerText = `${opt.key}. ${opt.text}`;
            // So sánh với cột "Đáp án đúng"
            btn.onclick = () => handleAnswer(opt.key, q["Đáp án đúng"]);
            optionsDiv.appendChild(btn);
        }
    });
}

// Giữ nguyên hàm shuffleArray, startTimer, handleAnswer của thầy...
// Chỉ cần thay đổi cách truy xuất dữ liệu như trên là sẽ chạy được 30 câu!
