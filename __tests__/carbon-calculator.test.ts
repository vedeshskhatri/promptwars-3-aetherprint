import {
  calculateCarbonBreakdown,
  getCarbonStatus,
  getNebulaColor,
  getCarbonEquivalents,
  generateAetherID,
} from '../lib/carbon-calculator'
import { EmissionInputs } from '../types'

// Mock clean inputs helper
const createMockInputs = (overrides?: Partial<EmissionInputs>): EmissionInputs => {
  return {
    transport: {
      carKmPerWeek: 0,
      carFuelType: 'none',
      publicTransitHoursPerWeek: 0,
      motorbikeKmPerWeek: 0,
      ...overrides?.transport,
    },
    energy: {
      monthlyElectricityKwh: 0,
      renewableOffsetPercent: 0,
      cookingFuel: 'biogas',
      ...overrides?.energy,
    },
    diet: {
      dietType: 'vegan',
      foodWasteLevel: 'none',
      foodSourcePreference: 'local',
      ...overrides?.diet,
    },
    consumption: {
      monthlyClothingSpendInr: 0,
      electronicsPurchasedPerYear: 0,
      onlineDeliveriesPerWeek: 0,
      ...overrides?.consumption,
    },
    flights: {
      shortHaulFlightsPerYear: 0,
      longHaulFlightsPerYear: 0,
      flightClass: 'economy',
      ...overrides?.flights,
    },
  }
}

describe('Carbon Calculation Engine tests', () => {
  // 1. All-zero / minimal inputs test
  test('calculateCarbonBreakdown with minimal/zero inputs', () => {
    const inputs = createMockInputs({
      diet: { dietType: 'vegan', foodWasteLevel: 'none', foodSourcePreference: 'local' },
      energy: { monthlyElectricityKwh: 0, renewableOffsetPercent: 0, cookingFuel: 'biogas' } // Biogas = 0.02 t
    })
    const breakdown = calculateCarbonBreakdown(inputs)
    expect(breakdown.transport).toBe(0)
    expect(breakdown.energy).toBe(0.02) // Flat cooking emissions for biogas
    expect(breakdown.diet).toBe(1.5) // Base vegan diet is 1.5t
    expect(breakdown.consumption).toBe(0)
    expect(breakdown.flights).toBe(0)
    expect(breakdown.total).toBe(1.52)
  })

  // 2. Car Petrol emission factor calculation test
  test('individual emission factor: petrol car 100km/week', () => {
    const inputs = createMockInputs({
      transport: {
        carKmPerWeek: 100,
        carFuelType: 'petrol',
        publicTransitHoursPerWeek: 0,
        motorbikeKmPerWeek: 0,
      },
    })
    const breakdown = calculateCarbonBreakdown(inputs)
    // 100 km * 0.21 kg/km * 52 weeks / 1000 = 1.092 -> 1.09 tCO2
    expect(breakdown.transport).toBe(1.09)
  })

  // 3. Car Diesel emission factor calculation test
  test('individual emission factor: diesel car 200km/week', () => {
    const inputs = createMockInputs({
      transport: {
        carKmPerWeek: 200,
        carFuelType: 'diesel',
        publicTransitHoursPerWeek: 0,
        motorbikeKmPerWeek: 0,
      },
    })
    const breakdown = calculateCarbonBreakdown(inputs)
    // 200 * 0.17 * 52 / 1000 = 1.768 -> 1.77 tCO2
    expect(breakdown.transport).toBe(1.77)
  })

  // 4. Public transit calculations test
  test('individual emission factor: public transit 10 hours/week', () => {
    const inputs = createMockInputs({
      transport: {
        carKmPerWeek: 0,
        carFuelType: 'none',
        publicTransitHoursPerWeek: 10,
        motorbikeKmPerWeek: 0,
      },
    })
    const breakdown = calculateCarbonBreakdown(inputs)
    // 10 hrs * 20 km/h * 0.089 kg/km * 52 / 1000 = 0.9256 -> 0.93 tCO2
    expect(breakdown.transport).toBe(0.93)
  })

  // 5. Motorbike calculations test
  test('individual emission factor: motorbike 150km/week', () => {
    const inputs = createMockInputs({
      transport: {
        carKmPerWeek: 0,
        carFuelType: 'none',
        publicTransitHoursPerWeek: 0,
        motorbikeKmPerWeek: 150,
      },
    })
    const breakdown = calculateCarbonBreakdown(inputs)
    // 150 * 0.113 * 52 / 1000 = 0.8814 -> 0.88 tCO2
    expect(breakdown.transport).toBe(0.88)
  })

  // 6. Electricity calculations test
  test('individual emission factor: electricity 250 kWh/month', () => {
    const inputs = createMockInputs({
      energy: {
        monthlyElectricityKwh: 250,
        renewableOffsetPercent: 0,
        cookingFuel: 'biogas',
      },
    })
    const breakdown = calculateCarbonBreakdown(inputs)
    // 250 kWh * 0.82 kg/kWh * 12 months / 1000 = 2.46 tCO2 + 0.02 (cooking) = 2.48 tCO2
    expect(breakdown.energy).toBe(2.48)
  })

  // 7. Renewable offset test
  test('renewable offset percentage deduction', () => {
    const inputs = createMockInputs({
      energy: {
        monthlyElectricityKwh: 250,
        renewableOffsetPercent: 40,
        cookingFuel: 'biogas',
      },
    })
    const breakdown = calculateCarbonBreakdown(inputs)
    // 2.46 tCO2 * (1 - 0.40) = 1.476 -> 1.48 tCO2 + 0.02 (cooking) = 1.50 tCO2
    expect(breakdown.energy).toBe(1.50)
  })

  // 8. Flight class calculations test
  test('flights with first class multiplier', () => {
    const inputs = createMockInputs({
      flights: {
        shortHaulFlightsPerYear: 2,
        longHaulFlightsPerYear: 1,
        flightClass: 'first',
      },
    })
    const breakdown = calculateCarbonBreakdown(inputs)
    // Short haul: 2 * 255 = 510 kgCO2
    // Long haul: 1 * 1620 = 1620 kgCO2
    // Sum = 2130 kgCO2. First class multiplier = 4.0 -> 2130 * 4 = 8520 kgCO2 = 8.52 tCO2
    expect(breakdown.flights).toBe(8.52)
  })

  // 9. Diet source and waste multipliers test
  test('diet type with waste and imported multiplier', () => {
    const inputs = createMockInputs({
      diet: {
        dietType: 'omnivore',
        foodWasteLevel: 'medium',
        foodSourcePreference: 'imported',
      },
    })
    const breakdown = calculateCarbonBreakdown(inputs)
    // Base omnivore: 2.5t. Medium waste: 1.12. Imported: 1.15
    // 2.5 * 1.12 * 1.15 = 3.22 tCO2
    expect(breakdown.diet).toBe(3.22)
  })

  // 10. Status threshold checks
  test('getCarbonStatus checks for low, medium, high ranges', () => {
    expect(getCarbonStatus(1.5)).toBe('low')
    expect(getCarbonStatus(2.0)).toBe('medium')
    expect(getCarbonStatus(3.5)).toBe('medium')
    expect(getCarbonStatus(4.7)).toBe('medium')
    expect(getCarbonStatus(5.2)).toBe('high')
  })

  // 11. Deterministic AetherID checks
  test('generateAetherID generates consistent and unique IDs', () => {
    const inputs1 = createMockInputs({ transport: { carKmPerWeek: 120, carFuelType: 'petrol', publicTransitHoursPerWeek: 0, motorbikeKmPerWeek: 0 } })
    const inputs2 = createMockInputs({ transport: { carKmPerWeek: 120, carFuelType: 'petrol', publicTransitHoursPerWeek: 0, motorbikeKmPerWeek: 0 } })
    const inputs3 = createMockInputs({ transport: { carKmPerWeek: 50, carFuelType: 'electric', publicTransitHoursPerWeek: 5, motorbikeKmPerWeek: 10 } })

    const id1 = generateAetherID(inputs1)
    const id2 = generateAetherID(inputs2)
    const id3 = generateAetherID(inputs3)

    expect(id1).toBe(id2)
    expect(id1).not.toBe(id3)
    expect(id1).toMatch(/^AE-[0-9A-F]{4}-[0-9A-F]{4}$/)
  })

  // 12. Nebula color interpolation checks
  test('getNebulaColor transitions correctly', () => {
    const zeroColor = getNebulaColor(0)
    const midColor = getNebulaColor(2.0)
    const highColor = getNebulaColor(10.0)

    // Should return hex colors
    expect(zeroColor).toMatch(/^#[0-9a-fA-F]{6}$/)
    expect(midColor).toMatch(/^#[0-9a-fA-F]{6}$/)
    expect(highColor).toMatch(/^#[0-9a-fA-F]{6}$/)

    // Zero should be close to nebulaLow (#00FFCC)
    expect(zeroColor.toLowerCase()).toBe('#00ffcc')
    // 10.0 (well above global avg 4.7) should be close to nebulaHigh (#FF2244)
    expect(highColor.toLowerCase()).toBe('#ff2244')
  })

  // 13. Carbon equivalents checks
  test('getCarbonEquivalents returns expected structured calculations', () => {
    const equivalents = getCarbonEquivalents(1.4)
    expect(equivalents.length).toBe(3)
    expect(equivalents[0].label).toContain('Mumbai ⇄ Delhi')
    expect(equivalents[0].value).toBe(4) // 1.4 / 0.35 = 4 flights
    expect(equivalents[1].value).toBe(23) // 1.4 * 1000 / 60 = 23.33 -> 23 kg beef
  })
})
