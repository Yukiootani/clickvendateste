// --- CONFIGURAÇÃO TÉCNICA (PREENCHER NO SETUP DO CLIENTE) ---
const SETUP = {
    firebase: {
        apiKey: "AIzaSyBrLZcBCaxn_R-a90RZUpAKUm6jCWZz1u8",
        authDomain: "clickvenda-teste.firebaseapp.com",
        projectId: "clickvenda-teste",
        storageBucket: "clickvenda-teste.firebasestorage.app",
        messagingSenderId: "752863552827",
        appId: "1:752863552827:web:69b521a29470f27d92c31e",
        vapidKey: "BMJE4TOOey0GVmEnJTh8j_rktQVAr5P9wFHzZd-VbPSWg86FnrWiNxJzQLDLQeWnc3A1Ruwlpz8H15wWE_L9F9o"
    },
    cloudinary: {
        cloudName: "dwdolbysc",
        uploadPreset: "f21rmydo"
    }
};

// --- PALETAS DE CORES (NÃO MEXER) ---
const THEMES = {
    padrao: { p: "#1B263B", s: "#Cca43b", bg: "#FDFBF7", t: "#333" }, // Executivo
    rosa:   { p: "#be185d", s: "#f472b6", bg: "#fdf2f8", t: "#831843" }, // Boutique
    azul:   { p: "#1e3a8a", s: "#3b82f6", bg: "#eff6ff", t: "#1e293b" }, // Tech
    preto:  { p: "#111111", s: "#ffffff", bg: "#000000", t: "#eeeeee" }  // Luxury
};

// --- LÓGICA DO CMS (MOTOR VISUAL) ---
async function applyCMS() {
    if (!firebase.apps.length) firebase.initializeApp(SETUP.firebase);
    
    const root = document.documentElement;
    const setColors = (c) => {
        root.style.setProperty('--primary', c.p);
        root.style.setProperty('--accent', c.s);
        root.style.setProperty('--bg', c.bg);
        root.style.setProperty('--text', c.t);
        const meta = document.querySelector('meta[name="theme-color"]');
        if(meta) meta.setAttribute("content", c.p);
    };
    setColors(THEMES.padrao); // Inicia padrão

    try {
        const db = firebase.firestore();
        const doc = await db.collection('cms').doc('layout').get();
        if(doc.exists) {
            const data = doc.data();
            
            // 1. Aplica Cores
            if(data.theme && THEMES[data.theme]) setColors(THEMES[data.theme]);
            
            // 2. Aplica Textos
            const textMap = {
                'cms-title': data.headline,
                'cms-subtitle': data.subheadline,
                'cms-slogan': data.slogan,
                'dynamic-name': data.headline
            };
            for (const [id, text] of Object.entries(textMap)) {
                const elements = document.querySelectorAll(`#${id}, .${id}`);
                elements.forEach(el => { if(text) el.innerText = text; });
            }

            // 3. Aplica Logo
            const logos = document.querySelectorAll('.cms-logo');
            if(data.logoUrl) logos.forEach(img => img.src = data.logoUrl);
            else logos.forEach(img => img.style.display = 'none');
        }
    } catch(e) { console.log("CMS Offline/Erro"); }
    
    const loader = document.getElementById('loader');
    if(loader) loader.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', applyCMS);