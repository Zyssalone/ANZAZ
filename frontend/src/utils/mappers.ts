import type { Badge, Challenge, LeaderboardEntry, Species } from '../data/mockData';

export function toSpecies(row: any): Species {
  return {
    id: String(row.id ?? row.species_id),
    commonName: row.common_name,
    scientificName: row.scientific_name,
    category: row.category,
    status: row.conservation_status,
    description: row.description ?? '',
    habitat: row.habitat ?? row.location_name ?? 'Morocco',
    facts: Array.isArray(row.facts) ? row.facts : [],
    iconColor: row.icon_color ?? '#2d8a4e',
    sightings: Number(row.sightings ?? 0),
    distance: row.location_name ? 'Mapped sighting' : 'From database',
    location: row.location_name ?? row.habitat ?? 'Morocco',
    capturedAt: row.created_at ? new Date(row.created_at).toLocaleDateString() : undefined,
  };
}

export function toChallenge(row: any, index: number): Challenge {
  const isPlant = row.category_filter === 'plant';
  const isEndangered = /endangered/i.test(row.title ?? '');

  return {
    id: String(row.id),
    title: row.title,
    progress: Number(row.progress ?? 0),
    total: Number(row.target ?? 1),
    iconName: isEndangered ? 'ShieldAlert' : isPlant ? 'Trophy' : 'Globe',
    iconColor: isEndangered ? '#c0392b' : isPlant ? '#b8860b' : '#3498db',
    bgColor: index % 3 === 0 ? '#fffff0' : index % 3 === 1 ? '#f0f8ff' : '#fff5f5',
  };
}

export function toLeaderboardEntry(row: any, currentUserId?: number | null): LeaderboardEntry {
  const name = row.name ?? 'Unknown';
  return {
    id: String(row.id),
    name,
    points: Number(row.points ?? 0),
    rank: Number(row.rank ?? 0),
    isCurrentUser: currentUserId === Number(row.id),
    avatar: name.charAt(0).toUpperCase(),
  };
}

export function toBadge(row: any): Badge {
  return {
    id: String(row.id),
    name: row.name,
    iconName: row.icon_name ?? 'Lock',
    earned: Boolean(row.earned),
  };
}

export function getUserStats(user: any) {
  const level = Number(user?.level ?? 1);
  const xp = Number(user?.xp ?? 0);
  const xpMax = Math.max(level * 500, 500);

  return {
    id: Number(user?.id ?? 0),
    name: user?.name ?? 'Explorer',
    level,
    xp,
    xpMax,
    points: Number(user?.points ?? 0),
    rank: Number(user?.rank ?? 0),
    speciesCount: Number(user?.species_count ?? 0),
    title: 'Nature Explorer',
  };
}
