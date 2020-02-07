import React from 'react';
import { ClientSDKProvider } from '@cognite/gearbox';
import { CogniteClient } from '@cognite/sdk';
import { Content } from './Content';

const client = new CogniteClient({appId: 'Workshop'});
client.loginWithOAuth({project: 'cognitesdk-js'});
client.authenticate();

export const App = () => 
  <ClientSDKProvider client={client}>
    <Content client={client} />
  </ClientSDKProvider>
