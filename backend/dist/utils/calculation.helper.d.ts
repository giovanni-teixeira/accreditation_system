export declare class CalculationHelper {
    private static readonly EARTH_RADIUS_KM;
    private static readonly DETOUR_FACTOR;
    static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
    static calculateCo2Footprint(distanceKm: number, fuelType: string): number;
    private static toRad;
}
