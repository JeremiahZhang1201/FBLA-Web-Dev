// src/FilterBar.js
import React, { useState } from 'react';
import { Box, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';

export default function FilterBar({ onFilter }) {
  const [location, setLocation] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [myMatches, setMyMatches] = useState(false);

  const handleApplyFilters = () => {
    onFilter({
      location,
      minSalary,
      maxSalary,
      myMatches,
    });
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
      <TextField
        label="Location"
        variant="outlined"
        size="small"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <TextField
        label="Min Salary ($/year or $/hr numeric)"
        variant="outlined"
        size="small"
        value={minSalary}
        onChange={(e) => setMinSalary(e.target.value)}
      />
      <TextField
        label="Max Salary ($/year or $/hr numeric)"
        variant="outlined"
        size="small"
        value={maxSalary}
        onChange={(e) => setMaxSalary(e.target.value)}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={myMatches}
            onChange={(e) => setMyMatches(e.target.checked)}
          />
        }
        label="My Matches"
      />
      <Button variant="contained" onClick={handleApplyFilters}>
        Apply
      </Button>
    </Box>
  );
}
