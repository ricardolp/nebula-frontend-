import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    login: '/api/auth/login',
    signUp: '/api/auth/sign-up',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  organization: {
    users: (organizationId) => `/api/organizations/${organizationId}/users`,
    user: (organizationId, userId) => `/api/organizations/${organizationId}/users/${userId}`,
    me: (organizationId) => `/api/organizations/${organizationId}/me`,
    roles: (organizationId) => `/api/organizations/${organizationId}/roles`,
    role: (organizationId, roleId) => `/api/organizations/${organizationId}/roles/${roleId}`,
    workflows: (organizationId) => `/api/organizations/${organizationId}/workflows`,
    workflow: (organizationId, workflowId) =>
      `/api/organizations/${organizationId}/workflows/${workflowId}`,
    workflowSteps: (organizationId, workflowId) =>
      `/api/organizations/${organizationId}/workflows/${workflowId}/steps`,
    workflowStep: (organizationId, workflowId, stepId) =>
      `/api/organizations/${organizationId}/workflows/${workflowId}/steps/${stepId}`,
    workflowRequests: (organizationId) =>
      `/api/organizations/${organizationId}/workflow-requests`,
    workflowRequestsPendingMyApproval: (organizationId) =>
      `/api/organizations/${organizationId}/workflow-requests/pending-my-approval`,
    workflowRequest: (organizationId, requestId) =>
      `/api/organizations/${organizationId}/workflow-requests/${requestId}`,
    bps: (organizationId) => `/api/organizations/${organizationId}/bps`,
    bp: (organizationId, bpId) => `/api/organizations/${organizationId}/bps/${bpId}`,
    workflowSlas: (organizationId) =>
      `/api/organizations/${organizationId}/workflow-slas`,
    forms: (organizationId) => `/api/organizations/${organizationId}/forms`,
    form: (organizationId, formId) =>
      `/api/organizations/${organizationId}/forms/${formId}`,
    formFields: (organizationId, formId) =>
      `/api/organizations/${organizationId}/forms/${formId}/fields`,
    formField: (organizationId, formId, fieldId) =>
      `/api/organizations/${organizationId}/forms/${formId}/fields/${fieldId}`,
    integrations: (organizationId) => `/api/organizations/${organizationId}/integration`,
    integration: (organizationId, integrationId) =>
      `/api/organizations/${organizationId}/integration/${integrationId}`,
    integrationSync: (organizationId, integrationId) =>
      `/api/organizations/${organizationId}/integration/${integrationId}/sync`,
  },
  roleTypes: '/api/role-types',
  invite: '/api/invite',
  inviteOrganization: {
    pending: (organizationId) => `/api/invite/organization/${organizationId}/pending`,
    delete: (organizationId, inviteId) =>
      `/api/invite/organization/${organizationId}/${inviteId}`,
  },
};
