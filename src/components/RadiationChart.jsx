// import React from 'react';
// import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const RadiationChart = ({ dosimeterData }) => {
//   const lines = Object.entries(dosimeterData).map(([id, data], index) => (
//     <Line
//       key={id}
//       type="monotone"
//       dataKey="cpm"
//       name={id}
//       data={data}
//       stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`}
//       dot={false}
//     />
//   ));

//   const mergedData = Object.entries(dosimeterData).reduce((acc, [id, values]) => {
//     values.forEach((v, i) => {
//       if (!acc[i]) acc[i] = { time: v.time };
//       acc[i][id] = parseFloat(v.cpm);
//     });
//     return acc;
//   }, []);

//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <LineChart data={mergedData}>
//         <XAxis dataKey="time" />
//         <YAxis domain={[0, 'dataMax + 0.1']} />
//         <Tooltip />
//         <Legend />
//         {lines}
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };

// export default RadiationChart;

















import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const RadiationChart = ({ dosimeterData }) => {
  // Merge data from all dosimeters by timestamp
  const mergedData = [];
  const dosimeterIds = Object.keys(dosimeterData);

  dosimeterIds.forEach((id) => {
    dosimeterData[id].forEach((entry, i) => {
      if (!mergedData[i]) mergedData[i] = { time: entry.timestamp };
      mergedData[i][id] = parseFloat(entry.cpm);
    });
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={mergedData}>
        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
        <YAxis domain={[0, 'dataMax + 10']} tick={{ fontSize: 10 }} />
        <Tooltip />
        <Legend />
        {dosimeterIds.map((id, index) => (
          <Line
            key={id}
            type="monotone"
            dataKey={id}
            name={`Dosimeter ${id}`}
            stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`}
            dot={false}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RadiationChart;
