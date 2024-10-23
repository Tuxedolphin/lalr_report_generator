import { Box, Card, CardContent, Divider, Fab } from "@mui/material";
import { FC } from "react";


const ActionButton:FC = () => {

  

  return (
    <Card sx={{ marginTop: 1, marginBottom: 2 }}>
      <CardContent>
        <Box>Settings</Box>
        <Divider sx={{ marginTop: 1, marginBottom: 1 }}></Divider>
        
      </CardContent>
    </Card>
  );
}

export default ActionButton;
