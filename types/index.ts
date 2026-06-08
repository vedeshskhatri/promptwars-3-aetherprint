export interface TransportInputs {
  carKmPerWeek: number
  carFuelType: 'petrol' | 'diesel' | 'electric' | 'none'
  publicTransitHoursPerWeek: number
  motorbikeKmPerWeek: number
}

export interface EnergyInputs {
  monthlyElectricityKwh: number
  renewableOffsetPercent: number
  cookingFuel: 'lpg' | 'electric' | 'induction' | 'biogas'
}

export interface DietInputs {
  dietType: 'vegan' | 'vegetarian' | 'flexitarian' | 'omnivore' | 'meat-heavy'
  foodWasteLevel: 'none' | 'low' | 'medium' | 'high'
  foodSourcePreference: 'local' | 'imported'
}

export interface ConsumptionInputs {
  monthlyClothingSpendInr: number
  electronicsPurchasedPerYear: number
  onlineDeliveriesPerWeek: number
}

export interface FlightInputs {
  shortHaulFlightsPerYear: number
  longHaulFlightsPerYear: number
  flightClass: 'economy' | 'business' | 'first'
}

export interface EmissionInputs {
  transport: TransportInputs
  energy: EnergyInputs
  diet: DietInputs
  consumption: ConsumptionInputs
  flights: FlightInputs
}

export interface CarbonBreakdown {
  transport: number  // tCO2e/year
  energy: number
  diet: number
  consumption: number
  flights: number
  total: number
}

export interface CarbonEquivalent {
  label: string
  value: number
  unit: string
  icon: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
