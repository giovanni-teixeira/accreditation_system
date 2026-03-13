// src/utils/calculation.helper.ts

export class CalculationHelper {
  private static readonly EARTH_RADIUS_KM = 6371;
  private static readonly DETOUR_FACTOR = 1.3;

  /**
   * Calcula a distância entre dois pontos usando a fórmula de Haversine
   * e aplica o fator de correção rodoviário.
   */
  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;

    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceStraightKm = this.EARTH_RADIUS_KM * c;

    // Aplica o fator de correção (Detour Factor) para estimar distância rodoviária
    return Number((distanceStraightKm * this.DETOUR_FACTOR).toFixed(2));
  }

  /**
   * Fatores de emissão aproximados (kg CO2 por Km)
   * Baseado em médias de mercado para veículos leves no Brasil.
   */
  static calculateCo2Footprint(distanceKm: number, fuelType: string): number {
    const emissionFactors: Record<string, number> = {
      GASOLINA: 0.12,
      ETANOL: 0.02,
      DIESEL: 0.15,
      ELETRICO: 0.01,
      NAO_INFORMADO: 0.10,
    };

    const factor = emissionFactors[fuelType.toUpperCase()] || 0.10;
    
    // Ida e Volta (* 2)
    return Number((distanceKm * 2 * factor).toFixed(3));
  }

  private static toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}
