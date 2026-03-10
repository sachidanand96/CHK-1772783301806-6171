
const GEMINI_API_KEY = "AIzaSyDRxcIPNar9A3XWBmhu8SNzL0eXsPdcVNY";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;


const CRISIS_KEYWORDS = [
    "i want to die", "i feel hopeless", "i can't go on", "kill myself",
    "end my life", "suicide", "no point in living"
];

const songsData = [
    "Arambha hai prachand - A .mp3",
    "Believer - A .mp3",
    "East Duo - T .mp3",
    "Experience – Ludovico Einaudi - T .mp3",
    "Fix You – B .mp3",
    "Gangster paradise - A .mp3",
    "Hall of Fame – B .mp3",
    "Happy Nation - G .mp3",
    "Indila - G .mp3",
    "Kala Chasma - A .mp3",
    "Kar Har Maidaan Fateh – B .mp3",
    "Kesariya - N .mp3",
    "Love you Zindigi - G .mp3",
    "Mvsterious - B .mp3",
    "O Mahi - N .mp3",
    "Paisa - A .mp3",
    "Raabta - T .mp3",
    "Shiv Kailash - T .mp3",
    "War Song - B .mp3",
    "Weightless – T .mp3",
    "ilahi - N .mp3",
    "jaise jache karma - N .mp3",
    "Матушка - G .mp3"
];

let globalAudio = null;
let currentPlayingBtn = null;


let moodData = JSON.parse(localStorage.getItem('mindcare_moods')) || [];
let moodChartInstance = null;
let aiPreviewLoading = false;
let userData = JSON.parse(localStorage.getItem('mindcare_user')) || {
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@example.com',
    avatar: 'https://i.pravatar.cc/150?img=47',
    plan: 'Free Plan'
};

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    initNavigation();
    initMoodTracker();
    initChart();
    initChat();
    updateProgressHistory();
    generateAiPreview();
    initSettings();
    initBooking();
    initMusicPlayer();
});


function loadUserData() {
    const nameEl = document.getElementById('user-name');
    const avatarEl = document.getElementById('user-avatar');
    const emailEl = document.getElementById('user-email');
    const pageTitle = document.getElementById('page-title');
    const initialMessage = document.querySelector('.ai-message .message-content');
    const dashboardHeading = document.getElementById('dashboard-heading');

    if (nameEl) nameEl.textContent = userData.name;
    if (avatarEl) avatarEl.src = userData.avatar;
    if (emailEl) emailEl.textContent = userData.email || userData.plan;
    if (pageTitle) pageTitle.textContent = `Welcome back, ${userData.name}`;
    if (initialMessage) initialMessage.textContent = `Hello ${userData.name}, I'm your MindCare AI assistant. How are you feeling today? Need someone to talk to?`;
    if (dashboardHeading) dashboardHeading.textContent = `Dashboard for ${userData.name}`;
}

function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const modal = document.getElementById('settings-modal');
    const closeBtn = document.getElementById('close-settings');
    const cancelBtn = document.getElementById('cancel-settings');
    const saveBtn = document.getElementById('save-settings');
    const nameInput = document.getElementById('user-name-input');
    const avatarInput = document.getElementById('user-avatar-input');
    const planInput = document.getElementById('user-plan-input');

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {

            nameInput.value = userData.name;
            avatarInput.value = userData.avatar;
            planInput.value = userData.plan;
            modal.classList.remove('hidden');
        });
    }

    const closeModal = () => modal.classList.add('hidden');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            userData.name = nameInput.value.trim() || 'User';
            userData.avatar = avatarInput.value.trim() || 'https://i.pravatar.cc/150?img=1';
            userData.plan = planInput.value.trim() || 'Free Plan';

            localStorage.setItem('mindcare_user', JSON.stringify(userData));
            loadUserData();
            updateTitles();
            generateAiPreview();
            closeModal();
        });
    }
}


function initBooking() {
    const bookBtn = document.getElementById('book-assistant-btn');
    const modal = document.getElementById('booking-modal');
    const closeBtn = document.getElementById('close-booking');
    const bookingForm = document.getElementById('booking-form');
    const statusMsg = document.getElementById('booking-status-message');
    const confirmBtn = document.getElementById('confirm-booking-btn');

    if (bookBtn && modal) {
        bookBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            if (statusMsg) statusMsg.style.display = 'none';
        });
    }

    const closeModal = () => modal.classList.add('hidden');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (typeof emailjs !== 'undefined') {
        emailjs.init("YOUR_PUBLIC_KEY");
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const doctor = document.getElementById('doctor-select').value;
            const date = document.getElementById('booking-date').value;
            const email = document.getElementById('booking-email-input').value;

            confirmBtn.textContent = 'Sending...';
            confirmBtn.disabled = true;

            const templateParams = {
                to_email: email,
                doctor_name: doctor,
                booking_date: date,
                user_name: userData.name
            };

            // Using dummy service_id and template_id
            if (typeof emailjs !== 'undefined') {
                emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                    .then(function () {
                        handleSuccess();
                    }, function (error) {
                        console.warn("EmailJS error (expected if keys aren't set). Simulating success for prototype:", error);
                        handleSuccess(); // Simulate success anyway for the UI prototype
                    });
            } else {
                handleSuccess();
            }

            function handleSuccess() {
                confirmBtn.textContent = 'Confirm Appointment';
                confirmBtn.disabled = false;
                statusMsg.textContent = `Appointment confirmed! Email sent to ${email}`;
                statusMsg.style.display = 'block';
                statusMsg.style.color = '#10b981'; // green

                setTimeout(() => {
                    closeModal();
                    bookingForm.reset();
                }, 2500);
            }
        });
    }
}

// --- Update Titles with User Name ---
function updateTitles() {
    const titles = {
        'dashboard': `Welcome back, ${userData.name}`,
        'chat': 'AI Therapy Chat',
        'progress': 'My Progress'
    };

    // Update the titles object in navigation
    // Since it's local, we can access it in initNavigation
}

// --- Tab Navigation ---
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active state in nav
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Show target section
            const targetId = item.getAttribute('data-target');
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            // Update header
            const titles = {
                'dashboard': `Welcome back, ${userData.name}`,
                'chat': 'AI Therapy Chat',
                'progress': 'My Progress'
            };
            if (titles[targetId]) {
                pageTitle.textContent = titles[targetId];
            }

            // Re-render chart
            if (targetId === 'dashboard' && moodChartInstance) {
                moodChartInstance.update();
            }
        });
    });
}

// --- Mood Tracker ---
function initMoodTracker() {
    const moodBtns = document.querySelectorAll('.mood-btn');
    const feedbackText = document.getElementById('mood-feedback');

    // Check if user already logged mood today
    const today = new Date().toLocaleDateString();
    const todayLog = moodData.find(log => log.date === today);

    if (todayLog) {
        // Find and highlight the button
        const btn = document.querySelector(`.mood-btn[data-mood="${todayLog.mood}"]`);
        if (btn) {
            moodBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        }
    }

    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove selection
            moodBtns.forEach(b => b.classList.remove('selected'));
            // Add selection
            btn.classList.add('selected');

            const mood = btn.getAttribute('data-mood');
            if (feedbackText) {
                feedbackText.textContent = `Mood recorded: ${mood}. Thank you!`;
                feedbackText.classList.remove('hidden');
                setTimeout(() => feedbackText.classList.add('hidden'), 3000);
            }

            saveMood(mood);
        });
    });
}

function saveMood(moodStr) {
    const today = new Date().toLocaleDateString();

    // Convert mood to numeric value (1-5)
    const moodValues = {
        'Terrible': 1,
        'Bad': 2,
        'Neutral': 3,
        'Good': 4,
        'Amazing': 5
    };
    const value = moodValues[moodStr];

    // Check if exists
    const existingIndex = moodData.findIndex(log => log.date === today);
    if (existingIndex >= 0) {
        moodData[existingIndex] = { date: today, mood: moodStr, value: value };
    } else {
        moodData.push({ date: today, mood: moodStr, value: value });
    }

    // Sort array by date
    moodData.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem('mindcare_moods', JSON.stringify(moodData));

    updateChart();
    updateProgressHistory();
    generateAiPreview(); // Re-generate AI prompt for new mood
}

// --- Chart visualization (Bar Chart) ---
function initChart() {
    const canvas = document.getElementById('moodBarChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Prepare initial data (last 7 days)
    const labels = [];
    const dataPoints = [];
    const bgColors = [];

    const todayStr = new Date().toLocaleDateString();

    const d = new Date();
    for (let i = 6; i >= 0; i--) {
        const targetDate = new Date(d);
        targetDate.setDate(d.getDate() - i);
        const dateStr = targetDate.toLocaleDateString();

        // Format label as Short Day (MON, TUE etc)
        const labelStr = targetDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        labels.push(labelStr);

        const log = moodData.find(l => l.date === dateStr);
        const val = log ? log.value : 0;
        dataPoints.push(val);

        // Style the bar. If it's today, make it darker blue. Otherwise regular purple.
        if (dateStr === todayStr && val > 0) {
            bgColors.push('#3b28cc'); // Primary selected color
        } else {
            // Lighter purples based on height, or just standard purple
            bgColors.push(val > 0 ? '#ecebff' : '#f3f4f6');
        }
    }

    moodChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mood Level',
                data: dataPoints,
                backgroundColor: bgColors,
                borderRadius: 4,
                borderSkipped: false,
                barThickness: 24
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    display: false, // Hide Y axis like screenshot
                    min: 0,
                    max: 5
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9ca3af',
                        font: { size: 10, weight: 600 }
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const labels = ['', 'Terrible', 'Bad', 'Neutral', 'Good', 'Amazing'];
                            return labels[context.raw] || 'No Data';
                        }
                    }
                }
            }
        }
    });
}

function updateChart() {
    if (!moodChartInstance) return;

    const labels = [];
    const dataPoints = [];
    const bgColors = [];

    const todayStr = new Date().toLocaleDateString();
    const d = new Date();

    for (let i = 6; i >= 0; i--) {
        const targetDate = new Date(d);
        targetDate.setDate(d.getDate() - i);
        const dateStr = targetDate.toLocaleDateString();
        const labelStr = targetDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        labels.push(labelStr);

        const log = moodData.find(l => l.date === dateStr);
        const val = log ? log.value : 0;
        dataPoints.push(val);

        if (dateStr === todayStr && val > 0) {
            bgColors.push('#3b28cc'); // Darker primary
        } else if (val > 0) {
            // Vary shades of purple based on value to mimic screenshot
            const opacities = [0.1, 0.2, 0.4, 0.6, 0.8];
            bgColors.push(`rgba(162, 155, 254, ${opacities[val - 1]})`);
        } else {
            bgColors.push('#f3f4f6');
        }
    }

    moodChartInstance.data.labels = labels;
    moodChartInstance.data.datasets[0].data = dataPoints;
    moodChartInstance.data.datasets[0].backgroundColor = bgColors;
    moodChartInstance.update();
}

function updateProgressHistory() {
    const container = document.getElementById('mood-history-list');
    if (!container) return;
    container.innerHTML = '';
    if (moodData.length === 0) {
        container.innerHTML = '<p style="padding: 16px; color: #636e72;">No history recorded yet.</p>';
        return;
    }
    const reversed = [...moodData].reverse();
    reversed.forEach(log => {
        let color = '#3b28cc';
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <div><strong>${log.date}</strong></div>
            <div style="color: ${color}; font-weight: 600;">${log.mood}</div>
        `;
        container.appendChild(item);
    });
}

// --- Dynamic AI Preview (Gemini API) ---
async function generateAiPreview() {
    if (aiPreviewLoading) return;

    const previewEl = document.getElementById('dynamic-ai-text');
    if (!previewEl) return;

    const today = new Date().toLocaleDateString();
    const todayLog = moodData.find(log => log.date === today);
    const mood = todayLog ? todayLog.mood : "unspecified";

    // Set loading state
    aiPreviewLoading = true;
    previewEl.innerHTML = '<span style="color: #9ca3af; font-style: italic;">AI is thinking...</span>';

    const prompt = `You are MindCare AI, an empathetic wellness assistant speaking to ${userData.name}. 
Based on her currently logged mood of "${mood}" today, write exactly ONE short, friendly sentence (max 20 words) greeting her and suggesting a quick wellness activity.
Example format: "Hi ${userData.name}, I see you're feeling ${mood} today. Would you like to try a quick 2-minute breathing exercise?"
Do not include quotation marks or any other text.`;

    try {
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 50 }
        };

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("API Network Error");

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text.replace(/"/g, '').trim();

        previewEl.innerHTML = `"${textResponse}"`;
    } catch (e) {
        console.error("AI Preview Error:", e);
        previewEl.innerHTML = `"Hi ${userData.name}, I'm here for you today. Would you like to start a new session?"`;
    } finally {
        aiPreviewLoading = false;
    }
}


// --- Chat Section (Main AI Therapy functionality) ---
function initChat() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-chat-btn');
    const closeAlertBtn = document.getElementById('close-alert');

    if (sendBtn) sendBtn.addEventListener('click', handleChatSubmit);
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChatSubmit();
        });
    }

    if (closeAlertBtn) {
        closeAlertBtn.addEventListener('click', () => {
            document.getElementById('crisis-alert').classList.add('hidden');
        });
    }
}

async function handleChatSubmit() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    appendMessage(message, 'user');
    input.value = '';
    const typingId = showTypingIndicator();

    try {
        const aiData = await callGeminiAPI(message);
        removeTypingIndicator(typingId);
        appendMessage(aiData.response, 'ai');

        if (aiData.stress_level && document.getElementById('current-sentiment')) {
            document.getElementById('current-sentiment').textContent = aiData.stress_level;
        }

        if (aiData.is_crisis) {
            document.getElementById('crisis-alert').classList.remove('hidden');
        }
    } catch (error) {
        console.error(error);
        removeTypingIndicator(typingId);
        appendMessage("I'm sorry, I'm having trouble connecting right now. Please try again later.", 'ai');
    }
}

function appendMessage(text, sender) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    messageDiv.appendChild(contentDiv);
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
    const container = document.getElementById('chat-messages');
    const id = 'typing-' + Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ai-message`;
    messageDiv.id = id;
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    messageDiv.appendChild(contentDiv);
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

async function callGeminiAPI(userText) {
    const payload = {
        contents: [{
            parts: [{
                text: `You are MindCare AI. Be empathetic.
Analyze the user's state as "Low Stress", "Moderate Stress", "High Stress", or "Sadness".
Respond ONLY with JSON: {"response":"reply...","stress_level":"Low Stress","is_crisis":false}
User says: "${userText}"`
            }]
        }],
        generationConfig: { temperature: 0.7, responseMimeType: "application/json" }
    };

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.warn("API Error, using fallback response.", response.status);
            return mockAIResponse(userText);
        }

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        return JSON.parse(textResponse);
    } catch (e) {
        console.error("callGeminiAPI Error:", e);
        return mockAIResponse(userText);
    }
}

function mockAIResponse(userText) {
    const lowerText = userText.toLowerCase();
    let is_crisis = false;
    let stress_level = "Moderate Stress";

    if (CRISIS_KEYWORDS.some(kw => lowerText.includes(kw))) {
        is_crisis = true;
        stress_level = "High Stress";
    } else if (lowerText.includes("sad") || lowerText.includes("depressed")) {
        stress_level = "Sadness";
    }

    return {
        response: "I hear you, and your feelings are completely valid. (I am currently running in offline fallback mode because my AI system has reached its quota limit, but please know I'm still here for you.)",
        stress_level: stress_level,
        is_crisis: is_crisis
    };
}

// --- Music Player Logic ---
function initMusicPlayer() {
    const musicModal = document.getElementById('music-modal');
    const closeMusicBtn = document.getElementById('close-music');

    if (closeMusicBtn && musicModal) {
        closeMusicBtn.addEventListener('click', () => {
            musicModal.classList.add('hidden');
            stopAudio();
        });
    }

    const moodBtns = document.querySelectorAll('.mood-btn');
    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mood = btn.getAttribute('data-mood');
            openMusicModal(mood);
        });
    });
}

function openMusicModal(moodStr) {
    const musicModal = document.getElementById('music-modal');
    const songList = document.getElementById('song-list');

    if (!musicModal || !songList) return;

    const moodLetters = {
        'Terrible': 'T',
        'Bad': 'B',
        'Neutral': 'N',
        'Good': 'G',
        'Amazing': 'A'
    };
    const letter = moodLetters[moodStr];

    // Filter songs to match endings like 'T .mp3' or 'T.mp3'
    const filteredSongs = songsData.filter(s => {
        const cleanName = s.trim();
        return cleanName.endsWith(`${letter} .mp3`) || cleanName.endsWith(`${letter}.mp3`) || cleanName.endsWith(`${letter} .MP3`);
    });

    songList.innerHTML = '';

    if (filteredSongs.length === 0) {
        songList.innerHTML = '<li style="text-align:center; padding: 20px;">No songs found for this mood.</li>';
    } else {
        filteredSongs.forEach(songFile => {
            let displayName = songFile.replace(/\s*[-–]\s*[A-Z]\s*\.mp3$/, '');

            const li = document.createElement('li');
            li.className = 'song-card';
            li.innerHTML = `
                <div class="song-details">
                    <div class="song-icon"><i class="fa-solid fa-music"></i></div>
                    <div class="song-name">${displayName}</div>
                </div>
                <div class="audio-controls">
                    <button class="play-song-btn" data-src="${songFile.replace(/"/g, '&quot;')}">
                        <i class="fa-solid fa-play"></i>
                    </button>
                </div>
            `;
            songList.appendChild(li);
        });

        const playBtns = songList.querySelectorAll('.play-song-btn');
        playBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const src = this.getAttribute('data-src');
                playPauseSong(src, this);
            });
        });
    }

    musicModal.classList.remove('hidden');
}

function playPauseSong(fileName, btnEl) {
    const src = fileName;

    // Check if clicked song is already the globalAudio
    // Decode the global audio src to confidently compare with the filename
    if (globalAudio && decodeURI(globalAudio.src).endsWith(src)) {
        if (!globalAudio.paused) {
            globalAudio.pause();
            btnEl.innerHTML = '<i class="fa-solid fa-play"></i>';
            btnEl.classList.remove('playing');
        } else {
            globalAudio.play();
            btnEl.innerHTML = '<i class="fa-solid fa-pause"></i>';
            btnEl.classList.add('playing');
        }
        return;
    }

    stopAudio();

    globalAudio = new Audio(src);
    globalAudio.play();

    currentPlayingBtn = btnEl;
    btnEl.innerHTML = '<i class="fa-solid fa-pause"></i>';
    btnEl.classList.add('playing');

    globalAudio.onended = () => {
        btnEl.innerHTML = '<i class="fa-solid fa-play"></i>';
        btnEl.classList.remove('playing');
        currentPlayingBtn = null;
    };
}

function stopAudio() {
    if (globalAudio) {
        globalAudio.pause();
        globalAudio.currentTime = 0;
    }
    if (currentPlayingBtn) {
        currentPlayingBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        currentPlayingBtn.classList.remove('playing');
        currentPlayingBtn = null;
    }
}

