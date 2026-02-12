import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * Migration Table Row
 * Linha da tabela de dados de migração do sistema legado
 */
export function MigrationTableRow({ row, selected, onSelectRow }) {
  const [openDetails, setOpenDetails] = useState(false);

  const handleOpenDetails = useCallback(() => {
    setOpenDetails(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setOpenDetails(false);
  }, []);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>{row.id}</TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {row.origem}
          </Typography>
        </TableCell>

        <TableCell>{row.codigo_do_parceiro || '-'}</TableCell>

        <TableCell>
          <Typography variant="body2" sx={{ maxWidth: 250 }} noWrap>
            {row.razao_social_nome || '-'}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" fontFamily="monospace">
            {row.cnpj_cpf || '-'}
          </Typography>
        </TableCell>

        <TableCell>
          <Chip
            label={row.tipo_juridico === 'F' ? 'Física' : 'Jurídica'}
            size="small"
            color={row.tipo_juridico === 'F' ? 'primary' : 'secondary'}
            variant="soft"
          />
        </TableCell>

        <TableCell>
          <Chip
            label={row.status === 'A' ? 'Ativo' : 'Inativo'}
            size="small"
            color={row.status === 'A' ? 'success' : 'error'}
            variant="soft"
          />
        </TableCell>

        <TableCell>{row.empresa || '-'}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenDetails}>
            <Iconify icon="solar:eye-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Dialog 
        open={openDetails} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalhes do Registro
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            {/* Informações Básicas */}
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Informações Básicas
              </Typography>
              <Stack spacing={1}>
                <DetailRow label="ID" value={row.id} />
                <DetailRow label="Origem" value={row.origem} />
                <DetailRow label="Código do Parceiro" value={row.codigo_do_parceiro} />
                <DetailRow label="Nr. Matrícula BP" value={row.nr_matric_bp} />
                <DetailRow label="Empresa" value={row.empresa} />
                <DetailRow label="Centro/Filial" value={row.centro_filial} />
              </Stack>
            </Box>

            <Divider />

            {/* Dados Pessoais/Empresariais */}
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Dados Pessoais/Empresariais
              </Typography>
              <Stack spacing={1}>
                <DetailRow label="Razão Social/Nome" value={row.razao_social_nome} />
                <DetailRow label="Nome Fantasia/Sobrenome" value={row.nome_fantasia_sobrenome} />
                <DetailRow label="Tipo Jurídico" value={row.tipo_juridico === 'F' ? 'Física' : 'Jurídica'} />
                <DetailRow label="Gênero" value={row.genero} />
                <DetailRow label="Data de Nascimento/Abertura" value={row.data_nascimento_abertura ? fDate(row.data_nascimento_abertura) : '-'} />
                <DetailRow label="CPF/CNPJ" value={row.cnpj_cpf} />
                <DetailRow label="Inscrição Estadual" value={row.inscricao_estadual} />
                <DetailRow label="Inscrição Municipal" value={row.inscricao_municipal} />
                <DetailRow label="RG" value={row.rg} />
                <DetailRow label="Órgão Expedidor RG" value={row.orgao_expedidor_da_rg} />
              </Stack>
            </Box>

            <Divider />

            {/* Endereço */}
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Endereço
              </Typography>
              <Stack spacing={1}>
                <DetailRow label="Endereço" value={row.endereco} />
                <DetailRow label="Número" value={row.numero} />
                <DetailRow label="Complemento" value={row.complemento_do_endereco} />
                <DetailRow label="Bairro" value={row.bairro} />
                <DetailRow label="Município" value={row.descricao_do_municipio} />
                <DetailRow label="Estado" value={row.estado_do_municipio} />
                <DetailRow label="CEP" value={row.cep} />
                <DetailRow label="País" value={row.nome_do_pais} />
              </Stack>
            </Box>

            <Divider />

            {/* Contato */}
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Contato
              </Typography>
              <Stack spacing={1}>
                <DetailRow label="Telefone 1" value={row.telefone_1} />
                <DetailRow label="Telefone 2" value={row.telefone_2} />
                <DetailRow label="Celular" value={row.numero_celular} />
                <DetailRow label="Email" value={row.email_do_contato_em_geral} />
              </Stack>
            </Box>

            <Divider />

            {/* Tributação */}
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Tributação
              </Typography>
              <Stack spacing={1}>
                <DetailRow label="Tipo de Contribuinte ICMS" value={row.tipo_de_contribuinte_de_icms} />
                <DetailRow label="Tipo de ISSQN" value={row.tipo_de_issqn} />
                <DetailRow label="Simples Nacional" value={row.simples_nacional} />
                <DetailRow label="Tipo de Tributação" value={row.tipo_de_tributacao} />
                <DetailRow label="Tributa SENAR" value={row.tributa_senar} />
                <DetailRow label="Tipo de Contribuinte PIS/COFINS" value={row.tipo_de_contribuinte_pis_cofins} />
                <DetailRow label="Tipo de Contribuinte IPI" value={row.tipo_de_contribuinte_ipi} />
                <DetailRow label="ISSQN Retido" value={row.issqn_retido} />
                <DetailRow label="IRF" value={row.irf_imposto_retido_na_fonte} />
              </Stack>
            </Box>

            <Divider />

            {/* Classificação */}
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Classificação
              </Typography>
              <Stack spacing={1}>
                <DetailRow label="É Cliente?" value={row.o_parceiro_e_um_cliente} />
                <DetailRow label="É Cooperado?" value={row.o_parceiro_e_um_cooperado} />
                <DetailRow label="É Fornecedor?" value={row.o_parceiro_e_um_fornec} />
                <DetailRow label="Categoria de Fornecedores" value={row.categoria_de_fornecedores} />
                <DetailRow label="Categoria de Clientes" value={row.categoria_de_clientes} />
                <DetailRow label="Atividade" value={row.atividade} />
                <DetailRow label="CNAE" value={row.cnae} />
              </Stack>
            </Box>

            {/* Dados Adicionais para Cooperados */}
            {row.o_parceiro_e_um_cooperado === 'S' && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Dados do Cooperado
                  </Typography>
                  <Stack spacing={1}>
                    <DetailRow label="Posto Acerto" value={row.posto_acerto} />
                    <DetailRow label="Nome Posto Acerto" value={row.nome_posto_acerto} />
                    <DetailRow label="Centro" value={row.centro} />
                    <DetailRow label="Matrícula" value={row.matricula} />
                    <DetailRow label="Porte Cooperado" value={row.porte_cooperado} />
                    <DetailRow label="Movimentação de Contas" value={row.movimentacao_de_contas} />
                    <DetailRow label="Grupo Compra" value={row.grupo_compra} />
                    <DetailRow label="Tipo PN" value={row.tipo_pn} />
                    <DetailRow label="Nome do Pai" value={row.nome_do_pai} />
                    <DetailRow label="Nome da Mãe" value={row.nome_da_mae} />
                    <DetailRow label="Nome Cônjuge" value={row.nome_conjuge} />
                    <DetailRow label="Regime Casamento" value={row.regime_casamento} />
                    <DetailRow label="Nº Dependentes" value={row.numero_dependentes} />
                  </Stack>
                </Box>
              </>
            )}

            <Divider />

            {/* Metadados */}
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Metadados
              </Typography>
              <Stack spacing={1}>
                <DetailRow label="Status" value={row.status === 'A' ? 'Ativo' : 'Inativo'} />
                <DetailRow label="Data de Cadastro" value={row.data_de_cadastro ? fDate(row.data_de_cadastro) : '-'} />
                <DetailRow label="Data Inserção Registro" value={row.data_da_insercao_do_registro ? fDate(row.data_da_insercao_do_registro) : '-'} />
                <DetailRow label="Data Unificação" value={row.data_unificacao ? fDate(row.data_unificacao) : '-'} />
                <DetailRow label="Created At" value={row.created_at ? fDate(row.created_at) : '-'} />
              </Stack>
            </Box>

            {/* Observações */}
            {(row.observacoes_do_cadastro || row.outras_informacoes) && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Observações
                  </Typography>
                  <Stack spacing={1}>
                    <DetailRow label="Observações do Cadastro" value={row.observacoes_do_cadastro} />
                    <DetailRow label="Outras Informações" value={row.outras_informacoes} />
                  </Stack>
                </Box>
              </>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDetails} variant="contained">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

/**
 * Componente auxiliar para exibir linha de detalhe
 */
function DetailRow({ label, value }) {
  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 200 }}>
        {label}:
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value || '-'}
      </Typography>
    </Stack>
  );
}

