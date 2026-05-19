import { Box, Typography } from '@mui/material';

const WHITE_W = 90;
const WHITE_H = 260;
const BLACK_W = 56;
const BLACK_H = 162;

const OCTAVE_PATTERN = [
  { note: 'C',  type: 'white', whiteIndex: 0 },
  { note: 'C#', type: 'black', afterWhite: 0 },
  { note: 'D',  type: 'white', whiteIndex: 1 },
  { note: 'D#', type: 'black', afterWhite: 1 },
  { note: 'E',  type: 'white', whiteIndex: 2 },
  { note: 'F',  type: 'white', whiteIndex: 3 },
  { note: 'F#', type: 'black', afterWhite: 3 },
  { note: 'G',  type: 'white', whiteIndex: 4 },
  { note: 'G#', type: 'black', afterWhite: 4 },
  { note: 'A',  type: 'white', whiteIndex: 5 },
  { note: 'A#', type: 'black', afterWhite: 5 },
  { note: 'B',  type: 'white', whiteIndex: 6 },
];

function buildKeys(numOctaves = 2, startOctave = 3) {
  const white = [];
  const black = [];

  for (let oct = 0; oct < numOctaves; oct++) {
    const octaveOffset = oct * 7 * WHITE_W;
    OCTAVE_PATTERN.forEach(({ note, type, whiteIndex, afterWhite }) => {
      const key = { note, type, octave: startOctave + oct };
      if (type === 'white') {
        key.left = octaveOffset + whiteIndex * WHITE_W;
        key.showLabel = note === 'C';
        white.push(key);
      } else {
        // Center the black key over the boundary between the two white keys
        key.left = octaveOffset + (afterWhite + 1) * WHITE_W - BLACK_W / 2;
        black.push(key);
      }
    });
  }
  return { white, black };
}

const { white: WHITE_KEYS, black: BLACK_KEYS } = buildKeys(1);
const TOTAL_WIDTH = 7 * WHITE_W;

export default function Piano({ selectedNotes, onNoteClick, disabled }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
      <Box
        sx={{
          position: 'relative',
          width: TOTAL_WIDTH,
          height: WHITE_H,
          userSelect: 'none',
          filter: disabled ? 'grayscale(60%) opacity(0.6)' : 'none',
        }}
      >
        {WHITE_KEYS.map(key => {
          const selected = selectedNotes.has(key.note);
          return (
            <Box
              key={`${key.note}${key.octave}`}
              onClick={() => !disabled && onNoteClick(key.note)}
              sx={{
                position: 'absolute',
                left: key.left,
                top: 0,
                width: WHITE_W - 2,
                height: WHITE_H,
                backgroundColor: selected ? '#ede9fe' : '#fff',
                border: '1px solid #ede8f5',
                borderRadius: '0 0 6px 6px',
                cursor: disabled ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                pb: 0.75,
                boxShadow: selected
                  ? 'inset 0 -3px 0 #a78bfa'
                  : 'inset 0 -2px 0 #ede8f5',
                transition: 'background-color 0.1s',
                '&:hover': !disabled && {
                  backgroundColor: selected ? '#ddd6fe' : '#f5f0ff',
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: '13px',
                  color: selected ? '#5b21b6' : '#9ca3af',
                  fontWeight: selected ? 700 : 400,
                  lineHeight: 1,
                }}
              >
                {key.showLabel ? `${key.note}${key.octave}` : key.note}
              </Typography>
            </Box>
          );
        })}

        {BLACK_KEYS.map(key => {
          const selected = selectedNotes.has(key.note);
          return (
            <Box
              key={`${key.note}${key.octave}`}
              onClick={() => !disabled && onNoteClick(key.note)}
              sx={{
                position: 'absolute',
                left: key.left,
                top: 0,
                width: BLACK_W,
                height: BLACK_H,
                backgroundColor: selected ? '#8b5cf6' : '#1f2937',
                borderRadius: '0 0 5px 5px',
                cursor: disabled ? 'default' : 'pointer',
                zIndex: 2,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                pb: 0.75,
                boxShadow: selected
                  ? '0 0 0 2px #c4b5fd'
                  : '1px 2px 4px rgba(0,0,0,0.2)',
                transition: 'background-color 0.1s',
                '&:hover': !disabled && {
                  backgroundColor: selected ? '#7c3aed' : '#374151',
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: '10px',
                  color: selected ? '#ede9fe' : '#6b7280',
                  fontWeight: selected ? 700 : 400,
                  lineHeight: 1,
                }}
              >
                {key.note}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
