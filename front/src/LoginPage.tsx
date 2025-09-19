import * as React from 'react';
import { Form, Login, TextInput, required, useLogin, useNotify } from 'react-admin';
import type { SubmitHandler } from 'react-hook-form';

type LoginValues = {
  username: string;
  password: string;
};

export const LoginPage: React.FC = () => {
  const login = useLogin();
  const notify = useNotify();

  const onSubmit: SubmitHandler<any> = async (values) => {
    try {
      await login(values);
    } catch (e: any) {
      notify(e?.message || 'Credenciales inválidas', { type: 'warning' });
    }
  };

  return (
    <Login>
      <Form<LoginValues> onSubmit={onSubmit} defaultValues={{ username: '', password: '' }}>
        <TextInput
          source="username"
          label="Correo electrónico"
          type="email"
          autoComplete="username"
          validate={required()}
          fullWidth
        />
        <TextInput
          source="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          validate={required()}
          fullWidth
        />
      </Form>
    </Login>
  );
};
