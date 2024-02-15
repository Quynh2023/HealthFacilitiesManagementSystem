import React from 'react';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import DbDesignImage from '../Components/DbDesign.jpg';

const Home = () => {
  return (
    <div>
      <Nav />
      <h2 style={{ textAlign: 'center', marginTop: '90px' }}>Health Facilities Management System</h2>
      <img
        src={DbDesignImage}
        alt="Main-ER-model-db-design"
        style={{ display: 'block', margin: 'auto', marginTop: '50px', height: '75vh' }}
      />
      <Footer />
    </div>
  );
};

export default Home;

