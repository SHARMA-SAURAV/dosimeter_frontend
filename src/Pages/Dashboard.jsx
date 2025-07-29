import React from 'react';
import DosimeterCard from '../components/DosimeterCard';
import RadiationChart from '../components/RadiationChart';
// import DosimeterCard from './DosimeterCard';
// import RadiationChart from './RadiationChart';

const Dashboard = ({ dosimeterData, stoppedDevices }) => (
  <div className="container my-4">
    {/* <h2 className="mb-4">Dosimeter Monitoring Dashboard</h2> */}
    <div className="row">
      <div className="col-md-4">
        {Object.entries(dosimeterData).map(([id, data]) => (
          <DosimeterCard
            key={id}
            deviceId={id}
            data={data}
            isStopped={stoppedDevices[id]}
          />
        ))}
      </div>
      <div className="col-md-8">
        <RadiationChart dosimeterData={dosimeterData} />
      </div>
    </div>
  </div>
);


export default Dashboard;
