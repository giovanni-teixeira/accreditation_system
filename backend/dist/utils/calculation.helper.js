"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculationHelper = void 0;
class CalculationHelper {
    static EARTH_RADIUS_KM = 6371;
    static DETOUR_FACTOR = 1.3;
    static calculateDistance(lat1, lon1, lat2, lon2) {
        if (!lat1 || !lon1 || !lat2 || !lon2)
            return 0;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
                Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceStraightKm = this.EARTH_RADIUS_KM * c;
        return Number((distanceStraightKm * this.DETOUR_FACTOR).toFixed(2));
    }
    static calculateCo2Footprint(distanceKm, fuelType) {
        const emissionFactors = {
            GASOLINA: 0.12,
            ETANOL: 0.02,
            DIESEL: 0.15,
            ELETRICO: 0.01,
            NAO_INFORMADO: 0.10,
        };
        const factor = emissionFactors[fuelType.toUpperCase()] || 0.10;
        return Number((distanceKm * 2 * factor).toFixed(3));
    }
    static toRad(degrees) {
        return (degrees * Math.PI) / 180;
    }
}
exports.CalculationHelper = CalculationHelper;
//# sourceMappingURL=calculation.helper.js.map