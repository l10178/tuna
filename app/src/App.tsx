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
import SettingsIcon from '@mui/icons-material/Settings';

import RecipeShake from './components/RecipeShake';
import UserSettings from './components/UserSettings';

import { Application, getApplications } from './api/ApplicationApi';
import { User, getUsers } from './api/UserApi';

function App() {
  const [applications] = React.useState<Application[]>(getApplications());
  const [users] = React.useState<User[]>(getUsers());
  const [selectedUserId] = React.useState<string | null>(null);
  const [openMenu, setOpenMenu] = React.useState<boolean>(false);
  const [showUserSettings, setShowUserSettings] = React.useState<boolean>(false);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  const handleOpenSelect = () => {
    setOpenMenu(true);
  };

  const handleCloseSelect = () => {
    setOpenMenu(false);
  };

  const handleOpenUserSettings = () => {
    // If a user is already selected, use that user
    if (selectedUserId) {
      const user = users.find(u => u.id === selectedUserId);
      if (user) {
        setCurrentUser(user);
      }
    } else if (users.length > 0) {
      // Otherwise, use the first user
      setCurrentUser(users[0]);
    }
    setShowUserSettings(true);
  };

  const handleCloseSettings = () => {
    setShowUserSettings(false);
  };

  const handleSaveUserSettings = (user: User) => {
    // In a real app, you would update the user in your database/API here
    console.log('Saving user:', user);
    // For now, just close the settings
    setShowUserSettings(false);
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
            <IconButton
              size="large"
              color="inherit"
              onClick={handleOpenUserSettings}
            >
              <SettingsIcon />
            </IconButton>
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

      {showUserSettings ? (
        <UserSettings
          user={currentUser}
          onBack={handleCloseSettings}
          onSave={handleSaveUserSettings}
        />
      ) : (
          <RecipeShake />
      )}
    </div>
  );
}

export default App;
