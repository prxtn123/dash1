const express = require("express");
const db = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = 3002;
app.use(cors());
app.use(express.json());

app.get("/v1/api/building-details", (req, res) => {
  db.query(
    "SELECT building_name,lat,lng FROM cam_sur.building",
    (error, result) => {
      if (error) {
        console.log(error);
        res.send({});
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/v1/api/floor-detail", (req, res) => {
  const buildingName = req.query.buildingName;
  db.query(
    "SELECT * FROM cam_sur.floor LEFT JOIN cam_sur.camera ON floor.building_name = camera.building_name AND floor.floor_num = camera.floor_num WHERE floor.building_name = ?",
    buildingName,
    (err, result) => {
      if (err) {
      } else {
        const filtered_result = [];
        result.forEach((obj) => {
          let building = obj.building_name;
          let floor = obj.floor_num;
          if (building == null || floor == null) return;
          else {
            filtered_result.push(obj);
          }
        });
        res.send(filtered_result);
      }
    }
  );
});

app.get("/v1/api/user-detail", (req, res) => {
  const user_id = req.query.user_id;
  db.query(
    "SELECT camera_id FROM user_camera_info WHERE user_id=?",
    user_id,
    (err, result) => {
      if (err) {
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/v1/api/camera-detail", (req, res) => {
  db.query(
    "SELECT COUNT(*) FROM cam_sur.camera;",

    (err, result) => {
      if (err) {
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/v1/api/camera-select", (req, res) => {
  db.query(
    "SELECT * FROM cam_sur.camera;",

    (err, result) => {
      if (err) {
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/v1/api/dashboard-feed", (req, res) => {
  db.query(
    "SELECT * FROM cam_sur.dashboard_feeds;",

    (err, result) => {
      if (err) {
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/v1/api/building-count", (req, res) => {
  db.query(
    "SELECT COUNT(*) FROM cam_sur.building;",

    (err, result) => {
      if (err) {
      } else {
        res.send(result);
      }
    }
  );
});

// app.get("/v1/api/last-twelve-alerts", (req, res) => {
//   db.query(
//     "SELECT COUNT(*) FROM cam_sur.building;",

//     (err, result) => {
//       if (err) {
//       } else {
//         res.send(result);
//       }
//     }
//   );
// });

app.get("/v1/api/inactive-active-cameras", (req, res) => {
  db.query(
    "SELECT SUM(CASE WHEN network_state = 0 THEN 1 ELSE 0 END) AS count_of_zeros,SUM(CASE WHEN network_state = 1 THEN 1 ELSE 0 END) AS count_of_ones FROM cam_sur.camera;",

    (err, result) => {
      if (err) {
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/v1/api/camera-table", (req, res) => {
  db.query(
    "SELECT building_name,COUNT(*) AS num_cameras, SUM(CASE WHEN network_state = 1 THEN 1 ELSE 0 END) AS active, SUM(CASE WHEN network_state = 0 THEN 1 ELSE 0 END) AS inactive FROM cam_sur.camera GROUP BY building_name;",

    (err, result) => {
      if (err) {
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/v1/api/recent-alerts", (req, res) => {
  db.query(
    "SELECT building_name,event_type,event_date,camera_loc FROM cam_sur.event JOIN cam_sur.camera ON cam_sur.event.camera_id = cam_sur.camera.camera_id ORDER BY event_id DESC LIMIT 10;",

    (err, result) => {
      if (err) {
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/v1/api/all-alerts", (req, res) => {
  db.query(
    "SELECT building_name,event_type,event_date,camera_loc FROM cam_sur.event JOIN cam_sur.camera ON cam_sur.event.camera_id = cam_sur.camera.camera_id ORDER BY event_id DESC ;",
    (err, result) => {
      if (err) {
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/v1/api/user-detail", (req, res) => {
  const user_id = req.body.user_id;
  const camera_id = req.body.camera_id;
  db.query(
    "INSERT INTO user_camera_info (user_id, camera_id) VALUES (?, ?)",
    [user_id, camera_id],
    (err, result) => {
      if (err) {
        return res.status(500).send({});
      } else {
        return res.send(result);
      }
    }
  );
});
app.post("/v1/api/building", (req, res) => {
  const building_name = req.body.building_name;
  const lat = req.body.lat;
  const lng = req.body.lng;

  db.query(
    'INSERT INTO cam_sur.building (building_name,lat,lng) VALUES (?, ?, ?)',
    [building_name, lat, lng],

    (error, result) => {
      if (error) {
        console.log(error);
        res.send({ message: "Error adding building name" });
      } else {
        res.send({ message: "Building name added successfully" });
      }
    }
  );
});

app.post("/v1/api/switch-feed", (req, res) => {
  const feed_id = req.body.feed_id;
  const building_name = req.body.building_name;
  const floor_num = req.body.floor_num;
  const camera_id = parseInt(req.body.camera_id);
  const camera_loc = req.body.camera_loc;
  const feed_url = req.body.feed_url;

  db.query(
    "UPDATE cam_sur.dashboard_feeds SET building_name=?, floor_num=?, camera_id=?, camera_loc=?, feed_url=? WHERE feed_id=?",
    [building_name, floor_num, camera_id, camera_loc, feed_url, feed_id],

    (error, result) => {
      if (error) {
        console.log(error);
        res.send({ message: "Error changing video feed" });
      } else {
        res.send({ message: "Video feed changed successfully" });
      }
    }
  );
});

app.delete("/v1/api/delete_camera/:camera_id", (req, res) => {
  const camera_id = req.params.camera_id;
  db.query(
    "DELETE FROM cam_sur.camera WHERE camera_id = ?",
    [camera_id],
    (error, result) => {
      if (error) {
        console.log(error);
        res.send({ message: "Error deleting camera record" });
      } else {
        if (result.affectedRows === 0) {
          res.status(404).send({ message: "camera record not found" });
        } else {
          res.send({ message: "camera record deleted successfully" });
        }
      }
    }
  );
});

app.post("/v1/api/addFloor", (req, res) => {
  const building_name = req.body.building_name;
  const floor_num = req.body.floor_num;
  const camera_name = req.body.camera_name;
  const camera_loc = req.body.camera_loc;
  const date_of_installation = req.body.date_of_installation;
  db.query(
    'INSERT INTO cam_sur.floor (building_name,floor_num) VALUES (?, ?)',
    [building_name, floor_num],
    (error, result) => {
      if (error) {
        console.log(error);
        //res.send({ message: "Error adding floor " });
        db.query(
          'INSERT INTO cam_sur.camera (building_name,floor_num,camera_name,camera_loc,date_of_installation) VALUES (?, ?, ?, ?, DATE(?))',
          [building_name, floor_num, camera_name, camera_loc, date_of_installation],
          (error, result) => {
            if (error) {
              console.log(error);
              res.send({ message: "Error adding camera " });
            } else {
              res.send({ message: "Camera added successfully" });
            }
          }
        );
      } else {
        res.send({ message: "Floor added successfully" });
        db.query(
          'INSERT INTO cam_sur.camera (building_name,floor_num,camera_name,camera_loc,date_of_installation) VALUES (?, ?, ?, ?, DATE(?))',
          [building_name, floor_num, camera_name, camera_loc, date_of_installation],
          (error, result) => {
            if (error) {
              console.log(error);
              res.send({ message: "Error adding camera " });
            } else {
              res.send({ message: "Camera added successfully" });
            }
          }
        );
      }
    }
  );
});

app.post("/v1/api/billing", (req, res) => {
  db.query(
    "UPDATE transactions SET balance_rem = 0 WHERE user_id = 1",
    (error, result) => {
      if (error) {
        console.log(error);
        res.send({ message: "Error in updating billing data" });
      } else {
        res.send({ message: "Billing data updated" });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
