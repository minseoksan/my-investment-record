document.addEventListener("DOMContentLoaded", function () {
    // 1. HTML 요소 가져오기
    const journalForm = document.getElementById('journal-form');
    const journalList = document.querySelector('.journal-list');
    const typeSelect = journalForm ? journalForm.querySelector("select") : null;

    const marketDate = document.getElementById("market-date");
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    if (marketDate) marketDate.textContent = `📅${formattedDate}`;

    const Checklistmodal = document.getElementById("checklist-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalChecklist = document.getElementById("modal-checklist");
    const cancelModalBtn = document.getElementById("cancel-modal");
    const confirmSaveBtn = document.getElementById("confirm-save");

    let editingIndex = null; // 수정할 일지의 인덱스를 저장하는 변수

    const checklistData = {
    buy: [
        "영업이익 적자 여부를 확인",
        "최근 6개월 급등 여부를 확인",
        "분할 매수 계획을 수립",
        "손절가와 목표가를 설정"
    ],
    sell: [
        "목표가 달성 여부를 확인",
        "손절가 도달 여부를 확인",
        "분할 매도 계획을 수립",
        "매도 이유를 다시 점검"
    ],
    lesson: [
        "배운 점 기록",
        "다음 대응 전략을 수립",
        "실패 원인 분석",
        "감정적인 매매 또는 매수였는지 확인"
    ]
    };

    const journals = JSON.parse(localStorage.getItem("journals")) || [];

    // 2. 화면에 기록 목록을 렌더링하는 함수
    function renderJournals() {
        if (!journalList) return;
        journalList.innerHTML = "";

        journals.forEach(function (journal, index) {
            const newCard = document.createElement("div");

            let badgeText = "💡 투자 교훈";
            let badgeClass = "green";
            let borderClass = "danger";

            if (journal.type === "buy") {
                badgeText = "📥 매수 기록";
                badgeClass = "blue";
                borderClass = "buy";
            } else if (journal.type === "sell") {
                badgeText = "📤 매도 기록";
                badgeClass = "red";
                borderClass = "sell";
            }

            newCard.className = `journal-item ${borderClass}`;
            newCard.innerHTML = `
                <span class="badge ${badgeClass}">${badgeText}</span>
                <h4>${journal.title}</h4>
                <p>${journal.content}</p>
                <small class="date">기록일: ${journal.date}</small>
                <button class="delete-btn">삭제</button>
                <button class="edit-btn">수정</button>
            `;

            const deleteBtn = newCard.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", function () {
                deleteJournal(index);
            });

            const editBtn = newCard.querySelector(".edit-btn");
            editBtn.addEventListener("click", function () {
                editJournal(index);
            });

            journalList.appendChild(newCard);
        });
    }

    // 3. 일지 저장 함수
    function saveJournal() {
        const titleInput = document.getElementById('titleInput');
        const contentInput = document.getElementById('contentInput');

        if (!titleInput || !contentInput) return;

        const title = titleInput.value;
        const content = contentInput.value;
        const typeValue = typeSelect ? typeSelect.value : 'lesson';
        const today = new Date().toISOString().split('T')[0];

        if (!title.trim() || !content.trim()) {
            alert('종목명과 내용을 모두 입력해 주세요!');
            return;
        }

        const journal = {
            type: typeValue,
            title: title,
            content: content,
            date: today
        };
        if (editingIndex === null) {
            journals.unshift(journal);
        } else {
            journals[editingIndex] = journal;
            editingIndex = null; // 수정 후 인덱스 초기화
        }
        localStorage.setItem("journals", JSON.stringify(journals));

        // 모달 닫기 (독립적 처리)
        if (Checklistmodal) Checklistmodal.style.display = "none";

        renderJournals();

        if (journalForm) journalForm.reset();

        // 체크박스 초기화
        const modalCheckboxes = modalChecklist.querySelectorAll(".modal-check");
        modalCheckboxes.forEach(cb => {cb.checked = false;});
    }

    // 4. 일지 삭제 함수
    function deleteJournal(index) {
        const isDelete = confirm("정말 삭제하시겠습니까?");
        if (!isDelete) return;
        
        journals.splice(index, 1);
        localStorage.setItem("journals", JSON.stringify(journals));
        renderJournals();
    }

    // 5. 일지 수정 함수
    function editJournal(index) {
        const titleInput = document.getElementById("titleInput");
        const contentInput = document.getElementById("contentInput");

        const isEdit = confirm("정말 수정하시겠습니까?");
        if (!isEdit) return;
        
        editingIndex = index;
        titleInput.value = journals[index].title;
        contentInput.value = journals[index].content;
        typeSelect.value = journals[index].type;
    }

    // 5. 체크리스트 모달 생성
    function openModal(type) {
        modalChecklist.innerHTML = "";
        if (type === "buy") {
            modalTitle.textContent = "🛡️ 매수 체크리스트";
        } else if (type === "sell") {
            modalTitle.textContent = "📤 매도 체크리스트";
        } else if (type === "lesson") {
            modalTitle.textContent = "💡 투자 교훈 체크리스트";
        }

        const items = checklistData[type];

        items.forEach(function(item) {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.addEventListener("change", function () {
                if (checkbox.checked) {
                    label.style.textDecoration = "line-through";
                    label.style.color = "#94a3b8";
                } else {
                    label.style.textDecoration = "none";
                    label.style.color = "";
                }
            });

            checkbox.type = "checkbox";
            checkbox.className = "modal-check";
            label.appendChild(checkbox);
            label.append(" " + item);
            modalChecklist.appendChild(label);
        });
    
    Checklistmodal.style.display = "flex";
    }

    // 6. 폼 제출(Submit) 이벤트 연결
    if (journalForm) {
        journalForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const titleInput = document.getElementById('titleInput');
            const contentInput = document.getElementById('contentInput');

            if (titleInput && contentInput && (!titleInput.value.trim() || !contentInput.value.trim())) {
                alert('종목명과 내용을 모두 입력해 주세요!');
                return;
            }

            const typeValue = typeSelect ? typeSelect.value : '';
            openModal(typeValue);
        });
    }

    // 6. 모달 버튼 이벤트
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener("click", function () {
            if (Checklistmodal) Checklistmodal.style.display = "none";
        });
    }

    if (confirmSaveBtn) {
        confirmSaveBtn.addEventListener("click", function () {
            const modalCheckboxes = modalChecklist.querySelectorAll(".modal-check");
            const allChecked = Array.from(modalCheckboxes).every(checkbox => checkbox.checked);
            if (allChecked) {
                saveJournal();
            } else {
                alert("모든 체크리스트 항목을 확인해주세요.");
            }
        });
    }

    // 8. 초기 렌더링
    renderJournals();

    // 9. 체크리스트 취소선 기능
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            const parentElement = checkbox.parentElement;
            if (!parentElement) return;

            if (checkbox.checked) {
                parentElement.style.textDecoration = 'line-through';
                parentElement.style.color = '#94a3b8';
            } else {
                parentElement.style.textDecoration = 'none';
                parentElement.style.color = '';
            }
        });
    });
});