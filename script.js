const el = {
    status: document.getElementById('status'),
    video: document.getElementById('video'),
    apiKey: document.getElementById('apiKey'),
    button: document.getElementById('uploadWidget')
}
const app = {
    transcriptionURL: '',
    public_id: '',
    waitForTranscription: async () => {
        const maxAttempts = 30;
        const delay = 2000; // 2 segundos entre tentativas
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const url = `https://res.cloudinary.com/${config.cloudName}/raw/upload/v${Date.now()}/${app.public_id}.transcript`;
            try {
                console.log(`Tentativa ${attempt}/${maxAttempts}: Verificando transcrição...`);
                const response = await fetch(url);
                if (response.ok) {
                    app.transcriptionURL = url;
                    console.log('Transcrição encontrada!', url);
                    return true;
                }
            } catch (error) {
                console.log(`Tentativa ${attempt} falhou:`, error.message);
            }
            if (attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
            console.log(`Transcrição não encontrada após todas as tentativas`);
            return false;
    },
    getTranscription:  async () => {
        const response = await fetch(app.transcriptionURL)
        return response.text()
    },
    getViralMoment: async () => {
        const transcription = await app.getTranscription()
        const model = 'gemini-2.5-flash'
        const endpointGemini = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
        const prompt = `
        Role: You area a professional video editor specializing in viral content.
        Task: Analyze the transcrpition below and indentify the most engaging, funny, or suprising segment.
        Constraints:
        1. Durantion: Minimum 30 seconds, Maximum 60 seconds.
        2. Format: Return ONLY the start and end string for Cloudinary. Format: so_<start_seconds>,eo_<end_seconds>
        3. Examples: "so_10,eo_20" or "so_12.5,eo_45.2"
        4. CRITICAL: Do not use markdown, do not use quotes, do not explain. Return ONLY the raw string.
        Transcription:
        ${transcription}`
        const headers = {
            'x-goog-api-key': el.apiKey.value,
            'Content-Type': 'application/json'
        }
        const contents = [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ]
        const maxAttempts = 3
        const delay = 1500

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const response = await fetch(endpointGemini, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ contents })
                })
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }
                const data = await response.json()
                const rawText = data.candidates[0].content.parts[0].text.trim()
                return rawText.replace(/```/g,'').replace(/json/g, '').trim()
            } catch (error) {
                const isLastAttempt = attempt === maxAttempts
                console.log(`Gemini falhou (tentativa ${attempt}/${maxAttempts}): `, error.message)
                if (isLastAttempt) {
                    throw error
                }
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }
    }
}
const config = {
    cloudName:'djvuiucfr',
    uploadPreset: 'upload_nlw'
}
const myWidget = cloudinary.createUploadWidget(
    config,
    async (error, result) => { 
        if (!error && result && result.event === "success") { 
        console.log('Done! Here is the image info: ', result.info);
        app.public_id = result.info.public_id 
            try {
                const isReady = await app.waitForTranscription ();
                if (!isReady) {
                throw new Error('Erro ao buscar transcrição')
                }
                const viralMoment = await app.getViralMoment()
                const viralMomentURL = `https:res.cloudinary.com/${config.cloudName}/video/upload/${viralMoment}/${app.public_id}.mp4`
                el.video.setAttribute('src', viralMomentURL)
            } catch(error) {
                console.log({ error })
            }
        }
    }
)

el.button.addEventListener("click", () => {
    if(!el.apiKey.value) {
        alert('Por favor, isira sua API do Gemini primeiro.')
        el.apiKey.focus()
        return
    }
    myWidget.open();
}, false);