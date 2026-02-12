import { useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';

import { useAuthContext } from 'src/auth/hooks';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function WorkspacesPopover({ data = [], sx, ...other }) {
  const popover = usePopover();
  const { selectedOrganizationId, setSelectedOrganizationId } = useAuthContext();

  const mediaQuery = 'sm';

  const workspace = useMemo(
    () => data.find((d) => d.id === selectedOrganizationId) ?? data[0] ?? null,
    [data, selectedOrganizationId]
  );

  const handleChangeWorkspace = useCallback(
    (newValue) => {
      setSelectedOrganizationId(newValue.id);
      popover.onClose();
    },
    [popover, setSelectedOrganizationId]
  );

  // Não exibir o popover quando não houver organizações (ex.: usuário não logado)
  if (!data?.length) {
    return null;
  }

  return (
    <>
      <ButtonBase
        disableRipple
        onClick={popover.onOpen}
        sx={{
          py: 0.5,
          gap: { xs: 0.5, [mediaQuery]: 1 },
          ...sx,
        }}
        {...other}
      >
        <Box
          component="img"
          alt={workspace?.name}
          src={workspace?.logo}
          sx={{ width: 24, height: 24, borderRadius: '50%' }}
        />

        <Box
          component="span"
          sx={{
            typography: 'subtitle2',
            display: { xs: 'none', [mediaQuery]: 'inline-flex' },
          }}
        >
          {workspace?.name}
        </Box>

        {workspace?.plan != null && (
          <Label
            color={workspace.plan === 'Free' ? 'default' : 'info'}
            sx={{
              height: 22,
              display: { xs: 'none', [mediaQuery]: 'inline-flex' },
            }}
          >
            {workspace.plan}
          </Label>
        )}

        <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
      </ButtonBase>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-left' } }}
      >
        <MenuList sx={{ width: 240 }}>
          {data.map((option) => (
            <MenuItem
              key={option.id}
              selected={option.id === selectedOrganizationId}
              onClick={() => handleChangeWorkspace(option)}
              sx={{ height: 48 }}
            >
              <Avatar alt={option.name} src={option.logo} sx={{ width: 24, height: 24 }} />

              <Box component="span" sx={{ flexGrow: 1 }}>
                {option.name}
              </Box>

              {option.plan != null && (
                <Label color={option.plan === 'Free' ? 'default' : 'info'}>{option.plan}</Label>
              )}

              {option.id === selectedOrganizationId && (
                <Iconify
                  icon="eva:checkmark-circle-2-fill"
                  width={20}
                  sx={{ ml: 1, color: 'primary.main' }}
                />
              )}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
