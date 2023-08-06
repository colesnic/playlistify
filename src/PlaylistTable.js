import "./App.css";
import { Autocomplete, TextField, Button, ButtonGroup } from "@mui/material";
import BluetoothDriveIcon from "@mui/icons-material/BluetoothDrive";
import axios from 'axios'

const PlaylistTable = (props) => {
    const getOldPlaylistTracks = async (e) => {
        let tracks_href = "";
        let playlist = {};
        if (props.playlistsArray && props.oldPlaylistChoice) {
          playlist = props.playlistsArray.find(
            (playlist_item) => playlist_item.name === props.oldPlaylistChoice
          );
          tracks_href = playlist.tracks.href;
        }
    
        try {
          const response = await axios.get(tracks_href, {
            headers: {
              Authorization: `Bearer ${props.spotToken}`,
            },
          });
          const trackItems = response.data;
    
          console.log(`Obtained ${trackItems?.items?.length} tracks from playlist named ${playlist.name} at ${tracks_href}`)
    
          props.setOldTracks(trackItems.items);

          props.setInitiateSequenceButton(true);
        } catch (error) {
          console.error(`Error fetching tracks from ${playlist.name} at ${tracks_href}:`, error);
        }
      };
  const handleOldPlaylistChoiceChange = (event, newValue) => {
    props.setOldPlaylistChoice(newValue);
  };

  function arrayifyPlaylists(playlistObject) {
    if (playlistObject.length) {
      let userPlaylists = [];
      for (const playlist of playlistObject) {
        userPlaylists.push(playlist.name);
      }
      return userPlaylists;
    } else {
      return false;
    }
  }

  return (
    <div style={{ display: "grid", gap: "10px", placeItems: "center" }}>
      <Autocomplete
        readOnly={props.initiateSequenceButton ? true : false}
        value={props.oldPlaylistChoice.name}
        onChange={handleOldPlaylistChoiceChange}
        disablePortal
        id="combo-box-demo"
        options={
          arrayifyPlaylists(props.playlistsArray).length
            ? arrayifyPlaylists(props.playlistsArray)
            : ["loading..."]
        }
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Choose a playlist to perfect" />
        )}
      />
      <div className="createButton">
        <Button
          disabled={props.initiateSequenceButton ? true : false}
          onClick={() => {
            if (props.oldPlaylistChoice.name !== "") {
                getOldPlaylistTracks()
            }
          }}
          variant="contained"
          endIcon={<BluetoothDriveIcon />}
          sx={{
            backgroundColor: "#1DB954",
            color: "white",
            "&:hover": {
              backgroundColor: "#148C55",
            },
          }}
        >
          Playlistify
        </Button>
      </div>
    </div>
  );
};
export default PlaylistTable;
