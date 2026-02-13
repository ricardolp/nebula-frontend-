import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { DepotCombobox } from './depot-combobox';
import { getDepotsByPlant } from './depot-constants';

export function RHFDepotCombobox({ 
  name, 
  helperText, 
  plantValue,  // Valor direto do centro
  plantFieldName = 'plant',  // Nome do campo do centro no formulário (padrão: 'plant')
  ...other 
}) {
  const { control, watch, setValue } = useFormContext();

  // Observa o valor do campo do centro no formulário
  const watchedPlantValue = watch(plantFieldName);
  const currentDepotValue = watch(name);
  
  // Usa plantValue se fornecido, caso contrário usa o valor do campo observado
  const effectivePlantValue = plantValue ?? watchedPlantValue;

  // Limpa o depósito se o centro mudar e o depósito atual não for válido
  useEffect(() => {
    if (currentDepotValue && effectivePlantValue) {
      const validDepots = getDepotsByPlant(effectivePlantValue);
      const isDepotValid = validDepots.some(depot => depot.code === currentDepotValue);
      
      if (!isDepotValid) {
        setValue(name, '', { shouldValidate: true });
      }
    }
  }, [effectivePlantValue, currentDepotValue, name, setValue]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DepotCombobox
          {...field}
          onChange={(value) => field.onChange(value)}
          plantValue={effectivePlantValue}
          error={!!error}
          helperText={error?.message || helperText}
          {...other}
        />
      )}
    />
  );
}
