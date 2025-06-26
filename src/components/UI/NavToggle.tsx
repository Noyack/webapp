// ViewToggle.tsx
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useContext } from 'react';
import { ViewContext } from '../../context/ViewContext';

export default function ViewToggle() {
  const { view, setView } = useContext(ViewContext);

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: 'Learn' | 'Invest' | null,
  ) => {
    if (newView !== null) {
      setView({ view: newView });
    }
  };
  return (
    <ToggleButtonGroup
      color="primary"
      value={view.view}
      exclusive
      onChange={handleChange}
      aria-label="View"
    >
      <ToggleButton value="Learn" color="success" sx={{ borderRadius: '30px', fontWeight: 'bold' }}>
        Learn
      </ToggleButton>
      <ToggleButton value="Invest" color="warning" sx={{ borderRadius: '30px', fontWeight: 'bold' }}>
        Invest
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
