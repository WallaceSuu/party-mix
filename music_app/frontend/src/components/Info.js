import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, IconButton, Icon } from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/navigateNext";
import { Link } from "react-router-dom";

const pages = {
    JOIN: "pages.join",
    CREATE: "pages.create"
}

export default function Info(props) {

    const [page, setPage] = useState(pages.JOIN);

    function joinInfo() {
        return (
            <Grid container spacing={6} alignItems="center">
                <Grid item xs={6}>
                    <Typography variant="h5" component="h5" color="primary">
                        Join Your Friends!
                    </Typography>
                    <Typography variant="body1" component="p">
                        Create a room, enter your desired settings and share the code with your friends
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5" component="h5" color="primary">
                        Share Your Music!
                    </Typography>
                    <Typography variant="body1" component="p">
                        Connect to your Spotify account and let your friends control the music!
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    function createInfo() {
        return (
            <Grid container spacing={6} alignItems="center">
                <Grid item xs={6}>
                    <Typography variant="h5" component="h5" color="primary">
                        Skip Songs
                    </Typography>
                    <Typography variant="body1" component="p">
                        Decide how many votes are needed for a skip, or let the host skip songs on their own!
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5" component="h5" color="primary">
                        Pause/Play
                    </Typography>
                    <Typography variant="body1" component="p">
                        Decide if guests are allowed to pause/play songs!
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    useEffect(() => {
        console.log("component has ran")
        return () => console.log("unmounted")
    });

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    What is Party Mix?
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="body1">
                    {(page === pages.JOIN ? joinInfo() : createInfo())}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <IconButton onClick={() => {
                    {page === pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE)};
                }}>
                    {page === pages.CREATE ? <NavigateBeforeIcon /> : <NavigateNextIcon />}
                </IconButton>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={ Link }>
                    Back
                </Button>
            </Grid>
        </Grid>
    );
}