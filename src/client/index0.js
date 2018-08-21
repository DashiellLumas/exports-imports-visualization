import React, {Component} from "react"
import {ComposableMap, ZoomableGroup, Geographies, Geography} from "react-simple-maps"
import ReactTooltip from "react-tooltip"
import tooltip from "wsdm-tooltip"
import axios from "axios"
const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto"
}

class BasicMap extends Component {

  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    // this.fetchData = this.fetchData.bind(this);
  }
  componentDidMount() {
    this.tip = tooltip()
    this.tip.create()
    // this.fetchData();
  }

  handleMouseMove(geography, event) {
    axios.get(`https://api.census.gov/data/2014/intltrade/imp_exp?get=IMPALL2014,COUNTRY&SCHEDULE=5700`).then((res)=>{
      console.log(`${geography.properties.name}`);
      this.tip.show(`<div class="tooltip-inner">
      ${geography.properties.name}
      ${res.data[1][1]}
    </div>
      `)
      this.tip.position({pageX: event.pageX, pageY: event.pageY})
    })

  }

  handleMouseLeave() {
    this.tip.hide()
  }
  render() {
    return (
      <div style={wrapperStyles}>
        <ComposableMap projectionConfig={{
          scale: 205
        }} width={980} height={551} style={{
          width: "100%",
          height: "auto"
        }}>
          <ZoomableGroup center={[0, 20]} disablePanning>
            <Geographies geography="/static/world-50m.json">
              {(geographies, projection) => geographies.map((geography, i) => geography.id !== "ATA" && (<Geography key={i} geography={geography} projection={projection} id={geography.properties.name} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave} style={{
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
    )
  }
}

export default BasicMap
