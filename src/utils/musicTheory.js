const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SCALES = [
  { name: 'Major',        intervals: [0, 2, 4, 5, 7, 9, 11] },
  { name: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10] },
  { name: 'Dorian',       intervals: [0, 2, 3, 5, 7, 9, 10] },
  { name: 'Phrygian',     intervals: [0, 1, 3, 5, 7, 8, 10] },
  { name: 'Lydian',       intervals: [0, 2, 4, 6, 7, 9, 11] },
  { name: 'Mixolydian',   intervals: [0, 2, 4, 5, 7, 9, 10] },
  { name: 'Locrian',      intervals: [0, 1, 3, 5, 6, 8, 10] },
];

// Enharmonic display names for ambiguous roots
const ROOT_DISPLAY = {
  'C#': 'C♯ / D♭',
  'D#': 'D♯ / E♭',
  'F#': 'F♯ / G♭',
  'G#': 'G♯ / A♭',
  'A#': 'A♯ / B♭',
};

function getScaleNotes(root, intervals) {
  const rootIdx = CHROMATIC.indexOf(root);
  return intervals.map(i => CHROMATIC[(rootIdx + i) % 12]);
}

export function suggestKeys(selectedNotes) {
  if (selectedNotes.length === 0) return [];

  const suggestions = [];

  for (const root of CHROMATIC) {
    for (const scale of SCALES) {
      const scaleNotes = getScaleNotes(root, scale.intervals);
      const matchingNotes = selectedNotes.filter(n => scaleNotes.includes(n));
      const score = matchingNotes.length / selectedNotes.length;

      suggestions.push({
        id: `${root}-${scale.name}`,
        key: `${ROOT_DISPLAY[root] ?? root} ${scale.name}`,
        root,
        scaleName: scale.name,
        matches: matchingNotes.length,
        total: selectedNotes.length,
        score,
        scaleNotes,
        matchingNotes,
        missingNotes: selectedNotes.filter(n => !scaleNotes.includes(n)),
      });
    }
  }

  return suggestions
    .sort((a, b) => b.score - a.score || b.matches - a.matches);
}
