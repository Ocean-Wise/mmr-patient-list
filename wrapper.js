import DataGrid from './DataGrid';
import ReactDOM from 'react-dom';
import React from 'react';

const PatientList = (element) => {
  ReactDOM.render(<DataGrid />,
    element);
};

module.exports = PatientList;
