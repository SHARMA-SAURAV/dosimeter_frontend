function DosimeterSection({ dosimeterData }) {
  return (
    <div className="dosimeter-section">
      <h2>Dosimeter Data</h2>
      {dosimeterData.map((data, index) => (
        <div key={index} className="dosimeter-item">
          <p><strong>Date:</strong> {data.date}</p>
          <p><strong>Value:</strong> {data.value} mSv</p>
          <p><strong>Location:</strong> {data.location}</p>
        </div>
      ))}
    </div>
  );
}
export default DosimeterSection;