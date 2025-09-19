import spanishMessages from '@blackbox-vision/ra-language-spanish';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import * as React from 'react';
import { Admin, Resource } from 'react-admin';
import { authProvider } from './authProvider';
import { dataProvider } from './dataProvider';
import { LoginPage } from './LoginPage';
import { TaskCreate, TaskEdit, TaskList } from './resources/tasks';
import { theme } from './theme';

// i18n: español
const i18nProvider = polyglotI18nProvider(() => ({
  ...spanishMessages,
  resources: {
    tasks: {
      name: 'Tarea |||| Tareas',
      fields: {
        id: 'ID',
        title: 'Título',
        description: 'Descripción',
        status: 'Estado',
        createdAt: 'Creada',
        updatedAt: 'Actualizada',
      },
    },
  },
}), 'es');

export const App: React.FC = () => {
  return (
    <Admin
      title="Administrador de Tareas"
      theme={theme}
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      i18nProvider={i18nProvider}
      requireAuth={true}
    >
      <Resource
        name="tasks"
        options={{ label: 'Tareas' }}
        list={TaskList}
        create={TaskCreate}
        edit={TaskEdit}
      />
    </Admin>
  );
};
