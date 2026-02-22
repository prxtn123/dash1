import { Box } from "@mui/material";

import { fetchCameraSelect, fetchDashboardFeeds, switchFeed } from "../../services/dashboardApi";
import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import VideocamIcon from "@mui/icons-material/Videocam";

const DisplayControlBoxTwo = () => {
  const [selectedBuildingDisplayTwo, setSelectedBuildingDisplayTwo] =
    useState("");
  const [selectedFloorDisplayTwo, setSelectedFloorDisplayTwo] = useState(0);
  const [selectedLocationDisplayTwo, setSelectedLocationDisplayTwo] =
    useState("");
  const [selectedCameraDisplayTwo, setSelectedCameraDisplayTwo] = useState("");
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

  const handleBuildingChange_display_two = (event) => {
    setSelectedBuildingDisplayTwo(event.target.value);
    setSelectedFloorDisplayTwo(0);
    setSelectedLocationDisplayTwo("");
    setSelectedCameraDisplayTwo("");
  };

  const handleFloorChange_display_two = (event) => {
    setSelectedFloorDisplayTwo(event.target.value);
    setSelectedLocationDisplayTwo("");
    setSelectedCameraDisplayTwo("");
  };
  const handleLocationChange_display_two = (event) => {
    setSelectedLocationDisplayTwo(event.target.value);
    setSelectedCameraDisplayTwo("");
  };

  const handleCameraChange_display_two = (event) => {
    setSelectedCameraDisplayTwo(event.target.value);
  };

  const handleChangeFeedDisplayTwo = () => {
    if (
      selectedCameraDisplayTwo !== "" &&
      selectedCameraDisplayTwo !== "Select Camera"
    ) {
      const cameraID = getCameraId(
        selectedBuildingDisplayTwo,
        selectedCameraDisplayTwo,
        selectedLocationDisplayTwo
      );
      const feedURL = getURL(cameraID);
      console.log("Camera ID " + cameraID);
      console.log("feed " + feedURL);

      switchFeed({
          feed_id: 2,
          building_name: selectedBuildingDisplayTwo,
          floor_num: selectedFloorDisplayTwo,
          camera_id: cameraID,
          camera_loc: selectedLocationDisplayTwo,
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

  const filteredCamerasTwo = cameraFeeds.filter(
    (camera) =>
      camera.building_name === selectedBuildingDisplayTwo &&
      camera.floor_num === selectedFloorDisplayTwo &&
      camera.camera_loc === selectedLocationDisplayTwo
  );

  return (
    <Box>
      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">Building Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select-filled"
          value={selectedBuildingDisplayTwo}
          label="Building Name"
          onChange={handleBuildingChange_display_two}
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
          value={selectedFloorDisplayTwo}
          onChange={handleFloorChange_display_two}
        >
          <MenuItem value="0">Floor number</MenuItem>
          {selectedBuildingDisplayTwo &&
            [
              ...new Set(
                cameraFeeds
                  .filter(
                    (camera) =>
                      camera.building_name === selectedBuildingDisplayTwo
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
          value={selectedLocationDisplayTwo}
          id="demo-simple-select-label-location"
          onChange={handleLocationChange_display_two}
        >
          <MenuItem value="">Select Location</MenuItem>
          {selectedBuildingDisplayTwo &&
            [
              ...new Set(
                cameraFeeds
                  .filter(
                    (camera) =>
                      camera.building_name === selectedBuildingDisplayTwo &&
                      camera.floor_num === selectedFloorDisplayTwo
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
          value={selectedCameraDisplayTwo}
          onChange={handleCameraChange_display_two}
        >
          <MenuItem value="">Select Camera</MenuItem>
          {selectedLocationDisplayTwo &&
            filteredCamerasTwo.map((camera) => (
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
        onClick={handleChangeFeedDisplayTwo}
      >
        Change Feed
      </Button>
    </Box>
  );
};

export default DisplayControlBoxTwo;
