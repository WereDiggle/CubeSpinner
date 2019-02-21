import React from 'react';
import ReactDOM from 'react-dom';
import {CompactPicker} from 'react-color'

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(color) {
    return "#" + componentToHex(color.red) + 
                 componentToHex(color.green) + 
                 componentToHex(color.blue);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16)
    } : null;
}

class CubeForm extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        color: null,
        rotation: null
      };
      fetch('/api/v1/cube')
      .then(results => {
          return results.json();
      }).then((data) => {
          this.setState({ 
            color: {
              red: data.red,
              green: data.green,
              blue: data.blue,
            },
            rotation: {
              x: data.rotation_x,
              y: data.rotation_y,
              z: data.rotation_z,
            }
          })
      });
  }

  setColor = ({hex}) => {
    var color = hexToRgb(hex)
    this.setState({ color: color })
  }

  setRotation = (rotation) => {
    this.setState({ rotation: rotation })
  }

  updateCube = () => {
      fetch('/api/v1/cube', {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            red: this.state.color.red,
            green: this.state.color.green,
            blue: this.state.color.blue,
            rotation_x: this.state.rotation.x,
            rotation_y: this.state.rotation.y,
            rotation_z: this.state.rotation.z,
          })
      })
      .then(results => {
          return results.json();
      }).then((data) => {
          console.log(data)
      })
  }

  render() {
    if (!this.state.color) {
      return <div />
    }

    return (
      <div className="cube-form">
        <h1>Customize Your Cube</h1>
        <ColorSelector color={this.state.color} setColor={this.setColor}/>
        <RotationSelector rotation={this.state.rotation} setRotation={this.setRotation}/>
        <button onClick={this.updateCube}>Update Cube</button>
      </div>
    );
  }
}

class ColorSelector extends React.Component {
    render() {
        return (
            <div>
            <h2>Color</h2>
            <CompactPicker 
                color={rgbToHex(this.props.color)}
                onChangeComplete={this.props.setColor}
            />
            </div>
        );
    }
}

class RotationSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: props.rotation.x,
      y: props.rotation.y,
      z: props.rotation.z
    };
  }

  setX = (event) => {
    this.setState({x: event.target.value})
    this.props.setRotation(this.state)
  }
  setY = (event) => {
    this.setState({y: event.target.value})
    this.props.setRotation(this.state)
  }
  setZ = (event) => {
    this.setState({z: event.target.value})
    this.props.setRotation(this.state)
  }

  render() {
    return (
      <div>
      <h2>Rotational Velocity</h2>
      <form>
        <label>
          X: 
          <input type="number" value={this.state.x} onChange={this.setX} />
        </label>
        <label>
          Y: 
          <input type="number" value={this.state.y} onChange={this.setY} />
        </label>
        <label>
          Z: 
          <input type="number" value={this.state.z} onChange={this.setZ} /> 
        </label>
      </form>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <CubeForm />,
  document.getElementById('root')
);
