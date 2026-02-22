import { Box } from "@mui/material";

import { fetchCameraSelect, fetchDashboardFeeds, switchFeed } from "../../services/dashboardApi";
import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import VideocamIcon from "@mui/icons-material/Videocam";

const DisplayControlBoxThree = () => {
  const [selectedBuildingDisplayThree, setSelectedBuildingDisplayThree] =
    useState("");
  const [selectedFloorDisplayThree, setSelectedFloorDisplayThree] = useState(0);
  const [selectedLocationDisplayThree, setSelectedLocationDisplayThree] =
    useState("");
  const [selectedCameraDisplayThree, setSelectedCameraDisplayThree] =
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

  const handleBuildingChange_display_three = (event) => {
    setSelectedBuildingDisplayThree(event.target.value);
    setSelectedFloorDisplayThree(0);
    setSelectedLocationDisplayThree("");
    setSelectedCameraDisplayThree("");
  };

  const handleFloorChange_display_three = (event) => {
    setSelectedFloorDisplayThree(event.target.value);
    setSelectedLocationDisplayThree("");
    setSelectedCameraDisplayThree("");
  };
  const handleLocationChange_display_three = (event) => {
    setSelectedLocationDisplayThree(event.target.value);
    setSelectedCameraDisplayThree("");
  };

  const handleCameraChange_display_three = (event) => {
    setSelectedCameraDisplayThree(event.target.value);
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

  const handleChangeFeedDisplayThree = () => {
    if (
      selectedCameraDisplayThree !== "" &&
      selectedCameraDisplayThree !== "Select Camera"
    ) {
      const cameraID = getCameraId(
        selectedBuildingDisplayThree,
        selectedCameraDisplayThree,
        selectedLocationDisplayThree
      );
      const feedURL = getURL(cameraID);
      console.log("Camera ID " + cameraID);
      console.log("feed " + feedURL);

      switchFeed({
          feed_id: 3,
          building_name: selectedBuildingDisplayThree,
          floor_num: selectedFloorDisplayThree,
          camera_id: cameraID,
          camera_loc: selectedLocationDisplayThree,
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

  const filteredCamerasThree = cameraFeeds.filter(
    (camera) =>
      camera.building_name === selectedBuildingDisplayThree &&
      camera.floor_num === selectedFloorDisplayThree &&
      camera.camera_loc === selectedLocationDisplayThree
  );

  return (
    <Box>
      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">Building Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select-filled"
          value={selectedBuildingDisplayThree}
          label="Building Name"
          onChange={handleBuildingChange_display_three}
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
          value={selectedFloorDisplayThree}
          onChange={handleFloorChange_display_three}
        >
          <MenuItem value="0">Floor number</MenuItem>
          {selectedBuildingDisplayThree &&
            [
              ...new Set(
                cameraFeeds
                  .filter(
                    (camera) =>
                      camera.building_name === selectedBuildingDisplayThree
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
          value={selectedLocationDisplayThree}
          id="demo-simple-select-label-location"
          onChange={handleLocationChange_display_three}
        >
          <MenuItem value="">Select Location</MenuItem>
          {selectedBuildingDisplayThree &&
            [
              ...new Set(
                cameraFeeds
                  .filter(
                    (camera) =>
                      camera.building_name === selectedBuildingDisplayThree &&
                      camera.floor_num === selectedFloorDisplayThree
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
          value={selectedCameraDisplayThree}
          onChange={handleCameraChange_display_three}
        >
          <MenuItem value="">Select Camera</MenuItem>
          {selectedLocationDisplayThree &&
            filteredCamerasThree.map((camera) => (
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
        onClick={handleChangeFeedDisplayThree}
      >
        Change Feed
      </Button>
    </Box>
  );
};

export default DisplayControlBoxThree;
