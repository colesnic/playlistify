import "./App.css";
import AnalyzationGrid from "./Analyzation.js";
import SlowLinearProgress from "./LoadingBar.js";
import PlaylistTable from "./PlaylistTable";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import Typewriter from "./TypeWriter";

const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const AUTH_ENDPOINT = process.env.AUTH_ENDPOINT;
const RESPONSE_TYPE = process.env.RESPONSE_TYPE;
const SCOPE = process.env.SCOPE;

function App() {
  const [token, setToken] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [initiateSequence, setInitiateSequence] = useState(false);
  const [oldPlaylist, setOldPlaylist] = useState("");
  const [oldTracks, setOldTracks] = useState({});

  useEffect(() => {

    const getPlaylists = async () => {
      renderLogin();
  
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const playlistsObject = response.data;
        console.log(`Obtained ${playlistsObject.items.length} playlists from https://api.spotify.com/v1/me/playlists`)
        setPlaylists(playlistsObject.items);
      } catch (error) {
        console.error("Error fetching playlists from https://api.spotify.com/v1/me/playlists:", error);
      }
    };
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
    getPlaylists()
  }, [token]);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const renderLogin = () => {
    return <h1>Please login!</h1>;
  };

  return (
    <div className="App">
      <div className="background"></div>
      {!token ? (
        <Button variant="contained" disableElevation
          href={
            `${AUTH_ENDPOINT}` +
            `client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`
          }
        >
          Login to Spotify
        </Button>
      ) : (
        <Button variant="contained" disableElevation onClick={logout}>Logout</Button>
      )}
      <div className="artistForm">
        <h1>
        <Typewriter
        text="Big trip planned? Or maybe you just want to make sure you're playing b a n g e r s on aux"
        delay={100}
        ></Typewriter>
        </h1>
      </div>
      <div className="playlistAutofill">
        <PlaylistTable
          spotToken={token}
          playlistsArray={playlists}
          setInitiateSequenceButton={setInitiateSequence}
          initiateSequenceButton={initiateSequence}
          setOldPlaylistChoice={setOldPlaylist}
          oldPlaylistChoice={oldPlaylist}
          setOldTracks={setOldTracks}
        ></PlaylistTable>
      </div>
      {initiateSequence ? (
        <div>
          <div className="analyzationGrid">
            <div className="loadBar">
              <SlowLinearProgress></SlowLinearProgress>
            </div>
            <AnalyzationGrid
              oldPlaylistTracks={oldTracks}
              bearerToken={token}
            ></AnalyzationGrid>
          </div>
        </div>
      ) : (
        <h1></h1>
      )}
    </div>
  );
}

export default App;
