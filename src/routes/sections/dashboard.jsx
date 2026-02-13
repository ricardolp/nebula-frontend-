import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
const OverviewCoursePage = lazy(() => import('src/pages/dashboard/course'));
// Product
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// Order
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// Invoice
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// User
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
const InviteListPage = lazy(() => import('src/pages/dashboard/invite/list'));
const RoleListPage = lazy(() => import('src/pages/dashboard/role/list'));
const IntegrationListPage = lazy(() => import('src/pages/dashboard/integration/list'));
const IntegrationCreatePage = lazy(() => import('src/pages/dashboard/integration/new'));
const IntegrationEditPage = lazy(() => import('src/pages/dashboard/integration/edit'));
// Blog
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// Job
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// Tour
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// File manager
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// Workflows, Forms, Workflow requests
const WorkflowsListPage = lazy(() => import('src/pages/dashboard/workflows/index'));
const WorkflowsNewPage = lazy(() => import('src/pages/dashboard/workflows/new'));
const WorkflowEditPage = lazy(() => import('src/pages/dashboard/workflows/edit'));
const FormsListPage = lazy(() => import('src/pages/dashboard/forms/index'));
const FormsNewPage = lazy(() => import('src/pages/dashboard/forms/new'));
const FormsEditPage = lazy(() => import('src/pages/dashboard/forms/edit'));
const WorkflowRequestsListPage = lazy(() => import('src/pages/dashboard/workflow-requests/index'));
const WorkflowRequestsPendingPage = lazy(() => import('src/pages/dashboard/workflow-requests/pending'));
const WorkflowRequestsNewPage = lazy(() => import('src/pages/dashboard/workflow-requests/new'));
const WorkflowRequestDetailsPage = lazy(() => import('src/pages/dashboard/workflow-requests/details'));
const WorkflowSlasListPage = lazy(() => import('src/pages/dashboard/workflow-slas/index'));
// Business Partners
const BusinessPartnersListPage = lazy(() => import('src/pages/dashboard/business-partners/index'));
const BusinessPartnerNewPage = lazy(() => import('src/pages/dashboard/business-partners/new'));
const BusinessPartnerEditPage = lazy(() => import('src/pages/dashboard/business-partners/edit'));
// Materials
const MaterialsListPage = lazy(() => import('src/pages/dashboard/materials/index'));
const MaterialNewPage = lazy(() => import('src/pages/dashboard/materials/new'));
const MaterialEditPage = lazy(() => import('src/pages/dashboard/materials/edit'));
const MaterialViewPage = lazy(() => import('src/pages/dashboard/materials/view'));
// Domains
const DomainsGroupedPage = lazy(() => import('src/pages/dashboard/domains/index'));
const DomainsByTabelaPage = lazy(() => import('src/pages/dashboard/domains/by-tabela'));
// App
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// Test render page by role
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// Blank page
const ParamsPage = lazy(() => import('src/pages/dashboard/params'));
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      { path: 'course', element: <OverviewCoursePage /> },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'invite',
        children: [
          { element: <InviteListPage />, index: true },
          { path: 'list', element: <InviteListPage /> },
        ],
      },
      {
        path: 'role',
        children: [
          { element: <RoleListPage />, index: true },
          { path: 'list', element: <RoleListPage /> },
        ],
      },
      {
        path: 'integration',
        children: [
          { element: <IntegrationListPage />, index: true },
          { path: 'list', element: <IntegrationListPage /> },
          { path: 'new', element: <IntegrationCreatePage /> },
          { path: ':id/edit', element: <IntegrationEditPage /> },
        ],
      },
      {
        path: 'workflows',
        children: [
          { element: <WorkflowsListPage />, index: true },
          { path: 'new', element: <WorkflowsNewPage /> },
          { path: ':id/edit', element: <WorkflowEditPage /> },
        ],
      },
      {
        path: 'forms',
        children: [
          { element: <FormsListPage />, index: true },
          { path: 'new', element: <FormsNewPage /> },
          { path: ':id/edit', element: <FormsEditPage /> },
        ],
      },
      {
        path: 'workflow-requests',
        children: [
          { element: <WorkflowRequestsListPage />, index: true },
          { path: 'pending', element: <WorkflowRequestsPendingPage /> },
          { path: 'new', element: <WorkflowRequestsNewPage /> },
          { path: ':requestId', element: <WorkflowRequestDetailsPage /> },
        ],
      },
      {
        path: 'workflow-slas',
        children: [
          { element: <WorkflowSlasListPage />, index: true },
        ],
      },
      {
        path: 'business-partners',
        children: [
          { element: <BusinessPartnersListPage />, index: true },
          { path: 'new', element: <BusinessPartnerNewPage /> },
          { path: ':id/edit', element: <BusinessPartnerEditPage /> },
        ],
      },
      {
        path: 'materials',
        children: [
          { element: <MaterialsListPage />, index: true },
          { path: 'new', element: <MaterialNewPage /> },
          { path: ':id', element: <MaterialViewPage /> },
          { path: ':id/edit', element: <MaterialEditPage /> },
        ],
      },
      {
        path: 'domains',
        children: [
          { element: <DomainsGroupedPage />, index: true },
          { path: ':tabela', element: <DomainsByTabelaPage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'params', element: <ParamsPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
