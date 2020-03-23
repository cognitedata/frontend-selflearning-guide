import React, {useState} from 'react';
import { AssetSearch, AssetEventsPanel} from "@cognite/gearbox";
import { EventForm } from './EventForm';

const searchStyle = {
  searchResultList: {
    container: {
      maxHeight: '200px',
      overflow: 'auto'
    }
  }
};

export const Content = ({client}) => {
  const [asset, setAsset] = useState();
  const [updating, setUpdating] = useState(false);
  const onLiveSearchSelect = (selectedAsset) => {
    setAsset(selectedAsset);
  };
  const onSubmit = async values => {
    const {description, type} = values;
    const startTime = Date.now() - 60 * 1000;

    await client.events.create([
      {
        assetIds: [asset.id],
        description,
        type,
        startTime
      }
    ]);
  };
  const refreshEventsTable = async () => {
    await setUpdating(true);
    await setUpdating(false);
  };

  return (
    <>
      <div className="header">
        <AssetSearch onLiveSearchSelect={onLiveSearchSelect} styles={searchStyle}/>
        <button onClick={refreshEventsTable}>Refresh</button>
      </div>
      <div className="body">
        {
          asset && !updating
            ? (
                <>
                  <EventForm onSubmit={onSubmit} />
                  <AssetEventsPanel assetId={asset.id} />
                </>
              )
            : <p>No asset selected</p>
        }
      </div>
    </>
  )
};
