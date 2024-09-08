import React, { useEffect, useRef } from 'react';
import { initialise } from '@open-ic/openchat-xframe';

function OpenChatFrame({ path = '/community/rfeib-riaaa-aaaar-ar3oq-cai/channel/334961401678552956581044255076222828441', theme = 'dark' }) {
  const iframeRef = useRef(null);
  const clientRef = useRef(null);

  useEffect(() => {
    const initOpenChat = async () => {
      if (iframeRef.current) {
        const client = await initialise(iframeRef.current, {
          targetOrigin: 'https://oc.app',
          initialPath: path,
          theme: {
            name: 'my-app-theme',
            base: theme,
            overrides: {
              primary: "green",
              bd: 'rgb(91, 243, 190)',
              bg: 'transparent',
              txt: "black",
              placeholder: "green",
              'txt-light': '#75c8af',
              timeline: {
                txt: "yellow"
              }
              // Puedes añadir más overrides aquí según necesites
            }
          }
        });
        clientRef.current = client;
      }
    };

    initOpenChat();
  }, [path, theme]);

  return (
    <iframe
      ref={iframeRef}
      title="OpenChat Frame"
      style={{ width: '100%', height: '600px', border: 'none' }}
    />
  );
}

export default OpenChatFrame;
