import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FestivalIcon from '@mui/icons-material/Festival';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EngineeringIcon from '@mui/icons-material/Engineering';

import { Application } from '../api/ApplicationApi';

interface ApplicationsPageProps {
    applications: Application[];
    onNavigateToShake: () => void;
}

const getAppIcon = (index: number) => {
    const colors = ['#3f51b5', '#ff9800', '#9c27b0', '#03a9f4', '#4caf50', '#f50057'];
    const icons = [
        <SmartToyIcon sx={{ fontSize: 36, color: colors[0] }} />,
        <RestaurantIcon sx={{ fontSize: 36, color: colors[1] }} />,
        <SportsEsportsIcon sx={{ fontSize: 36, color: colors[2] }} />,
        <TravelExploreIcon sx={{ fontSize: 36, color: colors[3] }} />,
        <EngineeringIcon sx={{ fontSize: 36, color: colors[4] }} />,
        <FestivalIcon sx={{ fontSize: 36, color: colors[5] }} />
    ];
    return icons[index % icons.length];
};

const getIconBackground = (index: number) => {
    const backgrounds = [
        'rgba(63, 81, 181, 0.1)',
        'rgba(255, 152, 0, 0.1)',
        'rgba(156, 39, 176, 0.1)',
        'rgba(3, 169, 244, 0.1)',
        'rgba(76, 175, 80, 0.1)',
        'rgba(233, 30, 99, 0.1)',
    ];
    return backgrounds[index % backgrounds.length];
};

const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ applications, onNavigateToShake }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedApp, setSelectedApp] = React.useState<string | null>(null);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, appId: string) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedApp(appId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedApp(null);
    };

    const filteredApps = applications.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.description && app.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
                    我的应用
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
                    {/* Search input */}
                    <Paper
                        elevation={0}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: { xs: '100%', sm: 240 },
                            height: 40,
                            borderRadius: 20,
                            border: '1px solid',
                            borderColor: 'divider',
                            px: 2
                        }}
                    >
                        <SearchIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} />
                        <InputBase
                            placeholder="搜索"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            sx={{ flex: 1, fontSize: '0.875rem' }}
                        />
                    </Paper>

                    {/* Create button */}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        disableElevation
                        sx={{
                            borderRadius: 20,
                            height: 40,
                            px: 2,
                            textTransform: 'none',
                            fontWeight: 'normal'
                        }}
                    >
                        创建应用
                    </Button>
                </Box>
            </Box>

            {/* App grid */}
            {filteredApps.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredApps.map((app, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={app.id}>
                            <Card
                                elevation={0}
                                sx={{
                                    height: '100%',
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'rgba(0, 0, 0, 0.08)',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: 'rgba(0, 0, 0, 0.12)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                {/* Card header with icon and title */}
                                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: getIconBackground(index),
                                        mr: 1.5
                                    }}>
                                        {getAppIcon(index)}
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.3 }}>
                                            {app.name}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                            {app.type === 'internal' ? '内部工具' : 'App'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Card content with description */}
                                <CardActionArea onClick={onNavigateToShake}>
                                    <Box sx={{ px: 2, pb: 2 }}>
                                        <Typography sx={{
                                            fontSize: '0.875rem',
                                            color: 'text.secondary',
                                            lineHeight: 1.5,
                                            height: '4.5rem',
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical'
                                        }}>
                                            {app.description || "该应用暂无描述"}
                                        </Typography>
                                    </Box>
                                </CardActionArea>

                                {/* Card footer with tags and action button */}
                                <Box sx={{
                                    p: 2,
                                    borderTop: '1px solid rgba(0, 0, 0, 0.04)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {app.tags && app.tags.map((tag, tagIndex) => (
                                            <Box
                                                key={`${app.id}-tag-${tagIndex}`}
                                                sx={{
                                                    fontSize: '0.7rem',
                                                    color: 'text.secondary',
                                                    bgcolor: 'rgba(0, 0, 0, 0.03)',
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1
                                                }}
                                            >
                                                {tag}
                                            </Box>
                                        ))}
                                    </Box>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, app.id)}
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: 2,
                            border: '1px dashed',
                            borderColor: 'divider'
                        }}
                    >
                        <Typography color="text.secondary">没有找到匹配的应用</Typography>
                    </Paper>
            )}

            {/* Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { minWidth: 180, borderRadius: 1 } } }}
            >
                <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem' }}>编辑信息</MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem' }}>复制</MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem' }}>导出</MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main', fontSize: '0.875rem' }}>删除</MenuItem>
            </Menu>
        </Box>
    );
};

export default ApplicationsPage; 