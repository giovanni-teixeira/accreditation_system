// Usando fetch nativo do Node 22

async function testCep(cep) {
    console.log(`--- Testando CEP: ${cep} ---`);
    let addressInfo = { street: '', city: '', state: '' };
    
    // Teste 1: BrasilAPI (V2)
    try {
        console.log('Consultando BrasilAPI (v2)...');
        const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
        const data = await res.json();
        if (res.ok) {
            addressInfo = { street: data.street, city: data.city, state: data.state };
            console.log('BrasilAPI Response (Sample):', addressInfo);
            if (data.location && data.location.coordinates && Object.keys(data.location.coordinates).length > 0) {
                console.log('✅ Coordenadas encontradas na BrasilAPI!');
            } else {
                console.log('❌ Coordenadas NÃO encontradas na BrasilAPI (Vazio).');
            }
        } else {
            console.log('BrasilAPI erro:', data.message);
        }
    } catch (e) {
        console.log('Erro BrasilAPI:', e.message);
    }

    // Teste 2: ViaCEP (Se o anterior falhou em pegar o endereço)
    if (!addressInfo.city) {
        try {
            console.log('\nConsultando ViaCEP...');
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (!data.erro) {
                addressInfo = { street: data.logradouro, city: data.localidade, state: data.uf };
                console.log('ViaCEP Response (Sample):', addressInfo);
            }
        } catch (e) {
            console.log('Erro ViaCEP:', e.message);
        }
    }

    // Teste 3: Nominatim (Fallback de Geocodificação)
    try {
        console.log('\nConsultando Nominatim (Fallback Geocoding)...');
        const query = encodeURIComponent(`${addressInfo.street || ''} ${addressInfo.city || ''} ${addressInfo.state || ''} Brasil`);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
        console.log('Query URL:', url);
        const res = await fetch(url, { headers: { 'User-Agent': 'Hakaton-Test-Script' } });
        const dataGeo = await res.json();
        if (dataGeo && dataGeo[0]) {
            console.log('✅ Coordenadas encontradas no Nominatim!');
            console.log('Nominatim Response:', { lat: dataGeo[0].lat, lon: dataGeo[0].lon });
        } else {
            console.log('❌ Coordenadas NÃO encontradas no Nominatim.');
        }
    } catch (e) {
        console.log('Erro Nominatim:', e.message);
    }
    console.log('------------------------------\n');
}

// Exemplos
async function run() {
    await testCep('14400010'); // Franca - SP (BrasilAPI deve trazer)
    await testCep('37800000'); // Guaxupé - MG (BrasilAPI NÃO deve trazer, Nominatim SIM)
}

run();
