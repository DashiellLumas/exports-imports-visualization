import React, { Component } from "react";
import ReactImage from "./react.png";
import {ComposableMap, ZoomableGroup, Geographies, Geography} from "react-simple-maps"
import ReactTooltip from "react-tooltip"
import tooltip from "wsdm-tooltip"
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
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
    }
    this.handleMouseClick = this.handleMouseClick.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.tip = tooltip()
    this.tip.create()
  }

  handleMouseMove(geography,event){
    this.tip.show(`<div class="tooltip-inner">
    ${geography.properties.name}
  </div>
    `)
    this.tip.position({pageX: event.pageX, pageY: event.pageY})
  }
  handleMouseClick(geography, event) {
    let country = `${geography.properties.name}`;
    this.setState({country: country}, () => this.fetchData(this.state.country));
  }

  fetchData(country){
    axios.get(`http://localhost:8080/api/countryCodes/${country}`)
    .then((res) => {
      let totalImports = res.data[1][0];
      let totalExports = res.data[1][1];
      let targetCountry = res.data[1][2];
      this.setState({
        totalExports: totalExports,
        totalImports: totalImports,
        targetCountry: targetCountry
      })
    })
  }

  handleMouseLeave() {
    this.tip.hide()
  }

  render() {
    return (
      <div style={wrapperStyles}>
        <h1>USA Exports Import by Country</h1>
        <div>{this.state.totalExports}</div>
        <div>{this.state.totalImports}</div>
        <div>{this.state.targetCountry}</div>
        <ComposableMap projectionConfig={{
          scale: 205
        }} width={980} height={551} style={{
          width: "100%",
          height: "auto"
        }}>
          <ZoomableGroup center={[0, 20]} disablePanning>
            <Geographies geography="/static/world-50m.json">
              {(geographies, projection) => geographies.map((geography, i) => geography.id !== "ATA" && (<Geography key={i} geography={geography} projection={projection} id={geography.properties.name} onClick={this.handleMouseClick} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave} style={{
                default: {
                  fill: "#ECEFF1",
                  stroke: "#607D8B",
                  strokeWidth: 0.75,
                  outline: "none"
                },
                hover: {
                  fill: "#607D8B",
                  stroke: "#607D8B",
                  strokeWidth: 0.75,
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
      </div>
    );
  }
}
