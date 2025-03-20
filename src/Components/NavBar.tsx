import {
  AppBar,
  Toolbar,
  Typography,
  useScrollTrigger,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
  Grid2 as Grid,
  IconButton,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import {
  FC,
  useEffect,
  useState,
  useRef,
  RefObject,
  cloneElement,
} from "react";
import { DarkModeSwitch } from "animated-toggle-button";
import {
  useIsDarkModeContext,
  useNavBarHeightContext,
  useNavBarTextContext,
} from "../context/contextFunctions";
import { useNavigate } from "react-router-dom";

const navItems = [
  { text: "Home", path: "/" },
  { text: "Add Report", path: "/add_entry" },
  { text: "History", path: "/history" },
];
const drawerWidth = 240;

interface NavDrawerProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const NavDrawer: FC<NavDrawerProps> = function ({
  mobileOpen,
  handleDrawerToggle,
}) {
  const navigate = useNavigate();
  const handleClick = (path: string) => () => {
    navigate(path);
    handleDrawerToggle();
  };

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Report Generator
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={handleClick(item.path)}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: "block", sm: "none" },
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
      }}
    >
      {drawer}
    </Drawer>
  );
};

interface ElevationType {
  children: React.ReactElement<{ elevation?: number; sx?: object }>;
}

const ElevationScroll: FC<ElevationType> = function ({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  const elevation = trigger ? 4 : 0;
  const sx = {
    backgroundColor: trigger ? undefined : "transparent",
    transition: "background-color 0.3s ease",
    position: "sticky"
  };

  return cloneElement(children, {
    elevation: elevation,
    sx: sx,
  });
};

const NavBar: FC = function () {
  const [isDarkMode, toggleDarkMode] = useIsDarkModeContext(true) as [
    boolean,
    () => void,
  ];

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const text = useNavBarTextContext(true) as string;

  const setHeight = useNavBarHeightContext(true) as React.Dispatch<
    React.SetStateAction<number>
  >;
  const ref = useRef() as RefObject<HTMLDivElement>;

  useEffect(() => {
    if (!ref.current) return;

    setHeight(ref.current.clientHeight);
  });

  return (
    <>
      <ElevationScroll>
        <AppBar
        >
          <Toolbar ref={ref}>
            <Grid container width={"100%"} spacing={2}>
              <Grid size="grow">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                  >
                    <MenuIcon sx={{ fontSize: 28 }} />
                  </IconButton>
                </Box>
              </Grid>
              <Grid
                size={8}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" noWrap component="div">
                  {text}
                </Typography>
              </Grid>
              <Grid
                size="grow"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DarkModeSwitch
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  size={28}
                  sunColor="yellow"
                />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <NavDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
    </>
  );
};

export default NavBar;
