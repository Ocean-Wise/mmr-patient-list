/**
*
* DataGrid
*
*/

import React from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import SEALION from './images/california-sea-lion.jpg';
import SEAL from './images/harbour-seal.jpg';
import ELEPHANTSEAL from './images/northern-elephant-seal.jpg';
import STELLER from './images/steller-sea-lion.jpg';
import FURSEAL from './images/northern-fur-seal.jpg';
import OTTER from './images/otter.jpg';
import TURTLE from './images/turtle.jpg';
import DOLPHIN from './images/dolphin.jpg';

const rowStyle = (row, rowIndex) => {
  const style = {};

  if (row.Status === 0) {
    style.backgroundColor = '#005EB8';
    style.color = 'white';
  }

  if (row.Status === 1) { // 1 is dead
    style.backgroundColor = '#D44E4E';
    style.color = 'white';
  }

  if (row.Status === 2) { // 2 is released
    style.backgroundColor = '#00B398';
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
      pageIndex: 0,
      pages: [],
      chunkSize: 50,
      currentPatients: 0,
      currentSpecies: [],
    };
    this.getData = this.getData.bind(this);
    this.pagination = this.pagination.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.chunkData = this.chunkData.bind(this);
    this.createWikiLink = this.createWikiLink.bind(this);
    this.getSpeciesList = this.getSpeciesList.bind(this);
  }

  componentWillMount() {
    this.updateWindowDimensions();
    this.getData();
  }

  componentDidMount() {
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
    const URL = "https://sheets.googleapis.com/v4/spreadsheets/1raQqEwsoN3BZgJq-U1xGYgDagL_zSrs3Z5maa_AJw-U/values/Sheet1!A2:X1011?key=AIzaSyAqJ0S5QW4VBSoOdX5M9ipD-2RQcRm2fhQ";
    axios.get(URL)
      .then((res) => {
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

        // Sort the data by Admit Date
        data.sort((a, b) => {
          a = new Date(a.AdmitDate);
          b = new Date(b.AdmitDate);
          return a > b ? -1 : a < b ? 1 : 0;
        });

        let patientPages = data;
        const [list, chunkSize] = [patientPages, this.state.chunkSize]; // Initialize chunking data

        /*
        * Create a new array of arrays with up to 9 or 6 values each from the 'list' array of patients
        * Outputs like [ [9], [9], [2] ]
        *
        */
        const pages = new Array(Math.ceil(list.length / chunkSize)).fill().map(() => list.splice(0, chunkSize));
        this.setState({ pages: pages, data: [].concat.apply([], pages) });
        this.getSpeciesList();
      })
      .catch((err) => {
        console.error(err); // eslint-disable-line
      });
  }

  pagination(i) {
    const { data, pageIndex } = this.state;

    this.setState({ pageIndex: i });
  }

  chunkData(event) {
    const { pages } = this.state;
    var merged = [].concat.apply([], pages);
    const [list, chunkSize] = [merged, event.target.value]; // Initialize chunking data

    /*
    * Create a new array of arrays with up to 9 or 6 values each from the 'list' array of patients
    * Outputs like [ [9], [9], [2] ]
    *
    */
    const newPages = new Array(Math.ceil(list.length / chunkSize)).fill().map(() => list.splice(0, chunkSize));
    this.setState({ data: [].concat.apply([], newPages), pages: newPages, chunkSize: event.target.value, pageIndex: 0 });
  }

  createWikiLink(species) {
    if (species.toLowerCase() === "phoca vitulina richardsii")
      species = "phoca vitulina richardsi";
    species = species.replace(/\s+/g, '_').toLowerCase();
    return "https://en.wikipedia.org/wiki/" + species;
  }

  getSpeciesList() {
    const { data } = this.state;
    var currentAnimals = {};
    var count = 0;
    var patients = data.map((patient) => {
      if (parseInt(patient.Status) === 0) {
        count++;
        if (currentAnimals[patient.Species] >= 1) {
          currentAnimals[patient.Species] = currentAnimals[patient.Species] + 1;
        } else {
          currentAnimals[patient.Species] = 1;
        }
      }
    });

    this.setState({ currentPatients: count, currentSpecies: currentAnimals });
  }

  render() {
    const { pages, pageIndex, currentSpecies } = this.state;
    // TODO: Implement multiple breakpoints for this
    const shouldHide = this.state.width > 768 ? false : true;
    const COLS = [
      {
       dataField: 'ID',
       text: 'ID',
       sort: true
     }, {
        dataField: 'Name',
        text: 'Name',
        sort: true
      }, {
        dataField: 'Species',
        text: 'Species',
        sort: true
      }, {
        dataField: 'Sex',
        text: 'Sex',
        sort: true
      }, {
        dataField: 'AdmitDate',
        text: 'Admit Date',
      }, {
        dataField: 'CollectionSite',
        text: 'Collection Site',
        hidden: shouldHide,
        sort: true
      }, {
        dataField: 'ReasonForAdmit',
        text: 'Reason for Admit',
        hidden: shouldHide,
        sort: true
      }
      //   dataField: 'ReleaseDate',
      //   text: 'Release Date',
      //   hidden: true,
      //   sort: true
      // }, {
      //   dataField: 'DateOfDeath',
      //   text: 'Date of Death',
      //   hidden: true,
      //   sort: true
      // }
    ];

    const buttons = pages.map((page, i) => {
      if (this.state.width < 965) {
        return null;
      }
      if (pageIndex === i) {
        return <button style={{ padding: '6px 12px', marginLeft: '-1px', lineHeight: 1.42857143, color: '#fff', textDecoration: 'none', backgroundColor: '#337ab7', border: '1px solid #ddd' }} key={`page-${i}`} onClick={() => this.pagination(i)}>{(i + 1).toString()}</button>;
      }
      return <button style={{ padding: '6px 12px', marginLeft: '-1px', lineHeight: 1.42857143, color: '#337ab7', textDecoration: 'none', backgroundColor: '#fff', border: '1px solid #ddd' }} key={`page-${i}`} onClick={() => this.pagination(i)}>{(i + 1).toString()}</button>;
    })

    if (pages.length === 0) {
      return (
        <div></div>
      );
    }

    let prev;
    if (pageIndex === 0) {
      prev = <button style={{ padding: '6px 12px', marginLeft: '-1px', lineHeight: 1.42857143, color: 'grey', textDecoration: 'none', backgroundColor: '#fff', border: '1px solid #ddd' }} disabled>Previous</button>;
    } else {
      prev = <button style={{ padding: '6px 12px', marginLeft: '-1px', lineHeight: 1.42857143, color: '#337ab7', textDecoration: 'none', backgroundColor: '#fff', border: '1px solid #ddd' }} onClick={() => this.pagination(pageIndex - 1)}>Previous</button>
    }
    let next;
    if (pageIndex === pages.length - 1 ) {
      next = <button style={{ padding: '6px 12px', marginLeft: '-1px', lineHeight: 1.42857143, color: 'grey', textDecoration: 'none', backgroundColor: '#fff', border: '1px solid #ddd' }} disabled>Next</button>;
    } else {
      next = <button style={{ padding: '6px 12px', marginLeft: '-1px', lineHeight: 1.42857143, color: '#337ab7', textDecoration: 'none', backgroundColor: '#fff', border: '1px solid #ddd' }} onClick={() => this.pagination(pageIndex + 1)}>Next</button>;
    }

    let speciesToRender = [];
    let speciesRendered = [];
    for (var species in currentSpecies) {
      species = species.replace(/\s+/g, ' ').replace(/\s+$/g, '');
      if (!speciesRendered.includes(species)) {
        let imgSrc;
        if (species.match(/Harbour seal/gi)) {
          imgSrc = SEAL;
        } else if (species.match(/Steller sea lion/gi)) {
          imgSrc = STELLER;
        } else if (species.match(/California sea lion/gi)) {
          imgSrc = SEALION;
        } else if (species.match(/Northern fur seal/gi)) {
          imgSrc = FURSEAL;
        } else if (species.match(/Northern elephant seal/gi)) {
          imgSrc = ELEPHANTSEAL;
        } else if (species.match(/Sea otter/gi)) {
          imgSrc = OTTER;
        } else if (species.match(/Cetacean/gi)) {
          imgSrc = DOLPHIN;
        } else {
          imgSrc = TURTLE;
        }
        speciesRendered.push(species);
        speciesToRender.push(<span style={{ margin: 6 }}><a href={this.createWikiLink(species)} target="_blank"><img style={{ borderRadius: 100 }} src={imgSrc} alt={species} width={150} height={150} /><br/><b>{species}</b></a>: {currentSpecies[species]}</span>);
      }
    }

    return (
      <div style={{ width: 'inherit', maxWidth: 'inherit', display: 'block' }}>
        <div style={{ margin: '0 auto', maxWidth: 450, textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
          <h3>Total Current Patients: {this.state.currentPatients}</h3>
          <h4><u>Breakdown by species</u></h4>
          <div style={this.state.width < 965 ? { display: 'inline-flex', flexDirection: 'column', justifyContent: 'center' } : { display: 'inline-flex', flexDirection: 'row', width: 445, justifyContent: 'center' }}>
            {speciesToRender}
          </div>
        </div>
        <br/>
        <div style={{ display: 'inline-flex', flexDirection: 'row', marginRight: 15 }}>
          Show&nbsp;
          <select onChange={(event) => this.chunkData(event)} value={this.state.chunkSize}>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          &nbsp;entries
        </div><br/>
        <div style={{ marginTop: 15, display: 'inline-flex', flexDirection: 'row' }}>
          {prev}
          {buttons}
          {next}
          <span style={this.state.width < 965 ? { display: 'block', marginTop: 5, marginLeft: 15 } : { display: 'none' }}>{this.state.width < 965 ? `Page ${pageIndex + 1} of ${pages.length}` : ''}</span>
        </div>
        <BootstrapTable keyField='Name' data={ pages[pageIndex] } columns={ COLS } rowStyle={ rowStyle } bordered striped hover condensed />
        <div style={{ display: 'inline-flex', flexDirection: 'row' }}>
          {prev}
          {buttons}
          {next}
        </div>
      </div>
    );
  }
}

DataGrid.propTypes = {
};

export default DataGrid;
