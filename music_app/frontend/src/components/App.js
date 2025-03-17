import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./Homepage";
import { ThemeProvider, createTheme, Container } from "@material-ui/core";
import { indigo } from "@material-ui/core/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: indigo[700],
    },
    secondary: {
      main: indigo[400],
    },
    background: {
      main: indigo[50],
    },
  }
})

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
    }
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  };

  animateBackground = () => {
    const { targetX, targetY, x, y } = this.state;
    const smoothFactor = 0.01; //adjust this value to control the mouse lag (lower is slower)
    const newX = x + (targetX - x) * smoothFactor;
    const newY = y + (targetY - y) * smoothFactor;

    this.setState({ x: newX, y: newY });

    requestAnimationFrame(this.animateBackground); //smoothing background
  };

  render() {

    const { x, y } = this.state;

    const gradientStyle = {
        background: `radial-gradient(circle at ${x}px ${y}px, rgba(176, 224, 230, 0.9) 0%, rgba(100, 149, 237, 0.7) 50%, rgba(30, 64, 140, 0.7) 80%) 1px`,
        height: '100vh',
        transition: 'background 0.5s ease-out',
      };

    return (
      <div style={gradientStyle}>
        <ThemeProvider theme={theme}>
          <Container>
            <div className="center">
              <HomePage />
            </div>
          </Container>
        </ThemeProvider>
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);