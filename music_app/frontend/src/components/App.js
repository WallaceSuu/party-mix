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
    text: {
      primary: "#ffffff",
    },
  }
})

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      song: {},
    }
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    this.interval = setInterval(this.getSongImage, 3000);
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

  getSongImage = () => {
    fetch("/spotify/current-song").then((response) => {
      if (!response.ok) {
          return {};
      } else {
          return response.json();
      }
      }).then((data) => {
          this.setState({song: data});
      })
  }

  render() {
    
    const { x, y } = this.state;

    const gradientStyle = {
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(176, 224, 230, 0.9) 0%, rgba(100, 149, 237, 0.7) 50%, rgba(30, 64, 140, 0.7) 80%) 1px`,
      height: '100vh',
      transition: 'background 0.5s ease-out',
    }

    const backgroundStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundImage: `url(${this.state.song.image_url})`, // Change to your image
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "blur(10px)", // Default blur effect
      zIndex: -2,
    }

    const backgroundGradientStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: `radial-gradient(circle at ${this.state.x}px ${this.state.y}px,
                  rgba(188,255,250,1) 0.01%,
                  rgba(4, 199, 238, 1) 100%)`,
      transition: 'background 0.3s ease',
      zIndex: -2, // Ensures background is behind the content
    };

    const cursorGlowStyle = {
      position: "absolute",
      top: y - 50,
      left: x - 50,
      width: "100px",
      height: "100px",
      background: "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 60%)",
      borderRadius: "50%",
      pointerEvents: "none",
      transition: "top 0.05s linear, left 0.05s linear",
      zIndex: 0,
    }

    let backgroundElement;
    if (Object.keys(this.state.song).length === 0) {
      backgroundElement = <div style={backgroundGradientStyle}></div>;
    } else {
      backgroundElement = (
        <>
          <div style={backgroundStyle}></div>
          <div style={cursorGlowStyle}></div>
        </>
      );
    }

    return (
      <div>
        {backgroundElement}
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