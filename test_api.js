const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCmakdDiyVH3bpDAdgW9oYJ4-GsSLxXCG0";

const userText = "I am feeling very bad and stressed out today.";
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

fetch(GEMINI_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
})
    .then(res => res.json())
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(console.error);
