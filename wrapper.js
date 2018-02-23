import DataGrid from './DataGrid';
import ReactDOM from 'react-dom';
import React from 'react';

const PatientList = (element, globalStyle=``, lgMax=``, xsMax=``) => {
  ReactDOM.render(<DataGrid globalStyle={globalStyle} lgMax={lgMax} xsMax={xsMax} />,
    element);
};

module.exports = PatientList;
