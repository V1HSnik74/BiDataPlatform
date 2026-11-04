export const ROUTES = {
  HOME: '/',
  SOURCES: '/sources',
  DASHBOARDS: '/dashboards',
  ADMIN: '/admin',
  DATASET_VIEW: {
    path: '/sources/:id',
    build: (id: number | string) => `/sources/${id}`,
  },
  NEWCHART: '/dashboards/new',
} as const
