export type SpeciesCategory = 'plant' | 'animal' | 'insect' | 'bird' | 'fungi';
export type ConservationStatus = 'endangered' | 'vulnerable' | 'near-threatened' | 'least-concern';

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  category: SpeciesCategory;
  status: ConservationStatus;
  description: string;
  habitat: string;
  facts: { label: string; value: string }[];
  iconColor: string;
  sightings: number;
  distance?: string;
  location?: string;
  capturedAt?: string;
  mapPin?: { x: number; y: number };
}

export interface Challenge {
  id: string;
  title: string;
  progress: number;
  total: number;
  iconName: string;
  iconColor: string;
  bgColor: string;
}

export interface Badge {
  id: string;
  name: string;
  iconName: string;
  earned: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  isCurrentUser: boolean;
  avatar: string;
}

export const CURRENT_USER = {
  name: 'Zyad Serghini',
  username: 'zyad_nature',
  level: 7,
  xp: 750,
  xpMax: 1000,
  points: 1250,
  rank: 12,
  speciesCount: 47,
  title: 'Nature Explorer',
};

export const SPECIES_DATA: Species[] = [
  {
    id: '1',
    commonName: 'Atlas Cedar',
    scientificName: 'Cedrus atlantica',
    category: 'plant',
    status: 'endangered',
    description:
      'The Atlas cedar is a species of cedar native to the Atlas Mountains of Morocco and Algeria. It is an evergreen conifer that can reach heights of 30–40 metres and live for over 800 years. Classified as endangered due to habitat loss, climate change, and overexploitation for timber.',
    habitat: 'Atlas Mountains, 1400–2200 m altitude',
    facts: [
      { label: 'Kingdom', value: 'Plantae' },
      { label: 'Family', value: 'Pinaceae' },
      { label: 'Height', value: '30–40 m' },
      { label: 'Lifespan', value: '800+ years' },
    ],
    iconColor: '#2d8a4e',
    sightings: 23,
    distance: '0.5 km',
    location: 'Ifrane National Park',
    capturedAt: '2 hours ago',
    mapPin: { x: 120, y: 180 },
  },
  {
    id: '2',
    commonName: 'Barbary Macaque',
    scientificName: 'Macaca sylvanus',
    category: 'animal',
    status: 'endangered',
    description:
      'The Barbary macaque is the only macaque found outside Asia and is endemic to Morocco and Algeria. It is a highly social primate that lives in mixed-sex troops in cedar and oak forests. The species faces severe pressure from habitat loss and illegal wildlife trade.',
    habitat: 'Cedar and oak forests, 1200–2000 m',
    facts: [
      { label: 'Kingdom', value: 'Animalia' },
      { label: 'Family', value: 'Cercopithecidae' },
      { label: 'Weight', value: '10–15 kg' },
      { label: 'Lifespan', value: '20–25 years' },
    ],
    iconColor: '#a0522d',
    sightings: 14,
    distance: '1.2 km',
    location: 'Ifrane Forest',
    capturedAt: '1 day ago',
    mapPin: { x: 250, y: 280 },
  },
  {
    id: '3',
    commonName: 'Wild Iris',
    scientificName: 'Iris tingitana',
    category: 'plant',
    status: 'near-threatened',
    description:
      'The Tangier iris is a striking flowering plant endemic to northwest Morocco. Its vivid violet-blue blooms appear in early spring in rocky coastal scrubland. Populations are declining due to urbanisation and collection for horticultural trade.',
    habitat: 'Coastal scrubland, rocky slopes below 500 m',
    facts: [
      { label: 'Kingdom', value: 'Plantae' },
      { label: 'Family', value: 'Iridaceae' },
      { label: 'Height', value: '40–70 cm' },
      { label: 'Bloom', value: 'Feb–Apr' },
    ],
    iconColor: '#9b59b6',
    sightings: 8,
    distance: '2.0 km',
    location: 'Cape Spartel',
    capturedAt: '3 days ago',
    mapPin: { x: 180, y: 400 },
  },
  {
    id: '4',
    commonName: 'Striped Hawk-Moth',
    scientificName: 'Hyles livornica',
    category: 'insect',
    status: 'least-concern',
    description:
      'A powerful migratory hawk-moth found across North Africa and southern Europe. Its caterpillars feed on a wide variety of host plants. The adults are fast fliers capable of hovering in front of flowers to feed on nectar.',
    habitat: 'Open scrubland, gardens, agricultural edges',
    facts: [
      { label: 'Kingdom', value: 'Animalia' },
      { label: 'Family', value: 'Sphingidae' },
      { label: 'Wingspan', value: '60–80 mm' },
      { label: 'Flight', value: 'Mar–Nov' },
    ],
    iconColor: '#3498db',
    sightings: 31,
    distance: '0.3 km',
    location: 'Toubkal Foothills',
    capturedAt: '5 hours ago',
    mapPin: { x: 90, y: 350 },
  },
  {
    id: '5',
    commonName: 'White Stork',
    scientificName: 'Ciconia ciconia',
    category: 'bird',
    status: 'least-concern',
    description:
      'A large, elegant wading bird that migrates through Morocco in enormous numbers each spring and autumn. Pairs nest atop chimneys, pylons, and historic monuments and are considered a symbol of good luck in Moroccan culture.',
    habitat: 'Wetlands, farmland, open plains',
    facts: [
      { label: 'Kingdom', value: 'Animalia' },
      { label: 'Family', value: 'Ciconiidae' },
      { label: 'Wingspan', value: '155–215 cm' },
      { label: 'Weight', value: '2.3–4.4 kg' },
    ],
    iconColor: '#2c3e50',
    sightings: 47,
    distance: '0.8 km',
    location: 'Merja Zerga Lagoon',
    capturedAt: '4 hours ago',
    mapPin: { x: 280, y: 180 },
  },
  {
    id: '6',
    commonName: 'Argan Tree',
    scientificName: 'Argania spinosa',
    category: 'plant',
    status: 'vulnerable',
    description:
      'The argan tree is an iconic Moroccan endemic found almost exclusively in the Souss-Massa region. It forms a unique UNESCO-protected biosphere reserve. Its fruit yields argan oil, prized worldwide for culinary and cosmetic uses.',
    habitat: 'Semi-arid plains and dry scrub, 0–1600 m',
    facts: [
      { label: 'Kingdom', value: 'Plantae' },
      { label: 'Family', value: 'Sapotaceae' },
      { label: 'Height', value: '8–10 m' },
      { label: 'Lifespan', value: '200+ years' },
    ],
    iconColor: '#e67e22',
    sightings: 19,
    distance: '3.4 km',
    location: 'Souss-Massa Reserve',
    capturedAt: '2 days ago',
    mapPin: { x: 200, y: 240 },
  },
  {
    id: '7',
    commonName: 'Mouflon',
    scientificName: 'Ovis musimon',
    category: 'animal',
    status: 'least-concern',
    description:
      'The mouflon is considered the ancestor of domestic sheep and is one of the two original wild species of sheep. In Morocco it inhabits the rocky, forested slopes of the Atlas and Rif mountains. Males carry distinctive curved horns.',
    habitat: 'Rocky mountain slopes, 800–2500 m',
    facts: [
      { label: 'Kingdom', value: 'Animalia' },
      { label: 'Family', value: 'Bovidae' },
      { label: 'Weight', value: '25–55 kg' },
      { label: 'Lifespan', value: '10–12 years' },
    ],
    iconColor: '#795548',
    sightings: 6,
    distance: '5.1 km',
    location: 'Toubkal National Park',
    capturedAt: '1 week ago',
    mapPin: { x: 310, y: 320 },
  },
  {
    id: '8',
    commonName: 'Swallowtail Butterfly',
    scientificName: 'Papilio machaon',
    category: 'insect',
    status: 'least-concern',
    description:
      'One of the most recognisable European and North African butterflies, the swallowtail has vivid yellow wings marked with black, blue, and red. It is a strong flier and an important pollinator across its wide range.',
    habitat: 'Meadows, hillsides, gardens, wasteland',
    facts: [
      { label: 'Kingdom', value: 'Animalia' },
      { label: 'Family', value: 'Papilionidae' },
      { label: 'Wingspan', value: '65–86 mm' },
      { label: 'Flight', value: 'Apr–Sep' },
    ],
    iconColor: '#f39c12',
    sightings: 22,
    distance: '1.5 km',
    location: 'Ourika Valley',
    capturedAt: '6 days ago',
    mapPin: { x: 150, y: 310 },
  },
  {
    id: '9',
    commonName: 'Barbary Partridge',
    scientificName: 'Alectoris barbara',
    category: 'bird',
    status: 'near-threatened',
    description:
      'The Barbary partridge is North Africa\'s signature gamebird and the national bird of Gibraltar. It inhabits scrubby hillsides and rocky terrain from Morocco to Libya. Populations are declining due to hunting pressure and habitat degradation.',
    habitat: 'Rocky scrub, hillsides, agricultural edges',
    facts: [
      { label: 'Kingdom', value: 'Animalia' },
      { label: 'Family', value: 'Phasianidae' },
      { label: 'Length', value: '32–35 cm' },
      { label: 'Weight', value: '360–560 g' },
    ],
    iconColor: '#8e44ad',
    sightings: 11,
    distance: '2.7 km',
    location: 'Rif Mountains',
    capturedAt: '5 days ago',
    mapPin: { x: 60, y: 430 },
  },
  {
    id: '10',
    commonName: 'Atlas Thyme',
    scientificName: 'Thymus atlanticus',
    category: 'plant',
    status: 'least-concern',
    description:
      'A compact, aromatic shrub endemic to the Atlas Mountains. Its tiny pink flowers attract bees and butterflies, and the plant is widely used in traditional Moroccan medicine and cooking. It thrives on limestone outcrops above 1500 m.',
    habitat: 'Limestone rocky outcrops, 1500–2800 m',
    facts: [
      { label: 'Kingdom', value: 'Plantae' },
      { label: 'Family', value: 'Lamiaceae' },
      { label: 'Height', value: '10–30 cm' },
      { label: 'Bloom', value: 'May–Jul' },
    ],
    iconColor: '#27ae60',
    sightings: 38,
    distance: '0.7 km',
    location: 'Jebel Ayachi',
    capturedAt: '3 hours ago',
    mapPin: { x: 220, y: 130 },
  },
  {
    id: '11',
    commonName: 'Common Kestrel',
    scientificName: 'Falco tinnunculus',
    category: 'bird',
    status: 'least-concern',
    description:
      'A small, agile falcon famous for its ability to hover motionless against the wind while scanning the ground for prey. The kestrel is one of Morocco\'s most widespread raptors, found from sea level to high mountain plateaus.',
    habitat: 'Open countryside, cliffs, urban areas',
    facts: [
      { label: 'Kingdom', value: 'Animalia' },
      { label: 'Family', value: 'Falconidae' },
      { label: 'Wingspan', value: '65–82 cm' },
      { label: 'Weight', value: '136–252 g' },
    ],
    iconColor: '#16a085',
    sightings: 29,
    distance: '1.0 km',
    location: 'Draa Valley',
    capturedAt: '8 hours ago',
    mapPin: { x: 340, y: 220 },
  },
  {
    id: '12',
    commonName: 'Atlas Mushroom',
    scientificName: 'Amanita caesarea',
    category: 'fungi',
    status: 'least-concern',
    description:
      'Known as the "food of the gods" in antiquity, Caesar\'s mushroom grows in the oak and cedar forests of northern Morocco. Its bright orange cap, yellow gills, and white volva make it one of the most beautiful edible fungi in the world.',
    habitat: 'Oak and cedar forest, 600–1800 m',
    facts: [
      { label: 'Kingdom', value: 'Fungi' },
      { label: 'Family', value: 'Amanitaceae' },
      { label: 'Cap', value: '8–20 cm' },
      { label: 'Season', value: 'Sep–Nov' },
    ],
    iconColor: '#e74c3c',
    sightings: 7,
    distance: '4.2 km',
    location: 'Khemisset Forest',
    capturedAt: '2 weeks ago',
    mapPin: { x: 270, y: 390 },
  },
];

export const CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Find 5 plant species this week',
    progress: 3,
    total: 5,
    iconName: 'Trophy',
    iconColor: '#b8860b',
    bgColor: '#fffff0',
  },
  {
    id: 'c2',
    title: 'Explore 3 new locations',
    progress: 1,
    total: 3,
    iconName: 'Globe',
    iconColor: '#3498db',
    bgColor: '#f0f8ff',
  },
  {
    id: 'c3',
    title: 'Spot 2 endangered species',
    progress: 0,
    total: 2,
    iconName: 'ShieldAlert',
    iconColor: '#c0392b',
    bgColor: '#fff5f5',
  },
];

export const BADGES: Badge[] = [
  { id: 'b1', name: 'First Catch', iconName: 'Sprout', earned: true },
  { id: 'b2', name: 'Plant Pro', iconName: 'Leaf', earned: true },
  { id: 'b3', name: 'Animal Spotter', iconName: 'PawPrint', earned: true },
  { id: 'b4', name: 'Explorer', iconName: 'Compass', earned: true },
  { id: 'b5', name: 'Scientist', iconName: 'Microscope', earned: false },
  { id: 'b6', name: 'Legend', iconName: 'Crown', earned: false },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { id: 'l1', name: 'Sarah K.', points: 2450, rank: 1, isCurrentUser: false, avatar: 'S' },
  { id: 'l2', name: 'Omar M.', points: 1890, rank: 2, isCurrentUser: false, avatar: 'O' },
  { id: 'l3', name: 'Aya L.', points: 1670, rank: 3, isCurrentUser: false, avatar: 'A' },
  { id: 'l4', name: 'Zyad S.', points: 1250, rank: 4, isCurrentUser: true, avatar: 'Z' },
  { id: 'l5', name: 'Fatima B.', points: 1100, rank: 5, isCurrentUser: false, avatar: 'F' },
  { id: 'l6', name: 'Youssef R.', points: 980, rank: 6, isCurrentUser: false, avatar: 'Y' },
];

export const STATUS_CONFIG: Record<
  ConservationStatus,
  { label: string; color: string; bg: string }
> = {
  endangered: { label: 'Endangered', color: '#c0392b', bg: '#fee8e8' },
  vulnerable: { label: 'Vulnerable', color: '#e67e22', bg: '#fff3e0' },
  'near-threatened': { label: 'Near Threatened', color: '#daa520', bg: '#fffde0' },
  'least-concern': { label: 'Least Concern', color: '#2d8a4e', bg: '#e8f5e9' },
};

export const RECENT_SPECIES = SPECIES_DATA.slice(0, 6);
export const RESULT_SPECIES = SPECIES_DATA[0];
