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
  useTheme,
  Fade,
  ListItemIcon,
  alpha,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Add as AddIcon,
  History as HistoryIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
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
import { useLocation, useNavigate } from "react-router-dom";
import ls from "../features/LocalStorage";
import favicon from "../assets/favicon.svg";

const navItems = [
  { text: "Home", path: "/", icon: <HomeIcon /> },
  { text: "Add Report", path: "/add_entry", icon: <AddIcon /> },
  { text: "History", path: "/history", icon: <HistoryIcon /> },
];
const drawerWidth = 280;

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
  const theme = useTheme();

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
        <AppBar position="sticky">
          <Toolbar ref={ref} sx={{ px: { xs: 2, sm: 3 } }}>
            <Grid container width={"100%"} spacing={2} alignItems="center">
              <Grid size="auto">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "40px",
                  }}
                >
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{
                      borderRadius: 2,
                      position: "relative",
                      transition: "all 0.3s ease",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0)}, ${alpha(theme.palette.primary.main, 0)})`,
                        zIndex: -1,
                        transition: "opacity 0.3s ease, background 0.3s ease",
                        opacity: 0,
                      },
                      "&:hover": {
                        backgroundColor: "transparent",
                        transform: "translateY(-3px)",
                        "& .MuiSvgIcon-root": {
                          transform: "scale(1.1)",
                          color: theme.palette.primary.main,
                        },
                        "&::before": {
                          opacity: 1,
                          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
                        },
                      },
                      "&:active": {
                        transform: "translateY(0)",
                        "& .MuiSvgIcon-root": {
                          transform: "scale(0.9)",
                        },
                      },
                    }}
                  >
                    <MenuIcon
                      sx={{
                        fontSize: 24,
                        transition: "all 0.3s ease",
                      }}
                    />
                  </IconButton>
                </Box>
              </Grid>
              <Grid
                size="grow"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Fade in={Boolean(text)} timeout={800}>
                  <Typography
                    variant="h6"
                    component="div"
                    fontWeight="medium"
                    sx={{
                      letterSpacing: "0.5px",
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      ...(!isDarkMode
                        ? {
                            color: "white",
                            textShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)",
                          }
                        : {
                            background: text
                              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.main, 0.7)})`
                              : "transparent",
                            WebkitBackgroundClip: text ? "text" : "none",
                            WebkitTextFillColor: text
                              ? "transparent"
                              : "inherit",
                          }),
                    }}
                  >
                    {text}
                  </Typography>
                </Fade>
              </Grid>
              <Grid
                size="auto"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "40px",
                    p: 0.5,
                    borderRadius: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.6
                      ),
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <DarkModeSwitch
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                    size={26}
                    sunColor="yellow"
                  />
                </Box>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <NavDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Toolbar />
    </>
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

  const isDarkMode = useIsDarkModeContext() as boolean;
  const theme = useTheme();

  const elevation = trigger ? 4 : 0;

  // More harmonious colors for light mode
  const color = isDarkMode ? theme.palette.background.paper : "#1976d2"; // Slightly lighter blue for navbar in light mode

  // Using a more complementary color for the border in light mode
  const borderColor = isDarkMode
    ? theme.palette.primary.main
    : theme.palette.warning.light;

  const sx = {
    transition: "all 0.3s ease",
    backdropFilter: trigger ? "blur(10px)" : "none",
    boxShadow: trigger
      ? `0 4px 20px ${alpha(theme.palette.common.black, isDarkMode ? 0.2 : 0.1)}`
      : "none",
    backgroundColor: trigger ? alpha(color, isDarkMode ? 0.8 : 0.85) : color,
    color: isDarkMode ? theme.palette.text.primary : "#ffffff",
    position: "fixed",
    top: 0,
    zIndex: theme.zIndex.appBar,
    // Enhanced border transition with conditional thickness based on theme
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: isDarkMode ? "1px" : "2px",
      background: `linear-gradient(90deg, transparent, ${borderColor} 20%, ${borderColor} 80%, transparent)`,
      transition:
        "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease",
      transform: trigger ? "scaleX(0)" : "scaleX(1)",
      opacity: trigger ? 0 : 1,
      transformOrigin: "center",
    },
  };

  return cloneElement(children, {
    elevation: elevation,
    sx: sx,
  });
};

interface NavDrawerProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const NavDrawer: FC<NavDrawerProps> = function ({
  mobileOpen,
  handleDrawerToggle,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleClick = (path: string) => () => {
    if (path === "/add_entry") ls.clearWorkingOn();

    navigate(path);
    handleDrawerToggle();
  };

  const drawer = (
    <Box
      sx={{
        textAlign: "center",
        height: "100%",
        background: theme.palette.background.default,
        backgroundImage: `radial-gradient(circle at 90% 10%, ${alpha(
          theme.palette.primary.main,
          0.05
        )}, transparent 40%), radial-gradient(circle at 10% 90%, ${alpha(
          theme.palette.secondary.main,
          0.03
        )}, transparent 40%)`,
      }}
    >
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(
              theme.palette.primary.main,
              0.05
            )}, transparent 70%)`,
            zIndex: 0,
          }}
        />
        <Avatar
          sx={{
            width: 70,
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.12)}`,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            p: 1,
            mb: 1,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: `0 12px 28px ${alpha(theme.palette.common.black, 0.15)}`,
            },
          }}
        >
          <img src={favicon} alt="LALR Generator Icon" width="45" height="45" />
        </Avatar>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 40,
              height: 2,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1,
            },
          }}
        >
          LALR Report Generator
        </Typography>
      </Box>
      <Divider sx={{ mx: 3, mb: 2, opacity: 0.6 }} />
      <List sx={{ p: 2 }}>
        {navItems.map((item, index) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem
              key={item.path}
              disablePadding
              sx={{
                mb: 1.5,
                animation: mobileOpen
                  ? `fadeSlideIn 0.5s ${(index * 0.1).toString()}s both`
                  : "none",
                "@keyframes fadeSlideIn": {
                  "0%": { opacity: 0, transform: "translateX(-10px)" },
                  "100%": { opacity: 1, transform: "translateX(0)" },
                },
              }}
            >
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  backgroundColor: isSelected
                    ? theme.palette.mode === "dark"
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.primary.main, 0.08)
                    : "transparent",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.primary.main, 0.2)
                        : alpha(theme.palette.primary.main, 0.12),
                    transform: "translateY(-2px)",
                    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
                  },
                  transition: "all 0.2s ease-in-out",
                  borderLeft: isSelected
                    ? `3px solid ${theme.palette.primary.main}`
                    : `3px solid transparent`,
                }}
                onClick={handleClick(item.path)}
                disabled={isSelected}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected ? theme.palette.primary.main : undefined,
                    minWidth: "46px",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  slotProps={{
                    primary: {
                      fontWeight: isSelected ? "bold" : "medium",
                      color: isSelected
                        ? theme.palette.primary.main
                        : undefined,
                      fontSize: "0.95rem",
                    },
                  }}
                />
                {isSelected && <ChevronRightIcon color="primary" />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ flexGrow: 1 }} />
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
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
          borderRadius: { xs: 0, sm: "0 16px 16px 0" },
          boxShadow:
            theme.palette.mode === "dark"
              ? `0 0 40px ${alpha(theme.palette.common.black, 0.5)}`
              : `0 10px 40px ${alpha(theme.palette.common.black, 0.15)}`,
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: alpha(theme.palette.background.default, 0.7),
            backdropFilter: "blur(10px)",
          },
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default NavBar;
