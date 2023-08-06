import React, { useEffect, useState } from "react";
import { Grid, Typography, Rating, Button } from "@mui/material";
import axios from "axios";
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Favorite from '@mui/icons-material/Favorite';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import "./App.css";

export const popularityScores = {
  100: {
    stars: 5,
    color: "#00FF00",
    grade: 'A+'
  },
  90: {
    stars: 4.5,
    color: "#33FF00",
    grade: "A"
  },
  80: {
    stars: 4,
    color: "#66FF00",
    grade: "A-"
  },
  70: {
    stars: 3.5,
    color: "#99FF00",
    grade: "B+"
  },
  60: {
    stars: 3,
    color: "#CCFF00",
    grade: "B"
  },
  50: {
    stars: 2.5,
    color: "#FFFF00",
    grade: "B-"
  },
  40: {
    stars: 2,
    color: "#FFCC00",
    grade: "C+"
  },
  30: {
    stars: 1.5,
    color: "#FF9900",
    grade: "C"
  },
  20: {
    stars: 1,
    color: "#FF6600",
    grade: "C-"
  },
  10: {
    stars: 0.5,
    color: "#FF3300",
    grade: "D"
  },
  0: {
    stars: 0,
    color: "#FF0000",
    grade: "F"
  },
};

function scorePopularity(popularityScore) {
  return popularityScores[popularityScore - (popularityScore % 10)];
}
let artist_dict = {}
const getTrackGenres = async (artist_href, bearerToken, tracks) => {
  const genreData = {};
  const url = "https://api.spotify.com/v1/artists?ids=" + artist_href;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    for (const artist of response.data.artists) {
      for (const genre of artist.genres) {
        if (genreData.hasOwnProperty(genre)) {
          genreData[genre] += 1;
        } else {
          genreData[genre] = 1;
        }
      }
    }

    for (const artist of response.data.artists) {
        artist_dict[artist.name] = artist.genres
    }

    console.log(`Obtained ${response.data.artists.length} artists from playlist, collecting ${Object.keys(genreData).length} genres.`)
    return [genreData, artist_dict];
  } catch (error) {
    console.log("Unable to pull artists from playlist with error: ", error);
  }
};

const generateGenreFitData = async (tracks, token, setGenreData, setArtistDict) => {
  let artists_url = "";
  if (tracks) {
    for (const track of tracks) {
      artists_url += track.track.artists[0].id + ",";
    }
    const data = await getTrackGenres(
        artists_url.substring(0, artists_url.length - 1),
        token,
        tracks
      );
    const genreData = data[0];
    const artist_dict = data[1];
    setGenreData(genreData)
    setArtistDict(artist_dict)
  }
};

const AnalyzationGrid = (props) => {
    const [genreData, setGenreData] = useState({})
    const [artistDict, setArtistDict] = useState({})
    const [opened, setOpened] = React.useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await generateGenreFitData(props.oldPlaylistTracks, props.bearerToken, setGenreData, setArtistDict);
    };
    fetchData();
  }, [props.oldPlaylistTracks, props.bearerToken]);

  return ( <div>
    <Grid container spacing={5}>
      {props.oldPlaylistTracks ? (
        props.oldPlaylistTracks.map((track) => (
            <div className="gridItem">
          <Grid key={track.track.id} item xs={8} md={3}>
            
            <Card variant="outlined" sx={{ boxShadow: '0 8px 10px rgba(0, 0, 0, 0.1)', width: 250, height: '100%', position: 'relative' }}>
              <CardOverflow>
                <AspectRatio ratio="2">
                  <img
                    src={track.track.album.images[0]?.url}
                    srcSet={track.track.album.images[0]?.url}
                    loading="lazy"
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </AspectRatio>
                <IconButton
                  aria-label="Like minimal photography"
                  size="md"
                  variant="solid"
                  color="danger"
                  sx={{
                    color: "#006d77",
                    '&:hover': {
                      backgroundColor: '#e29578'
                    },
                    backgroundColor: "#ffddd2",
                    position: 'absolute',
                    zIndex: 2,
                    borderRadius: '50%',
                    right: '1rem',
                    bottom: 0,
                    transform: 'translateY(50%)'
                  }}
                  onClick={() => {
                    console.log("I tried")
                  }}
                >
                  {(scorePopularity(track.track.popularity).stars >= 3) ? (
                    <Favorite />) : (<ChangeCircleIcon />)}
                </IconButton>
              </CardOverflow>
              <CardContent>
                <Typography level="title-md">
                  <Link href={track.track.external_urls.spotify} overlay underline="none">
                    {track.track.name}
                  </Link>
                </Typography>
                <Typography level="body-sm" sx={{ mt: 0.5 }}>
                  <Link href={track.track.artists[0]?.external_urls.spotify}>{track.track.artists[0]?.name}</Link>
                </Typography>
              </CardContent>
              <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
                <Divider inset="context" />
                <CardContent orientation="horizontal">
                  <Typography
                    level="body-xs"
                    sx={{ fontWeight: 'md', color: 'text.secondary' }}
                  >
                    <Rating
                      name="read-only"
                      precision={0.5}
                      value={scorePopularity(track.track.popularity).stars}
                      readOnly
                    />
                  </Typography>
                  <Divider orientation="vertical" />
                  <Typography
                    level="body-xs"
                    sx={{ fontWeight: 'md', color: 'text.secondary' }}
                  >
                    Singability Score: <em>{scorePopularity(track.track.popularity).grade}</em>
                  </Typography>
                </CardContent>
              </CardOverflow>
            </Card>
          </Grid></div>
        ))
      ) : (<h1></h1>)}
    </Grid>
  </div>
  );
};

export default AnalyzationGrid;
