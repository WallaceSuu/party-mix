import React, { Component } from "react";
import { Grid, Button, Typography, Box } from "@material-ui/core"
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
            spotifyAuthenticated: false,
            song: {},
            users: [],
        };
        this.roomCode = this.props.match.params.roomCode;
        this.onLeaveButton = this.onLeaveButton.bind(this);
        this.onUpdateShowSettings = this.onUpdateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.getCurrentSong = this.getCurrentSong.bind(this);
        this.getUsersInRoom = this.getUsersInRoom.bind(this);
        this.getRoomDetails();
    }

    componentDidMount() {
        this.interval = setInterval(this.getCurrentSong, 3000);
        this.interval = setInterval(this.getUsersInRoom, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getRoomDetails = () => {
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
            });
            if (this.state.isHost) {
                this.authenticateSpotify();
            }

        })
    }

    authenticateSpotify = () => {
        fetch('/spotify/is-authenticated')
            .then((response) => response.json())
            .then((data) => {
                this.setState({ spotifyAuthenticated : data.status });
                console.log(data.status)
                if (!data.status) {
                    fetch('/spotify/get-auth-url')
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                });
            }
        });
    }

    getCurrentSong = () => {
        fetch("/spotify/current-song").then((response) => {
            if (!response.ok) {
                return {};
            } else {
                return response.json();
            }
        }).then((data) => {
            this.setState({song: data})
        })
    }

    getUsersInRoom() {
        fetch("/api/users-in-room").then((response) => {
            if (!response.ok) {
                return {};
            } else {
                return response.json();
            }
        }).then((data) => {
            this.setState({users: data})
        })
    }

    onLeaveButton() {
        const csrfToken = document.cookie.match(/csrftoken=([^;]+)/);
        const token = csrfToken ? csrfToken[1] : "";
        const requestOptions = {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json",
                        "X-CSRFToken": token,
            }
        };
        fetch('/api/leave-room/', requestOptions).then((_response) => {
            this.props.leaveRoomCallback();
            this.props.history.push('/');
        });
    }

    onUpdateShowSettings = (value) => {
        this.setState({
            showSettings: value,
        });
    }

    renderSettings = () => {
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

    renderSettingsButton = () => {
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
            <div className="main-wrapper">
                <Box position="absolute" top={0} left={0} zIndex={1}>
                    <Typography variant="h6" component="h6" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'}}>
                        {this.state.isHost ? "Currently Host" : ""}
                    </Typography>
                    <Typography variant="h7" component="h7" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'}}>
                        {(this.state.users).length} Active {(this.state.users).length === 0 ? "Users" : "User"}
                    </Typography>
                    <List>
                        {this.state.users.map((user, index) => (
                            <ListItem key={index}>
                                <ListItemText 
                                primary={user.username}
                                style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'}}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Grid container spacing={1} justifyContent="center">
                    <Grid item xs={12} align="center">
                        <Typography variant="h6" component="h6" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'}}>
                            Code: {this.roomCode}
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <MusicPlayer {...this.state.song} isHost={this.state.isHost} />
                    </Grid>
                    {this.state.isHost ? this.renderSettingsButton() : null}
                    <Grid item xs={12} align="center">
                        <Button variant="contained" color="secondary" onClick={this.onLeaveButton}>
                            Leave Room
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }

}