import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import NoSsr from '@mui/material/NoSsr';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { CONFIG } from 'src/config-global';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

/**
 * Componente de Logo com suporte a exibição de texto
 * @param {number} width - Largura do logo
 * @param {number} height - Altura do logo
 * @param {boolean} showText - Se true, mostra o texto "nebula" ao lado do logo
 * @param {boolean} disableLink - Se true, desabilita o link
 * @param {string} href - URL do link
 */
export const Logo = forwardRef(
  ({ width = 40, height = 40, showText = false, disableLink = false, className, href = '/', sx, ...other }, ref) => {
    const logo = (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          component="img"
          alt="logo"
          src={`${CONFIG.site.basePath}/logo/logo-single.png`}
          width={width}
          height={height}
          sx={{
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />
        {showText && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              letterSpacing: 0.5,
              textTransform: 'lowercase',
            }}
          >
            nebula
          </Typography>
        )}
      </Box>
    );

    return (
      <NoSsr
        fallback={
          <Box
            width={showText ? 'auto' : width}
            height={height}
            className={logoClasses.root.concat(className ? ` ${className}` : '')}
            sx={{
              flexShrink: 0,
              display: 'inline-flex',
              verticalAlign: 'middle',
              ...sx,
            }}
          />
        }
      >
        <Box
          ref={ref}
          component={RouterLink}
          href={href}
          width={showText ? 'auto' : width}
          height={height}
          className={logoClasses.root.concat(className ? ` ${className}` : '')}
          aria-label="logo"
          sx={{
            flexShrink: 0,
            display: 'inline-flex',
            verticalAlign: 'middle',
            ...(disableLink && { pointerEvents: 'none' }),
            ...sx,
          }}
          {...other}
        >
          {logo}
        </Box>
      </NoSsr>
    );
  }
);
