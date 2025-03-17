import './App.css';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from '@mui/material/Link';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GitHubIcon from '@mui/icons-material/GitHub';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import RecipeShake from './components/RecipeShake';

import { Application, getApplications } from './api/ApplicationApi';

function App() {
  const [applications] = React.useState<Application[]>(getApplications());
  const [openMenu, setOpenMenu] = React.useState<boolean>(false);

  const handleOpenSelect = () => {
    setOpenMenu(true);
  };

  const handleCloseSelect = () => {
    setOpenMenu(false);
  };

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={handleOpenSelect}
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            </Typography>
            <Link color="inherit" href="https://github.com/l10178/tuna" target="_blank">
              <GitHubIcon />
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer
        open={openMenu}
        onClose={handleCloseSelect}
        sx={{ '& .MuiDrawer-paper': { width: 240 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h5">选择应用</Typography>
          <List>
            {applications.map((app) => (
              <ListItem key={app.id} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <RestaurantMenuIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={app.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <RecipeShake />
    </div>
  );
}

export default App;
