import React from 'react';
import '../index.css'; // Assuming you are using index.css for global styles
import EARISTLogo from '../assets/EARIST_Logo.png'; // Adjust the path if necessary

function Contact() {
  return (
    <div className="contact-container">
      <div className="header">
        <img src={EARISTLogo} alt="EARIST Logo" className="logo" />
        <h1 className="title">Eulogio "Amang" Rodriguez Institute of Science and Technology</h1>
      </div>
      <p className="address">Nagtahan, Sampaloc, Manila</p>
      <div className="about">
        <p>
          We are Group 1 of the Web Development course. Our program is Bachelor of Science in Information Technology, and we are currently third-year students from Section C.
        </p>
        <h3>Leader:</h3>
        <p>Laurence Paul Quiniano</p>
        <h3>Members:</h3>
        <ul>
          <li>Angela Tanya Navarrosa</li>
          <li>Ericka Anne Yang</li>
          <li>Febrich Faith Marin</li>
          <li>Jhon Reymar Yruma</li>
        </ul>
      </div>
    </div>
  );
}

export default Contact;
