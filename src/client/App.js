import React, {Component} from "react";
import $ from 'jquery';
import Popper from 'popper.js';
import {ComposableMap, ZoomableGroup, Geographies, Geography} from "react-simple-maps"
import ReactTooltip from "react-tooltip"
import tooltip from "wsdm-tooltip"
import axios from "axios";
import c3 from "c3";
import {Modal, OverlayTrigger, popover, Button, PageHeader} from 'react-bootstrap';
import "./app.css";
const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto"
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: null,
      totalImports: null,
      totalExports: null,
      targetCountry: null,
      show: false,
      data: null
    }
    this.handleMouseClick = this.handleMouseClick.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.renderChart = this.renderChart.bind(this);
  }

  renderChart(){
    let chart = c3.generate({
      bindto: '#piechart1',
      size: {
        width: 300,
        height: 300
      },
      donut: {
        title: this.state.targetCountry
      },
    data: {
        columns: [
          ['import', this.state.totalImports],
          ['export', this.state.totalExports]
        ],
            type: 'pie',
            colors: {
              export:'#A9A9A9',
              import: '#90EE90'
            }
    }
});
  }

  componentDidMount() {
    this.tip = tooltip()
    this.tip.create()
  }

  handleClose() {
    this.setState({show: false});
  }

  handleShow() {
    this.setState({show: true});
    console.log("works")
  }

  handleMouseMove(geography, event) {
    this.tip.show(`<div class="tooltip-inner">
    ${geography.properties.name}
  </div>
    `)
    this.tip.position({pageX: event.pageX, pageY: event.pageY})
  }


  handleMouseClick(geography, event) {
    let country = `${geography.properties.name}`;
    this.setState({
      show: true,
      country: country
    }, () => this.fetchData(this.state.country));
  }

  fetchData(country) {
    axios.get(`/api/countryCodes/${country}`).then((res) => {
      let totalImports = res.data[1][0];
      let totalExports = res.data[1][1];
      let targetCountry = res.data[1][2];
      this.setState({ data: res.data, totalExports: totalExports, totalImports: totalImports, targetCountry: targetCountry})
      console.log(this.state.data);
      this.renderChart()
    })
    .catch((error) => {
      if (error.res) {
        console.log(error.res.data);
        console.log(error.res.status);
        console.log(error.res.headers);
      } else if (error.request) {
        console.log(error.request)

      } else {
        console.log('Error', error.message);
      }
    })
  }

  handleMouseLeave() {
    this.tip.hide()
  }

  render() {
    return (
      <div>
        <PageHeader className="header">
          <h1 className="center-text">U.S. Imports and Exports</h1>
          <p className="center-text desc">International Trade with the US from 2005-2014</p>
        </PageHeader>
        <ComposableMap projectionConfig={{
          scale: 225
        }} width={1080} height={551} style={{
          width: "100%",
          height: "auto"
        }}>
          <ZoomableGroup center={[0, 20]} disablePanning>
            <Geographies geography="./data/world-50m.json">
              {(geographies, projection) => geographies.map((geography, i) => geography.id !== "ATA" && (<Geography key={i} geography={geography} projection={projection} className="country" id={geography.properties.name} onClick={this.handleMouseClick} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave} style={{
                default: {
                  fill: "white",
                  stroke: "black",
                  strokeWidth: .75,
                  outline: "none"
                },
                hover: {
                  fill: "rgba(15,112,1,.02)",
                  stroke: "black",
                  strokeWidth: .75,
                  outline: "none"
                },
                pressed: {
                  fill: "#FF5722",
                  stroke: "#607D8B",
                  strokeWidth: 0.75,
                  outline: "none"
                }
              }}/>))}
            </Geographies>

          </ZoomableGroup>
        </ComposableMap>
        <ReactTooltip/>
        <div className="bottom-right">Data from the U.S. Census Bureau International Trade database
        </div>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className="value-text">{this.state.targetCountry}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className="value-text"><span className="export">Export Value:</span>${this.state.totalExports}</div>
              <div className="value-text"><span className="import">Import Value:</span>${this.state.totalImports}</div>
                      <div id="piechart1"></div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
