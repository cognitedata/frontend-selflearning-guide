import React, {useState} from 'react';
import { AssetSearch, AssetEventsPanel} from "@cognite/gearbox";
import { EventForm } from './EventForm';
import { Row, Col, Button } from 'antd';

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
    const subtype = 'subtype';
    const startTime = Date.now() - 60 * 1000;

    await client.events.create([
      {
        assetIds: [asset.id],
        description,
        type,
        subtype,
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
      </div>
      <div className="body">
        {
          asset && !updating
            ? (
                <>
                  <Row className="actions">
                    <Col span={12} align={"left"}>
                      <EventForm onSubmit={onSubmit} />
                    </Col>
                    <Col span={12} align={"right"}>
                      <Button htmlType="button" onClick={refreshEventsTable}>Refresh Event Table</Button>
                    </Col>
                  </Row>
                  <AssetEventsPanel assetId={asset.id} />
                </>
              )
            : <p>No asset selected</p>
        }
      </div>
    </>
  )
};
