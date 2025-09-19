import * as React from 'react';
import {
  Button,
  Create,
  CreateButton,
  Datagrid,
  Edit,
  EditButton,
  ExportButton,
  List,
  NumberField,
  SelectField,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  TopToolbar,
  useDataProvider,
  useNotify,
  useRecordContext,
  useRefresh,
} from 'react-admin';
import type { Task, TaskStatus } from '../types';

const estadoChoices = [
  { id: 'pending', name: 'Pendiente' },
  { id: 'completed', name: 'Completada' },
];

const AccionesLista = () => (
  <TopToolbar>
    <CreateButton label="Nueva tarea" />
    <ExportButton label="Exportar" />
  </TopToolbar>
);

const FiltrosTareas = [
  <TextInput
    key="q"
    label="Buscar (título o descripción)"
    source="q"
    alwaysOn
  />,
  <SelectInput
    key="status"
    label="Estado"
    source="status"
    choices={estadoChoices}
    alwaysOn
    emptyText="Todos"
    emptyValue={undefined}
  />,
];

const BotonAlternarEstado: React.FC = () => {
  const record = useRecordContext<Task>();
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();

  if (!record) return null;
  const siguiente: TaskStatus = record.status === 'completed' ? 'pending' : 'completed';

  return (
    <Button
      label={record.status === 'completed' ? 'Marcar como pendiente' : 'Marcar como completada'}
      onClick={async () => {
        try {
          await dataProvider.update('tasks', {
            id: record.id,
            data: { ...record, status: siguiente },
            previousData: record,
          });
          notify('Actualizada', { type: 'info' });
          refresh();
        } catch (e: any) {
          notify(e.message || 'Error', { type: 'warning' });
        }
      }}
    />
  );
};

export const TaskList: React.FC = () => (
  <List
    perPage={25}
    filters={FiltrosTareas as any}
    sort={{ field: 'id', order: 'DESC' }}
    actions={<AccionesLista />}
    title="Tareas"
  >
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" label="ID" />
      <TextField source="title" label="Título" />
      <TextField source="description" label="Descripción" />
      <SelectField source="status" choices={estadoChoices} label="Estado" />
      <EditButton label="Editar" />
      <BotonAlternarEstado />
    </Datagrid>
  </List>
);

export const TaskCreate: React.FC = () => (
  <Create title="Crear tarea">
    <SimpleForm>
      <TextInput source="title" label="Título" fullWidth required />
      <TextInput source="description" label="Descripción" fullWidth multiline minRows={3} />
      <SelectInput source="status" label="Estado" choices={estadoChoices} defaultValue="pending" />
    </SimpleForm>
  </Create>
);

export const TaskEdit: React.FC = () => (
  <Edit title="Editar tarea">
    <SimpleForm>
      <TextInput source="title" label="Título" fullWidth required />
      <TextInput source="description" label="Descripción" fullWidth multiline minRows={3} />
      <SelectInput source="status" label="Estado" choices={estadoChoices} />
    </SimpleForm>
  </Edit>
);
