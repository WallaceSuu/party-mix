import React, { Component } from "react";
import { Button, Grid, Typography, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";

export default class RoomJoinPage extends Component {
    constructor(props) {    
        super(props);
        this.state = {
            textboxValue: "",
            roomCode: "",
            error: "",
            usernamePage: false,
            username: "",
        }
    }

    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        {this.state.usernamePage ? "Enter a Username" : "Join a Room"}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField 
                    error={this.state.error}
                    label= {this.state.usernamePage ? "Username" : "Code"}
                    placeholder= {this.state.usernamePage ? "Enter a Username" : "Enter a Room Code"}
                    value={this.state.textboxValue}
                    helperText={this.state.error}
                    variant="outlined"
                    onChange={this.handleTextFieldChange}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" onClick = {() => {
                        this.state.usernamePage ? this.onEnterRoom() : this.onNextButton();
                    }} >
                        {this.state.usernamePage ? "Join Room" : "Next"}
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick = {() => this.onBackButton()}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    }

    handleTextFieldChange = (e) => {
        this.setState({
            textboxValue: e.target.value
        });
    }

    onNextButton = () => {
        const roomCode = this.state.textboxValue;
        //need to check if room exists beforehand just to make sure
        this.setState({
            roomCode: roomCode,
            textboxValue: "",
            usernamePage: true,
            error: null,
        })
    }
    
    onBackButton = (e) => {
        if (this.state.usernamePage) {
            this.setState({
                roomCode: "",
                usernamePage: false,
                error: null
            })
        } else {
            this.props.history.push("/");
            this.setState({
                usernamePage: true
            })
        }
    }

    onEnterRoom = () =>  {
        const username = this.state.textboxValue

        console.log("your username:", this.state.textboxValue);
        
        var requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: this.state.roomCode,
                username: username,
            })
        };

        fetch('/api/join-room/', requestOptions).then((response) => {
            if (response.ok) {
                this.props.history.push(`/room/${this.state.roomCode}`);
            } else {
                this.setState({error: "Room not found"});
            }
        }).catch((error) => {
            console.log(error);
        })
    }
}