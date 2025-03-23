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
import ApplicationsPage from './components/ApplicationsPage';
import ExplorePage from './components/ExplorePage';
import logoImage from './logo.svg';

import { getCurrentUserApplications } from './api/ApplicationApi';
import { Application } from './api/Modules';

function App() {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [currentSection, setCurrentSection] = React.useState<'shake' | 'apps' | 'explore'>('apps');

  // 初始化数据
  React.useEffect(() => {
    // 加载应用列表
    const loadApplications = async () => {
      const apps = await getCurrentUserApplications();
      setApplications(apps);
    };
    loadApplications();
  }, []);


  const handleNavigate = (section: 'shake' | 'apps' | 'explore') => {
    setCurrentSection(section);
  };

  const renderContent = () => {
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
              onClick={() => handleNavigate('apps')}
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
