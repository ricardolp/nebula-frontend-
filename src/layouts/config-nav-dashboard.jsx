import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Início - sempre visível no topo
   */
  {
    items: [
      { title: 'Início', path: paths.dashboard.root, icon: ICONS.dashboard },
    ],
  },
  /**
   * Central de Cadastros
   */
  {
    subheader: 'Central de Cadastros',
    items: [
      {
        title: 'Business Partner',
        path: paths.dashboard.businessPartners.root,
        icon: ICONS.user,
        children: [
          { title: 'Listagem', path: paths.dashboard.businessPartners.root },
          { title: 'Formulário completo', path: paths.dashboard.businessPartners.new },
        ],
      },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Gerenciar',
    items: [
      {
        title: 'Acessos',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Usuários', path: paths.dashboard.user.list },
          { title: 'Convites', path: paths.dashboard.invite.list },
          { title: 'Roles', path: paths.dashboard.role.list },
        ],
      },
      {
        title: 'Integrações',
        path: paths.dashboard.integration.list,
        icon: ICONS.external,
      },
      {
        title: 'Workflows',
        path: paths.dashboard.workflows.root,
        icon: ICONS.external,
        children: [
          { title: 'Gerenciar', path: paths.dashboard.workflows.root },
          { title: 'Formulários', path: paths.dashboard.forms.root },
          { title: 'SLAs', path: paths.dashboard.workflowSlas.root },
        ],
      },
      {
        title: 'Solicitações',
        path: paths.dashboard.workflowRequests.root,
        icon: ICONS.order,
        children: [
          { title: 'Gerenciar', path: paths.dashboard.workflowRequests.root },
          { title: 'Pendentes', path: paths.dashboard.workflowRequests.pending },
        ],
      },
    ],
  },
];
