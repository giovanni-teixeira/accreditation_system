// Usando fetch nativo do Node 22+
// Uso: node test-cep-api.js [ZIPBASE_KEY] [GEONAMES_USER]

async function testCep(cep, country = 'BR', zipBaseKey = null, geoNamesUser = 'demo') {
    console.log(`\n==========================================`);
    console.log(`🔍 TESTANDO: ${cep} (${country})`);
    console.log(`==========================================`);

    // 1. BrasilAPI (Somente Brasil)
    if (country === 'BR' || country.toLowerCase() === 'brasil') {
        try {
            console.log('\n[1] Consultando BrasilAPI (v2)...');
            const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
            const data = await res.json();
            if (res.ok) {
                console.log('✅ BrasilAPI (OK):', { rua: data.street, cidade: data.city });
                if (data.location?.coordinates) console.log('📍 Coordenadas OK');
            } else { console.log('❌ BrasilAPI (Erro):', data.message); }
        } catch (e) { console.log('❌ Erro BrasilAPI:', e.message); }

        try {
            console.log('\n[2] Consultando ViaCEP...');
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (!data.erro) { console.log('✅ ViaCEP (OK):', { rua: data.logradouro, cidade: data.localidade }); }
            else { console.log('❌ ViaCEP (Erro): CEP não encontrado'); }
        } catch (e) { console.log('❌ Erro ViaCEP:', e.message); }
    }

    // 3. Zippopotam.us (Global - Rápida e Direta) baseada no feedback do usuário.
    try {
        console.log(`\n[3] Consultando Zippopotam.us (${country})...`);
        const cc = country.length === 2 ? country.toLowerCase() : country.substring(0,2).toLowerCase();
        const res = await fetch(`http://api.zippopotam.us/${cc}/${cep}`);
        const data = await res.json();
        if (res.ok && data.places?.[0]) {
            console.log('✅ Zippopotam.us (OK):', { cidade: data.places[0]['place name'], estado: data.places[0]['state'] });
        } else { console.log('❌ Zippopotam.us: Não encontrado'); }
    } catch (e) { console.log('❌ Erro Zippopotam.us:', e.message); }

    // 4. ZipBase.io (Global - Necessita Key) baseada no feedback do usuário.
    if (zipBaseKey) {
        try {
            console.log(`\n[4] Consultando ZipBase.io (${country})...`);
            const res = await fetch(`https://zipbase.io/api/v1/lookup?postalCode=${cep}&country=${country}`, {
                headers: { 'X-API-Key': zipBaseKey }
            });
            const data = await res.json();
            if (res.ok) {
                console.log('✅ ZipBase.io (OK):', { rua: data.address, cidade: data.city });
            } else { console.log('❌ ZipBase.io:', res.statusText); }
        } catch (e) { console.log('❌ Erro ZipBase.io:', e.message); }
    }

    // 5. Geonames (Global - Fallback) baseada no feedback do usuário.
    try {
        console.log(`\n[5] Consultando Geonames (${country})...`);
        const res = await fetch(`http://api.geonames.org/postalCodeLookupJSON?postalcode=${cep}&country=${country}&username=${geoNamesUser}`);
        const data = await res.json();
        if (data.postalcodes?.[0]) {
            console.log('✅ Geonames (OK):', { cidade: data.postalcodes[0].placeName, estado: data.postalcodes[0].adminName1 });
        } else { console.log('❌ Geonames: Não encontrado'); }
    } catch (e) { console.log('❌ Erro Geonames:', e.message); }

    // 6. Nominatim (Global Fallback Geocoding) baseada no feedback do usuário.
    try {
        console.log('\n[6] Consultando Nominatim (Final Fallback)...');
        const query = encodeURIComponent(`${cep} ${country}`);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, { headers: { 'User-Agent': 'Hakaton-Test' } });
        const data = await res.json();
        if (data?.[0]) { console.log('✅ Nominatim (OK):', data[0].display_name); }
        else { console.log('❌ Nominatim: Não encontrado'); }
    } catch (e) { console.log('❌ Erro Nominatim:', e.message); }
}

const zipBaseKey = process.argv[2];
const geoNamesUser = process.argv[3] || 'demo';

async function run() {
    await testCep('14400010', 'BR', zipBaseKey, geoNamesUser);
    await testCep('10001', 'US', zipBaseKey, geoNamesUser); // NY
    await testCep('75001', 'FR', zipBaseKey, geoNamesUser); // Paris
}

run();
