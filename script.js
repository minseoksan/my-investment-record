// 1. HTML 요소 가져오기
const journalForm = document.getElementById('journal-form');
const journalList = document.querySelector('.journal-list');

// 2. 이벤트 리스너 등록
journalForm.addEventListener('submit', function(event) {
    // 💡 브라우저의 기본 새로고침을 무조건 최상단에서 막아줍니다.
    event.preventDefault(); 

    // 3. 입력값 가져오기
    const typeSelect = journalForm.querySelector('select');
    const typeValue = typeSelect.value; // 'buy', 'sell', 'lesson'
    
    // 에러 발생 확률이 높은 복잡한 코드 대신, 직관적인 조건문으로 한글 텍스트와 뱃지 색상을 정합니다.
    let typeText = '💡 투자 교훈';
    let badgeClass = 'red';
    let borderColor = '#ef4444'; // 기본값 (교훈 - 빨간색)

    if (typeValue === 'buy') {
        typeText = '📥 매수 기록';
        badgeClass = 'blue';
        borderColor = '#3b82f6'; // 파란색
    } else if (typeValue === 'sell') {
        typeText = '📤 매도 기록';
        badgeClass = 'green';
        borderColor = '#22c55e'; // 초록색
    }

    const title = document.getElementById('titleInput').value;
    const content = document.getElementById('contentInput').value;

    // [방어 코드] 텅 빈 입력 방지
    if (!title.trim() || !content.trim()) {
        alert('종목명과 내용을 모두 입력해 주세요!');
        return;
    }

    // 4. 새로운 일지 카드 <div> 생성
    const newCard = document.createElement('div');
    newCard.classList.add('journal-item');
    newCard.style.borderLeft = `5px solid ${borderColor}`; // 왼쪽 테두리 색상 동적 적용

    // 오늘의 날짜 생성 (2026-07-20 형식)
    const today = new Date().toISOString().split('T')[0];

    // 5. 카드 내부 HTML 채우기
    newCard.innerHTML = `
        <span class="badge ${badgeClass}">${typeText}</span>
        <h4>${title}</h4>
        <p>${content}</p>
        <small class="date">기록일: ${today}</small>
    `;

    // 6. 리스트의 맨 위에 카드 추가
    journalList.prepend(newCard);

    // 7. 입력창 비우기
    journalForm.reset();
});


// --- 🩺 [최종 치트키 버전] 체크리스트 기능 ---

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