import { m } from 'framer-motion';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';

import { varHover } from 'src/components/animate';
import { Iconify } from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export function ThemeToggle({ sx, ...other }) {
  const settings = useSettingsContext();
  const { mode, setMode } = useColorScheme();

  const isDark = mode === 'dark';

  const handleToggle = () => {
    const nextMode = isDark ? 'light' : 'dark';
    setMode(nextMode);
    settings.onUpdateField('colorScheme', nextMode);
  };

  return (
    <Tooltip title={isDark ? 'Tema claro' : 'Tema escuro'}>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={handleToggle}
        sx={{
          p: 0,
          width: 40,
          height: 40,
          ...sx,
        }}
        {...other}
      >
        <Iconify
          icon={isDark ? 'solar:sun-2-bold' : 'solar:moon-bold'}
          width={24}
        />
      </IconButton>
    </Tooltip>
  );
}
