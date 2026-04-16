const createForm = document.getElementById('create-form');
const recipientInput = document.getElementById('recipient-input');
const purposeInput = document.getElementById('purpose-input');
const toneInput = document.getElementById('tone-input');
const languageInput = document.getElementById('language-input');
const keypointsInput = document.getElementById('keypoints-input');
const createButton = document.getElementById('create-button');
const progressContainer = document.getElementById('progress-container');
const statusText = document.getElementById('status-text');

const sessionId = 'session-' + Math.random().toString(36).substring(2, 15);

function showProgress() {
    createForm.classList.add('hidden');
    createButton.disabled = true;
    createButton.innerHTML = 'Drafting...';
    progressContainer.classList.remove('hidden');
}

function updateStatus(text) {
    statusText.textContent = text;

    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));

    const lower = text.toLowerCase();

    if (lower.includes('planning') || lower.includes('topic')) {
        document.getElementById('step-researcher').classList.add('active');
    } else if (lower.includes('review') || lower.includes('checking')) {
        document.getElementById('step-judge').classList.add('active');
    } else if (lower.includes('draft') || lower.includes('writing')) {
        document.getElementById('step-builder').classList.add('active');
    }
}

createForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const recipient = recipientInput.value.trim();
    const purpose = purposeInput.value.trim();
    const tone = toneInput.value.trim();
    const language = languageInput.value.trim();
    const keyPoints = keypointsInput.value.trim();

    if (!recipient || !purpose || !tone || !language || !keyPoints) return;

    showProgress();

    const message = `
Please draft an email based on the following request.

Recipient Type: ${recipient}
Purpose: ${purpose}
Tone: ${tone}
Language: ${language}
Key Points:
${keyPoints}

Please produce a polished email that the user can use directly.
`.trim();

    try {
        const response = await fetch('/api/chat_stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                session_id: sessionId
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const data = JSON.parse(line);
                    if (data.type === 'progress') {
                        updateStatus(data.text);
                    } else if (data.type === 'result') {
                        localStorage.setItem('currentEmail', data.text);
                        window.location.href = '/course.html';
                        return;
                    }
                } catch (e) {
                    console.error('Error parsing JSON:', e, line);
                }
            }
        }

    } catch (error) {
        console.error('Error:', error);
        statusText.textContent = 'Something went wrong. Please refresh and try again.';
    }
});