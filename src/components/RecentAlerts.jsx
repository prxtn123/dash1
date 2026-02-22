import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

import { fetchRecentAlerts } from "../services/dashboardApi";

const RecentAlerts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [recentAlerts, setRecentAlerts] = useState([]);

  const getRecentAlerts = async () => {
    const data = await fetchRecentAlerts();
    setRecentAlerts(data);
  };

  useEffect(() => {
    getRecentAlerts();
  }, []);

  return (
    <Box
      gridColumn="span 4"
      gridRow="span 2"
      backgroundColor={colors.primary[400]}
      overflow="auto"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderBottom={`4px solid ${colors.primary[500]}`}
        colors={colors.grey[100]}
        p="15px"
      >
        <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
          Recent Alerts
        </Typography>
      </Box>
      {recentAlerts.map((transaction, i) => (
        <Box
          key={`${transaction.building_name}-${i}`}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`}
          p="15px"
        >
          <Box>
            <Typography
              color={colors.greenAccent[500]}
              variant="h5"
              fontWeight="600"
            >
              {transaction.building_name}
            </Typography>
            <Typography color={colors.grey[100]}>
              {transaction.camera_loc}
            </Typography>
          </Box>
          <Box color={colors.grey[100]}>{transaction.event_date}</Box>
          <Box
            backgroundColor={colors.redAccent[800]}
            p="5px 10px"
            borderRadius="4px"
          >
            {transaction.event_type}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default RecentAlerts;
