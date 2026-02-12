import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { AnimateAvatar } from 'src/components/animate';

import { useAuthContext } from 'src/auth/hooks';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';

// ----------------------------------------------------------------------

export function AccountDrawer({ sx, ...other }) {
  const theme = useTheme();
  const { user } = useAuthContext();
  const displayName = user?.displayName ?? user?.name ?? '';
  const photoURL = user?.photoURL ?? user?.avatar ?? null;
  const email = user?.email ?? '';

  const [open, setOpen] = useState(false);

  const handleOpenDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  const renderAvatar = (
    <AnimateAvatar
      width={96}
      slotProps={{
        avatar: { src: photoURL, alt: displayName },
        overlay: {
          border: 2,
          spacing: 3,
          color: `linear-gradient(135deg, ${varAlpha(theme.vars.palette.primary.mainChannel, 0)} 25%, ${theme.vars.palette.primary.main} 100%)`,
        },
      }}
    >
      {displayName?.charAt(0).toUpperCase()}
    </AnimateAvatar>
  );

  return (
    <>
      <AccountButton
        open={open}
        onClick={handleOpenDrawer}
        photoURL={photoURL}
        displayName={displayName}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={handleCloseDrawer}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        <IconButton
          onClick={handleCloseDrawer}
          sx={{ top: 12, left: 12, zIndex: 9, position: 'absolute' }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Stack alignItems="center" sx={{ pt: 8, pb: 3 }}>
          {renderAvatar}

          <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
            {displayName}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} noWrap>
            {email}
          </Typography>
        </Stack>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={handleCloseDrawer} />
        </Box>
      </Drawer>
    </>
  );
}
