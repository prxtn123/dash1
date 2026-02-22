import { Box } from "@mui/material";

import { fetchCameraSelect, fetchDashboardFeeds, switchFeed } from "../../services/dashboardApi";
import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import VideocamIcon from "@mui/icons-material/Videocam";

const DisplayControlBoxOne = () => {
  const [selectedBuildingDisplayOne, setSelectedBuildingDisplayOne] =
    useState("");
  const [selectedFloorDisplayOne, setSelectedFloorDisplayOne] = useState(0);
  const [selectedLocationDisplayOne, setSelectedLocationDisplayOne] =
    useState("");
  const [selectedCameraDisplayOne, setSelectedCameraDisplayOne] = useState("");
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

  const handleBuildingChange_display_one = (event) => {
    setSelectedBuildingDisplayOne(event.target.value);
    setSelectedFloorDisplayOne(0);
    setSelectedLocationDisplayOne("");
    setSelectedCameraDisplayOne("");
  };

  const handleFloorChange_display_one = (event) => {
    setSelectedFloorDisplayOne(event.target.value);
    setSelectedLocationDisplayOne("");
    setSelectedCameraDisplayOne("");
  };

  const handleLocationChange_display_one = (event) => {
    setSelectedLocationDisplayOne(event.target.value);
    setSelectedCameraDisplayOne("");
  };

  const handleCameraChange_display_one = (event) => {
    setSelectedCameraDisplayOne(event.target.value);
  };

  const handleChangeFeedDisplayOne = () => {
    if (
      selectedCameraDisplayOne !== "" &&
      selectedCameraDisplayOne !== "Select Camera"
    ) {
      const cameraID = getCameraId(
        selectedBuildingDisplayOne,
        selectedCameraDisplayOne,
        selectedLocationDisplayOne
      );
      const feedURL = getURL(cameraID);
      console.log("Camera ID " + cameraID);
      console.log("feed " + feedURL);

      switchFeed({
          feed_id: 1,
          building_name: selectedBuildingDisplayOne,
          floor_num: selectedFloorDisplayOne,
          camera_id: cameraID,
          camera_loc: selectedLocationDisplayOne,
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

  //console.log("UNIQUE BUILDINGS: ", uniqueBuildingNames);

  const filteredCamerasOne = cameraFeeds.filter(
    (camera) =>
      camera.building_name === selectedBuildingDisplayOne &&
      camera.floor_num === selectedFloorDisplayOne &&
      camera.camera_loc === selectedLocationDisplayOne
  );

  return (
    <Box>
      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">Building Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select-filled"
          value={selectedBuildingDisplayOne}
          label="Building Name"
          onChange={handleBuildingChange_display_one}
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
          value={selectedFloorDisplayOne}
          onChange={handleFloorChange_display_one}
        >
          <MenuItem value="0">Floor number</MenuItem>
          {selectedBuildingDisplayOne &&
            [
              ...new Set(
                cameraFeeds
                  .filter(
                    (camera) =>
                      camera.building_name === selectedBuildingDisplayOne
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
          value={selectedLocationDisplayOne}
          onChange={handleLocationChange_display_one}
        >
          <MenuItem value="">Select Location</MenuItem>
          {selectedBuildingDisplayOne &&
            [
              ...new Set(
                cameraFeeds
                  .filter(
                    (camera) =>
                      camera.building_name === selectedBuildingDisplayOne &&
                      camera.floor_num === selectedFloorDisplayOne
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
          value={selectedCameraDisplayOne}
          onChange={handleCameraChange_display_one}
        >
          <MenuItem value="">Select Camera</MenuItem>
          {selectedLocationDisplayOne &&
            filteredCamerasOne.map((camera) => (
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
        onClick={handleChangeFeedDisplayOne}
      >
        Change Feed
      </Button>
    </Box>
  );
};
export default DisplayControlBoxOne;
