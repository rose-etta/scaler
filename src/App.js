import { useState, useMemo } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import Piano from './components/Piano';
import KeySuggestions from './components/KeySuggestions';
import { suggestKeys } from './utils/musicTheory';

const MAX_NOTES = 7;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary:   { main: '#8b5cf6', light: '#ede9fe', dark: '#7c3aed' },
    success:   { main: '#16a34a', light: '#f0fdf4' },
    warning:   { main: '#d97706', light: '#fffbeb' },
    error:     { main: '#e11d48', light: '#fff1f2' },
    background: { default: '#faf5ff', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", sans-serif',
  },
});

export default function App() {
  const [selectedNotes, setSelectedNotes] = useState(new Set());

  const handleNoteClick = (note) => {
    setSelectedNotes(prev => {
      const next = new Set(prev);
      if (next.has(note)) {
        next.delete(note);
      } else if (next.size < MAX_NOTES) {
        next.add(note);
      }
      return next;
    });
  };

  const handleClear = () => setSelectedNotes(new Set());

  const selectedArray = useMemo(() => Array.from(selectedNotes), [selectedNotes]);
  const suggestions = useMemo(() => suggestKeys(selectedArray), [selectedArray]);

  const atLimit = selectedNotes.size >= MAX_NOTES;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 4 }}>
        <Container maxWidth="md">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: '#1a1a2e' }}
            >
              Scaler
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Select notes to narrow down what key a song might be in
            </Typography>
          </Box>

          {/* Piano */}
          <Box sx={{ display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
            <Piano
              selectedNotes={selectedNotes}
              onNoteClick={handleNoteClick}
            />
          </Box>

          {/* Selected notes panel */}
          <Box sx={{ p: 2.5, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Selected notes ({selectedNotes.size}/{MAX_NOTES})
                {atLimit && (
                  <Typography component="span" color="warning.main" sx={{ ml: 1, fontSize: '0.75rem' }}>
                    — limit reached
                  </Typography>
                )}
              </Typography>
              {selectedNotes.size > 0 && (
                <Button
                  size="small"
                  onClick={handleClear}
                  color="inherit"
                  sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                >
                  Clear all
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 36 }}>
              {selectedArray.length === 0 ? (
                <Typography variant="body2" color="text.disabled" sx={{ alignSelf: 'center' }}>
                  No notes selected
                </Typography>
              ) : (
                selectedArray.map(note => (
                  <Chip
                    key={note}
                    label={note}
                    onDelete={() => handleNoteClick(note)}
                    color="primary"
                    variant="filled"
                    sx={{ fontWeight: 600 }}
                  />
                ))
              )}
            </Box>
          </Box>

          {/* Key suggestions */}
          <Box sx={{ mt: 3 }}>
            <KeySuggestions suggestions={suggestions} selectedCount={selectedNotes.size} />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
