// Usando fetch nativo do Node 22+
async function testZipcodebase(apiKey, cep, country = 'BR') {
    console.log(`--- Testando Zipcodebase para ${country}: ${cep} ---`);
    try {
        const url = `https://app.zipcodebase.com/api/v1/search?apikey=${apiKey}&codes=${cep}&country=${country}`;
        console.log(`URL: https://app.zipcodebase.com/api/v1/search?apikey=***&codes=${cep}&country=${country}`);
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
            console.log('Zipcodebase Response:', JSON.stringify(data, null, 2));
            const result = data.results?.[cep]?.[0];
            if (result) {
                console.log('\n✅ Dados Normalizados:');
                console.log({
                    cep: cep,
                    rua: result.line_1 || '(Vazio)',
                    bairro: result.province_sub || '(Vazio)',
                    cidade: result.city || '(Vazio)',
                    estado: result.province || '(Vazio)',
                    latitude: result.latitude,
                    longitude: result.longitude
                });
            } else {
                console.log('\n❌ Nenhum resultado encontrado para este CEP.');
            }
        } else {
            console.log('\n❌ Erro na API:', data.message || response.statusText);
        }
    } catch (e) {
        console.error('\n❌ Erro de Conexão:', e.message);
    }
    console.log('------------------------------------------\n');
}

// Pega a chave dos argumentos ou da env
const apiKey = process.argv[2] || process.env.ZIPCODE_API_KEY;

if (!apiKey) {
    console.log('Uso: node test_zipcodebase.js <SUA_API_KEY>');
    process.exit(1);
}

// Teste com um CEP de Franca e um Internacional
async function run() {
    await testZipcodebase(apiKey, '14400010', 'BR'); // Franca - SP
    await testZipcodebase(apiKey, '10001', 'US');    // New York
}

run();
