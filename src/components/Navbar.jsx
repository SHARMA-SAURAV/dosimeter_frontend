import React from 'react';

function Navbar() {
    return (
        <div className="navbar" style={{ backgroundColor: 'white', }}>
            <nav style={{  justifyContent: 'space-between', alignItems: 'center', margin: '10 px', }}>
                <h1 className='header' style={{color: '#0070E0', fontSize: "35px",  marginBottom:'-5px'}}>Dosimeter Monitoring Dashboard</h1>
                <hr />
                <h4 style={{ marginTop:'5px'}}>Monitoring radiation levels across multiple dosimeter device in real time  </h4>
                
            </nav>
        </div>

    );
}
export default Navbar;