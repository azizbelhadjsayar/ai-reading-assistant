// Test simple pour vérifier l'API Gemini
// Copiez ce code dans la console Chrome (F12) sur n'importe quelle page

const apiKey = "VOTRE_CLE_API_ICI"; // Remplacez par votre vraie clé

// Test 1: Vérifier que la clé fonctionne
fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        contents: [{
            parts: [{ text: "Hello, say hi!" }]
        }]
    })
})
    .then(r => r.json())
    .then(d => console.log("SUCCESS:", d))
    .catch(e => console.error("ERROR:", e));
