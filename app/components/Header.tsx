"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Header() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Помилка при виході:", error);
    }
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      className="bg-black border-b border-gray-800"
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          className="font-bold tracking-wider"
          sx={{ flexGrow: 1 }}
        >
          EVENT PLANNER
        </Typography>

        {user && (
          <Box className="flex items-center gap-4">
            <Typography
              variant="body2"
              className="text-gray-300 hidden sm:block"
            >
              {user.email}
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              endIcon={<LogoutIcon />}
              className="text-white border-gray-700 hover:bg-gray-800"
              variant="outlined"
              size="small"
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
