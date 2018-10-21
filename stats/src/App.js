import React, { Component } from 'react';

import './App.css';
import VolumeChart from './VolumeChart';
import Agents from './Agents';
import TPM from './TPM';
import Cost from './Cost';
import Graph from 'react-graph-vis';
import Images from './Images'

class App extends Component {
  constructor(props) {

    super(props);

    this.state = {
      tickcount: 1,
      dataTimer: 0,
      agentsTimer: 0,
      statsTimer: 0,
      costTimer: 0,
      imagesTimer: 0,
      shouldRedraw: false,
      images: [{ image: "" }],
      tpm: 0,
      agents: 0,
      cost: 0,
      data: {
        nodes: [{ id: 0, id: 1 }],
        edges: []
      },
      lastObject: "",
      distance: 1000,
      volume_data: [
      ]

    }
  }


  addData(data) {
    console.log(`${data} i/pm`);
    var vd = this.state.volume_data

    vd.push({ x: this.state.tickcount, y: data })

    this.setState({ tickcount: this.state.tickcount + 1 })
    this.setState({ volume_data: vd })
  }

  getData() {
    console.log(`Getting Data, clearning ${this.state.dataTimer}`);
    console.log(`Number of edges: ${this.state.data.edges.length}`);

    clearInterval(this.state.dataTimer)


    const url = `${process.env.REACT_APP_API_SERVER}/api/coco/vis/${this.state.lastObject}`
    console.log(url);
    fetch(url).then(res => res.json()).then(data => {
      // if (data.nodes.length > 0) {
      // let graph_data = this.state.data

      if (this.state.data.edges.length > 100) {
        this.setState({ data: data })
      } else {

        this.setState({ data: { nodes: this.state.data.nodes.concat(data.nodes), edges: this.state.data.edges.concat(data.edges) } })
      }
      this.setState({ lastObject: data.lastObject })

      // }
      const dataTimer = setInterval(() => {
        this.getData()
      }, 5000);
      this.setState({ dataTimer: dataTimer })

    })

  }


  getAgents() {
    console.log(`Getting Agents, clearning ${this.state.agentsTimer}`);

    clearInterval(this.state.agentsTimer)

    const url = `${process.env.REACT_APP_API_SERVER}/api/coco/agents`
    fetch(url).then(res => res.json()).then(data => {
      this.setState({ agents: data.agents })
      // this.state.network.fit({ animation: true })
      const agentsTimer = setInterval(() => {
        this.getAgents()
      }, 7000);
      this.setState({ agentsTimer: agentsTimer })

    })
  }

  getCost() {
    console.log(`Getting Cost, clearning ${this.state.costTimer}`);

    clearInterval(this.state.costTimer)

    const url = `${process.env.REACT_APP_API_SERVER}/api/coco/cost`
    fetch(url).then(res => res.json()).then(data => {
      this.setState({ cost: data.cost })
      const costTimer = setInterval(() => {
        this.getCost()
      }, 7000);
      this.setState({ costTimer: costTimer })
    })
  }

  getImages() {
    console.log(`Getting Images, clearning ${this.state.imagesTimer}`);

    if (this.state.lastObject !== "") {
      clearInterval(this.state.imagesTimer)
      const url = `${process.env.REACT_APP_API_SERVER}/api/coco/images/${this.state.lastObject}`
      fetch(url).then(res => res.json()).then(data => {
        this.setState({ images: data })

        const imagesTimer = setInterval(() => {
          this.getImages()
        }, 7000);

        this.setState({ imagesTimer: imagesTimer })
      })
    }
  }
  getStats() {
    console.log(`Getting Stats, clearning ${this.state.statsTimer}`);
    clearInterval(this.state.statsTimer)

    const url = `${process.env.REACT_APP_API_SERVER}/api/coco/stats`
    fetch(url).then(res => res.json()).then(data => {
      this.addData(data.tpm)

      const statsTimer = setInterval(() => {
        this.getStats()
      }, 5000);
      this.setState({ statsTimer: statsTimer, tpm: data.tpm })

    })
  }

  componentDidMount() {
    const dataTimer = setInterval(() => {
      this.getData()
    }, 5000);
    this.setState({ dataTimer: dataTimer })

    const statsTimer = setInterval(() => {
      this.getStats()
    }, 5000);
    this.setState({ statsTimer: statsTimer })

    const agentsTimer = setInterval(() => {
      this.getAgents()
    }, 7000);
    this.setState({ agentsTimer: agentsTimer })


    const costTimer = setInterval(() => {
      this.getCost()
    }, 7000);

    this.setState({ costTimer: costTimer })

    const imagesTimer = setInterval(() => {
      this.getImages()
    }, 7000);

    this.setState({ imagesTimer: imagesTimer })



  }

  render() {


    const options = {
      autoResize: true,
      nodes: {
        shape: 'dot',
        size: 10
      },
      physics: {
        enabled: true,
        forceAtlas2Based: {
          gravitationalConstant: -100,
          centralGravity: 0.005,
          springLength: 230,
          springConstant: 0.18
        },
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 95,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0
        },
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 100,
          onlyDynamicEdges: false,
          fit: true
        },
        maxVelocity: 50,
        minVelocity: 0.1,
        timestep: 0.5,
        solver: "forceAtlas2Based",
        stabilization: true
      }
    };

    return (
      <div className="App">
        <div className="info">
          <Agents agents={this.state.agents} />
          <TPM tpm={this.state.tpm} />
          <Cost cost={this.state.cost} />
        </div>
        <div className="volume">
          <VolumeChart data={this.state.volume_data} options={this.state.volume_options} shouldRedraw={this.state.shouldRedraw} />
        </div>
        <div className="graph">
          <Graph getNetwork={network => this.setState({ network })} graph={this.state.data} options={options} />
        </div>

        <div class="images">
          <Images images={this.state.images} />
        </div>
      </div>
    );
  }
}

export default App;
