import './App.css';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ExploreIcon from '@mui/icons-material/Explore';
import Button from '@mui/material/Button';

import RecipeShake from './components/RecipeShake';
import UserSettings from './components/UserSettings';
import ApplicationsPage from './components/ApplicationsPage';
import ExplorePage from './components/ExplorePage';
import logoImage from './logo.svg';

import { Application, getCurrentUserApplications } from './api/ApplicationApi';
import { User } from './api/UserApi';

function App() {
  const [applications] = React.useState<Application[]>(getCurrentUserApplications());
  const [showUserSettings, setShowUserSettings] = React.useState<boolean>(false);
  const [currentUser] = React.useState<User | null>(null);
  const [currentSection, setCurrentSection] = React.useState<'shake' | 'apps' | 'explore'>('shake');


  const handleCloseSettings = () => {
    setShowUserSettings(false);
  };

  const handleSaveUserSettings = (user: User) => {
    console.log('Saving user:', user);
    setShowUserSettings(false);
  };

  const handleNavigate = (section: 'shake' | 'apps' | 'explore') => {
    setCurrentSection(section);
    setShowUserSettings(false);
  };

  const renderContent = () => {
    if (showUserSettings) {
      return (
        <UserSettings
          user={currentUser}
          onBack={handleCloseSettings}
          onSave={handleSaveUserSettings}
        />
      );
    }

    switch (currentSection) {
      case 'apps':
        return (
          <ApplicationsPage
            applications={applications}
            onNavigateToShake={() => handleNavigate('shake')}
          />
        );
      case 'explore':
        return <ExplorePage />;
      default:
        return <RecipeShake />;
    }
  };

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" enableColorOnDark>
          <Toolbar>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => handleNavigate('shake')}
            >
              <img
                src={logoImage}
                alt="Logo"
                style={{
                  height: 32,
                  marginRight: 8
                }}
              />
              <Typography
                variant="h6"
                component="div"
              >
                庄周吃鱼
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Button
                size="large"
                color="inherit"
                startIcon={<SmartToyIcon />}
                onClick={() => handleNavigate('apps')}
                sx={{ mx: 3 }}
              >
                应用
              </Button>
              <Button
                size="large"
                color="inherit"
                startIcon={<ExploreIcon />}
                onClick={() => handleNavigate('explore')}
                sx={{ mx: 3 }}
              >
                探索
              </Button>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Link color="inherit" href="https://github.com/l10178/tuna" target="_blank">
              <GitHubIcon />
            </Link>
          </Toolbar>
        </AppBar>
      </Box>

      {renderContent()}
    </div>
  );
}

export default App;
