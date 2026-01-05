// MATHERK - Vehicle Database
// Russian Military Equipment

const VEHICLES = [
  {
    id: 't72b3',
    name: 'T-72B3',
    type: 'MBT',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/85/T-72B3_-_TankBiathlon2013-01.jpg'
  },
  {
    id: 't80bvm',
    name: 'T-80BVM',
    type: 'MBT',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/T-80BVM_-_Engineering_Technologies_2012_%2810%29.jpg'
  },
  {
    id: 't90m',
    name: 'T-90M',
    type: 'MBT',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/T-90M_main_battle_tank_%28cropped%29.jpg'
  },
  {
    id: 'bmp1',
    name: 'BMP-1',
    type: 'IFV',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/BMP-1_AP.JPG'
  },
  {
    id: 'bmp2',
    name: 'BMP-2',
    type: 'IFV',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/90/BMP-2_military_-_infantry_combat_vehicles.jpg'
  },
  {
    id: 'bmp3',
    name: 'BMP-3',
    type: 'IFV',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/BMP-3_-_VTTV-Omsk-2009_%281%29.jpg'
  },
  {
    id: 'bmd2',
    name: 'BMD-2',
    type: 'Airborne IFV',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/2008_Moscow_Victory_Day_Parade_-_BMD-2.jpg'
  },
  {
    id: 'bmd4m',
    name: 'BMD-4M',
    type: 'Airborne IFV',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/74/BMD-4M_-_ARMY-2016.jpg'
  }
];

const CONFIG = {
  questionsPerSession: 16,
  timePerQuestion: 20000, // 20 seconds
  points: {
    correct: 10,
    speedBonus: 5,
    speedThreshold: 5000, // 5 seconds
    wrong: -5
  }
};
