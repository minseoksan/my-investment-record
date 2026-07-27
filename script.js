// HTML 요소 가져오기
const journalForm = document.getElementById('journal-form');
const journalList = document.querySelector('.journal-list');
const typeSelect = journalForm.querySelector("select");
const buyChecklistModal = document.getElementById("checklist-modal");
const modalCheckboxes = buyChecklistModal.querySelectorAll(".buy-modal-check");
const cancelModalBtn = document.getElementById("cancel-modal");
const confirmSaveBtn = document.getElementById("confirm-save");
const journals = JSON.parse(localStorage.getItem("journals")) || [];

//  화면에 기록 목록을 렌더링하는 함수
function renderJournals() {
    journalList.innerHTML = "";

    journals.forEach(function(journal) {

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
        `;

        journalList.appendChild(newCard);
    });
}

// 저장 버튼 클릭 시 처리
function saveJournal(){
    const typeValue = typeSelect.value; // 'buy', 'sell', 'lesson'
    const title = document.getElementById('titleInput').value;
    const content = document.getElementById('contentInput').value;
    const today = new Date().toISOString().split('T')[0];
    const journal = {
    type: typeValue,
    title: title,
    content: content,
    date: today
    };

    if (!title.trim() || !content.trim()) {
    alert('종목명과 내용을 모두 입력해 주세요!');
    return;
    }
    journals.unshift(journal);

    // Local Storage 저장
    localStorage.setItem("journals", JSON.stringify(journals));

    buyChecklistModal.style.display = "none";
    // 화면 다시 그리기
    renderJournals();

    // 입력창 초기화
    journalForm.reset();

    modalCheckboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });


}

// 이벤트 리스너 등록
journalForm.addEventListener('submit', function(event) {
    // 💡 브라우저의 기본 새로고침을 무조건 최상단에서 막아줍니다.
    event.preventDefault();
    const typeValue = typeSelect.value;
    if (typeValue === "buy") {
        buyChecklistModal.style.display = "flex";
    }
    else if (typeValue === "sell") {
        saveJournal();
    }
    else if (typeValue === "lesson") {
        saveJournal();
    }
    

});

cancelModalBtn.addEventListener("click", function(){

    buyChecklistModal.style.display = "none";

});


confirmSaveBtn.addEventListener("click", function(){
    const allChecked = [...modalCheckboxes].every(function(checkbox) {
        return checkbox.checked;
    });
    if (allChecked) {
        saveJournal();
    } else {
        alert("모든 체크리스트 항목을 확인해주세요.");
    }
})


// --- 🩺 [최종 치트키 버전] 체크리스트 기능 ---

renderJournals();
// HTML의 클래스명(.rule-list)을 따지지 않고, 웹페이지에 존재하는 모든 체크박스를 싹 다 잡아옵니다.
const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');

allCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
        // 체크박스를 감싸고 있는 가장 가까운 부모 태그(li 또는 div 등)를 찾습니다.
        const parentElement = checkbox.parentElement;

        if (checkbox.checked) {
            // 체크가 되면 부모 태그 전체의 글자에 취소선을 긋고 회색으로 만듭니다.
            parentElement.style.textDecoration = 'line-through';
            parentElement.style.color = '#94a3b8';
        } else {
            // 체크를 해제하면 원래대로 돌려놓습니다.
            parentElement.style.textDecoration = 'none';
            parentElement.style.color = ''; // CSS에 설정된 원래 색상으로 복구
        }
    });
});