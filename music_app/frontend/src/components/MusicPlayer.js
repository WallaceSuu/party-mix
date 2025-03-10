import React, { Component } from "react";
import { Grid, Typography, Card, IconButton, LinearProgress, Icon } from "@material-ui/core"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import PauseIcon from "@material-ui/icons/Pause"
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious"

export default class MusicPlayer extends Component {
    constructor(props) {
        super(props);
    }

    onPauseSong() {
        console.log(this.props);
        const csrfToken = document.cookie.match(/csrftoken=([^;]+)/);
        const token = csrfToken ? csrfToken[1] : "";
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json",
                        "X-CSRFToken": token,
            },
        };
        fetch("/spotify/pause", requestOptions);
    }

    onPlaySong() {
        const csrfToken = document.cookie.match(/csrftoken=([^;]+)/);
        const token = csrfToken ? csrfToken[1] : "";
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json",
                       "X-CSRFToken": token,
            },
        };
        fetch("/spotify/play", requestOptions);
    }

    onSkipSong() {
            const csrfToken = document.cookie.match(/csrftoken=([^;]+)/);
            const token = csrfToken ? csrfToken[1] : "";
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json",
                           "X-CSRFToken": token,
                },
            };
            fetch("/spotify/skip", requestOptions);
    }

    onGoBack() {
        const csrfToken = document.cookie.match(/csrftoken=([^;]+)/);
        const token = csrfToken ? csrfToken[1] : "";
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json",
                       "X-CSRFToken": token,
            },
        };
        fetch("/spotify/go-back", requestOptions);
    }

    render() {
        const songProgress = (this.props.time/this.props.duration)*100;

        return (
            <Card>
                <Grid container alignItems="center">
                    <Grid item xs={4} align="center">
                        <img src={this.props.image_url} height="100%" width="100%"/>
                    </Grid>
                    <Grid item xs={8} align="center">
                        <Typography component="h5" variant="h5">
                            {this.props.title}
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle1">
                            {this.props.artist}
                        </Typography>
                        <div>
                            {this.props.isHost ? (
                                <IconButton onClick={() => this.onGoBack()}>
                                <SkipPreviousIcon />
                                </IconButton>
                            ) : (
                                null
                            )}
                            <IconButton onClick = {() => 
                                {
                                    this.props.is_playing ? this.onPauseSong() : this.onPlaySong();
                                }
                                }
                            >
                                {this.props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton> 
                            <IconButton onClick={() => this.onSkipSong()}>
                                <SkipNextIcon />
                            </IconButton>
                        </div>
                        <Typography component="h6" variant="h6">
                            {this.props.votes} / {this.props.votes_required}
                        </Typography>
                    </Grid>
                </Grid>
                <LinearProgress variant="determinate" value={songProgress}>
                </LinearProgress>
            </Card>
        )
    }
}