/**
*
* DataGrid
*
*/

import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const rowStyle = (row, rowIndex) => {
  const style = {};

  if (row.Status === 0) {
    style.backgroundColor = 'blue';
    style.color = 'white';
  }

  if (row.Status === 1) { // 1 is dead
    style.backgroundColor = 'red';
    style.color = 'white';
  }

  if (row.Status === 2) { // 2 is released
    style.backgroundColor = 'green';
    style.color = 'white';
  }

  if (row.Status === 3) {
    style.backgroundColor = 'black';
    style.color = 'white';
  }

  return style;
}

class DataGrid extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      width: 0,
      height: 0,
    };
    this.getData = this.getData.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentWillMount() {
    this.updateWindowDimensions(),
    this.getData();
  }

  componentDidMount() {
    this.interval = setInterval(this.getData(), 1000);
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  // Gets approved posts, with the hashtag 'beoceanwise' from the OW UGC admin app
  getData() {
    const URL = "https://sheets.googleapis.com/v4/spreadsheets/1coq6ZOy8fZYAZ6DKjPaQepaSvnhqu2B3eTSJ1Tp5FJA/values/Sheet1!A2:X1011?key=AIzaSyCy5jc38aVVg5GIseF611VkbGUKB3DNhXo";
    axios.get(URL)
      .then((res) => {
        console.log(res);
        let len = res.data.values.length;
        let spreadsheet = res.data.values;
        let data = [];
        for (var i = 0; i < len; i += 1) {
          data.push({
            Name: spreadsheet[i.toString()][1],
            ID: spreadsheet[i.toString()][0],
            Species: spreadsheet[i.toString()][2],
            Sex: spreadsheet[i.toString()][3],
            AdmitDate: spreadsheet[i.toString()][5],
            CollectionSite: spreadsheet[i.toString()][6],
            ReasonForAdmit: spreadsheet[i.toString()][11],
            ReleaseDate: spreadsheet[i.toString()][16],
            DateOfDeath: spreadsheet[i.toString()][23],
            Status: parseInt(spreadsheet[i.toString()][4]), // To determine colour of row
          });
        }
        this.setState({ data: data });
      })
      .catch((err) => {
        console.error(err); // eslint-disable-line
      });
  }

  render() {
    // TODO: Implement multiple breakpoints for this
    const shouldHide = this.state.width > 768 ? false : true;
    const COLS = [{
      dataField: 'Name',
      text: 'Name',
    }, {
      dataField: 'ID',
      text: 'ID',
      hidden: shouldHide,
    }, {
      dataField: 'Species',
      text: 'Species',
    }, {
      dataField: 'Sex',
      text: 'Sex',
      hidden: shouldHide,
    }, {
      dataField: 'AdmitDate',
      text: 'Admit Date',
    }, {
      dataField: 'CollectionSite',
      text: 'Collection Site',
      hidden: shouldHide,
    }, {
      dataField: 'ReasonForAdmit',
      text: 'Reason for Admit',
      hidden: shouldHide,
    }, {
      dataField: 'ReleaseDate',
      text: 'Release Date',
    }, {
      dataField: 'DateOfDeath',
      text: 'Date of Death',
    }]
    return (
      <BootstrapTable keyField='Name' data={ this.state.data } columns={ COLS } rowStyle={ rowStyle } bordered striped hover condensed />
    );
  }
}

DataGrid.propTypes = {
  globalStyle: PropTypes.string,
  lgMax: PropTypes.string,
  xsMax: PropTypes.string,
  tag: PropTypes.string.isRequired,
};

export default DataGrid;
