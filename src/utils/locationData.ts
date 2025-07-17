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
export const cityData = {
  AL: [
    'Alexander City', 'Andalusia', 'Anniston', 'Athens', 'Atmore', 'Auburn',
    'Bessemer', 'Birmingham', 'Chickasaw', 'Clanton', 'Cullman', 'Decatur',
    'Demopolis', 'Dothan', 'Enterprise', 'Eufaula', 'Florence', 'Fort Payne',
    'Gadsden', 'Greenville', 'Guntersville', 'Huntsville', 'Jasper',
    'Marion', 'Mobile', 'Montgomery', 'Opelika', 'Ozark', 'Phenix City',
    'Prichard', 'Scottsboro', 'Selma', 'Sheffield', 'Sylacauga', 'Talladega',
    'Troy', 'Tuscaloosa', 'Tuscumbia', 'Tuskegee'
  ],

  AK: [
    'Anchorage', 'Cordova', 'Fairbanks', 'Haines', 'Homer', 'Juneau',
    'Ketchikan', 'Kodiak', 'Kotzebue', 'Nome', 'Palmer', 'Seward', 'Sitka',
    'Skagway', 'Valdez'
  ],

  AZ: [
    'Ajo', 'Avondale', 'Bisbee', 'Casa Grande', 'Chandler', 'Clifton',
    'Douglas', 'Flagstaff', 'Florence', 'Gila Bend', 'Glendale', 'Globe',
    'Kingman', 'Lake Havasu City', 'Mesa', 'Nogales', 'Phoenix', 'Prescott',
    'Scottsdale', 'Sierra Vista', 'Tempe', 'Tombstone', 'Tucson',
    'Window Rock', 'Winslow', 'Yuma'
  ],

  AR: [
    'Arkadelphia', 'Arkansas Post', 'Batesville', 'Benton', 'Blytheville',
    'Camden', 'Conway', 'Crossett', 'El Dorado', 'Fayetteville',
    'Forrest City', 'Fort Smith', 'Harrison', 'Helena', 'Hope',
    'Hot Springs', 'Jacksonville', 'Jonesboro', 'Little Rock', 'Magnolia',
    'Morrilton', 'Newport', 'North Little Rock', 'Osceola', 'Pine Bluff',
    'Rogers', 'Searcy', 'Stuttgart', 'Van Buren', 'West Memphis'
  ],

  CA: [
    'Alameda', 'Alhambra', 'Anaheim', 'Antioch', 'Arcadia', 'Bakersfield',
    'Barstow', 'Belmont', 'Berkeley', 'Beverly Hills', 'Brea', 'Buena Park',
    'Burbank', 'Calexico', 'Calistoga', 'Carlsbad', 'Carmel', 'Chico',
    'Chula Vista', 'Claremont', 'Compton', 'Concord', 'Corona', 'Coronado',
    'Costa Mesa', 'Culver City', 'Daly City', 'Davis', 'Downey', 'El Centro',
    'El Cerrito', 'El Monte', 'Escondido', 'Eureka', 'Fairfield', 'Fontana',
    'Fremont', 'Fresno', 'Fullerton', 'Garden Grove', 'Glendale', 'Hayward',
    'Hollywood', 'Huntington Beach', 'Indio', 'Inglewood', 'Irvine',
    'La Habra', 'Laguna Beach', 'Lancaster', 'Livermore', 'Lodi', 'Lompoc',
    'Long Beach', 'Los Angeles', 'Malibu', 'Martinez', 'Marysville',
    'Menlo Park', 'Merced', 'Modesto', 'Monterey', 'Mountain View', 'Napa',
    'Needles', 'Newport Beach', 'Norwalk', 'Novato', 'Oakland', 'Oceanside',
    'Ojai', 'Ontario', 'Orange', 'Oroville', 'Oxnard', 'Pacific Grove',
    'Palm Springs', 'Palmdale', 'Palo Alto', 'Pasadena', 'Petaluma',
    'Pomona', 'Port Hueneme', 'Rancho Cucamonga', 'Red Bluff', 'Redding',
    'Redlands', 'Redondo Beach', 'Redwood City', 'Richmond', 'Riverside',
    'Roseville', 'Sacramento', 'Salinas', 'San Bernardino', 'San Clemente',
    'San Diego', 'San Fernando', 'San Francisco', 'San Gabriel', 'San Jose',
    'San Juan Capistrano', 'San Leandro', 'San Luis Obispo', 'San Marino',
    'San Mateo', 'San Pedro', 'San Rafael', 'San Simeon', 'Santa Ana',
    'Santa Barbara', 'Santa Clara', 'Santa Clarita', 'Santa Cruz',
    'Santa Monica', 'Santa Rosa', 'Sausalito', 'Simi Valley', 'Sonoma',
    'South San Francisco', 'Stockton', 'Sunnyvale', 'Susanville',
    'Thousand Oaks', 'Torrance', 'Turlock', 'Ukiah', 'Vallejo', 'Ventura',
    'Victorville', 'Visalia', 'Walnut Creek', 'Watts', 'West Covina',
    'Whittier', 'Woodland', 'Yorba Linda', 'Yuba City'
  ],

  CO: [
    'Alamosa', 'Aspen', 'Aurora', 'Boulder', 'Breckenridge', 'Brighton',
    'Canon City', 'Central City', 'Climax', 'Colorado Springs', 'Cortez',
    'Cripple Creek', 'Denver', 'Durango', 'Englewood', 'Estes Park',
    'Fort Collins', 'Fort Morgan', 'Georgetown', 'Glenwood Springs',
    'Golden', 'Grand Junction', 'Greeley', 'Gunnison', 'La Junta',
    'Leadville', 'Littleton', 'Longmont', 'Loveland', 'Montrose', 'Ouray',
    'Pagosa Springs', 'Pueblo', 'Silverton', 'Steamboat Springs', 'Sterling',
    'Telluride', 'Trinidad', 'Vail', 'Walsenburg', 'Westminster'
  ],

  CT: [
    'Ansonia', 'Berlin', 'Bloomfield', 'Branford', 'Bridgeport', 'Bristol',
    'Coventry', 'Danbury', 'Darien', 'Derby', 'East Hartford', 'East Haven',
    'Enfield', 'Fairfield', 'Farmington', 'Greenwich', 'Groton', 'Guilford',
    'Hamden', 'Hartford', 'Lebanon', 'Litchfield', 'Manchester', 'Mansfield',
    'Meriden', 'Middletown', 'Milford', 'Mystic', 'Naugatuck',
    'New Britain', 'New Haven', 'New London', 'North Haven', 'Norwalk',
    'Norwich', 'Old Saybrook', 'Orange', 'Seymour', 'Shelton', 'Simsbury',
    'Southington', 'Stamford', 'Stonington', 'Stratford', 'Torrington',
    'Wallingford', 'Waterbury', 'Waterford', 'Watertown', 'West Hartford',
    'West Haven', 'Westport', 'Wethersfield', 'Willimantic', 'Windham',
    'Windsor', 'Windsor Locks', 'Winsted'
  ],

  DE: [
    'Dover', 'Lewes', 'Milford', 'New Castle', 'Newark', 'Smyrna',
    'Wilmington'
  ],

  FL: [
    'Apalachicola', 'Bartow', 'Belle Glade', 'Boca Raton', 'Bradenton',
    'Cape Coral', 'Clearwater', 'Cocoa Beach', 'Cocoa-Rockledge',
    'Coral Gables', 'Daytona Beach', 'De Land', 'Deerfield Beach',
    'Delray Beach', 'Fernandina Beach', 'Fort Lauderdale', 'Fort Myers',
    'Fort Pierce', 'Fort Walton Beach', 'Gainesville', 'Hallandale Beach',
    'Hialeah', 'Hollywood', 'Homestead', 'Jacksonville', 'Key West',
    'Lake City', 'Lake Wales', 'Lakeland', 'Largo', 'Melbourne', 'Miami',
    'Miami Beach', 'Naples', 'New Smyrna Beach', 'Ocala', 'Orlando',
    'Ormond Beach', 'Palatka', 'Palm Bay', 'Palm Beach', 'Panama City',
    'Pensacola', 'Pompano Beach', 'Saint Augustine', 'Saint Petersburg',
    'Sanford', 'Sarasota', 'Sebring', 'Tallahassee', 'Tampa',
    'Tarpon Springs', 'Titusville', 'Venice', 'West Palm Beach',
    'White Springs', 'Winter Haven', 'Winter Park'
  ],

  GA: [
    'Albany', 'Americus', 'Andersonville', 'Athens', 'Atlanta', 'Augusta',
    'Bainbridge', 'Blairsville', 'Brunswick', 'Calhoun', 'Carrollton',
    'Columbus', 'Dahlonega', 'Dalton', 'Darien', 'Decatur', 'Douglas',
    'East Point', 'Fitzgerald', 'Fort Valley', 'Gainesville', 'La Grange',
    'Macon', 'Marietta', 'Milledgeville', 'Plains', 'Rome', 'Savannah',
    'Toccoa', 'Valdosta', 'Warm Springs', 'Warner Robins', 'Washington',
    'Waycross'
  ],

  HI: [
    'Hanalei', 'Hilo', 'Honaunau', 'Honolulu', 'Kahului', 'Kaneohe',
    'Kapaa', 'Kawaihae', 'Lahaina', 'Laie', 'Wahiawa', 'Wailuku', 'Waimea'
  ],

  ID: [
    'Blackfoot', 'Boise', 'Bonners Ferry', 'Caldwell', 'Coeur d\'Alene',
    'Idaho City', 'Idaho Falls', 'Kellogg', 'Lewiston', 'Moscow', 'Nampa',
    'Pocatello', 'Priest River', 'Rexburg', 'Sun Valley', 'Twin Falls'
  ],

  IL: [
    'Alton', 'Arlington Heights', 'Arthur', 'Aurora', 'Belleville',
    'Belvidere', 'Bloomington', 'Brookfield', 'Cahokia', 'Cairo',
    'Calumet City', 'Canton', 'Carbondale', 'Carlinville', 'Carthage',
    'Centralia', 'Champaign', 'Charleston', 'Chester', 'Chicago',
    'Chicago Heights', 'Cicero', 'Collinsville', 'Danville', 'Decatur',
    'DeKalb', 'Des Plaines', 'Dixon', 'East Moline', 'East Saint Louis',
    'Effingham', 'Elgin', 'Elmhurst', 'Evanston', 'Freeport', 'Galena',
    'Galesburg', 'Glen Ellyn', 'Glenview', 'Granite City', 'Harrisburg',
    'Herrin', 'Highland Park', 'Jacksonville', 'Joliet', 'Kankakee',
    'Kaskaskia', 'Kewanee', 'La Salle', 'Lake Forest', 'Libertyville',
    'Lincoln', 'Lisle', 'Lombard', 'Macomb', 'Mattoon', 'Moline',
    'Monmouth', 'Mount Vernon', 'Mundelein', 'Naperville', 'Nauvoo',
    'Normal', 'North Chicago', 'Oak Park', 'Oregon', 'Ottawa', 'Palatine',
    'Park Forest', 'Park Ridge', 'Pekin', 'Peoria', 'Petersburg',
    'Pontiac', 'Quincy', 'Rantoul', 'River Forest', 'Rock Island',
    'Rockford', 'Salem', 'Shawneetown', 'Skokie', 'South Holland',
    'Springfield', 'Streator', 'Summit', 'Urbana', 'Vandalia', 'Virden',
    'Waukegan', 'Wheaton', 'Wilmette', 'Winnetka', 'Wood River', 'Zion'
  ],

  IN: [
    'Anderson', 'Bedford', 'Bloomington', 'Columbus', 'Connersville',
    'Corydon', 'Crawfordsville', 'East Chicago', 'Elkhart', 'Elwood',
    'Evansville', 'Fort Wayne', 'French Lick', 'Gary', 'Geneva', 'Goshen',
    'Greenfield', 'Hammond', 'Hobart', 'Huntington', 'Indianapolis',
    'Jeffersonville', 'Kokomo', 'Lafayette', 'Madison', 'Marion',
    'Michigan City', 'Mishawaka', 'Muncie', 'Nappanee', 'Nashville',
    'New Albany', 'New Castle', 'New Harmony', 'Peru', 'Plymouth',
    'Richmond', 'Santa Claus', 'Shelbyville', 'South Bend', 'Terre Haute',
    'Valparaiso', 'Vincennes', 'Wabash', 'West Lafayette'
  ],

  IA: [
    'Amana Colonies', 'Ames', 'Boone', 'Burlington', 'Cedar Falls',
    'Cedar Rapids', 'Charles City', 'Cherokee', 'Clinton', 'Council Bluffs',
    'Davenport', 'Des Moines', 'Dubuque', 'Estherville', 'Fairfield',
    'Fort Dodge', 'Grinnell', 'Indianola', 'Iowa City', 'Keokuk',
    'Mason City', 'Mount Pleasant', 'Muscatine', 'Newton', 'Oskaloosa',
    'Ottumwa', 'Sioux City', 'Waterloo', 'Webster City', 'West Des Moines'
  ],

  KS: [
    'Abilene', 'Arkansas City', 'Atchison', 'Chanute', 'Coffeyville',
    'Council Grove', 'Dodge City', 'Emporia', 'Fort Scott', 'Garden City',
    'Great Bend', 'Hays', 'Hutchinson', 'Independence', 'Junction City',
    'Kansas City', 'Lawrence', 'Leavenworth', 'Liberal', 'Manhattan',
    'McPherson', 'Medicine Lodge', 'Newton', 'Olathe', 'Osawatomie',
    'Ottawa', 'Overland Park', 'Pittsburg', 'Salina', 'Shawnee',
    'Smith Center', 'Topeka', 'Wichita'
  ],

  KY: [
    'Ashland', 'Barbourville', 'Bardstown', 'Berea', 'Boonesborough',
    'Bowling Green', 'Campbellsville', 'Covington', 'Danville',
    'Elizabethtown', 'Frankfort', 'Harlan', 'Harrodsburg', 'Hazard',
    'Henderson', 'Hodgenville', 'Hopkinsville', 'Lexington', 'Louisville',
    'Mayfield', 'Maysville', 'Middlesboro', 'Newport', 'Owensboro',
    'Paducah', 'Paris', 'Richmond'
  ],

  LA: [
    'Abbeville', 'Alexandria', 'Bastrop', 'Baton Rouge', 'Bogalusa',
    'Bossier City', 'Gretna', 'Houma', 'Lafayette', 'Lake Charles',
    'Monroe', 'Morgan City', 'Natchitoches', 'New Iberia', 'New Orleans',
    'Opelousas', 'Ruston', 'Saint Martinville', 'Shreveport', 'Thibodaux'
  ],

  ME: [
    'Auburn', 'Augusta', 'Bangor', 'Bar Harbor', 'Bath', 'Belfast',
    'Biddeford', 'Boothbay Harbor', 'Brunswick', 'Calais', 'Caribou',
    'Castine', 'Eastport', 'Ellsworth', 'Farmington', 'Fort Kent',
    'Gardiner', 'Houlton', 'Kennebunkport', 'Kittery', 'Lewiston', 'Lubec',
    'Machias', 'Orono', 'Portland', 'Presque Isle', 'Rockland', 'Rumford',
    'Saco', 'Scarborough', 'Waterville', 'York'
  ],

  MD: [
    'Aberdeen', 'Annapolis', 'Baltimore', 'Bethesda-Chevy Chase', 'Bowie',
    'Cambridge', 'Catonsville', 'College Park', 'Columbia', 'Cumberland',
    'Easton', 'Elkton', 'Emmitsburg', 'Frederick', 'Greenbelt',
    'Hagerstown', 'Hyattsville', 'Laurel', 'Oakland', 'Ocean City',
    'Rockville', 'Saint Marys City', 'Salisbury', 'Silver Spring',
    'Takoma Park', 'Towson', 'Westminster'
  ],

  MA: [
    'Abington', 'Adams', 'Amesbury', 'Amherst', 'Andover', 'Arlington',
    'Athol', 'Attleboro', 'Barnstable', 'Bedford', 'Beverly', 'Boston',
    'Bourne', 'Braintree', 'Brockton', 'Brookline', 'Cambridge', 'Canton',
    'Charlestown', 'Chelmsford', 'Chelsea', 'Chicopee', 'Clinton',
    'Cohasset', 'Concord', 'Danvers', 'Dartmouth', 'Dedham', 'Dennis',
    'Duxbury', 'Eastham', 'Edgartown', 'Everett', 'Fairhaven',
    'Fall River', 'Falmouth', 'Fitchburg', 'Framingham', 'Gloucester',
    'Great Barrington', 'Greenfield', 'Groton', 'Harwich', 'Haverhill',
    'Hingham', 'Holyoke', 'Hyannis', 'Ipswich', 'Lawrence', 'Lenox',
    'Leominster', 'Lexington', 'Lowell', 'Ludlow', 'Lynn', 'Malden',
    'Marblehead', 'Marlborough', 'Medford', 'Milton', 'Nahant', 'Natick',
    'New Bedford', 'Newburyport', 'Newton', 'North Adams', 'Northampton',
    'Norton', 'Norwood', 'Peabody', 'Pittsfield', 'Plymouth',
    'Provincetown', 'Quincy', 'Randolph', 'Revere', 'Salem', 'Sandwich',
    'Saugus', 'Somerville', 'South Hadley', 'Springfield', 'Stockbridge',
    'Stoughton', 'Sturbridge', 'Sudbury', 'Taunton', 'Tewksbury', 'Truro',
    'Watertown', 'Webster', 'Wellesley', 'Wellfleet', 'West Bridgewater',
    'West Springfield', 'Westfield', 'Weymouth', 'Whitman',
    'Williamstown', 'Woburn', 'Woods Hole', 'Worcester'
  ],

  MI: [
    'Adrian', 'Alma', 'Ann Arbor', 'Battle Creek', 'Bay City',
    'Benton Harbor', 'Bloomfield Hills', 'Cadillac', 'Charlevoix',
    'Cheboygan', 'Dearborn', 'Detroit', 'East Lansing', 'Eastpointe',
    'Ecorse', 'Escanaba', 'Flint', 'Grand Haven', 'Grand Rapids',
    'Grayling', 'Grosse Pointe', 'Hancock', 'Highland Park', 'Holland',
    'Houghton', 'Interlochen', 'Iron Mountain', 'Ironwood', 'Ishpeming',
    'Jackson', 'Kalamazoo', 'Lansing', 'Livonia', 'Ludington',
    'Mackinaw City', 'Manistee', 'Marquette', 'Menominee', 'Midland',
    'Monroe', 'Mount Clemens', 'Mount Pleasant', 'Muskegon', 'Niles',
    'Petoskey', 'Pontiac', 'Port Huron', 'Royal Oak', 'Saginaw',
    'Saint Ignace', 'Saint Joseph', 'Sault Sainte Marie', 'Traverse City',
    'Trenton', 'Warren', 'Wyandotte', 'Ypsilanti'
  ],

  MN: [
    'Albert Lea', 'Alexandria', 'Austin', 'Bemidji', 'Bloomington',
    'Brainerd', 'Crookston', 'Duluth', 'Ely', 'Eveleth', 'Faribault',
    'Fergus Falls', 'Hastings', 'Hibbing', 'International Falls',
    'Little Falls', 'Mankato', 'Minneapolis', 'Moorhead', 'New Ulm',
    'Northfield', 'Owatonna', 'Pipestone', 'Red Wing', 'Rochester',
    'Saint Cloud', 'Saint Paul', 'Sauk Centre', 'South Saint Paul',
    'Stillwater', 'Virginia', 'Willmar', 'Winona'
  ],

  MS: [
    'Bay Saint Louis', 'Biloxi', 'Canton', 'Clarksdale', 'Columbia',
    'Columbus', 'Corinth', 'Greenville', 'Greenwood', 'Grenada',
    'Gulfport', 'Hattiesburg', 'Holly Springs', 'Jackson', 'Laurel',
    'Meridian', 'Natchez', 'Ocean Springs', 'Oxford', 'Pascagoula',
    'Pass Christian', 'Philadelphia', 'Port Gibson', 'Starkville',
    'Tupelo', 'Vicksburg', 'West Point', 'Yazoo City'
  ],

  MO: [
    'Boonville', 'Branson', 'Cape Girardeau', 'Carthage', 'Chillicothe',
    'Clayton', 'Columbia', 'Excelsior Springs', 'Ferguson', 'Florissant',
    'Fulton', 'Hannibal', 'Independence', 'Jefferson City', 'Joplin',
    'Kansas City', 'Kirksville', 'Lamar', 'Lebanon', 'Lexington',
    'Maryville', 'Mexico', 'Monett', 'Neosho', 'New Madrid', 'Rolla',
    'Saint Charles', 'Saint Joseph', 'Saint Louis', 'Sainte Genevieve',
    'Salem', 'Sedalia', 'Springfield', 'Warrensburg', 'West Plains'
  ],

  MT: [
    'Anaconda', 'Billings', 'Bozeman', 'Butte', 'Dillon', 'Fort Benton',
    'Glendive', 'Great Falls', 'Havre', 'Helena', 'Kalispell',
    'Lewistown', 'Livingston', 'Miles City', 'Missoula', 'Virginia City'
  ],

  NE: [
    'Beatrice', 'Bellevue', 'Boys Town', 'Chadron', 'Columbus', 'Fremont',
    'Grand Island', 'Hastings', 'Kearney', 'Lincoln', 'McCook', 'Minden',
    'Nebraska City', 'Norfolk', 'North Platte', 'Omaha', 'Plattsmouth',
    'Red Cloud', 'Sidney'
  ],

  NV: [
    'Boulder City', 'Carson City', 'Elko', 'Ely', 'Fallon', 'Genoa',
    'Goldfield', 'Henderson', 'Las Vegas', 'North Las Vegas', 'Reno',
    'Sparks', 'Virginia City', 'Winnemucca'
  ],

  NH: [
    'Berlin', 'Claremont', 'Concord', 'Derry', 'Dover', 'Durham', 'Exeter',
    'Franklin', 'Hanover', 'Hillsborough', 'Keene', 'Laconia', 'Lebanon',
    'Manchester', 'Nashua', 'Peterborough', 'Plymouth', 'Portsmouth',
    'Rochester', 'Salem', 'Somersworth'
  ],

  NJ: [
    'Asbury Park', 'Atlantic City', 'Bayonne', 'Bloomfield', 'Bordentown',
    'Bound Brook', 'Bridgeton', 'Burlington', 'Caldwell', 'Camden',
    'Cape May', 'Clifton', 'Cranford', 'East Orange', 'Edison',
    'Elizabeth', 'Englewood', 'Fort Lee', 'Glassboro', 'Hackensack',
    'Haddonfield', 'Hoboken', 'Irvington', 'Jersey City', 'Lakehurst',
    'Lakewood', 'Long Beach', 'Long Branch', 'Madison', 'Menlo Park',
    'Millburn', 'Millville', 'Montclair', 'Morristown', 'Mount Holly',
    'New Brunswick', 'New Milford', 'Newark', 'Ocean City', 'Orange',
    'Parsippany–Troy Hills', 'Passaic', 'Paterson', 'Perth Amboy',
    'Plainfield', 'Princeton', 'Ridgewood', 'Roselle', 'Rutherford',
    'Salem', 'Somerville', 'South Orange Village', 'Totowa', 'Trenton',
    'Union', 'Union City', 'Vineland', 'Wayne', 'Weehawken',
    'West New York', 'West Orange', 'Willingboro', 'Woodbridge'
  ],

  NM: [
    'Acoma', 'Alamogordo', 'Albuquerque', 'Artesia', 'Belen', 'Carlsbad',
    'Clovis', 'Deming', 'Farmington', 'Gallup', 'Grants', 'Hobbs',
    'Las Cruces', 'Las Vegas', 'Los Alamos', 'Lovington', 'Portales',
    'Raton', 'Roswell', 'Santa Fe', 'Shiprock', 'Silver City', 'Socorro',
    'Taos', 'Truth or Consequences', 'Tucumcari'
  ],

  NY: [
    'Albany', 'Amsterdam', 'Auburn', 'Babylon', 'Batavia', 'Beacon',
    'Bedford', 'Binghamton', 'Bronx', 'Brooklyn', 'Buffalo', 'Chautauqua',
    'Cheektowaga', 'Clinton', 'Cohoes', 'Coney Island', 'Cooperstown',
    'Corning', 'Cortland', 'Crown Point', 'Dunkirk', 'East Aurora',
    'East Hampton', 'Eastchester', 'Elmira', 'Flushing', 'Forest Hills',
    'Fredonia', 'Garden City', 'Geneva', 'Glens Falls', 'Gloversville',
    'Great Neck', 'Hammondsport', 'Harlem', 'Hempstead', 'Herkimer',
    'Hudson', 'Huntington', 'Hyde Park', 'Ilion', 'Ithaca', 'Jamestown',
    'Johnstown', 'Kingston', 'Lackawanna', 'Lake Placid', 'Levittown',
    'Lockport', 'Mamaroneck', 'Manhattan', 'Massena', 'Middletown',
    'Mineola', 'Mount Vernon', 'New Paltz', 'New Rochelle', 'New Windsor',
    'New York City', 'Newburgh', 'Niagara Falls', 'North Hempstead',
    'Nyack', 'Ogdensburg', 'Olean', 'Oneida', 'Oneonta', 'Ossining',
    'Oswego', 'Oyster Bay', 'Palmyra', 'Peekskill', 'Plattsburgh',
    'Port Washington', 'Potsdam', 'Poughkeepsie', 'Queens', 'Rensselaer',
    'Rochester', 'Rome', 'Rotterdam', 'Rye', 'Sag Harbor', 'Saranac Lake',
    'Saratoga Springs', 'Scarsdale', 'Schenectady', 'Seneca Falls',
    'Southampton', 'Staten Island', 'Stony Brook', 'Stony Point',
    'Syracuse', 'Tarrytown', 'Ticonderoga', 'Tonawanda', 'Troy', 'Utica',
    'Watertown', 'Watervliet', 'Watkins Glen', 'West Seneca',
    'White Plains', 'Woodstock', 'Yonkers'
  ],

  NC: [
    'Asheboro', 'Asheville', 'Bath', 'Beaufort', 'Boone', 'Burlington',
    'Chapel Hill', 'Charlotte', 'Concord', 'Durham', 'Edenton',
    'Elizabeth City', 'Fayetteville', 'Gastonia', 'Goldsboro',
    'Greensboro', 'Greenville', 'Halifax', 'Henderson', 'Hickory',
    'High Point', 'Hillsborough', 'Jacksonville', 'Kinston', 'Kitty Hawk',
    'Lumberton', 'Morehead City', 'Morganton', 'Nags Head', 'New Bern',
    'Pinehurst', 'Raleigh', 'Rocky Mount', 'Salisbury', 'Shelby',
    'Washington', 'Wilmington', 'Wilson', 'Winston-Salem'
  ],

  ND: [
    'Bismarck', 'Devils Lake', 'Dickinson', 'Fargo', 'Grand Forks',
    'Jamestown', 'Mandan', 'Minot', 'Rugby', 'Valley City', 'Wahpeton',
    'Williston'
  ],

  OH: [
    'Akron', 'Alliance', 'Ashtabula', 'Athens', 'Barberton', 'Bedford',
    'Bellefontaine', 'Bowling Green', 'Canton', 'Chillicothe',
    'Cincinnati', 'Cleveland', 'Cleveland Heights', 'Columbus', 'Conneaut',
    'Cuyahoga Falls', 'Dayton', 'Defiance', 'Delaware', 'East Cleveland',
    'East Liverpool', 'Elyria', 'Euclid', 'Findlay', 'Gallipolis',
    'Greenville', 'Hamilton', 'Kent', 'Kettering', 'Lakewood',
    'Lancaster', 'Lima', 'Lorain', 'Mansfield', 'Marietta', 'Marion',
    'Martins Ferry', 'Massillon', 'Mentor', 'Middletown', 'Milan',
    'Mount Vernon', 'New Philadelphia', 'Newark', 'Niles',
    'North College Hill', 'Norwalk', 'Oberlin', 'Painesville', 'Parma',
    'Piqua', 'Portsmouth', 'Put-in-Bay', 'Salem', 'Sandusky',
    'Shaker Heights', 'Springfield', 'Steubenville', 'Tiffin', 'Toledo',
    'Urbana', 'Warren', 'Wooster', 'Worthington', 'Xenia',
    'Yellow Springs', 'Youngstown', 'Zanesville'
  ],

  OK: [
    'Ada', 'Altus', 'Alva', 'Anadarko', 'Ardmore', 'Bartlesville',
    'Bethany', 'Chickasha', 'Claremore', 'Clinton', 'Cushing', 'Duncan',
    'Durant', 'Edmond', 'El Reno', 'Elk City', 'Enid', 'Eufaula',
    'Frederick', 'Guthrie', 'Guymon', 'Hobart', 'Holdenville', 'Hugo',
    'Lawton', 'McAlester', 'Miami', 'Midwest City', 'Moore', 'Muskogee',
    'Norman', 'Oklahoma City', 'Okmulgee', 'Pauls Valley', 'Pawhuska',
    'Perry', 'Ponca City', 'Pryor', 'Sallisaw', 'Sand Springs', 'Sapulpa',
    'Seminole', 'Shawnee', 'Stillwater', 'Tahlequah', 'The Village',
    'Tulsa', 'Vinita', 'Wewoka', 'Woodward'
  ],

  OR: [
    'Albany', 'Ashland', 'Astoria', 'Baker City', 'Beaverton', 'Bend',
    'Brookings', 'Burns', 'Coos Bay', 'Corvallis', 'Eugene',
    'Grants Pass', 'Hillsboro', 'Hood River', 'Jacksonville', 'John Day',
    'Klamath Falls', 'La Grande', 'Lake Oswego', 'Lakeview',
    'McMinnville', 'Medford', 'Newberg', 'Newport', 'Ontario',
    'Oregon City', 'Pendleton', 'Port Orford', 'Portland', 'Prineville',
    'Redmond', 'Reedsport', 'Roseburg', 'Salem', 'Seaside', 'Springfield',
    'The Dalles', 'Tillamook'
  ],

  PA: [
    'Abington', 'Aliquippa', 'Allentown', 'Altoona', 'Ambridge', 'Bedford',
    'Bethlehem', 'Bloomsburg', 'Bradford', 'Bristol', 'Carbondale',
    'Carlisle', 'Chambersburg', 'Chester', 'Columbia', 'Easton', 'Erie',
    'Franklin', 'Germantown', 'Gettysburg', 'Greensburg', 'Hanover',
    'Harmony', 'Harrisburg', 'Hazleton', 'Hershey', 'Homestead',
    'Honesdale', 'Indiana', 'Jeannette', 'Jim Thorpe', 'Johnstown',
    'Lancaster', 'Lebanon', 'Levittown', 'Lewistown', 'Lock Haven',
    'Lower Southampton', 'McKeesport', 'Meadville', 'Middletown',
    'Monroeville', 'Nanticoke', 'New Castle', 'New Hope',
    'New Kensington', 'Norristown', 'Oil City', 'Philadelphia',
    'Phoenixville', 'Pittsburgh', 'Pottstown', 'Pottsville', 'Reading',
    'Scranton', 'Shamokin', 'Sharon', 'State College', 'Stroudsburg',
    'Sunbury', 'Swarthmore', 'Tamaqua', 'Titusville', 'Uniontown',
    'Warren', 'Washington', 'West Chester', 'Wilkes-Barre',
    'Williamsport', 'York'
  ],

  RI: [
    'Barrington', 'Bristol', 'Central Falls', 'Cranston', 'East Greenwich',
    'East Providence', 'Kingston', 'Middletown', 'Narragansett',
    'Newport', 'North Kingstown', 'Pawtucket', 'Portsmouth', 'Providence',
    'South Kingstown', 'Tiverton', 'Warren', 'Warwick', 'Westerly',
    'Wickford', 'Woonsocket'
  ],

  SC: [
    'Abbeville', 'Aiken', 'Anderson', 'Beaufort', 'Camden', 'Charleston',
    'Columbia', 'Darlington', 'Florence', 'Gaffney', 'Georgetown',
    'Greenville', 'Greenwood', 'Hartsville', 'Lancaster', 'Mount Pleasant',
    'Myrtle Beach', 'Orangeburg', 'Rock Hill', 'Spartanburg', 'Sumter',
    'Union'
  ],

  SD: [
    'Aberdeen', 'Belle Fourche', 'Brookings', 'Canton', 'Custer',
    'De Smet', 'Deadwood', 'Hot Springs', 'Huron', 'Lead', 'Madison',
    'Milbank', 'Mitchell', 'Mobridge', 'Pierre', 'Rapid City',
    'Sioux Falls', 'Spearfish', 'Sturgis', 'Vermillion', 'Watertown',
    'Yankton'
  ],

  TN: [
    'Alcoa', 'Athens', 'Chattanooga', 'Clarksville', 'Cleveland',
    'Columbia', 'Cookeville', 'Dayton', 'Elizabethton', 'Franklin',
    'Gallatin', 'Gatlinburg', 'Greeneville', 'Jackson', 'Johnson City',
    'Jonesborough', 'Kingsport', 'Knoxville', 'Lebanon', 'Maryville',
    'Memphis', 'Morristown', 'Murfreesboro', 'Nashville', 'Norris',
    'Oak Ridge', 'Shelbyville', 'Tullahoma'
  ],

  TX: [
    'Abilene', 'Alpine', 'Amarillo', 'Arlington', 'Austin', 'Baytown',
    'Beaumont', 'Big Spring', 'Borger', 'Brownsville', 'Bryan', 'Canyon',
    'Cleburne', 'College Station', 'Corpus Christi', 'Crystal City',
    'Dallas', 'Del Rio', 'Denison', 'Denton', 'Eagle Pass', 'Edinburg',
    'El Paso', 'Fort Worth', 'Freeport', 'Galveston', 'Garland',
    'Goliad', 'Greenville', 'Harlingen', 'Houston', 'Huntsville',
    'Irving', 'Johnson City', 'Kilgore', 'Killeen', 'Kingsville',
    'Laredo', 'Longview', 'Lubbock', 'Lufkin', 'Marshall', 'McAllen',
    'McKinney', 'Mesquite', 'Midland', 'Mission', 'Nacogdoches',
    'New Braunfels', 'Odessa', 'Orange', 'Pampa', 'Paris', 'Pasadena',
    'Pecos', 'Pharr', 'Plainview', 'Plano', 'Port Arthur', 'Port Lavaca',
    'Richardson', 'San Angelo', 'San Antonio', 'San Felipe', 'San Marcos',
    'Sherman', 'Sweetwater', 'Temple', 'Texarkana', 'Texas City', 'Tyler',
    'Uvalde', 'Victoria', 'Waco', 'Weatherford', 'Wichita Falls', 'Ysleta'
  ],

  UT: [
    'Alta', 'American Fork', 'Bountiful', 'Brigham City', 'Cedar City',
    'Clearfield', 'Delta', 'Fillmore', 'Green River', 'Heber City',
    'Kanab', 'Layton', 'Lehi', 'Logan', 'Manti', 'Moab', 'Monticello',
    'Murray', 'Nephi', 'Ogden', 'Orderville', 'Orem', 'Panguitch',
    'Park City', 'Payson', 'Price', 'Provo', 'Saint George',
    'Salt Lake City', 'Spanish Fork', 'Springville', 'Tooele', 'Vernal'
  ],

  VT: [
    'Barre', 'Bellows Falls', 'Bennington', 'Brattleboro', 'Burlington',
    'Essex', 'Manchester', 'Middlebury', 'Montpelier', 'Newport',
    'Plymouth', 'Rutland', 'Saint Albans', 'Saint Johnsbury', 'Sharon',
    'Winooski'
  ],

  VA: [
    'Abingdon', 'Alexandria', 'Bristol', 'Charlottesville', 'Chesapeake',
    'Danville', 'Fairfax', 'Falls Church', 'Fredericksburg', 'Hampton',
    'Hanover', 'Hopewell', 'Lexington', 'Lynchburg', 'Manassas',
    'Martinsville', 'New Market', 'Newport News', 'Norfolk', 'Petersburg',
    'Portsmouth', 'Reston', 'Richmond', 'Roanoke', 'Staunton', 'Suffolk',
    'Virginia Beach', 'Waynesboro', 'Williamsburg', 'Winchester'
  ],

  WA: [
    'Aberdeen', 'Anacortes', 'Auburn', 'Bellevue', 'Bellingham',
    'Bremerton', 'Centralia', 'Coulee Dam', 'Coupeville', 'Ellensburg',
    'Ephrata', 'Everett', 'Hoquiam', 'Kelso', 'Kennewick', 'Longview',
    'Moses Lake', 'Oak Harbor', 'Olympia', 'Pasco', 'Point Roberts',
    'Port Angeles', 'Pullman', 'Puyallup', 'Redmond', 'Renton',
    'Richland', 'Seattle', 'Spokane', 'Tacoma', 'Vancouver',
    'Walla Walla', 'Wenatchee', 'Yakima'
  ],

  WV: [
    'Bath', 'Beckley', 'Bluefield', 'Buckhannon', 'Charles Town',
    'Charleston', 'Clarksburg', 'Elkins', 'Fairmont', 'Grafton',
    'Harpers Ferry', 'Hillsboro', 'Hinton', 'Huntington', 'Keyser',
    'Lewisburg', 'Logan', 'Martinsburg', 'Morgantown', 'Moundsville',
    'New Martinsville', 'Parkersburg', 'Philippi', 'Point Pleasant',
    'Princeton', 'Romney', 'Shepherdstown', 'South Charleston',
    'Summersville', 'Weirton', 'Welch', 'Wellsburg', 'Weston',
    'Wheeling', 'White Sulphur Springs', 'Williamson'
  ],

  WI: [
    'Appleton', 'Ashland', 'Baraboo', 'Belmont', 'Beloit', 'Eau Claire',
    'Fond du Lac', 'Green Bay', 'Hayward', 'Janesville', 'Kenosha',
    'La Crosse', 'Lake Geneva', 'Madison', 'Manitowoc', 'Marinette',
    'Menasha', 'Milwaukee', 'Neenah', 'New Glarus', 'Oconto', 'Oshkosh',
    'Peshtigo', 'Portage', 'Prairie du Chien', 'Racine', 'Rhinelander',
    'Ripon', 'Sheboygan', 'Spring Green', 'Stevens Point', 'Sturgeon Bay',
    'Superior', 'Waukesha', 'Wausau', 'Wauwatosa', 'West Allis',
    'West Bend', 'Wisconsin Dells'
  ],

  WY: [
    'Buffalo', 'Casper', 'Cheyenne', 'Cody', 'Douglas', 'Evanston',
    'Gillette', 'Green River', 'Jackson', 'Lander', 'Laramie',
    'Newcastle', 'Powell', 'Rawlins', 'Riverton', 'Rock Springs',
    'Sheridan', 'Ten Sleep', 'Thermopolis', 'Torrington', 'Worland'
  ],

  DC: [
    'Washington'
  ]
};

// export const cityData = [
//   // Alabama
//   { state: 'AL', name: 'Birmingham' },
//   { state: 'AL', name: 'Montgomery' },
//   { state: 'AL', name: 'Mobile' },
//   { state: 'AL', name: 'Huntsville' },
  
//   // Alaska
//   { state: 'AK', name: 'Anchorage' },
//   { state: 'AK', name: 'Fairbanks' },
//   { state: 'AK', name: 'Juneau' },
  
//   // Arizona
//   { state: 'AZ', name: 'Phoenix' },
//   { state: 'AZ', name: 'Tucson' },
//   { state: 'AZ', name: 'Mesa' },
//   { state: 'AZ', name: 'Scottsdale' },
  
//   // Arkansas
//   { state: 'AR', name: 'Little Rock' },
//   { state: 'AR', name: 'Fayetteville' },
//   { state: 'AR', name: 'Fort Smith' },
  
//   // California
//   { state: 'CA', name: 'Los Angeles' },
//   { state: 'CA', name: 'San Francisco' },
//   { state: 'CA', name: 'San Diego' },
//   { state: 'CA', name: 'Sacramento' },
//   { state: 'CA', name: 'San Jose' },
  
//   // Colorado
//   { state: 'CO', name: 'Denver' },
//   { state: 'CO', name: 'Colorado Springs' },
//   { state: 'CO', name: 'Boulder' },
//   { state: 'CO', name: 'Fort Collins' },
  
//   // Connecticut
//   { state: 'CT', name: 'Hartford' },
//   { state: 'CT', name: 'New Haven' },
//   { state: 'CT', name: 'Stamford' },
  
//   // Delaware
//   { state: 'DE', name: 'Wilmington' },
//   { state: 'DE', name: 'Dover' },
  
//   // Florida
//   { state: 'FL', name: 'Miami' },
//   { state: 'FL', name: 'Orlando' },
//   { state: 'FL', name: 'Tampa' },
//   { state: 'FL', name: 'Jacksonville' },
//   { state: 'FL', name: 'Naples' },
//   { state: 'FL', name: 'Fort Myers' },
//   { state: 'FL', name: 'Sarasota' },
  
//   // Georgia
//   { state: 'GA', name: 'Atlanta' },
//   { state: 'GA', name: 'Savannah' },
//   { state: 'GA', name: 'Augusta' },
  
//   // Hawaii
//   { state: 'HI', name: 'Honolulu' },
//   { state: 'HI', name: 'Hilo' },
//   { state: 'HI', name: 'Kailua' },
  
//   // Idaho
//   { state: 'ID', name: 'Boise' },
//   { state: 'ID', name: 'Idaho Falls' },
  
//   // Illinois
//   { state: 'IL', name: 'Chicago' },
//   { state: 'IL', name: 'Springfield' },
//   { state: 'IL', name: 'Rockford' },
  
//   // Indiana
//   { state: 'IN', name: 'Indianapolis' },
//   { state: 'IN', name: 'Fort Wayne' },
  
//   // Iowa
//   { state: 'IA', name: 'Des Moines' },
//   { state: 'IA', name: 'Cedar Rapids' },
  
//   // Kansas
//   { state: 'KS', name: 'Wichita' },
//   { state: 'KS', name: 'Kansas City' },
  
//   // Kentucky
//   { state: 'KY', name: 'Louisville' },
//   { state: 'KY', name: 'Lexington' },
  
//   // Louisiana
//   { state: 'LA', name: 'New Orleans' },
//   { state: 'LA', name: 'Baton Rouge' },
  
//   // Maine
//   { state: 'ME', name: 'Portland' },
//   { state: 'ME', name: 'Augusta' },
  
//   // Maryland
//   { state: 'MD', name: 'Baltimore' },
//   { state: 'MD', name: 'Annapolis' },
  
//   // Massachusetts
//   { state: 'MA', name: 'Boston' },
//   { state: 'MA', name: 'Cambridge' },
//   { state: 'MA', name: 'Springfield' },
  
//   // Michigan
//   { state: 'MI', name: 'Detroit' },
//   { state: 'MI', name: 'Grand Rapids' },
//   { state: 'MI', name: 'Ann Arbor' },
  
//   // Minnesota
//   { state: 'MN', name: 'Minneapolis' },
//   { state: 'MN', name: 'Saint Paul' },
//   { state: 'MN', name: 'Rochester' },
  
//   // Mississippi
//   { state: 'MS', name: 'Jackson' },
//   { state: 'MS', name: 'Gulfport' },
  
//   // Missouri
//   { state: 'MO', name: 'Kansas City' },
//   { state: 'MO', name: 'St. Louis' },
//   { state: 'MO', name: 'Springfield' },
  
//   // Montana
//   { state: 'MT', name: 'Billings' },
//   { state: 'MT', name: 'Missoula' },
  
//   // Nebraska
//   { state: 'NE', name: 'Omaha' },
//   { state: 'NE', name: 'Lincoln' },
  
//   // Nevada
//   { state: 'NV', name: 'Las Vegas' },
//   { state: 'NV', name: 'Reno' },
  
//   // New Hampshire
//   { state: 'NH', name: 'Manchester' },
//   { state: 'NH', name: 'Concord' },
  
//   // New Jersey
//   { state: 'NJ', name: 'Newark' },
//   { state: 'NJ', name: 'Jersey City' },
//   { state: 'NJ', name: 'Princeton' },
  
//   // New Mexico
//   { state: 'NM', name: 'Albuquerque' },
//   { state: 'NM', name: 'Santa Fe' },
  
//   // New York
//   { state: 'NY', name: 'New York City' },
//   { state: 'NY', name: 'Buffalo' },
//   { state: 'NY', name: 'Rochester' },
//   { state: 'NY', name: 'Albany' },
  
//   // North Carolina
//   { state: 'NC', name: 'Charlotte' },
//   { state: 'NC', name: 'Raleigh' },
//   { state: 'NC', name: 'Durham' },
//   { state: 'NC', name: 'Asheville' },
  
//   // North Dakota
//   { state: 'ND', name: 'Fargo' },
//   { state: 'ND', name: 'Bismarck' },
  
//   // Ohio
//   { state: 'OH', name: 'Columbus' },
//   { state: 'OH', name: 'Cleveland' },
//   { state: 'OH', name: 'Cincinnati' },
  
//   // Oklahoma
//   { state: 'OK', name: 'Oklahoma City' },
//   { state: 'OK', name: 'Tulsa' },
  
//   // Oregon
//   { state: 'OR', name: 'Portland' },
//   { state: 'OR', name: 'Eugene' },
//   { state: 'OR', name: 'Salem' },
  
//   // Pennsylvania
//   { state: 'PA', name: 'Philadelphia' },
//   { state: 'PA', name: 'Pittsburgh' },
//   { state: 'PA', name: 'Harrisburg' },
  
//   // Rhode Island
//   { state: 'RI', name: 'Providence' },
//   { state: 'RI', name: 'Newport' },
  
//   // South Carolina
//   { state: 'SC', name: 'Charleston' },
//   { state: 'SC', name: 'Columbia' },
//   { state: 'SC', name: 'Greenville' },
  
//   // South Dakota
//   { state: 'SD', name: 'Sioux Falls' },
//   { state: 'SD', name: 'Rapid City' },
  
//   // Tennessee
//   { state: 'TN', name: 'Nashville' },
//   { state: 'TN', name: 'Memphis' },
//   { state: 'TN', name: 'Knoxville' },
  
//   // Texas
//   { state: 'TX', name: 'Houston' },
//   { state: 'TX', name: 'Dallas' },
//   { state: 'TX', name: 'Austin' },
//   { state: 'TX', name: 'San Antonio' },
  
//   // Utah
//   { state: 'UT', name: 'Salt Lake City' },
//   { state: 'UT', name: 'Provo' },
  
//   // Vermont
//   { state: 'VT', name: 'Burlington' },
//   { state: 'VT', name: 'Montpelier' },
  
//   // Virginia
//   { state: 'VA', name: 'Richmond' },
//   { state: 'VA', name: 'Virginia Beach' },
//   { state: 'VA', name: 'Arlington' },
  
//   // Washington
//   { state: 'WA', name: 'Seattle' },
//   { state: 'WA', name: 'Spokane' },
//   { state: 'WA', name: 'Tacoma' },
  
//   // West Virginia
//   { state: 'WV', name: 'Charleston' },
//   { state: 'WV', name: 'Huntington' },
  
//   // Wisconsin
//   { state: 'WI', name: 'Milwaukee' },
//   { state: 'WI', name: 'Madison' },
  
//   // Wyoming
//   { state: 'WY', name: 'Cheyenne' },
//   { state: 'WY', name: 'Casper' },
  
//   // District of Columbia
//   { state: 'DC', name: 'Washington' }
// ];