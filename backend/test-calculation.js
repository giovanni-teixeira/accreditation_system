const { CalculationHelper } = require('./dist/utils/calculation.helper');

function testCalculation() {
    console.log('--- Testando Cálculo de CO2 (Ida e Volta) ---');
    
    // Distância de Franca para Ribeirão Preto (aprox 90km)
    const latFranca = -20.5333;
    const lonFranca = -47.4;
    const latRibeirao = -21.1775;
    const lonRibeirao = -47.8103;

    const distOneWay = CalculationHelper.calculateDistance(latFranca, lonFranca, latRibeirao, lonRibeirao);
    console.log(`Distância Ida (com fator 1.3): ${distOneWay} km`);

    const distTotal = distOneWay * 2;
    console.log(`Distância Total (Ida e Volta): ${distTotal.toFixed(2)} km`);

    const fuel = 'GASOLINA'; // Fator 0.12
    const co2 = CalculationHelper.calculateCo2Footprint(distOneWay, fuel);
    
    console.log(`Combustível: ${fuel}`);
    console.log(`Pegada CO2 Calculada: ${co2} kg`);

    // Verificação manual: distTotal * 0.12
    const manualCo2 = distTotal * 0.12;
    console.log(`Verificação Manual (${distTotal.toFixed(2)} * 0.12): ${manualCo2.toFixed(3)} kg`);

    if (Math.abs(co2 - manualCo2) < 0.01) {
        console.log('✅ TESTE APROVADO: O cálculo está considerando Ida e Volta corretamente!');
    } else {
        console.log('❌ TESTE REPROVADO: Divergência no cálculo.');
    }
}

testCalculation();
