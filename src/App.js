import React, {useEffect, useState} from 'react';
import { ClientSDKProvider } from '@cognite/gearbox';
import { CogniteClient } from '@cognite/sdk';
import { Content } from './Content';

const sdk = new CogniteClient({appId: 'Workshop'});
const auth = async (setClient) => {
  sdk.loginWithOAuth({project: 'cognitesdk-js'});
  await sdk.authenticate();

  setClient(sdk);
};

export const App = () => {
  const [client, setClient] = useState();

  useEffect(() => {
    auth(setClient);
  }, []);

  return (
      <>
        {
          !client
            ? <p>You need to authenticate first</p>
            : (<ClientSDKProvider client={client}>
                 <Content client={client} />
               </ClientSDKProvider>)
        }
      </>
  );
};
