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
          console.log("got initial data")
          console.log(data)
          this.setState({ 
            color: {
              red: data.red,
              green: data.green,
              blue: data.blue,
            },
            rotation: {
              x: parseInt(data.rotation_x),
              y: parseInt(data.rotation_y),
              z: parseInt(data.rotation_z),
            }
          })
      }).catch((error) => {
        console.log(error)
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
      console.log("update cube")
      console.log(this.state)
      fetch('/api/v1/cube', {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            red: this.state.color.red,
            green: this.state.color.green,
            blue: this.state.color.blue,
            rotation_x: parseInt(this.state.rotation.x),
            rotation_y: parseInt(this.state.rotation.y),
            rotation_z: parseInt(this.state.rotation.z),
          })
      })
      .then(results => {
          return results.json();
      }).then((data) => {
          console.log(data)
      }).catch((error) => {
        console.log(error)
      })
  }

  render() {
    if (!this.state.color) {
      return (
        <h1>Loading...</h1>
      )
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
    var x = event.target.value
    this.setState({x: x})
    this.props.setRotation({x: x,
                            y: this.state.y,
                            z: this.state.z})
  }
  setY = (event) => {
    var y = event.target.value
    this.setState({y: y})
    this.props.setRotation({x: this.state.x, 
                            y: y,
                            z: this.state.z})
  }
  setZ = (event) => {
    var z = event.target.value
    this.setState({z: z})
    this.props.setRotation({x: this.state.x, 
                            y: this.state.y,
                            z: z})
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
