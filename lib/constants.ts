/**
 * IPCC-sourced and peer-reviewed emission factors used across all carbon calculations.
 * Covers transit (car, public transport, motorbike), energy (electricity, cooking fuels),
 * sustenance (diet types, food waste, food source), consumption, and flights.
 * All values are in kgCO2e per unit unless otherwise noted.
 */
export const EMISSION_FACTORS = {
  // Transit (kgCO2e per km or unit)
  transit: {
    carFuel: {
      petrol: 0.21,
      diesel: 0.17,
      electric: 0.05,
      none: 0,
    },
    publicTransitHourly: 0.089, // per km
    publicTransitAvgSpeedKmh: 20, // avg km/h
    motorbike: 0.113,
  },
  
  // Energy
  energy: {
    electricityKwh: 0.82, // India grid factor
    cookingFuelFlat: {
      lpg: 0.432,       // LPG: 3.0 kgCO2/kg * 12 kg/month * 12 months = 432 kgCO2/yr = 0.432 tCO2e
      electric: 0.443,  // Electric: avg usage equivalent in tCO2e
      induction: 0.295, // Induction: energy efficient cooking
      biogas: 0.02,     // Biogas: carbon-neutral organic waste
    },
  },

  // Sustenance (base tCO2e per year)
  sustenance: {
    dietBase: {
      vegan: 1.5,
      vegetarian: 1.7,
      flexitarian: 2.2,
      omnivore: 2.5,
      'meat-heavy': 3.3,
    },
    foodWasteMultiplier: {
      none: 1.0,
      low: 1.05,
      medium: 1.12,
      high: 1.22,
    },
    sourceMultiplier: {
      local: 1.0,
      imported: 1.15,
    },
  },

  // Consumption
  consumption: {
    clothingPerInr: 0.008, // kgCO2 per ₹
    electronicsPerUnit: 80.0, // kgCO2 per device
    deliveryPerUnit: 0.5, // kgCO2 per delivery
  },

  // Flights
  flights: {
    shortHaul: 255.0, // kgCO2 per flight
    longHaul: 1620.0, // kgCO2 per flight
    classMultiplier: {
      economy: 1.0,
      business: 2.9,
      first: 4.0,
    },
  },
}

/**
 * Global and regional carbon emission baselines for comparison (tCO2e/year).
 * Used to contextualize individual carbon footprints against real-world targets.
 */
export const BASELINES = {
  indiaAverage: 1.9,
  globalAverage: 4.7,
  parisTarget: 2.0,
}

/**
 * Color palette for nebula visualization, mapped to emission severity levels.
 * nebulaLow (teal) → nebulaMid (amber) → nebulaHigh (crimson) as emissions increase.
 */
export const COLORS = {
  nebulaLow: '#00FFCC',  // clean teal
  nebulaMid: '#FF8C00',  // amber
  nebulaHigh: '#FF2244', // crimson
  void: '#000000',
  hudGlass: 'rgba(255, 255, 255, 0.04)',
  hudBorder: 'rgba(255, 255, 255, 0.08)',
  textPrimary: '#F0EDE8',
  textDim: 'rgba(240, 237, 232, 0.62)',
}

/**
 * Default neutral-state carbon breakdown used for landing page visualization.
 * Represents the global average (4.7 tCO2e/year) distributed across all categories.
 */
export const DEFAULT_CARBON_DATA = {
  transport: 0.8,
  energy: 1.2,
  diet: 1.7,
  consumption: 0.5,
  flights: 0.5,
  total: 4.7,
}
