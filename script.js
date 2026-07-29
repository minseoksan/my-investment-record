document.addEventListener("DOMContentLoaded", function () {
    // 1. HTML 요소 가져오기 (가져오지 못할 경우를 대비해 안전하게 처리)
    const journalForm = document.getElementById('journal-form');
    const journalList = document.querySelector('.journal-list');
    const typeSelect = journalForm ? journalForm.querySelector("select") : null;

    const buyChecklistModal = document.getElementById("buy-checklist-modal");
    const modalCheckboxes = buyChecklistModal ? buyChecklistModal.querySelectorAll(".buy-modal-check") : [];

    const cancelModalBtn = document.getElementById("cancel-modal");
    const confirmSaveBtn = document.getElementById("confirm-save");

    const journals = JSON.parse(localStorage.getItem("journals")) || [];

    // 2. 화면에 기록 목록을 렌더링하는 함수
    function renderJournals() {
        if (!journalList) return;
        journalList.innerHTML = "";

        journals.forEach(function (journal, index) {
            const newCard = document.createElement("div");

            let badgeText = "💡 투자 교훈";
            let badgeClass = "red";
            let borderClass = "danger";

            if (journal.type === "buy") {
                badgeText = "📥 매수 기록";
                badgeClass = "blue";
                borderClass = "buy";
            } else if (journal.type === "sell") {
                badgeText = "📤 매도 기록";
                badgeClass = "green";
                borderClass = "sell";
            }

            newCard.className = `journal-item ${borderClass}`;
            newCard.innerHTML = `
                <span class="badge ${badgeClass}">${badgeText}</span>
                <h4>${journal.title}</h4>
                <p>${journal.content}</p>
                <small class="date">기록일: ${journal.date}</small>
                <button class="delete-btn">삭제</button>
            `;
            const deleteBtn = newCard.querySelector(".delete-btn");

            deleteBtn.addEventListener("click", function () {
                deleteJournal(index);
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

        journals.unshift(journal);
        localStorage.setItem("journals", JSON.stringify(journals));

        if (buyChecklistModal) {
            buyChecklistModal.style.display = "none";
        }

        renderJournals();

        if (journalForm) journalForm.reset();

        modalCheckboxes.forEach(function (checkbox) {
            checkbox.checked = false;
        });
    }

    // 4. 일지 삭제 함수
    function deleteJournal(index) {
        const isDelete = confirm("정말 삭제하시겠습니까?");
        if (!isDelete) {
            return;
        }    
        journals.splice(index, 1);
        localStorage.setItem("journals", JSON.stringify(journals));
        renderJournals();
    }

    // 4. 폼 제출(Submit) 이벤트 연결
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
            if (typeValue === "buy") {
                if (buyChecklistModal) buyChecklistModal.style.display = "flex";
            } else {
                saveJournal();
            }
        });
    } else {
        console.error("오류: #journal-form 요소를 찾을 수 없습니다.");
    }

    // 5. [취소] 버튼 이벤트 연결
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener("click", function () {
            if (buyChecklistModal) buyChecklistModal.style.display = "none";
        });
    } else {
        console.error("오류: #cancel-modal 요소를 찾을 수 없습니다.");
    }

    // 6. [저장] 버튼 이벤트 연결
    if (confirmSaveBtn) {
        confirmSaveBtn.addEventListener("click", function () {
            const allChecked = Array.from(modalCheckboxes).every(function (checkbox) {
                return checkbox.checked;
            });

            if (allChecked) {
                saveJournal();
            } else {
                alert("모든 체크리스트 항목을 확인해주세요.");
            }
        });
    } else {
        console.error("오류: #confirm-save 요소를 찾을 수 없습니다.");
    }

    // 7. 초기 렌더링 실행
    renderJournals();

    // 8. 체크리스트 취소선 기능
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