import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';

import { useFormContext } from 'react-hook-form';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData } from 'src/components/table';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'tipo', label: 'Tipo', width: 80 },
  { id: 'funcao', label: 'Função', width: 150 },
  { id: 'associado', label: 'Associado', width: 100, align: 'center' },
  { id: 'orgVendas', label: 'Org Vendas', width: 120 },
  { id: 'canalDistr', label: 'Canal Distr', width: 120 },
  { id: 'setorAtiv', label: 'Setor Ativ', width: 120 },
  { id: 'moedaCliente', label: 'Moeda', width: 100 },
  { id: 'incoterms', label: 'Incoterms', width: 120 },
  { id: 'condpgto', label: 'Cond. Pagto', width: 120 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

/**
 * Aba de Regras de Vendas
 * Gerencia as regras de vendas do parceiro de negócio
 */
export function BusinessPartnerSalesRulesTab({ isView = false }) {
  const { watch, setValue, getValues } = useFormContext();
  
  // Estado local para as regras de vendas
  const [salesRules, setSalesRules] = useState([
    // Exemplo de dados - em produção viria da API
    {
      id: '1',
      tipo: 'PJ',
      funcao: 'S_CUVN/CLIE',
      associado: true,
      orgVendas: '1000',
      canalDistr: '10',
      setorAtiv: '01',
      moedaCliente: 'BRL',
      incoterms: 'FOB',
      condpgto: '0030',
    },
    {
      id: '2',
      tipo: 'PF',
      funcao: 'S_CUVN/FORN',
      associado: false,
      orgVendas: '2000',
      canalDistr: '20',
      setorAtiv: '02',
      moedaCliente: 'USD',
      incoterms: 'CIF',
      condpgto: '0060',
    },
  ]);

  const handleAddRule = useCallback(() => {
    if (isView) return;
    
    // Abrir modal/formulário para adicionar nova regra
    console.log('Adicionar nova regra de vendas');
  }, [isView]);

  const handleEditRule = useCallback((id) => {
    if (isView) return;
    
    // Abrir modal/formulário para editar regra
    console.log('Editar regra de vendas:', id);
  }, [isView]);

  const handleDeleteRule = useCallback((id) => {
    if (isView) return;
    
    if (window.confirm('Tem certeza que deseja deletar esta regra de vendas?')) {
      setSalesRules(prev => prev.filter(rule => rule.id !== id));
    }
  }, [isView]);

  const renderTableRows = () => {
    if (salesRules.length === 0) {
      return (
        <TableNoData notFound />
      );
    }

    return salesRules.map((rule) => (
      <TableRow
        key={rule.id}
        hover
        sx={{ cursor: isView ? 'default' : 'pointer' }}
        onClick={() => !isView && handleEditRule(rule.id)}
      >
        <TableCell>
          <Chip
            label={rule.tipo}
            size="small"
            color={rule.tipo === 'PF' ? 'primary' : 'secondary'}
            variant="soft"
          />
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {rule.funcao}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Chip
            label={rule.associado ? 'Sim' : 'Não'}
            size="small"
            color={rule.associado ? 'success' : 'default'}
            variant="soft"
          />
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {rule.orgVendas || '-'}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {rule.canalDistr || '-'}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {rule.setorAtiv || '-'}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {rule.moedaCliente || '-'}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {rule.incoterms || '-'}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {rule.condpgto || '-'}
          </Typography>
        </TableCell>

        {!isView && (
          <TableCell align="right" sx={{ px: 1 }}>
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteRule(rule.id);
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </TableCell>
        )}
      </TableRow>
    ));
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h6">
          Regras de Vendas
        </Typography>
        
        {!isView && (
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleAddRule}
            size="small"
          >
            Adicionar Regra
          </Button>
        )}
      </Stack>

      <Card>
        <Scrollbar>
          <Box sx={{ overflow: 'unset' }}>
            <TableHeadCustom
              headLabel={TABLE_HEAD}
              rowCount={salesRules.length}
            />

            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Box>
        </Scrollbar>
      </Card>

      {salesRules.length === 0 && (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Nenhuma regra de vendas configurada para este parceiro de negócio.
          </Typography>
          {!isView && (
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleAddRule}
              sx={{ mt: 2 }}
            >
              Adicionar Primeira Regra
            </Button>
          )}
        </Card>
      )}
    </Box>
  );
}
