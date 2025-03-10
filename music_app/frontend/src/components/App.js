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
  }

  render() {
    return (
      <Container>
        <ThemeProvider theme={theme}>
          <div className="center">
            <HomePage />
          </div>
        </ThemeProvider>
      </Container>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);