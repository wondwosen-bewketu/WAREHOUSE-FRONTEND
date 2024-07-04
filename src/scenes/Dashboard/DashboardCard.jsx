import React from "react";
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import {
  ShoppingCart,
  Store,
  TransferWithinAStation,
  AssignmentReturn,
} from "@mui/icons-material";

const DashboardCard = ({ title, count, icon: Icon, color }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        minWidth: "300px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
        },
        "@media (max-width: 600px)": {
          minWidth: "auto",
          width: "100%",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "column",
          padding: theme.spacing(2),
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: color,
            borderRadius: "50%",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            marginBottom: theme.spacing(2),
            transition: "background-color 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          <Icon sx={{ color: "#fff", fontSize: 36 }} />
        </Box>
        <Box sx={{ width: "100%" }}>
          <Typography variant="h5" color="textPrimary" gutterBottom>
            {count}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
