import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Application } from '../api/Modules';
import { getCurrentUserApplications } from '../api/ApplicationApi';
import ApplicationCard from './ApplicationCard';
import CreateApplicationDialog from './CreateApplicationDialog';

interface ApplicationsPageProps {
    onNavigateToShake: () => void;
}

const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ onNavigateToShake }) => {
    const [applications, setApplications] = React.useState<Application[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

    // 加载应用数据
    React.useEffect(() => {
        loadApplications();
    }, []);

    // 加载应用列表
    const loadApplications = async () => {
        try {
            setLoading(true);
            const apps = await getCurrentUserApplications();
            setApplications(apps);
        } catch (error) {
            console.error('Error loading applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    // 编辑应用
    const handleEditApp = (app: Application) => {
        console.log('编辑应用:', app);
    };

    // 复制应用
    const handleCopyApp = (app: Application) => {
        console.log('复制应用:', app);
    };

    // 导出应用
    const handleExportApp = (app: Application) => {
        console.log('导出应用:', app);
    };

    // 删除应用
    const handleDeleteApp = async (app: Application) => {
        try {
            // 从当前列表中移除应用
            setApplications(prevApps => prevApps.filter(a => a.id !== app.id));
            // TODO: 实现实际的删除API调用
            console.log('删除应用:', app);
        } catch (error) {
            console.error('删除应用失败:', error);
        }
    };

    // 打开创建应用对话框
    const handleOpenCreateDialog = () => {
        setCreateDialogOpen(true);
    };

    // 关闭创建应用对话框
    const handleCloseCreateDialog = () => {
        setCreateDialogOpen(false);
    };

    // 创建新应用
    const handleCreateApplication = (appData: Partial<Application>) => {
        // 创建临时ID，实际应用中应由后端生成
        const tempId = `temp_${Date.now()}`;
        const newApp: Application = {
            id: tempId,
            name: appData.name || '',
            description: appData.description,
            tags: appData.tags || []
        };

        // 添加到应用列表
        setApplications(prevApps => [newApp, ...prevApps]);

        // TODO: 实现实际的API调用
        console.log('创建新应用:', newApp);
    };

    const filteredApps = applications.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.description && app.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // 显示加载指示器
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">
                    我的应用
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
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

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        disableElevation
                        onClick={handleOpenCreateDialog}
                        sx={{
                            borderRadius: 20,
                            height: 40,
                            px: 2,
                            textTransform: 'none',
                            fontWeight: 'normal'
                        }}
                    >
                        创建
                    </Button>
                </Box>
            </Box>

            {/* App grid */}
            {filteredApps.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredApps.map((app, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={app.id}>
                            <ApplicationCard
                                application={app}
                                index={index}
                                onNavigate={onNavigateToShake}
                                onEdit={handleEditApp}
                                onCopy={handleCopyApp}
                                onExport={handleExportApp}
                                onDelete={handleDeleteApp}
                            />
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

            {/* 创建应用对话框 */}
            <CreateApplicationDialog
                open={createDialogOpen}
                onClose={handleCloseCreateDialog}
                onSubmit={handleCreateApplication}
            />
        </Box>
    );
};

export default ApplicationsPage; 