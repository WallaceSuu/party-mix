import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core"
import { Link } from "react-router-dom"
import CreateRoomPage from "./CreateRoomPage";
import { Create } from "@material-ui/icons";

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
        };
        this.roomCode = this.props.match.params.roomCode;
        this.getRoomDetails();
        this.onLeaveButton = this.onLeaveButton.bind(this);
        this.onUpdateShowSettings = this.onUpdateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
    }



    getRoomDetails() {
        fetch('/api/get-room' + '?code=' + this.roomCode).then((response) => {
            if (!response.ok) {
                this.props.leaveRoomCallback();
                this.props.history.push("/");
            }
            return response.json();
        }).then((data) => {
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
            })
        })
    }

    onLeaveButton() {
        const requestOptions = {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json",
                        "X-CSRFToken": document.cookie.match(/csrftoken=([^;]+)/)[1],
            }
        };
        fetch('/api/leave-room', requestOptions).then((_response) => {
            this.props.leaveRoomCallback();
            this.props.history.push('/');
        });
    }

    onUpdateShowSettings(value) {
        this.setState({
            showSettings: value,
        });
    }

    renderSettings() {
        return (<Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage 
                 update={true} 
                 votesToSkip={this.state.votesToSkip} 
                 guestCanPause={this.state.guestCanPause} 
                 roomCode={this.roomCode}
                 updateCallback={this.getRoomDetails}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                 variant="contained"
                 color="secondary"
                 onClick={() => this.onUpdateShowSettings(false)}>
                    Close
                 </Button>
            </Grid>
        </Grid>)
    }

    renderSettingsButton() {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => this.onUpdateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    }

    render() {
        if (this.state.showSettings) {
            return this.renderSettings();
        }
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Code: {this.roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Votes: {this.state.votesToSkip}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Guests Can Pause: {this.state.guestCanPause.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Host: {this.state.isHost.toString()}
                    </Typography>
                </Grid>
                {this.state.isHost ? this.renderSettingsButton() : null}
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={this.onLeaveButton}>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>


            //<div>
              //  <h3>{this.roomCode}</h3>
                //<p>votes: {this.state.votesToSkip}</p>
               // <p>guest_can_pause: {this.state.guestCanPause}</p>
                //<p>host: {this.state.host}</p>
            //</div>
        );
    }

}