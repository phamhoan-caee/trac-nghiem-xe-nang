// --- CẤU HÌNH ---
        const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz0Q3JLjr5UzRF8wzgKXS43nhil8HNYVGi6O2eZ7g9FqDlSq4dzA8sKX1S5V1xyii16/exec";
        
        let rawData = []; // Ngân hàng đề từ Sheets
        let currentQuestions = [];
        let userAnswers = {};
        let timeLeft = 20 * 60;
        let timer;

        // Tự động tải dữ liệu khi mở trang
        window.onload = async () => {
            try {
                const response = await fetch(WEB_APP_URL);
                rawData = await response.json();
                console.log("Đã tải " + rawData.length + " câu hỏi từ Sheets");
            } catch (e) {
                alert("Lỗi kết nối dữ liệu Sheets!");
            }
        };

        function startExam() {
            const name = document.getElementById('name').value;
            const cls = document.getElementById('class').value;
            if(!name || !cls) return alert("Vui lòng nhập đầy đủ thông tin!");
            
            if(rawData.length === 0) return alert("Đang tải đề, thầy đợi xíu nhé!");

            // LẤY ĐÚNG 30 CÂU NGẪU NHIÊN TẠI ĐÂY
            currentQuestions = [...rawData].sort(() => Math.random() - 0.5).slice(0, 30);
            
            document.getElementById('auth-view').classList.add('hidden');
            document.getElementById('exam-view').classList.remove('hidden');
            document.getElementById('timer').classList.remove('hidden');
            
            renderQuestions();
            timer = setInterval(updateTimer, 1000);
        }

        function renderQuestions() {
            const container = document.getElementById('question-container');
            container.innerHTML = currentQuestions.map((item, i) => `
                <div class="bg-white p-6 rounded-2xl shadow-sm border mb-6">
                    <div class="flex gap-3 mb-4">
                        <span class="bg-blue-600 text-white w-7 h-7 rounded flex items-center justify-center font-bold shrink-0 text-sm">${i+1}</span>
                        <h4 class="font-bold text-gray-800 text-sm leading-relaxed">${item["Nội dung câu hỏi"]}</h4>
                    </div>
                    
                    ${item["HINHANH"] ? `<img src="${item["HINHANH"]}" class="w-full rounded-xl mb-4 border">` : ''}

                    <div class="grid gap-3">
                        ${["A", "B", "C", "D"].map((label) => {
                            const optText = item["Đáp án " + label];
                            if(!optText) return ''; // Bỏ qua nếu đáp án trống
                            return `
                                <div class="relative">
                                    <input type="radio" name="q${i}" id="q${i}${label}" class="option-input hidden" onchange="selectOption(${i}, '${label}')">
                                    <label for="q${i}${label}" class="block p-3 border-2 border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-all font-medium text-gray-600 text-sm">
                                        ${label}. ${optText}
                                    </label>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `).join('');
        }

        function selectOption(qIdx, label) {
            userAnswers[qIdx] = label;
            document.getElementById('progress').innerText = `Tiến độ: ${Object.keys(userAnswers).length}/${currentQuestions.length}`;
        }

        function submitExam() {
            if(timeLeft > 0 && !confirm("Bạn muốn nộp bài sát hạch?")) return;
            clearInterval(timer);

            let score = 0;
            currentQuestions.forEach((q, i) => {
                if(userAnswers[i] === q["Đáp án đúng"]) score++;
            });
            
            // ... (Các phần hiển thị kết quả giữ nguyên như thầy đã viết)
        }

