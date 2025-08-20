// import React from 'react';
// import { FaRadiationAlt } from 'react-icons/fa';

//  const DosimeterCard = ({ deviceId, data, isStopped }) => {
//   if (!data || data.length === 0) return null;

//   const latest = data[data.length - 1];
//   const previous = data.length > 10 ? data[data.length - 11] : data[0];

//   const currentCPM = latest.cpm;
//   const microsievert = (currentCPM * 0.0057).toFixed(3); // example conversion
//   const time = latest.timestamp;

//   const cpmChange = currentCPM - previous.cpm;
//   const trend = ((cpmChange / previous.cpm) * 100).toFixed(2);

//   const trendColor = trend > 0 ? 'text-danger' : trend < 0 ? 'text-success' : 'text-secondary';
//   const trendIcon = trend > 0 ? '▲' : trend < 0 ? '▼' : '→';

//   return (
//     <div className="card shadow-sm mb-3">
//       <div className="card-header d-flex justify-content-between align-items-center">
//         <span><FaRadiationAlt className="me-2 text-warning" /> Dosimeter: <strong>{deviceId}</strong></span>
//         <small className="text-muted">{new Date(time).toLocaleTimeString()}</small>
//       </div>
//       <div className="card-body">
//         <p className="card-text mb-2">
//           <strong>CPM:</strong> {currentCPM} <br />
//           <strong>µSv/h:</strong> {microsievert}
//         </p>
//         <p className={`card-text mb-0 ${trendColor}`}>
//           <strong>Trend:</strong> {trendIcon} {Math.abs(trend)}%
//         </p>
//       </div>
//     </div>
//   );
// };

// export default DosimeterCard;





// import React from 'react';
// import { FaRadiationAlt } from 'react-icons/fa';

// const DosimeterCard = ({ deviceId, data, isStopped }) => {
//   if (!data || data.length === 0) return null;

//   const latest = data[data.length - 1];
//   const previous = data.length > 10 ? data[data.length - 11] : data[0];

//   const currentCPM = parseFloat(latest.cpm);
//   const microsievert = (currentCPM * 0.0057).toFixed(3);
//   const time = latest.timestamp;

//   const cpmChange = currentCPM - parseFloat(previous.cpm);
//   const trend = ((cpmChange / parseFloat(previous.cpm)) * 100).toFixed(2);

//   const trendColor =
//     trend > 0 ? 'text-danger' : trend < 0 ? 'text-success' : 'text-secondary';
//   const trendIcon = trend > 0 ? '▲' : trend < 0 ? '▼' : '→';

//   return (
//     <div className="card shadow-sm mb-3">
//       <div className="card-header d-flex justify-content-between align-items-center">
//         <span>
//           <FaRadiationAlt className="me-2 text-warning" /> Dosimeter:{' '}
//           <strong>{deviceId}</strong>
//         </span>
//         <small className="text-muted">
//           {new Date(time).toLocaleTimeString()}
//         </small>
//       </div>
//       <div className="card-body">
//         <p className="card-text mb-2">
//           <strong>CPM:</strong> {currentCPM} <br />
//           <strong>µSv/h:</strong> {microsievert}
//         </p>
//         <p className={`card-text mb-0 ${trendColor}`}>
//           <strong>Trend:</strong> {trendIcon} {Math.abs(trend)}%
//         </p>
//       </div>
//     </div>
//   );
// };

// export default DosimeterCard;











import React from 'react';
import { FaRadiationAlt } from 'react-icons/fa';

const DosimeterCard = ({ deviceId, data, isStopped }) => {
  if (!data || data.length === 0) return null;

  const latest = data[data.length - 1];
  const previous = data.length > 10 ? data[data.length - 11] : data[0];
  // console.log("Latest data:", data);
  // console.log("CPM data :", latest);
  const currentCPM = parseFloat(data.cpm);
  const microsievert = (currentCPM * 0.0057).toFixed(3);
  const time = data.timestamp;

  const cpmChange = currentCPM - parseFloat(data.cpm);
  const trend = ((cpmChange / (parseFloat(data.cpm) || 1)) * 100).toFixed(2);

  const trendColor =
    trend > 0 ? 'text-danger' : trend < 0 ? 'text-success' : 'text-secondary';
  const trendIcon = trend > 0 ? '▲' : trend < 0 ? '▼' : '→';

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>
          <FaRadiationAlt className="me-2 text-warning" /> Dosimeter:{' '}
          <strong>{deviceId}</strong>
        </span>
        <small className="text-muted">
          {new Date(time).toLocaleTimeString()}
        </small>
      </div>
      <div className="card-body">
        <p className="card-text mb-2">
          <strong>CPM:</strong> {currentCPM} <br />
          <strong>µSv/h:</strong> {microsievert}
        </p>
        <p className={`card-text mb-0 ${trendColor}`}>
          <strong>Trend:</strong> {trendIcon} {Math.abs(trend)}%
        </p>
      </div>
    </div>
  );
};

export default DosimeterCard;

