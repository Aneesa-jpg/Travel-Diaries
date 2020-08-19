import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';

import {listLogEnteries} from './API';
import LogEntryForm from './LogEntryForm';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntry, setAddEntry] = useState();
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 3
  });

  const getEntries = async () => {
        const logEntries = await listLogEnteries();
        setLogEntries(logEntries);
        console.log(logEntries);
  }

  useEffect(() => {
  // IIFE
    getEntries()
  }, []);

  const showAddMarkerPopup = (event) => {
    const [ longitude, latitude ] = event.lngLat;
    setAddEntry({
      latitude,
      longitude,
    });
  };


  return (
    <ReactMapGL
      {...viewport}
      mapStyle='mapbox://styles/cactus-chick/ckdzxooq00vzv19qksmerupz4'
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >
    {
      logEntries.map(entry => (
        <React.Fragment key={entry._id}>
          <Marker latitude={entry.latitude} longitude={entry.longitude} offsetLeft={-24} offsetTop={-12} >
            <div onClick={() => setShowPopup({
                  [entry._id]: true,
                })}>
              <svg style= {{width: "24px", height: "24px"}} className='marker' fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
          </Marker>
          {
            showPopup[entry._id] ? (<Popup
              latitude={entry.latitude}
              longitude={entry.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setShowPopup({})}
              dynamicPosition={true}
              anchor="top" >
            <div className='popup'>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
              <span>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</span>
            </div>
          </Popup> ) : null
          }
        </React.Fragment>
      )) 
    }
    {
      addEntry ? ( 
        <> 
          <Marker key={addEntry._id} latitude={addEntry.latitude} longitude={addEntry.longitude} offsetLeft={-24} offsetTop={-12} >
            <div>
              <svg style= {{width: "24px", height: "24px"}} className='add-marker' fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
          </Marker>
          <Popup
              latitude={addEntry.latitude}
              longitude={addEntry.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setAddEntry(null)}
              dynamicPosition={true}
              anchor="top" >
            <div className='popup'>
              <LogEntryForm location={addEntry} onClose={ () => 
              {setAddEntry(null);
              getEntries()}} />
            </div>
          </Popup> 

        </> 
      ) : null
    }

    
    </ReactMapGL>
  );
}
export default App;
