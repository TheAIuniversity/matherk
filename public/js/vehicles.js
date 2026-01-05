// MATHERK - Voertuigen Database
// Russisch Militair Materieel

const VEHICLES = {
  // === T-SERIE TANKS ===
  't72b3': {
    id: 't72b3',
    name: 'T-72B3',
    fullName: 'T-72B3 Model 2016',
    type: 'MBT',
    category: 'T-Serie',
    description: 'Gemoderniseerde T-72, meest voorkomende Russische tank in Oekraïne conflict',
    crew: 3,
    weight: '46 ton',
    armament: '125mm 2A46M-5 kanon, 12.7mm NSV, 7.62mm PKT',
    armor: 'Composiet + Kontakt-5 ERA',
    weakPoints: [
      { id: 'carousel', name: 'Carousel Autoloader', x: 50, y: 75, radius: 12, points: 15, critical: true, description: 'Ammo carrousel onder koepel - catastrophale explosie bij treffer' },
      { id: 'turret_ring', name: 'Koepelring', x: 50, y: 45, radius: 8, points: 12, critical: true, description: 'Verbinding koepel-romp, vaak ERA-vrij' },
      { id: 'driver_hatch', name: 'Bestuurderluik', x: 35, y: 35, radius: 6, points: 10, critical: false, description: 'Zwakke plek in frontpantser' },
      { id: 'engine', name: 'Motor (achterzijde)', x: 50, y: 90, radius: 15, points: 10, critical: false, description: 'V-92S2F motor, minder gepantserd' },
      { id: 'tracks', name: 'Rupsbanden', x: 15, y: 70, radius: 10, points: 5, critical: false, description: 'Immobiliseert voertuig' }
    ],
    images: {
      main: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/T-72B3_-_TankBiathlon2013-01.jpg/1280px-T-72B3_-_TankBiathlon2013-01.jpg',
      terrain: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/T-72B3_tank_in_Patriot_Park.jpg/1280px-T-72B3_tank_in_Patriot_Park.jpg',
      silhouette: 'silhouettes/t72.svg'
    },
    recognition: {
      features: ['ERA-blokken op koepel', 'Lange 125mm loop', 'Infrarood schijnwerper rechts van kanon', 'V-vormige ERA op glacis'],
      confusedWith: ['T-90M', 'T-80BVM'],
      distinctiveMarks: 'Kontakt-5 ERA blokken in kenmerkend patroon, geen Arena APS'
    }
  },

  't80bvm': {
    id: 't80bvm',
    name: 'T-80BVM',
    fullName: 'T-80BVM',
    type: 'MBT',
    category: 'T-Serie',
    description: 'Gemoderniseerde gasturbine tank, snelste Russische MBT',
    crew: 3,
    weight: '46 ton',
    armament: '125mm 2A46M-4 kanon, 12.7mm Kord, 7.62mm PKT',
    armor: 'Composiet + Relikt ERA',
    weakPoints: [
      { id: 'carousel', name: 'Carousel Autoloader', x: 50, y: 75, radius: 12, points: 15, critical: true, description: 'Ammo opslag onder koepelvloer - jack-in-the-box effect' },
      { id: 'turret_top', name: 'Koepeldak', x: 50, y: 35, radius: 10, points: 12, critical: true, description: 'Dunne bovenpantsering, kwetsbaar voor top-attack' },
      { id: 'turbine_intake', name: 'Turbine Inlaat', x: 65, y: 85, radius: 8, points: 10, critical: false, description: 'Gasturbine luchtinlaat aan achterzijde' },
      { id: 'side_hull', name: 'Zijpantser romp', x: 85, y: 60, radius: 12, points: 8, critical: false, description: 'Dunner zijpantser achter ERA' },
      { id: 'fuel_tanks', name: 'Externe brandstoftanks', x: 90, y: 75, radius: 8, points: 8, critical: false, description: 'Vaak externe tanks gemonteerd' }
    ],
    images: {
      main: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/T-80BVM_-_Engineering_Technologies_2012_%2810%29.jpg/1280px-T-80BVM_-_Engineering_Technologies_2012_%2810%29.jpg',
      terrain: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/T-80BV_tank.jpg/1280px-T-80BV_tank.jpg',
      silhouette: 'silhouettes/t80.svg'
    },
    recognition: {
      features: ['Relikt ERA (grotere blokken)', 'Gasturbine uitlaat achterzijde', 'Hogere koepel dan T-72', 'Thermische sights'],
      confusedWith: ['T-72B3', 'T-90M'],
      distinctiveMarks: 'Kenmerkende turbine-uitlaat, grotere ERA-blokken, iets hogere silhouet'
    }
  },

  't90m': {
    id: 't90m',
    name: 'T-90M',
    fullName: 'T-90M "Proryv-3"',
    type: 'MBT',
    category: 'T-Serie',
    description: 'Modernste operationele Russische tank, verbeterde bescherming en vuurleiding',
    crew: 3,
    weight: '48 ton',
    armament: '125mm 2A46M-5 kanon, 12.7mm Kord RWS, 7.62mm PKT',
    armor: 'Composiet + Relikt ERA + Soft-kill APS',
    weakPoints: [
      { id: 'carousel', name: 'Carousel Autoloader', x: 50, y: 75, radius: 12, points: 15, critical: true, description: 'Nog steeds carousel systeem - kritieke kwetsbaarheid' },
      { id: 'turret_rear', name: 'Koepel achterzijde', x: 50, y: 55, radius: 10, points: 12, critical: true, description: 'Bustle zonder ERA, bevat elektronica' },
      { id: 'rws', name: 'RWS Station', x: 60, y: 25, radius: 6, points: 8, critical: false, description: 'Remote Weapon Station, uitgeschakeld = geen secundair vuur' },
      { id: 'optics', name: 'Optiek/Sensors', x: 40, y: 30, radius: 5, points: 10, critical: false, description: 'Sosna-U sight systeem' },
      { id: 'engine_deck', name: 'Motordek', x: 50, y: 88, radius: 12, points: 8, critical: false, description: 'V-92S2F motor compartiment' }
    ],
    images: {
      main: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/T-90M_main_battle_tank_%28cropped%29.jpg/1280px-T-90M_main_battle_tank_%28cropped%29.jpg',
      terrain: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Army2022-405.jpg/1280px-Army2022-405.jpg',
      silhouette: 'silhouettes/t90.svg'
    },
    recognition: {
      features: ['Nieuwe gelaste koepel', 'Kord RWS bovenop', 'Relikt ERA in nieuw patroon', 'Shtora dazzlers (ronde lampen)'],
      confusedWith: ['T-72B3', 'T-80BVM'],
      distinctiveMarks: 'Herkenbaar aan RWS station, nieuwe koepelvorm, Shtora systeem zichtbaar'
    }
  },

  // === BMP SERIE ===
  'bmp1': {
    id: 'bmp1',
    name: 'BMP-1',
    fullName: 'BMP-1',
    type: 'IFV',
    category: 'BMP-Serie',
    description: 'Eerste generatie Russische IFV, nog steeds in gebruik bij reserve-eenheden',
    crew: 3,
    passengers: 8,
    weight: '13.5 ton',
    armament: '73mm 2A28 Grom kanon, AT-3 Sagger ATGM, 7.62mm PKT',
    armor: 'Staal 7-33mm',
    weakPoints: [
      { id: 'fuel_doors', name: 'Brandstoftanks (achterdeuren)', x: 50, y: 92, radius: 15, points: 15, critical: true, description: 'Brandstoftanks geïntegreerd in achterdeuren - extreem kwetsbaar' },
      { id: 'hull_top', name: 'Dakpantser', x: 50, y: 40, radius: 18, points: 12, critical: true, description: 'Zeer dun bovenpantser, granaten effectief' },
      { id: 'side_hull', name: 'Zijpantser', x: 90, y: 55, radius: 15, points: 10, critical: false, description: '14mm zijpantser - .50 cal kan penetreren' },
      { id: 'turret', name: 'Kleine koepel', x: 40, y: 35, radius: 10, points: 10, critical: false, description: 'Eenmanskoepel, commandant kwetsbaar' },
      { id: 'tracks', name: 'Rupsbanden', x: 15, y: 70, radius: 10, points: 5, critical: false, description: 'Immobilisatie' }
    ],
    images: {
      main: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/BMP-1_AP.JPG/1280px-BMP-1_AP.JPG',
      terrain: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/BMP-1_militaryphotos.net.jpg/1280px-BMP-1_militaryphotos.net.jpg',
      silhouette: 'silhouettes/bmp1.svg'
    },
    recognition: {
      features: ['Kleine eenmanskoepel', 'Korte 73mm loop', 'Sagger lanceerder boven kanon', 'Lage silhouet'],
      confusedWith: ['BMP-2', 'BMD-1'],
      distinctiveMarks: 'Korte dikke 73mm loop, ATGM rail boven kanon, geen autocannon'
    }
  },

  'bmp2': {
    id: 'bmp2',
    name: 'BMP-2',
    fullName: 'BMP-2',
    type: 'IFV',
    category: 'BMP-Serie',
    description: 'Werkpaard van de Russische gemechaniseerde infanterie, verbeterde vuurkracht',
    crew: 3,
    passengers: 7,
    weight: '14.3 ton',
    armament: '30mm 2A42 autocannon, AT-5 Konkurs ATGM, 7.62mm PKT',
    armor: 'Staal/Aluminium 7-33mm',
    weakPoints: [
      { id: 'fuel_doors', name: 'Brandstoftanks (achterdeuren)', x: 50, y: 92, radius: 15, points: 15, critical: true, description: 'Brandstof in achterdeuren - ontwerpfout, vaak fataal' },
      { id: 'turret_bustle', name: 'Koepel achterzijde', x: 55, y: 45, radius: 10, points: 12, critical: true, description: 'Munitie opslag voor 30mm' },
      { id: 'hull_top', name: 'Bovenpantser', x: 50, y: 50, radius: 15, points: 10, critical: false, description: 'Kwetsbaar voor luchtaanvallen en granaten' },
      { id: 'atgm', name: 'ATGM Lanceerder', x: 65, y: 25, radius: 6, points: 8, critical: false, description: 'Konkurs lanceerder - uitschakeling vermindert AT-capaciteit' },
      { id: 'side_armor', name: 'Zijpantser', x: 90, y: 55, radius: 12, points: 8, critical: false, description: 'HMG kan penetreren op korte afstand' }
    ],
    images: {
      main: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/BMP-2_military_-_infantry_combat_vehicles.jpg/1280px-BMP-2_military_-_infantry_combat_vehicles.jpg',
      terrain: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/BMP-2_in_Sevastopol.jpg/1280px-BMP-2_in_Sevastopol.jpg',
      silhouette: 'silhouettes/bmp2.svg'
    },
    recognition: {
      features: ['Tweemans koepel', 'Lange 30mm loop', 'ATGM lanceerder op koepel', 'Hogere koepel dan BMP-1'],
      confusedWith: ['BMP-1', 'BMP-3', 'BMD-2'],
      distinctiveMarks: 'Karakteristieke 30mm autocannon, ATGM aan rechterzijde koepel'
    }
  },

  'bmp3': {
    id: 'bmp3',
    name: 'BMP-3',
    fullName: 'BMP-3',
    type: 'IFV',
    category: 'BMP-Serie',
    description: 'Zwaarst bewapende IFV ter wereld, uniek dual-gun systeem',
    crew: 3,
    passengers: 7,
    weight: '18.7 ton',
    armament: '100mm 2A70 kanon/launcher, 30mm 2A72, 7.62mm PKT x3',
    armor: 'Aluminium composiet',
    weakPoints: [
      { id: 'hull_sides', name: 'Aluminium romp', x: 85, y: 55, radius: 15, points: 12, critical: true, description: 'Aluminium pantser - brandgevaar bij penetratie' },
      { id: 'turret', name: 'Grote koepel', x: 50, y: 35, radius: 12, points: 12, critical: true, description: 'Grote koepel met veel munitie' },
      { id: 'engine_front', name: 'Motor (voorin)', x: 50, y: 15, radius: 12, points: 10, critical: false, description: 'Unieke voormotor configuratie' },
      { id: 'rear_doors', name: 'Achterdeuren', x: 50, y: 92, radius: 12, points: 10, critical: false, description: 'Uitstapruimte - dunner gepantserd' },
      { id: 'optics', name: 'Vuurleiding optiek', x: 40, y: 28, radius: 6, points: 8, critical: false, description: 'Sophisticated targeting, dure vervanging' }
    ],
    images: {
      main: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/BMP-3_-_VTTV-Omsk-2009_%281%29.jpg/1280px-BMP-3_-_VTTV-Omsk-2009_%281%29.jpg',
      terrain: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/4mayrehalirbm17.jpg/1280px-4mayrehalirbm17.jpg',
      silhouette: 'silhouettes/bmp3.svg'
    },
    recognition: {
      features: ['Twee lopen (100mm + 30mm coaxiaal)', 'Grote afgeplatte koepel', 'Wave breaker op neus', 'Zwaarder dan andere BMPs'],
      confusedWith: ['BMP-2', 'BMD-4'],
      distinctiveMarks: 'Unieke dual-gun configuratie, 100mm loop duidelijk groter, wave breaker voorzijde'
    }
  },

  // === BMD SERIE ===
  'bmd2': {
    id: 'bmd2',
    name: 'BMD-2',
    fullName: 'BMD-2',
    type: 'Airborne IFV',
    category: 'BMD-Serie',
    description: 'Luchtlandingsvoertuig voor VDV, extreem licht gepantserd',
    crew: 3,
    passengers: 4,
    weight: '8 ton',
    armament: '30mm 2A42 autocannon, AT-5 Konkurs ATGM, 7.62mm PKT',
    armor: 'Aluminium 10-15mm',
    weakPoints: [
      { id: 'hull_anywhere', name: 'Romp (overal)', x: 50, y: 55, radius: 25, points: 15, critical: true, description: 'Aluminium romp - HMG penetreert overal' },
      { id: 'turret', name: 'BMP-2 koepel', x: 45, y: 35, radius: 10, points: 12, critical: true, description: 'Zelfde koepel als BMP-2, maar op lichtere romp' },
      { id: 'suspension', name: 'Hydropneumatisch', x: 20, y: 75, radius: 10, points: 8, critical: false, description: 'Complex ophangingssysteem, gevoelig voor schade' },
      { id: 'rear', name: 'Achterzijde', x: 50, y: 90, radius: 12, points: 8, critical: false, description: 'Motor en uitstapluiken' },
      { id: 'optics', name: 'Optieken', x: 55, y: 28, radius: 5, points: 6, critical: false, description: 'Eenvoudige sights' }
    ],
    images: {
      main: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/2008_Moscow_Victory_Day_Parade_-_BMD-2.jpg/1280px-2008_Moscow_Victory_Day_Parade_-_BMD-2.jpg',
      terrain: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/BMD-2_at_IDELF-2008.jpg/1280px-BMD-2_at_IDELF-2008.jpg',
      silhouette: 'silhouettes/bmd2.svg'
    },
    recognition: {
      features: ['Zeer lage silhouet', 'BMP-2 koepel op kleine romp', 'Instelbare bodemvrijheid', '5 road wheels'],
      confusedWith: ['BMP-2', 'BMD-4', 'BMD-1'],
      distinctiveMarks: 'Veel kleiner dan BMP-2, karakteristieke lage stand, 5 loopwielen'
    }
  },

  'bmd4m': {
    id: 'bmd4m',
    name: 'BMD-4M',
    fullName: 'BMD-4M "Sadovnitsa"',
    type: 'Airborne IFV',
    category: 'BMD-Serie',
    description: 'Modernste VDV voertuig, zwaarste bewapening in klasse',
    crew: 3,
    passengers: 5,
    weight: '13.5 ton',
    armament: '100mm 2A70 + 30mm 2A72 (BMP-3 bewapening), 7.62mm PKT',
    armor: 'Aluminium composiet 10-25mm',
    weakPoints: [
      { id: 'thin_armor', name: 'Dunne romp', x: 80, y: 55, radius: 18, points: 15, critical: true, description: 'Nog steeds aluminium - gewichtslimiet voor paradrop' },
      { id: 'bakhcha_turret', name: 'Bakhcha-U koepel', x: 50, y: 35, radius: 12, points: 12, critical: true, description: 'BMP-3 koepel met veel munitie' },
      { id: 'engine_rear', name: 'UTD-29 Motor', x: 50, y: 88, radius: 12, points: 10, critical: false, description: 'Achterin geplaatste motor' },
      { id: 'tracks', name: 'Rupsband systeem', x: 15, y: 70, radius: 8, points: 6, critical: false, description: 'Immobilisatie effectief' },
      { id: 'commander_sight', name: 'Commandant sight', x: 35, y: 25, radius: 5, points: 8, critical: false, description: 'Verlies van situational awareness' }
    ],
    images: {
      main: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/BMD-4M_-_ARMY-2016.jpg/1280px-BMD-4M_-_ARMY-2016.jpg',
      terrain: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMD-4M_%28-_3%29.jpg/1280px-BMD-4M_%28-_3%29.jpg',
      silhouette: 'silhouettes/bmd4.svg'
    },
    recognition: {
      features: ['BMP-3 koepel (100mm+30mm)', 'Lage romp', '6 road wheels', 'Groter dan BMD-2'],
      confusedWith: ['BMP-3', 'BMD-2'],
      distinctiveMarks: 'BMP-3 bewapening op compacte romp, 6 loopwielen, lagere silhouet dan BMP-3'
    }
  }
};

// Vraag types voor quiz
const QUESTION_TYPES = {
  IDENTIFICATION: 'identification',
  ENGAGEMENT: 'engagement',
  RECOGNITION: 'recognition'
};

// Moeilijkheidsgraden
const DIFFICULTY = {
  EASY: { timeLimit: 30000, imageType: 'main', pointMultiplier: 1.0 },
  MEDIUM: { timeLimit: 20000, imageType: 'terrain', pointMultiplier: 1.5 },
  HARD: { timeLimit: 15000, imageType: 'silhouette', pointMultiplier: 2.0 }
};

// Puntensysteem
const SCORING = {
  CORRECT_ID: 10,
  CORRECT_ENGAGEMENT: 15,
  SPEED_BONUS_THRESHOLD: 5000, // ms
  SPEED_BONUS: 5,
  WRONG_ID: -5,
  WRONG_ENGAGEMENT: -3,
  CRITICAL_HIT_BONUS: 5
};

// Export voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VEHICLES, QUESTION_TYPES, DIFFICULTY, SCORING };
}
