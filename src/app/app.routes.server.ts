import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rotas estáticas e página inicial pré-renderizadas
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'home',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'tecnicos',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'tecnicos/create',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'clientes',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'clientes/create',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'chamados',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'chamados/create',
    renderMode: RenderMode.Prerender,
  },

  // Rotas dinâmicas — renderização no servidor (sem necessidade de getPrerenderParams)
  {
    path: 'tecnicos/update/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'tecnicos/change-password/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'tecnicos/delete/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'clientes/update/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'clientes/change-password/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'clientes/delete/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'chamados/update/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'chamados/read/:id',
    renderMode: RenderMode.Server,
  },

  // Catch-all para quaisquer outras rotas, usando prerender
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  }
];
