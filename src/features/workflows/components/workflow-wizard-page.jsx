import { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
import { Iconify } from 'src/components/iconify';

import {
  createOrganizationWorkflow,
  getOrganizationWorkflow,
  patchOrganizationWorkflow,
  createOrganizationWorkflowStep,
  patchOrganizationWorkflowStep,
  deleteOrganizationWorkflowStep,
} from 'src/actions/workflows';
import { getOrganizationForms } from 'src/actions/forms';
import { getOrganizationRoles } from 'src/actions/roles';

// ----------------------------------------------------------------------

function SortableStepItem({
  step,
  index,
  forms,
  roles,
  onUpdate,
  onRemove,
}) {
  const sortableId = `step-${index}`;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      variant="outlined"
      style={style}
      sx={{
        opacity: isDragging ? 0.85 : 1,
        boxShadow: isDragging ? 3 : 0,
        borderRadius: 1.5,
        overflow: 'hidden',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minWidth: 0,
          }}
        >
          <IconButton
            size="small"
            sx={{
              cursor: 'grab',
              color: 'text.secondary',
              '&:active': { cursor: 'grabbing' },
            }}
            {...attributes}
            {...listeners}
          >
            <Iconify icon="solar:hamburger-menu-bold" width={20} />
          </IconButton>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              typography: 'caption',
              fontWeight: 700,
            }}
          >
            {index + 1}
          </Box>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ flex: 1, minWidth: 0 }}
        >
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 220 } }}>
            <InputLabel>Formulário</InputLabel>
            <Select
              value={step.formId}
              label="Formulário"
              onChange={(e) => onUpdate(index, 'formId', e.target.value)}
            >
              {forms.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
            <InputLabel>Perfil aprovador</InputLabel>
            <Select
              value={step.organizationRoleId}
              label="Perfil aprovador"
              onChange={(e) => onUpdate(index, 'organizationRoleId', e.target.value)}
            >
              {roles.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <IconButton
          size="small"
          color="error"
          onClick={() => onRemove(index)}
          sx={{ ml: 'auto', flexShrink: 0 }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" width={20} />
        </IconButton>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

/**
 * @param {string} [workflowId]
 * @param {object|null} initialWorkflow - { id, type, action, name, steps?: [] }
 * @param {boolean} isNew
 * @param {() => void} [goToList] - callback para voltar à listagem (ex.: navigate)
 * @param {(workflowId: string) => void} [goToEdit] - callback para ir à edição após criar
 */
export function WorkflowWizardPage({
  workflowId,
  initialWorkflow,
  isNew,
  goToList = () => window.history.back(),
  goToEdit = () => {},
}) {
  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [type, setType] = useState(initialWorkflow?.type ?? 'material');
  const [action, setAction] = useState(initialWorkflow?.action ?? 'create');
  const [name, setName] = useState(initialWorkflow?.name ?? '');
  const [steps, setSteps] = useState(() => {
    const s = initialWorkflow?.steps ?? [];
    return [...s]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((st) => ({
        id: st.id,
        formId: st.formId ?? '',
        organizationRoleId: st.organizationRoleId ?? '',
        order: st.order ?? 0,
      }));
  });
  const [forms, setForms] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingFormsRoles, setLoadingFormsRoles] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!organizationId) {
      setLoadingFormsRoles(false);
      return;
    }
    let cancelled = false;
    setLoadingFormsRoles(true);
    Promise.all([
      getOrganizationForms(organizationId, { activeOnly: true }),
      getOrganizationRoles(organizationId),
    ])
      .then(([formsData, rolesData]) => {
        if (cancelled) return;
        setForms(Array.isArray(formsData) ? formsData : []);
        setRoles(Array.isArray(rolesData) ? rolesData : []);
      })
      .catch(() => {
        if (!cancelled) {
          setForms([]);
          setRoles([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingFormsRoles(false);
      });
    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  const entityForms = forms.filter((f) => (f.entity ?? 'material') === type);

  const addStep = useCallback(() => {
    const nextOrder = steps.length;
    const firstFormId = entityForms[0]?.id ?? '';
    const firstRoleId = roles[0]?.id ?? '';
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setSteps((prev) => [
      ...prev,
      {
        formId: firstFormId,
        organizationRoleId: firstRoleId,
        order: nextOrder,
        tempId,
      },
    ]);
  }, [steps.length, entityForms, roles]);

  const removeStep = useCallback((index) => {
    setSteps((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, order: i }))
    );
  }, []);

  const updateStep = useCallback((index, field, value) => {
    setSteps((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      )
    );
  }, []);

  const moveStep = useCallback((oldIndex, newIndex) => {
    if (oldIndex === newIndex || newIndex < 0 || newIndex >= steps.length) return;
    setSteps((prev) => {
      const reordered = arrayMove(prev, oldIndex, newIndex);
      return reordered.map((s, i) => ({ ...s, order: i }));
    });
  }, [steps.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;
    if (!activeId.startsWith('step-') || !overId.startsWith('step-')) return;
    const activeIdx = parseInt(activeId.replace('step-', ''), 10);
    const overIdx = parseInt(overId.replace('step-', ''), 10);
    if (!Number.isNaN(activeIdx) && !Number.isNaN(overIdx)) moveStep(activeIdx, overIdx);
  }, [moveStep]);

  const handleSave = async () => {
    if (!organizationId) {
      toast.error('Organização não selecionada.');
      return;
    }

    setSaving(true);
    try {
      let targetWorkflowId = workflowId;

      if (isNew) {
        const payload = {
          type,
          action,
          name: name.trim() || undefined,
        };
        const workflow = await createOrganizationWorkflow(organizationId, payload);
        const createdId = workflow?.id;
        if (!createdId) {
          toast.error('Falha ao criar workflow.');
          setSaving(false);
          return;
        }
        toast.success('Workflow criado.');
        goToEdit(createdId);
        setSaving(false);
        return;
      }

      await patchOrganizationWorkflow(organizationId, workflowId, {
        type,
        action,
        name: name.trim() || undefined,
      });
      toast.success('Workflow atualizado.');
      targetWorkflowId = workflowId;

      const originalSteps = (initialWorkflow?.steps ?? []).sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      const originalIds = new Set(originalSteps.map((s) => s.id).filter(Boolean));
      const currentWithIds = steps.filter((s) => s.id);
      const currentIds = new Set(currentWithIds.map((s) => s.id));

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const stepOrder = i;
        if (step.id) {
          const orig = originalSteps.find((s) => s.id === step.id);
          if (
            orig &&
            (orig.formId !== step.formId ||
              orig.organizationRoleId !== step.organizationRoleId ||
              (orig.order ?? 0) !== stepOrder)
          ) {
            await patchOrganizationWorkflowStep(
              organizationId,
              targetWorkflowId,
              step.id,
              {
                formId: step.formId,
                organizationRoleId: step.organizationRoleId,
                order: stepOrder,
              }
            );
          }
        } else {
          await createOrganizationWorkflowStep(organizationId, targetWorkflowId, {
            formId: step.formId,
            organizationRoleId: step.organizationRoleId,
            order: stepOrder,
          });
        }
      }

      for (const id of originalIds) {
        if (!currentIds.has(id)) {
          await deleteOrganizationWorkflowStep(organizationId, targetWorkflowId, id);
        }
      }

      toast.success('Passos salvos.');
      goToList();
    } catch (err) {
      toast.error(err?.message || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5">
          {isNew ? 'Novo workflow' : 'Editar workflow'}
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" color="inherit" onClick={goToList}>
            Cancelar
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleSave}
            loading={saving}
            disabled={loadingFormsRoles}
          >
            {isNew ? 'Criar e configurar' : 'Salvar'}
          </LoadingButton>
        </Stack>
      </Box>

      <Card sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
          Dados do workflow
        </Typography>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            useFlexGap
            sx={{ flexWrap: 'wrap' }}
          >
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 180 } }} disabled={!isNew}>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={type}
                label="Tipo"
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="material">Material</MenuItem>
                <MenuItem value="partner">Parceiro</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 180 } }} disabled={!isNew}>
              <InputLabel>Ação</InputLabel>
              <Select
                value={action}
                label="Ação"
                onChange={(e) => setAction(e.target.value)}
              >
                <MenuItem value="create">Criar</MenuItem>
                <MenuItem value="update">Atualizar</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Nome (opcional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Workflow Material - Criação"
              sx={{ flex: 1, minWidth: { xs: '100%', sm: 260 } }}
            />
          </Stack>
        </Stack>
      </Card>

      {!isNew && (
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2.5,
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Passos do workflow
            </Typography>
            <Button
              variant="soft"
              color="primary"
              size="small"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addStep}
              disabled={loadingFormsRoles}
            >
              Adicionar passo
            </Button>
          </Box>
          {steps.length === 0 && (
            <Box
              sx={{
                py: 6,
                px: 2,
                textAlign: 'center',
                borderRadius: 1.5,
                border: 1,
                borderStyle: 'dashed',
                borderColor: 'divider',
                bgcolor: 'action.hover',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Nenhum passo. Clique em &quot;Adicionar passo&quot; para começar.
              </Typography>
            </Box>
          )}
          {steps.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={pointerWithin}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={steps.map((_, i) => `step-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                <Stack spacing={1.5}>
                  {steps.map((step, index) => (
                    <SortableStepItem
                      key={step.id ?? step.tempId ?? `step-${index}`}
                      step={step}
                      index={index}
                      forms={entityForms}
                      roles={roles}
                      onUpdate={updateStep}
                      onRemove={removeStep}
                    />
                  ))}
                </Stack>
              </SortableContext>
            </DndContext>
          )}
        </Card>
      )}
    </Stack>
  );
}
