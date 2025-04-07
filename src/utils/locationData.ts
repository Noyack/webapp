// data/locationData.ts

// US States list for dropdown
export const usStates = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' },
    { code: 'DC', name: 'District of Columbia' },
  ];
  
  // Home insurance rates by state (percent of home value) - 2024 estimates
  export const usHomeInsuranceRates = [
    { stateCode: 'AL', insuranceRate: 0.83 },
    { stateCode: 'AK', insuranceRate: 0.47 },
    { stateCode: 'AZ', insuranceRate: 0.42 },
    { stateCode: 'AR', insuranceRate: 0.74 },
    { stateCode: 'CA', insuranceRate: 0.35 },
    { stateCode: 'CO', insuranceRate: 0.55 },
    { stateCode: 'CT', insuranceRate: 0.47 },
    { stateCode: 'DE', insuranceRate: 0.32 },
    { stateCode: 'FL', insuranceRate: 0.97 },
    { stateCode: 'GA', insuranceRate: 0.58 },
    { stateCode: 'HI', insuranceRate: 0.28 },
    { stateCode: 'ID', insuranceRate: 0.35 },
    { stateCode: 'IL', insuranceRate: 0.52 },
    { stateCode: 'IN', insuranceRate: 0.55 },
    { stateCode: 'IA', insuranceRate: 0.58 },
    { stateCode: 'KS', insuranceRate: 0.91 },
    { stateCode: 'KY', insuranceRate: 0.58 },
    { stateCode: 'LA', insuranceRate: 1.10 },
    { stateCode: 'ME', insuranceRate: 0.36 },
    { stateCode: 'MD', insuranceRate: 0.38 },
    { stateCode: 'MA', insuranceRate: 0.41 },
    { stateCode: 'MI', insuranceRate: 0.46 },
    { stateCode: 'MN', insuranceRate: 0.54 },
    { stateCode: 'MS', insuranceRate: 0.95 },
    { stateCode: 'MO', insuranceRate: 0.65 },
    { stateCode: 'MT', insuranceRate: 0.56 },
    { stateCode: 'NE', insuranceRate: 0.82 },
    { stateCode: 'NV', insuranceRate: 0.39 },
    { stateCode: 'NH', insuranceRate: 0.35 },
    { stateCode: 'NJ', insuranceRate: 0.42 },
    { stateCode: 'NM', insuranceRate: 0.56 },
    { stateCode: 'NY', insuranceRate: 0.53 },
    { stateCode: 'NC', insuranceRate: 0.51 },
    { stateCode: 'ND', insuranceRate: 0.83 },
    { stateCode: 'OH', insuranceRate: 0.40 },
    { stateCode: 'OK', insuranceRate: 1.10 },
    { stateCode: 'OR', insuranceRate: 0.34 },
    { stateCode: 'PA', insuranceRate: 0.39 },
    { stateCode: 'RI', insuranceRate: 0.44 },
    { stateCode: 'SC', insuranceRate: 0.53 },
    { stateCode: 'SD', insuranceRate: 0.79 },
    { stateCode: 'TN', insuranceRate: 0.58 },
    { stateCode: 'TX', insuranceRate: 0.89 },
    { stateCode: 'UT', insuranceRate: 0.33 },
    { stateCode: 'VT', insuranceRate: 0.33 },
    { stateCode: 'VA', insuranceRate: 0.41 },
    { stateCode: 'WA', insuranceRate: 0.42 },
    { stateCode: 'WV', insuranceRate: 0.45 },
    { stateCode: 'WI', insuranceRate: 0.38 },
    { stateCode: 'WY', insuranceRate: 0.53 },
    { stateCode: 'DC', insuranceRate: 0.45 },
  ];
  
  // Property tax rates by state (percent of property value) - 2024 estimates
  export const usPropertyTaxRates = [
    { stateCode: 'AL', propertyTaxRate: 0.41 },
    { stateCode: 'AK', propertyTaxRate: 1.19 },
    { stateCode: 'AZ', propertyTaxRate: 0.62 },
    { stateCode: 'AR', propertyTaxRate: 0.62 },
    { stateCode: 'CA', propertyTaxRate: 0.76 },
    { stateCode: 'CO', propertyTaxRate: 0.51 },
    { stateCode: 'CT', propertyTaxRate: 2.14 },
    { stateCode: 'DE', propertyTaxRate: 0.57 },
    { stateCode: 'FL', propertyTaxRate: 0.89 },
    { stateCode: 'GA', propertyTaxRate: 0.92 },
    { stateCode: 'HI', propertyTaxRate: 0.28 },
    { stateCode: 'ID', propertyTaxRate: 0.69 },
    { stateCode: 'IL', propertyTaxRate: 2.27 },
    { stateCode: 'IN', propertyTaxRate: 0.85 },
    { stateCode: 'IA', propertyTaxRate: 1.53 },
    { stateCode: 'KS', propertyTaxRate: 1.41 },
    { stateCode: 'KY', propertyTaxRate: 0.86 },
    { stateCode: 'LA', propertyTaxRate: 0.55 },
    { stateCode: 'ME', propertyTaxRate: 1.30 },
    { stateCode: 'MD', propertyTaxRate: 1.09 },
    { stateCode: 'MA', propertyTaxRate: 1.23 },
    { stateCode: 'MI', propertyTaxRate: 1.54 },
    { stateCode: 'MN', propertyTaxRate: 1.15 },
    { stateCode: 'MS', propertyTaxRate: 0.65 },
    { stateCode: 'MO', propertyTaxRate: 0.97 },
    { stateCode: 'MT', propertyTaxRate: 0.84 },
    { stateCode: 'NE', propertyTaxRate: 1.73 },
    { stateCode: 'NV', propertyTaxRate: 0.53 },
    { stateCode: 'NH', propertyTaxRate: 2.18 },
    { stateCode: 'NJ', propertyTaxRate: 2.49 },
    { stateCode: 'NM', propertyTaxRate: 0.80 },
    { stateCode: 'NY', propertyTaxRate: 1.72 },
    { stateCode: 'NC', propertyTaxRate: 0.84 },
    { stateCode: 'ND', propertyTaxRate: 0.98 },
    { stateCode: 'OH', propertyTaxRate: 1.62 },
    { stateCode: 'OK', propertyTaxRate: 0.90 },
    { stateCode: 'OR', propertyTaxRate: 0.97 },
    { stateCode: 'PA', propertyTaxRate: 1.58 },
    { stateCode: 'RI', propertyTaxRate: 1.63 },
    { stateCode: 'SC', propertyTaxRate: 0.57 },
    { stateCode: 'SD', propertyTaxRate: 1.32 },
    { stateCode: 'TN', propertyTaxRate: 0.71 },
    { stateCode: 'TX', propertyTaxRate: 1.80 },
    { stateCode: 'UT', propertyTaxRate: 0.66 },
    { stateCode: 'VT', propertyTaxRate: 1.90 },
    { stateCode: 'VA', propertyTaxRate: 0.80 },
    { stateCode: 'WA', propertyTaxRate: 0.98 },
    { stateCode: 'WV', propertyTaxRate: 0.58 },
    { stateCode: 'WI', propertyTaxRate: 1.76 },
    { stateCode: 'WY', propertyTaxRate: 0.61 },
    { stateCode: 'DC', propertyTaxRate: 0.56 },
  ];
  
  // Current mortgage rates by loan type - as of March 2025 (example data)
  export const usMortgageRates = [
    { term: 30, type: 'fixed', rate: 5.75 },
    { term: 20, type: 'fixed', rate: 5.50 },
    { term: 15, type: 'fixed', rate: 5.25 },
    { term: 10, type: 'fixed', rate: 5.00 },
    { term: 5, type: 'ARM', rate: 5.10 },
    { term: 7, type: 'ARM', rate: 5.30 },
  ];
  
  // This data could be expanded with median home prices and median rents by city/state
  // In a production app, this would likely come from an external API or backend service


  // data/locationData.ts


// Cost of living index by state (100 = national average)
export const costOfLivingByState = [
  { state: 'AL', index: 87.9 },
  { state: 'AK', index: 125.8 },
  { state: 'AZ', index: 102.2 },
  { state: 'AR', index: 86.9 },
  { state: 'CA', index: 142.2 },
  { state: 'CO', index: 105.6 },
  { state: 'CT', index: 119.1 },
  { state: 'DE', index: 102.6 },
  { state: 'FL', index: 97.9 },
  { state: 'GA', index: 89.2 },
  { state: 'HI', index: 170.0 },
  { state: 'ID', index: 94.0 },
  { state: 'IL', index: 94.3 },
  { state: 'IN', index: 90.4 },
  { state: 'IA', index: 89.9 },
  { state: 'KS', index: 86.5 },
  { state: 'KY', index: 90.8 },
  { state: 'LA', index: 93.9 },
  { state: 'ME', index: 117.5 },
  { state: 'MD', index: 124.0 },
  { state: 'MA', index: 131.6 },
  { state: 'MI', index: 90.9 },
  { state: 'MN', index: 97.2 },
  { state: 'MS', index: 84.8 },
  { state: 'MO', index: 89.8 },
  { state: 'MT', index: 94.0 },
  { state: 'NE', index: 90.8 },
  { state: 'NV', index: 108.5 },
  { state: 'NH', index: 109.7 },
  { state: 'NJ', index: 125.1 },
  { state: 'NM', index: 87.5 },
  { state: 'NY', index: 139.1 },
  { state: 'NC', index: 94.9 },
  { state: 'ND', index: 98.8 },
  { state: 'OH', index: 90.8 },
  { state: 'OK', index: 86.1 },
  { state: 'OR', index: 113.1 },
  { state: 'PA', index: 101.7 },
  { state: 'RI', index: 119.4 },
  { state: 'SC', index: 95.9 },
  { state: 'SD', index: 99.8 },
  { state: 'TN', index: 89.8 },
  { state: 'TX', index: 91.5 },
  { state: 'UT', index: 98.4 },
  { state: 'VT', index: 117.0 },
  { state: 'VA', index: 100.7 },
  { state: 'WA', index: 110.7 },
  { state: 'WV', index: 91.1 },
  { state: 'WI', index: 94.9 },
  { state: 'WY', index: 89.3 },
  { state: 'DC', index: 152.1 }
];

// Effective tax rates by state (including state income tax, property tax, sales tax)
export const taxRatesByState = [
  { state: 'AL', effectiveTaxRate: 9.1 },
  { state: 'AK', effectiveTaxRate: 5.6 },
  { state: 'AZ', effectiveTaxRate: 8.8 },
  { state: 'AR', effectiveTaxRate: 9.4 },
  { state: 'CA', effectiveTaxRate: 12.6 },
  { state: 'CO', effectiveTaxRate: 9.4 },
  { state: 'CT', effectiveTaxRate: 12.8 },
  { state: 'DE', effectiveTaxRate: 6.2 },
  { state: 'FL', effectiveTaxRate: 6.8 },
  { state: 'GA', effectiveTaxRate: 9.1 },
  { state: 'HI', effectiveTaxRate: 11.7 },
  { state: 'ID', effectiveTaxRate: 9.6 },
  { state: 'IL', effectiveTaxRate: 11.1 },
  { state: 'IN', effectiveTaxRate: 9.0 },
  { state: 'IA', effectiveTaxRate: 10.8 },
  { state: 'KS', effectiveTaxRate: 10.3 },
  { state: 'KY', effectiveTaxRate: 9.9 },
  { state: 'LA', effectiveTaxRate: 9.2 },
  { state: 'ME', effectiveTaxRate: 11.0 },
  { state: 'MD', effectiveTaxRate: 10.9 },
  { state: 'MA', effectiveTaxRate: 10.0 },
  { state: 'MI', effectiveTaxRate: 10.0 },
  { state: 'MN', effectiveTaxRate: 11.2 },
  { state: 'MS', effectiveTaxRate: 9.0 },
  { state: 'MO', effectiveTaxRate: 9.2 },
  { state: 'MT', effectiveTaxRate: 7.9 },
  { state: 'NE', effectiveTaxRate: 10.3 },
  { state: 'NV', effectiveTaxRate: 8.2 },
  { state: 'NH', effectiveTaxRate: 6.9 },
  { state: 'NJ', effectiveTaxRate: 12.2 },
  { state: 'NM', effectiveTaxRate: 8.7 },
  { state: 'NY', effectiveTaxRate: 12.8 },
  { state: 'NC', effectiveTaxRate: 9.0 },
  { state: 'ND', effectiveTaxRate: 8.9 },
  { state: 'OH', effectiveTaxRate: 10.0 },
  { state: 'OK', effectiveTaxRate: 8.6 },
  { state: 'OR', effectiveTaxRate: 10.8 },
  { state: 'PA', effectiveTaxRate: 10.2 },
  { state: 'RI', effectiveTaxRate: 11.4 },
  { state: 'SC', effectiveTaxRate: 8.4 },
  { state: 'SD', effectiveTaxRate: 8.4 },
  { state: 'TN', effectiveTaxRate: 7.3 },
  { state: 'TX', effectiveTaxRate: 8.2 },
  { state: 'UT', effectiveTaxRate: 9.2 },
  { state: 'VT', effectiveTaxRate: 10.3 },
  { state: 'VA', effectiveTaxRate: 9.3 },
  { state: 'WA', effectiveTaxRate: 8.9 },
  { state: 'WV', effectiveTaxRate: 9.7 },
  { state: 'WI', effectiveTaxRate: 10.8 },
  { state: 'WY', effectiveTaxRate: 7.0 },
  { state: 'DC', effectiveTaxRate: 10.6 }
];

// Sample city data with major cities per state
export const cityData = [
  // Alabama
  { state: 'AL', name: 'Birmingham' },
  { state: 'AL', name: 'Montgomery' },
  { state: 'AL', name: 'Mobile' },
  { state: 'AL', name: 'Huntsville' },
  
  // Alaska
  { state: 'AK', name: 'Anchorage' },
  { state: 'AK', name: 'Fairbanks' },
  { state: 'AK', name: 'Juneau' },
  
  // Arizona
  { state: 'AZ', name: 'Phoenix' },
  { state: 'AZ', name: 'Tucson' },
  { state: 'AZ', name: 'Mesa' },
  { state: 'AZ', name: 'Scottsdale' },
  
  // Arkansas
  { state: 'AR', name: 'Little Rock' },
  { state: 'AR', name: 'Fayetteville' },
  { state: 'AR', name: 'Fort Smith' },
  
  // California
  { state: 'CA', name: 'Los Angeles' },
  { state: 'CA', name: 'San Francisco' },
  { state: 'CA', name: 'San Diego' },
  { state: 'CA', name: 'Sacramento' },
  { state: 'CA', name: 'San Jose' },
  
  // Colorado
  { state: 'CO', name: 'Denver' },
  { state: 'CO', name: 'Colorado Springs' },
  { state: 'CO', name: 'Boulder' },
  { state: 'CO', name: 'Fort Collins' },
  
  // Connecticut
  { state: 'CT', name: 'Hartford' },
  { state: 'CT', name: 'New Haven' },
  { state: 'CT', name: 'Stamford' },
  
  // Delaware
  { state: 'DE', name: 'Wilmington' },
  { state: 'DE', name: 'Dover' },
  
  // Florida
  { state: 'FL', name: 'Miami' },
  { state: 'FL', name: 'Orlando' },
  { state: 'FL', name: 'Tampa' },
  { state: 'FL', name: 'Jacksonville' },
  { state: 'FL', name: 'Naples' },
  { state: 'FL', name: 'Fort Myers' },
  { state: 'FL', name: 'Sarasota' },
  
  // Georgia
  { state: 'GA', name: 'Atlanta' },
  { state: 'GA', name: 'Savannah' },
  { state: 'GA', name: 'Augusta' },
  
  // Hawaii
  { state: 'HI', name: 'Honolulu' },
  { state: 'HI', name: 'Hilo' },
  { state: 'HI', name: 'Kailua' },
  
  // Idaho
  { state: 'ID', name: 'Boise' },
  { state: 'ID', name: 'Idaho Falls' },
  
  // Illinois
  { state: 'IL', name: 'Chicago' },
  { state: 'IL', name: 'Springfield' },
  { state: 'IL', name: 'Rockford' },
  
  // Indiana
  { state: 'IN', name: 'Indianapolis' },
  { state: 'IN', name: 'Fort Wayne' },
  
  // Iowa
  { state: 'IA', name: 'Des Moines' },
  { state: 'IA', name: 'Cedar Rapids' },
  
  // Kansas
  { state: 'KS', name: 'Wichita' },
  { state: 'KS', name: 'Kansas City' },
  
  // Kentucky
  { state: 'KY', name: 'Louisville' },
  { state: 'KY', name: 'Lexington' },
  
  // Louisiana
  { state: 'LA', name: 'New Orleans' },
  { state: 'LA', name: 'Baton Rouge' },
  
  // Maine
  { state: 'ME', name: 'Portland' },
  { state: 'ME', name: 'Augusta' },
  
  // Maryland
  { state: 'MD', name: 'Baltimore' },
  { state: 'MD', name: 'Annapolis' },
  
  // Massachusetts
  { state: 'MA', name: 'Boston' },
  { state: 'MA', name: 'Cambridge' },
  { state: 'MA', name: 'Springfield' },
  
  // Michigan
  { state: 'MI', name: 'Detroit' },
  { state: 'MI', name: 'Grand Rapids' },
  { state: 'MI', name: 'Ann Arbor' },
  
  // Minnesota
  { state: 'MN', name: 'Minneapolis' },
  { state: 'MN', name: 'Saint Paul' },
  { state: 'MN', name: 'Rochester' },
  
  // Mississippi
  { state: 'MS', name: 'Jackson' },
  { state: 'MS', name: 'Gulfport' },
  
  // Missouri
  { state: 'MO', name: 'Kansas City' },
  { state: 'MO', name: 'St. Louis' },
  { state: 'MO', name: 'Springfield' },
  
  // Montana
  { state: 'MT', name: 'Billings' },
  { state: 'MT', name: 'Missoula' },
  
  // Nebraska
  { state: 'NE', name: 'Omaha' },
  { state: 'NE', name: 'Lincoln' },
  
  // Nevada
  { state: 'NV', name: 'Las Vegas' },
  { state: 'NV', name: 'Reno' },
  
  // New Hampshire
  { state: 'NH', name: 'Manchester' },
  { state: 'NH', name: 'Concord' },
  
  // New Jersey
  { state: 'NJ', name: 'Newark' },
  { state: 'NJ', name: 'Jersey City' },
  { state: 'NJ', name: 'Princeton' },
  
  // New Mexico
  { state: 'NM', name: 'Albuquerque' },
  { state: 'NM', name: 'Santa Fe' },
  
  // New York
  { state: 'NY', name: 'New York City' },
  { state: 'NY', name: 'Buffalo' },
  { state: 'NY', name: 'Rochester' },
  { state: 'NY', name: 'Albany' },
  
  // North Carolina
  { state: 'NC', name: 'Charlotte' },
  { state: 'NC', name: 'Raleigh' },
  { state: 'NC', name: 'Durham' },
  { state: 'NC', name: 'Asheville' },
  
  // North Dakota
  { state: 'ND', name: 'Fargo' },
  { state: 'ND', name: 'Bismarck' },
  
  // Ohio
  { state: 'OH', name: 'Columbus' },
  { state: 'OH', name: 'Cleveland' },
  { state: 'OH', name: 'Cincinnati' },
  
  // Oklahoma
  { state: 'OK', name: 'Oklahoma City' },
  { state: 'OK', name: 'Tulsa' },
  
  // Oregon
  { state: 'OR', name: 'Portland' },
  { state: 'OR', name: 'Eugene' },
  { state: 'OR', name: 'Salem' },
  
  // Pennsylvania
  { state: 'PA', name: 'Philadelphia' },
  { state: 'PA', name: 'Pittsburgh' },
  { state: 'PA', name: 'Harrisburg' },
  
  // Rhode Island
  { state: 'RI', name: 'Providence' },
  { state: 'RI', name: 'Newport' },
  
  // South Carolina
  { state: 'SC', name: 'Charleston' },
  { state: 'SC', name: 'Columbia' },
  { state: 'SC', name: 'Greenville' },
  
  // South Dakota
  { state: 'SD', name: 'Sioux Falls' },
  { state: 'SD', name: 'Rapid City' },
  
  // Tennessee
  { state: 'TN', name: 'Nashville' },
  { state: 'TN', name: 'Memphis' },
  { state: 'TN', name: 'Knoxville' },
  
  // Texas
  { state: 'TX', name: 'Houston' },
  { state: 'TX', name: 'Dallas' },
  { state: 'TX', name: 'Austin' },
  { state: 'TX', name: 'San Antonio' },
  
  // Utah
  { state: 'UT', name: 'Salt Lake City' },
  { state: 'UT', name: 'Provo' },
  
  // Vermont
  { state: 'VT', name: 'Burlington' },
  { state: 'VT', name: 'Montpelier' },
  
  // Virginia
  { state: 'VA', name: 'Richmond' },
  { state: 'VA', name: 'Virginia Beach' },
  { state: 'VA', name: 'Arlington' },
  
  // Washington
  { state: 'WA', name: 'Seattle' },
  { state: 'WA', name: 'Spokane' },
  { state: 'WA', name: 'Tacoma' },
  
  // West Virginia
  { state: 'WV', name: 'Charleston' },
  { state: 'WV', name: 'Huntington' },
  
  // Wisconsin
  { state: 'WI', name: 'Milwaukee' },
  { state: 'WI', name: 'Madison' },
  
  // Wyoming
  { state: 'WY', name: 'Cheyenne' },
  { state: 'WY', name: 'Casper' },
  
  // District of Columbia
  { state: 'DC', name: 'Washington' }
];