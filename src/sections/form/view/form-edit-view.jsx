import { useState, useCallback, useEffect, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  getOrganizationForm,
  getOrganizationFormFields,
  patchOrganizationForm,
  createOrganizationFormField,
  patchOrganizationFormField,
  deleteOrganizationFormField,
} from 'src/actions/forms';

import { FormEditSkeleton } from '../form-edit-skeleton';
import { getFieldTemplatesByEntity, getPartnerFieldGroups } from '../data/field-templates';

// ----------------------------------------------------------------------

const LIBRARY_DRAG_TYPE = 'form-library';
const STATUS_LABELS = { active: 'Ativo', inactive: 'Inativo' };

function generateTempId() {
  return `temp-${crypto.randomUUID()}`;
}

function mapApiFieldToCanvas(f) {
  return {
    id: f.id,
    formId: f.formId,
    campo: f.campo,
    tabela: f.tabela,
    sequencia: f.sequencia ?? 0,
  };
}

/** Item arrastável da biblioteca (esquerda) — desativado quando já está no formulário */
function LibraryFieldItem({ template, disabled }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${LIBRARY_DRAG_TYPE}-${template.id}`,
    data: { type: 'library', template },
    disabled,
  });
  return (
    <Card
      ref={setNodeRef}
      variant="outlined"
      sx={{
        cursor: disabled ? 'not-allowed' : 'grab',
        opacity: disabled ? 0.6 : isDragging ? 0.5 : 1,
        bgcolor: disabled ? 'action.hover' : 'transparent',
        p: 1.5,
        mb: 1,
        '&:active': { cursor: disabled ? 'not-allowed' : 'grabbing' },
      }}
      {...(disabled ? {} : { ...attributes, ...listeners })}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        {disabled && (
          <Iconify icon="solar:check-circle-bold" width={18} sx={{ color: 'success.main', mt: 0.25, flexShrink: 0 }} />
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={500} color={disabled ? 'text.disabled' : 'text.primary'}>
            {template.label}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {template.campo} ({template.tabela})
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

/** Item no canvas (direita) - sortable + removível */
function CanvasFieldItem({ field, onRemove }) {
  const id = field.id ?? field.tempId;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `canvas-${id}`,
    data: { type: 'canvas', field },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const label = field.label ?? `${field.campo} (${field.tabela})`;
  return (
    <Card
      ref={setNodeRef}
      variant="outlined"
      style={style}
      sx={{
        opacity: isDragging ? 0.8 : 1,
        p: 1.5,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ cursor: 'grab', flex: 1 }} {...attributes} {...listeners}>
        <Typography variant="body2" fontWeight={500}>
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {field.campo} · {field.tabela}
        </Typography>
      </Box>
      <IconButton
        size="small"
        color="error"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(field);
        }}
      >
        <Iconify icon="solar:trash-bin-trash-bold" width={18} />
      </IconButton>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function FormEditView({ formId }) {
  const router = useRouter();
  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formName, setFormName] = useState('');
  const [formStatus, setFormStatus] = useState('active');
  const [fields, setFields] = useState([]);
  const [activeDrag, setActiveDrag] = useState(null);
  const initialFieldIdsRef = useRef(new Set());

  const { setNodeRef: setCanvasRef, isOver: isCanvasOver } = useDroppable({ id: 'canvas-drop' });

  const entity = form?.entity ?? 'material';
  const templates = getFieldTemplatesByEntity(entity);
  const partnerGroups = entity === 'partner' ? getPartnerFieldGroups() : [];
  const usedKeys = new Set(fields.map((f) => `${f.campo}-${f.tabela}`));

  const loadForm = useCallback(async () => {
    if (!organizationId || !formId) return;
    setLoading(true);
    try {
      const [formData, fieldsData] = await Promise.all([
        getOrganizationForm(organizationId, formId),
        getOrganizationFormFields(organizationId, formId),
      ]);
      setForm(formData);
      setFormName(formData.name ?? '');
      setFormStatus(formData.status ?? 'active');
      const sorted = (fieldsData ?? [])
        .map(mapApiFieldToCanvas)
        .sort((a, b) => (a.sequencia ?? 0) - (b.sequencia ?? 0));
      setFields(sorted);
      initialFieldIdsRef.current = new Set(sorted.map((f) => f.id).filter(Boolean));
    } catch (err) {
      toast.error(err?.message ?? 'Erro ao carregar formulário');
      setForm(null);
      setFields([]);
    } finally {
      setLoading(false);
    }
  }, [organizationId, formId]);

  useEffect(() => {
    loadForm();
  }, [loadForm]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    setActiveDrag(active);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setActiveDrag(null);
      const activeId = String(active.id);
      const overId = over ? String(over.id) : null;

      if (activeId.startsWith(LIBRARY_DRAG_TYPE)) {
        const template = templates.find((t) => `${LIBRARY_DRAG_TYPE}-${t.id}` === activeId);
        const droppedOnCanvas =
          overId === 'canvas-drop' || (overId && overId.startsWith('canvas-'));
        const droppedBackOnLibrary = overId != null && overId.startsWith(LIBRARY_DRAG_TYPE);
        if (template && (droppedOnCanvas || overId === null) && !droppedBackOnLibrary) {
          const newField = {
            tempId: generateTempId(),
            campo: template.campo,
            tabela: template.tabela,
            label: template.label,
            sequencia: fields.length,
          };
          setFields((prev) => [...prev, newField]);
        }
        return;
      }

      if (overId && activeId.startsWith('canvas-') && overId.startsWith('canvas-')) {
        const oldIndex = fields.findIndex((f) => `canvas-${f.id ?? f.tempId}` === activeId);
        const newIndex = fields.findIndex((f) => `canvas-${f.id ?? f.tempId}` === overId);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          setFields((prev) => {
            const reordered = arrayMove(prev, oldIndex, newIndex);
            return reordered.map((f, i) => ({ ...f, sequencia: i }));
          });
        }
      }
    },
    [templates, fields]
  );

  const handleRemoveField = useCallback((field) => {
    setFields((prev) =>
      prev.filter((f) => {
        if (field.id != null) return f.id !== field.id;
        if (field.tempId != null) return f.tempId !== field.tempId;
        return true;
      })
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (!organizationId || !formId || !form) return;
    const trimmedName = formName.trim();
    if (!trimmedName) {
      toast.error('Informe o nome do formulário.');
      return;
    }
    setSaving(true);
    try {
      if (trimmedName !== form.name) {
        await patchOrganizationForm(organizationId, formId, { name: trimmedName });
        setForm((prev) => (prev ? { ...prev, name: trimmedName } : null));
      }

      const originalIds = initialFieldIdsRef.current;
      const currentIds = new Set(fields.filter((f) => f.id).map((f) => f.id));

      const patchCreatePromises = fields.map((field, i) => {
        const sequencia = i;
        if (field.id) {
          return patchOrganizationFormField(organizationId, formId, field.id, {
            campo: field.campo,
            tabela: field.tabela,
            sequencia,
          });
        }
        return createOrganizationFormField(organizationId, formId, {
          campo: field.campo,
          tabela: field.tabela,
          sequencia,
        });
      });
      await Promise.all(patchCreatePromises);

      const idsToDelete = [...originalIds].filter((id) => !currentIds.has(id));
      await Promise.all(
        idsToDelete.map((id) => deleteOrganizationFormField(organizationId, formId, id))
      );

      toast.success('Formulário atualizado.');
      loadForm();
    } catch (err) {
      toast.error(err?.message ?? 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }, [organizationId, formId, form, formName, fields, loadForm]);

  const handleBack = useCallback(() => {
    router.push(paths.dashboard.forms.root);
  }, [router]);

  const handleStatusChange = useCallback(
    async (e) => {
      const newStatus = e.target.value;
      if (!organizationId || !formId || !form) return;
      setFormStatus(newStatus);
      try {
        await patchOrganizationForm(organizationId, formId, { status: newStatus });
        setForm((prev) => (prev ? { ...prev, status: newStatus } : null));
        toast.success(newStatus === 'active' ? 'Formulário ativado!' : 'Formulário desativado!');
      } catch (err) {
        setFormStatus(form?.status ?? 'active');
        toast.error(err?.message ?? 'Erro ao atualizar status');
      }
    },
    [organizationId, formId, form]
  );

  if (loading && !form) {
    return <FormEditSkeleton />;
  }

  if (!form) {
    return (
      <DashboardContent>
        <Typography color="error">Formulário não encontrado.</Typography>
        <Button sx={{ mt: 2 }} onClick={handleBack} variant="outlined">
          Voltar
        </Button>
      </DashboardContent>
    );
  }

  const sortableIds = fields.map((f) => `canvas-${f.id ?? f.tempId}`);
  const activeTemplate =
    activeDrag?.data?.current?.type === 'library' ? activeDrag.data.current.template : null;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Editar formulário"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Formulários', href: paths.dashboard.forms.root },
          { name: form.name || 'Editar' },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={handleBack} disabled={saving}>
              Voltar
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando…' : 'Salvar'}
            </Button>
          </Stack>
        }
        sx={{ mb: 3 }}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          mb: 3,
          width: '100%',
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label="Nome do formulário"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          sx={{ maxWidth: 480, flex: 1, minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 140, ml: 'auto' }} size="medium">
          <InputLabel id="form-status-label">Status</InputLabel>
          <Select
            labelId="form-status-label"
            label="Status"
            value={formStatus}
            onChange={handleStatusChange}
            disabled={saving}
          >
            <MenuItem value="active">{STATUS_LABELS.active}</MenuItem>
            <MenuItem value="inactive">{STATUS_LABELS.inactive}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Stack direction="row" spacing={2} sx={{ minHeight: 560 }}>
          {/* Coluna esquerda: biblioteca de campos da entidade */}
          <Card variant="outlined" sx={{ width: 280, flexShrink: 0, overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2">
                Campos da entidade ({entity === 'material' ? 'Material' : 'Parceiro'})
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Arraste para a coluna da direita
              </Typography>
            </Box>
            <Scrollbar sx={{ height: 480, p: 1.5 }}>
              {entity === 'partner' && partnerGroups.length > 0 ? (
                partnerGroups.map((group) => (
                  <Accordion
                    key={group.key}
                    disableGutters
                    elevation={0}
                    sx={{
                      '&:before': { display: 'none' },
                      border: (t) => `1px solid ${t.palette.divider}`,
                      '& + &': { mt: 0 },
                      '&.Mui-expanded': { my: 0.5 },
                    }}
                  >
                    <AccordionSummary expandIcon={<Iconify icon="eva:chevron-down-fill" width={20} />}>
                      <Iconify
                        icon={group.icon}
                        width={20}
                        sx={{ mr: 1.5, color: 'primary.main', flexShrink: 0 }}
                      />
                      <Typography variant="subtitle2">{group.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0, flexDirection: 'column' }}>
                      {group.templates.map((template) => (
                        <LibraryFieldItem
                          key={template.id}
                          template={template}
                          disabled={usedKeys.has(`${template.campo}-${template.tabela}`)}
                        />
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                templates.map((template) => (
                  <LibraryFieldItem
                    key={template.id}
                    template={template}
                    disabled={usedKeys.has(`${template.campo}-${template.tabela}`)}
                  />
                ))
              )}
            </Scrollbar>
          </Card>

          {/* Coluna direita: campos do formulário (canvas) */}
          <Card
            variant="outlined"
            sx={{
              position: 'relative',
              flex: 1,
              minWidth: 0,
              borderStyle: 'dashed',
              borderWidth: 2,
              bgcolor: 'action.hover',
              minHeight: 520,
            }}
          >
            {/* Área droppable cobre todo o card para garantir detecção ao soltar */}
            <Box
              ref={setCanvasRef}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'inherit',
              }}
            />
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                minHeight: 520,
                p: 2,
                borderRadius: 1,
                border: (theme) =>
                  isCanvasOver ? `2px solid ${theme.palette.primary.main}` : '2px dashed transparent',
                bgcolor: 'background.paper',
                boxSizing: 'border-box',
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Campos do formulário (arraste da esquerda ou reordene)
              </Typography>
              <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                {fields.length === 0 && (
                  <Typography variant="body2" color="text.disabled" sx={{ py: 4, textAlign: 'center' }}>
                    Arraste campos da coluna da esquerda para cá.
                  </Typography>
                )}
                {fields.map((field) => (
                  <CanvasFieldItem key={field.id ?? field.tempId} field={field} onRemove={handleRemoveField} />
                ))}
              </SortableContext>
            </Box>
          </Card>
        </Stack>

        <DragOverlay>
          {activeTemplate ? (
            <Card variant="outlined" sx={{ p: 1.5, boxShadow: 3 }}>
              <Typography variant="body2" fontWeight={500}>
                {activeTemplate.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {activeTemplate.campo} ({activeTemplate.tabela})
              </Typography>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </DashboardContent>
  );
}
