const form = document.getElementById('prefillForm');
const emailInput = document.getElementById('contactEmail');
const nameInput = document.getElementById('contactName');
const telInput = document.getElementById('contactTel');
const loadBtn = document.getElementById('loadBtn');
const statusEl = document.getElementById('status');
const sessionDataEl = document.getElementById('sessionData');

const emptyContact = () => ({ email: '', name: '', tel: '' });

async function fetchSessionData() {
    setStatus('読み込み中...');
    try {
        const response = await fetch('sessions/get_data.php', {
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        renderSessionData(data);
        setStatus('セッション情報を読み込みました');
    } catch (error) {
        console.error(error);
        setStatus('セッションの読み込みに失敗しました');
    }
}

async function saveSessionData(event) {
    event?.preventDefault();

    setStatus('保存中...');
    try {
        const formData = new FormData(form);

        const response = await fetch('sessions/save_data.php', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        renderSessionData(data);
        setStatus('セッションへ保存しました');
    } catch (error) {
        console.error(error);
        setStatus('保存に失敗しました');
    }
}

function renderSessionData(data) {
    sessionDataEl.textContent = JSON.stringify(data, null, 2);

    const contact = data.contact ?? emptyContact();
    emailInput.value = contact.email ?? '';
    nameInput.value = contact.name ?? '';
    telInput.value = contact.tel ?? '';
}

function setStatus(text) {
    statusEl.textContent = text;
}

loadBtn.addEventListener('click', fetchSessionData);
form.addEventListener('submit', saveSessionData);

document.addEventListener('DOMContentLoaded', fetchSessionData);
