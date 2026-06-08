import { EMISSION_FACTORS, BASELINES, COLORS } from './constants'
import { EmissionInputs, CarbonBreakdown, CarbonEquivalent } from '../types'

/**
 * Calculates carbon breakdown in tonnes of CO2e per year (tCO2e/yr) based on inputs.
 */
export function calculateCarbonBreakdown(inputs: EmissionInputs): CarbonBreakdown {
  // 1. Transit
  const carFuelFactor = EMISSION_FACTORS.transit.carFuel[inputs.transport.carFuelType] || 0
  const carEmissions = (inputs.transport.carKmPerWeek * carFuelFactor * 52) / 1000
  
  const transitHours = inputs.transport.publicTransitHoursPerWeek
  const transitDist = transitHours * EMISSION_FACTORS.transit.publicTransitAvgSpeedKmh
  const transitEmissions = (transitDist * EMISSION_FACTORS.transit.publicTransitHourly * 52) / 1000
  
  const motorbikeEmissions = (inputs.transport.motorbikeKmPerWeek * EMISSION_FACTORS.transit.motorbike * 52) / 1000
  
  const transport = Number((carEmissions + transitEmissions + motorbikeEmissions).toFixed(2))

  // 2. Energy
  const electricityEmissions = (inputs.energy.monthlyElectricityKwh * EMISSION_FACTORS.energy.electricityKwh * 12 * (1 - inputs.energy.renewableOffsetPercent / 100)) / 1000
  const cookingEmissions = EMISSION_FACTORS.energy.cookingFuelFlat[inputs.energy.cookingFuel] || 0
  
  const energy = Number((electricityEmissions + cookingEmissions).toFixed(2))

  // 3. Sustenance
  const dietBase = EMISSION_FACTORS.sustenance.dietBase[inputs.diet.dietType] || 0
  const wasteMult = EMISSION_FACTORS.sustenance.foodWasteMultiplier[inputs.diet.foodWasteLevel] || 1.0
  const sourceMult = EMISSION_FACTORS.sustenance.sourceMultiplier[inputs.diet.foodSourcePreference] || 1.0
  
  const diet = Number((dietBase * wasteMult * sourceMult).toFixed(2))

  // 4. Consumption
  const clothingEmissions = (inputs.consumption.monthlyClothingSpendInr * EMISSION_FACTORS.consumption.clothingPerInr * 12) / 1000
  const electronicsEmissions = (inputs.consumption.electronicsPurchasedPerYear * EMISSION_FACTORS.consumption.electronicsPerUnit) / 1000
  const deliveryEmissions = (inputs.consumption.onlineDeliveriesPerWeek * EMISSION_FACTORS.consumption.deliveryPerUnit * 52) / 1000
  
  const consumption = Number((clothingEmissions + electronicsEmissions + deliveryEmissions).toFixed(2))

  // 5. Flights
  const shortHaulEmissions = inputs.flights.shortHaulFlightsPerYear * EMISSION_FACTORS.flights.shortHaul
  const longHaulEmissions = inputs.flights.longHaulFlightsPerYear * EMISSION_FACTORS.flights.longHaul
  const classMult = EMISSION_FACTORS.flights.classMultiplier[inputs.flights.flightClass] || 1.0
  
  const flights = Number(((shortHaulEmissions + longHaulEmissions) * classMult / 1000).toFixed(2))

  const total = Number((transport + energy + diet + consumption + flights).toFixed(2))

  return {
    transport,
    energy,
    diet,
    consumption,
    flights,
    total,
  }
}

/**
 * Returns carbon status based on the total emissions.
 */
export function getCarbonStatus(total: number): 'low' | 'medium' | 'high' {
  if (total < BASELINES.parisTarget) {
    return 'low'
  } else if (total <= BASELINES.globalAverage) {
    return 'medium'
  } else {
    return 'high'
  }
}

/**
 * Interpolates a hex color between two colors based on a factor [0, 1].
 */
function interpolateColor(color1: string, color2: string, factor: number): string {
  const r1 = parseInt(color1.substring(1, 3), 16)
  const g1 = parseInt(color1.substring(3, 5), 16)
  const b1 = parseInt(color1.substring(5, 7), 16)

  const r2 = parseInt(color2.substring(1, 3), 16)
  const g2 = parseInt(color2.substring(3, 5), 16)
  const b2 = parseInt(color2.substring(5, 7), 16)

  const r = Math.round(r1 + factor * (r2 - r1))
  const g = Math.round(g1 + factor * (g2 - g1))
  const b = Math.round(b1 + factor * (b2 - b1))

  const rs = r.toString(16).padStart(2, '0')
  const gs = g.toString(16).padStart(2, '0')
  const bs = b.toString(16).padStart(2, '0')

  return `#${rs}${gs}${bs}`
}

/**
 * Gets the interpolated hex color for the nebula based on total emissions.
 * 0.0t (Pure Teal) -> 2.0t (Amber) -> 4.7t (Crimson) -> capped above 4.7t
 */
export function getNebulaColor(total: number): string {
  const lowColor = COLORS.nebulaLow
  const midColor = COLORS.nebulaMid
  const highColor = COLORS.nebulaHigh

  if (total <= BASELINES.parisTarget) {
    // Interpolate between low and mid
    const factor = Math.max(0, Math.min(1, total / BASELINES.parisTarget))
    return interpolateColor(lowColor, midColor, factor)
  } else {
    // Interpolate between mid and high
    const factor = Math.max(0, Math.min(1, (total - BASELINES.parisTarget) / (BASELINES.globalAverage - BASELINES.parisTarget)))
    return interpolateColor(midColor, highColor, factor)
  }
}

/**
 * Generates carbon equivalents based on the total emissions.
 */
export function getCarbonEquivalents(total: number): CarbonEquivalent[] {
  // Mumbai -> Delhi flight = ~0.35 tCO2e
  const flightsVal = Math.round(total / 0.35)
  // 1 kg of beef = 60 kg CO2e = 0.06 tCO2e
  const beefVal = Math.round(total * 1000 / 60)
  // Tree absorbs ~22 kg CO2/year = 0.022 tCO2e
  const treesVal = Math.round(total * 1000 / 22)

  return [
    {
      label: 'Return Flights Mumbai ⇄ Delhi',
      value: flightsVal,
      unit: 'flights',
      icon: 'Plane',
    },
    {
      label: 'Beef Consumption',
      value: beefVal,
      unit: 'kg',
      icon: 'Beef',
    },
    {
      label: 'Tree Absorption Capacity',
      value: treesVal,
      unit: 'mature trees / year',
      icon: 'Trees',
    },
  ]
}

/**
 * Deterministically generates a unique, hex-looking 8-character ID from the inputs.
 */
export function generateAetherID(inputs: EmissionInputs): string {
  const str = JSON.stringify(inputs)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  const positiveHash = Math.abs(hash)
  const hex = positiveHash.toString(16).toUpperCase()
  return `AE-${hex.substring(0, 4)}-${hex.substring(4, 8) || '0000'}`.padEnd(12, 'F').substring(0, 12)
}
