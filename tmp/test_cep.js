// Usando fetch nativo do Node 22+

async function testAddress() {
    const cep = '01001000';
    try {
        console.log(`Testing BrasilAPI V2 for CEP: ${cep}`);
        const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
        const data = await response.json();
        console.log('BrasilAPI Response:', JSON.stringify(data, null, 2));
        console.log('Street property:', data.street);

        console.log(`\nTesting ViaCEP for CEP: ${cep}`);
        const responseVia = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dataVia = await responseVia.json();
        console.log('ViaCEP Response:', JSON.stringify(dataVia, null, 2));
        console.log('Logradouro property:', dataVia.logradouro);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

testAddress();
