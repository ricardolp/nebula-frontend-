import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * Componente genérico para gerenciar arrays dinâmicos
 * @param {string} name - Nome do campo no formulário
 * @param {string} title - Título da seção
 * @param {Array} columns - Configuração das colunas [{field, header, width}]
 * @param {Function} FormComponent - Componente do formulário de edição
 * @param {Object} defaultValues - Valores padrão para novo item
 * @param {boolean} isView - Modo visualização
 */
export function DynamicArrayManager({
  name,
  title,
  columns,
  FormComponent,
  defaultValues,
  isView = false,
}) {
  const { control } = useFormContext();
  const { fields, append, update, remove } = useFieldArray({ control, name });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState(defaultValues);

  const handleAdd = () => {
    setEditingIndex(null);
    setFormData(defaultValues);
    setDialogOpen(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(fields[index]);
    setDialogOpen(true);
  };

  const handleDelete = (index) => {
    if (window.confirm('Tem certeza que deseja remover este item?')) {
      remove(index);
    }
  };

  const handleSave = (data) => {
    if (editingIndex !== null) {
      update(editingIndex, data);
    } else {
      append(data);
    }
    setDialogOpen(false);
    setFormData(defaultValues);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setFormData(defaultValues);
    setEditingIndex(null);
  };

  // Função auxiliar para renderizar valor da célula
  const renderCellValue = (item, column) => {
    const value = item[column.field];
    
    if (value === null || value === undefined || value === '') {
      return <Typography variant="body2" color="text.disabled">N/A</Typography>;
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Sim' : 'Não';
    }
    
    if (column.render) {
      return column.render(value, item);
    }
    
    return value;
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        {!isView && (
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleAdd}
            size="small"
          >
            Adicionar
          </Button>
        )}
      </Stack>

      {fields.length > 0 ? (
        <TableContainer component={Card} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.field} width={column.width}>
                    <strong>{column.header}</strong>
                  </TableCell>
                ))}
                {!isView && (
                  <TableCell width={100} align="center">
                    <strong>Ações</strong>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((item, index) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {renderCellValue(item, column)}
                    </TableCell>
                  ))}
                  {!isView && (
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(index)}
                          >
                            <Iconify icon="solar:pen-bold" width={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(index)}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Card variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Nenhum item adicionado
          </Typography>
        </Card>
      )}

      {/* Dialog de Edição */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingIndex !== null ? `Editar ${title}` : `Adicionar ${title}`}
        </DialogTitle>
        <DialogContent dividers>
          <FormComponent
            data={formData}
            onChange={setFormData}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={() => handleSave(formData)} 
            variant="contained"
            startIcon={<Iconify icon="solar:check-circle-bold" />}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

