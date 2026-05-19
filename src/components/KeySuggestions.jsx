import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Grid,
} from '@mui/material';

function ScoreBar({ score }) {
  const pct = Math.round(score * 100);
  const color =
    pct === 100 ? 'success' :
    pct >= 75  ? 'primary' :
    pct >= 50  ? 'warning' : 'error';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
      <LinearProgress
        variant="determinate"
        value={pct}
        color={color}
        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
      />
      <Typography variant="body2" sx={{ minWidth: 36, textAlign: 'right', fontWeight: 600 }}>
        {pct}%
      </Typography>
    </Box>
  );
}

const TIER = [
  { min: 1.00, bg: '#f0fdf4' },
  { min: 0.75, bg: '#f5f3ff' },
  { min: 0.50, bg: '#fffbeb' },
  { min: 0.00, bg: '#ffffff' },
];

const RANK_COLORS = [
  { bgcolor: '#bbf7d0', color: '#15803d' },
  { bgcolor: '#ddd6fe', color: '#5b21b6' },
  { bgcolor: '#fed7aa', color: '#c2410c' },
];

function SuggestionCard({ suggestion, rank }) {
  const tier = TIER.find(t => suggestion.score >= t.min);

  return (
    <Card
      sx={{
        backgroundColor: tier.bg,
        position: 'relative',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 3 },
      }}
    >
      <CardContent sx={{ pb: '12px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          {rank <= 3 && (
            <Chip
              label={`#${rank}`}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '11px',
                height: 20,
                ...RANK_COLORS[rank - 1],
              }}
            />
          )}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {suggestion.key}
          </Typography>
        </Box>

        <ScoreBar score={suggestion.score} />

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          {suggestion.matches} of {suggestion.total} note{suggestion.total !== 1 ? 's' : ''} match
        </Typography>

        <Typography variant="caption" sx={{ display: 'block', mt: 0.75, color: 'text.secondary', letterSpacing: '0.02em' }}>
          {suggestion.scaleNotes.join(' – ')}
        </Typography>

        {suggestion.missingNotes.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="error.main">
              Outside this key: {suggestion.missingNotes.join(', ')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default function KeySuggestions({ suggestions, selectedCount }) {
  if (selectedCount === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          color: 'text.secondary',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography sx={{ fontSize: 48, color: '#c4b5fd', lineHeight: 1 }}>♪</Typography>
        <Typography variant="h6" sx={{ opacity: 0.5 }}>
          Discover possible scales
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.4 }}>
          Select up to 7 notes
        </Typography>
      </Box>
    );
  }

  const topScore = suggestions[0]?.score ?? 0;
  // Show suggestions with at least 50% match, or at least top 4 if fewer than that
  const visible = suggestions.filter(s => s.score >= 0.5).slice(0, 12);
  const fallback = visible.length < 4 ? suggestions.slice(0, 4) : visible;
  const shown = visible.length >= 4 ? visible : fallback;

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Key Suggestions
        </Typography>
        {selectedCount < 3 && (
          <Typography variant="body2" color="text.secondary">
            (add more notes for better results)
          </Typography>
        )}
      </Box>

      {topScore === 1 && (
        <Typography variant="body2" color="success.main" sx={{ mb: 1.5, fontWeight: 600 }}>
          All selected notes fit perfectly in the keys marked 100%
        </Typography>
      )}

      <Grid container spacing={2}>
        {shown.map((s, i) => (
          <Grid key={s.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <SuggestionCard suggestion={s} rank={i + 1} />
          </Grid>
        ))}
      </Grid>

      {suggestions.filter(s => s.score >= 0.5).length > 12 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Many keys match — try adding more specific notes to narrow it down
        </Typography>
      )}
    </Box>
  );
}
