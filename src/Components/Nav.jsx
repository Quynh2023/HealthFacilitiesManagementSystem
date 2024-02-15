import React from 'react';
import {Link} from 'react-router-dom';

const Nav = () => {

  return (
    <div>
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top" style={{fontSize: '18px', marginBottom: '100px'}}>
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link active">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/getAllPostalCodes" className="nav-link">PostalCodes</Link>
            </li>
            <li className="nav-item">
              <Link to="/getAllFacilities" className="nav-link">Facilities</Link>
            </li>
            <li className="nav-item">
              <Link to="/getAllEmployees" className="nav-link">Employees</Link>
            </li>
            <li className="nav-item">
              <Link to="/getAllEmployments" className="nav-link">Employments</Link>
            </li>
            <li className="nav-item">
              <Link to="/getAllManagers" className="nav-link">Managers</Link>
            </li>
            <li className="nav-item">
              <Link to="/getAllVaccines" className="nav-link">Vaccines</Link>
            </li>
            <li className="nav-item">
              <Link to="/getAllInfections" className="nav-link">Infections</Link>
            </li>
            <li className="nav-item">
              <Link to="/getAllSchedules" className="nav-link">Schedules</Link>
            </li>
            <li className="nav-item">
              <Link to="/getAllEmailLogs" className="nav-link">EmailLogs</Link>
            </li>
            <li className="nav-item">
              <Link to="/getQuery1" className="nav-link">Query1</Link>
            </li>
            <li className="nav-item">
              <Link to="/getQuery2" className="nav-link">Query2</Link>
            </li>
            <li className="nav-item">
              <Link to="/getQuery3" className="nav-link">Query3</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  );
};

export default Nav;
