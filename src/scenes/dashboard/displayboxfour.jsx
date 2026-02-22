import { Box } from "@mui/material";

import { fetchCameraSelect, fetchDashboardFeeds, switchFeed } from "../../services/dashboardApi";
import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import VideocamIcon from "@mui/icons-material/Videocam";

const DisplayControlBoxFour = () => {
  const [selectedBuildingDisplayFour, setSelectedBuildingDisplayFour] =
    useState("");
  const [selectedFloorDisplayFour, setSelectedFloorDisplayFour] = useState(0);
  const [selectedLocationDisplayFour, setSelectedLocationDisplayFour] =
    useState("");
  const [selectedCameraDisplayFour, setSelectedCameraDisplayFour] =
    useState("");

  const [uniqueBuildingNames, setUniqueBuildingNames] = useState([]);
  const [dashboardFeed, setDashboardFeed] = useState([]);
  const [cameraFeeds, setCameraFeeds] = useState([]);

  useEffect(() => {
    getCameraFeedData();
    getDashboardFeedData();
  }, []);

  const getCameraFeedData = async () => {
    const data = await fetchCameraSelect();
    setCameraFeeds(data);
    setUniqueBuildingNames([
      ...new Set(data.map((camera) => camera.building_name)),
    ]);
  };

  const getDashboardFeedData = async () => {
    const data = await fetchDashboardFeeds();
    setDashboardFeed(data);
  };
  const handleBuildingChange_display_four = (event) => {
    setSelectedBuildingDisplayFour(event.target.value);
    setSelectedFloorDisplayFour(0);
    setSelectedLocationDisplayFour("");
    setSelectedCameraDisplayFour("");
  };

  const handleFloorChange_display_four = (event) => {
    setSelectedFloorDisplayFour(event.target.value);
    setSelectedLocationDisplayFour("");
    setSelectedCameraDisplayFour("");
  };
  const handleLocationChange_display_four = (event) => {
    setSelectedLocationDisplayFour(event.target.value);
    setSelectedCameraDisplayFour("");
  };

  const handleCameraChange_display_four = (event) => {
    setSelectedCameraDisplayFour(event.target.value);
  };

  function getCameraId(buildingName, cameraName, cameraLoc) {
    const camera = cameraFeeds.find(
      (c) =>
        c.building_name === buildingName &&
        c.camera_name === cameraName &&
        c.camera_loc === cameraLoc
    );
    return camera ? camera.camera_id : null;
  }

  function getURL(cameraID) {
    const cameraURL = cameraFeeds.find((c) => c.camera_id === cameraID);
    return cameraURL ? cameraURL.feed : null;
  }
  const handleChangeFeedDisplayFour = () => {
    if (
      selectedCameraDisplayFour !== "" &&
      selectedCameraDisplayFour !== "Select Camera"
    ) {
      const cameraID = getCameraId(
        selectedBuildingDisplayFour,
        selectedCameraDisplayFour,
        selectedLocationDisplayFour
      );
      const feedURL = getURL(cameraID);
      console.log("Camera ID " + cameraID);
      console.log("feed " + feedURL);

      switchFeed({
          feed_id: 4,
          building_name: selectedBuildingDisplayFour,
          floor_num: selectedFloorDisplayFour,
          camera_id: cameraID,
          camera_loc: selectedLocationDisplayFour,
          feed_url: feedURL,
        })
        .then((result) => {
            console.log("RESULT:", result);
            window.location.reload(false);
          },
          (error) => {
            console.log("ERROR:", error);
          }
        );

      // console.log("Building selected " + selectedBuildingDisplayOne);
      // console.log("Floor selected " + selectedFloorDisplayOne);
      // console.log("Location selected " + selectedLocationDisplayOne);
      // console.log("Camera selected " + selectedCameraDisplayOne);
    } else {
      alert("All fields must be filled to change feed.");
    }
  };

  const filteredCamerasFour = cameraFeeds.filter(
    (camera) =>
      camera.building_name === selectedBuildingDisplayFour &&
      camera.floor_num === selectedFloorDisplayFour &&
      camera.camera_loc === selectedLocationDisplayFour
  );
  return (
    <Box>
      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">Building Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select-filled"
          value={selectedBuildingDisplayFour}
          label="Building Name"
          onChange={handleBuildingChange_display_four}
        >
          {uniqueBuildingNames.map((item) => (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-floor">Floor</InputLabel>
        <Select
          labelId="demo-simple-select-floor"
          id="demo-simple-select-filled"
          value={selectedFloorDisplayFour}
          onChange={handleFloorChange_display_four}
        >
          <MenuItem value="0">Floor number</MenuItem>
          {selectedBuildingDisplayFour &&
            [
              ...new Set(
                cameraFeeds
                  .filter(
                    (camera) =>
                      camera.building_name === selectedBuildingDisplayFour
                  )
                  .map((camera) => camera.floor_num)
              ),
            ].map((floor_number) => (
              <MenuItem key={floor_number} value={floor_number}>
                {floor_number}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label-location">Location</InputLabel>
        <Select
          value={selectedLocationDisplayFour}
          id="demo-simple-select-label-location"
          onChange={handleLocationChange_display_four}
        >
          <MenuItem value="">Select Location</MenuItem>
          {selectedBuildingDisplayFour &&
            [
              ...new Set(
                cameraFeeds
                  .filter(
                    (camera) =>
                      camera.building_name === selectedBuildingDisplayFour &&
                      camera.floor_num === selectedFloorDisplayFour
                  )
                  .map((camera) => camera.camera_loc)
              ),
            ].map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label-camera">Camera</InputLabel>
        <Select
          id="demo-simple-select-label-camera"
          value={selectedCameraDisplayFour}
          onChange={handleCameraChange_display_four}
        >
          <MenuItem value="">Select Camera</MenuItem>
          {selectedLocationDisplayFour &&
            filteredCamerasFour.map((camera) => (
              <MenuItem key={camera.camera_id} value={camera.camera_name}>
                {camera.camera_name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <Button
        endIcon={<VideocamIcon />}
        color="success"
        size="large"
        variant="contained"
        sx={{ ml: 14, mt: 3 }}
        onClick={handleChangeFeedDisplayFour}
      >
        Change Feed
      </Button>
    </Box>
  );
};

export default DisplayControlBoxFour;
