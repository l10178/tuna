import * as React from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Application } from '../api/Modules';
import { getApplicationById, updateApplication } from '../api/ApplicationApi';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid2';
import { getIconBackground } from './ApplicationCard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FestivalIcon from '@mui/icons-material/Festival';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import EngineeringIcon from '@mui/icons-material/Engineering';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

// 定义标签页内容接口
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// 应用图标列表
const APP_ICONS = [
    { icon: <SmartToyIcon />, name: '机器人', color: '#3f51b5' },
    { icon: <RestaurantIcon />, name: '餐饮', color: '#ff9800' },
    { icon: <SportsEsportsIcon />, name: '游戏', color: '#9c27b0' },
    { icon: <TravelExploreIcon />, name: '探索', color: '#03a9f4' },
    { icon: <EngineeringIcon />, name: '工程', color: '#4caf50' },
    { icon: <FestivalIcon />, name: '娱乐', color: '#f50057' }
];

// 标签页内容组件
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            style={{ width: '100%', height: '100%' }}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3, height: '100%' }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// 获取props
function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

// 应用编辑页面组件
const ApplicationEditor: React.FC = () => {
    // 获取路由参数
    const { appId } = useParams<{ appId: string }>();

    // 状态
    const [value, setValue] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [application, setApplication] = React.useState<Application | null>(null);
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [tags, setTags] = React.useState<string[]>([]);
    const [newTag, setNewTag] = React.useState('');
    const [selectedIconIndex, setSelectedIconIndex] = React.useState(0);
    const [snackbar, setSnackbar] = React.useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    // 加载应用数据
    React.useEffect(() => {
        const fetchApplication = async () => {
            try {
                setLoading(true);
                if (appId) {
                    const app = await getApplicationById(appId);
                    setApplication(app);
                    setName(app.name);
                    setDescription(app.description || '');
                    setTags(app.tags || []);
                    setSelectedIconIndex(parseInt(app.logo || '0'));
                }
            } catch (error) {
                console.error('Error loading application:', error);
                showErrorMessage('加载应用失败');
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [appId]);

    // 处理标签页切换
    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    // 处理名称变更
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    // 处理描述变更
    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    // 添加标签
    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    // 删除标签
    const handleDeleteTag = (tagToDelete: string) => {
        setTags(tags.filter(tag => tag !== tagToDelete));
    };

    // 处理新标签输入变更
    const handleNewTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTag(event.target.value);
    };

    // 处理新标签输入按键
    const handleNewTagKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddTag();
        }
    };

    // 保存应用
    const handleSave = async () => {
        try {
            if (!application) return;

            setSaving(true);

            // 验证必填字段
            if (!name.trim()) {
                showErrorMessage('应用名称不能为空');
                setSaving(false);
                return;
            }

            // 构建更新后的应用对象
            const updatedApplication: Application = {
                ...application,
                name: name.trim(),
                description: description.trim() || undefined,
                tags,
                logo: selectedIconIndex.toString(),
            };

            // 调用API更新应用
            await updateApplication(updatedApplication);

            // 更新本地状态
            setApplication(updatedApplication);

            showSuccessMessage('保存成功');
        } catch (error) {
            console.error('Error saving application:', error);
            showErrorMessage('保存失败');
        } finally {
            setSaving(false);
        }
    };

    // 显示成功消息
    const showSuccessMessage = (message: string) => {
        setSnackbar({
            open: true,
            message,
            severity: 'success'
        });
    };

    // 显示错误消息
    const showErrorMessage = (message: string) => {
        setSnackbar({
            open: true,
            message,
            severity: 'error'
        });
    };

    // 关闭提示框
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // 加载中状态
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
            {/* 顶部导航栏 */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        sx={{ mr: 2 }}
                        onClick={() => window.history.back()}
                    >
                        返回
                    </Button>
                    <Typography variant="h6">
                        {application?.name || '编辑应用'}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? '保存中...' : '保存'}
                </Button>
            </Box>

            {/* 内容区域 */}
            <Box sx={{
                display: 'flex',
                flexGrow: 1,
                overflow: 'hidden',
                bgcolor: 'background.default',
            }}>
                {/* 左侧标签栏 */}
                <Paper
                    sx={{
                        width: 200,
                        flexShrink: 0,
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 0,
                        boxShadow: 'none'
                    }}
                >
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="应用设置标签页"
                        sx={{
                            '& .MuiTabs-indicator': {
                                left: 0,
                                right: 'auto',
                                width: 3
                            },
                            '& .Mui-selected': {
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                                fontWeight: 500
                            }
                        }}
                    >
                        <Tab
                            label="基本信息"
                            {...a11yProps(0)}
                            sx={{ alignItems: 'flex-start', pl: 3, minHeight: 48 }}
                        />
                        <Tab
                            label="数据编排"
                            {...a11yProps(1)}
                            sx={{ alignItems: 'flex-start', pl: 3, minHeight: 48 }}
                        />
                    </Tabs>
                </Paper>

                {/* 右侧内容区域 */}
                <Box sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}>
                    {/* 基本信息标签页 */}
                    <TabPanel value={value} index={0}>
                        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                            <Typography variant="h6" sx={{ mb: 4, fontWeight: 500 }}>
                                基本信息
                            </Typography>

                            {/* 图标选择器 */}
                            <Box sx={{ mb: 5 }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                                    应用图标
                                </Typography>
                                <Grid container spacing={2} sx={{ mb: 1 }}>
                                    {APP_ICONS.map((iconObj, index) => (
                                        <Grid key={index}>
                                            <Avatar
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    bgcolor: getIconBackground(index),
                                                    color: iconObj.color,
                                                    cursor: 'pointer',
                                                    border: index === selectedIconIndex ? `2px solid ${iconObj.color}` : 'none',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        transform: 'scale(1.08)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                                    }
                                                }}
                                                onClick={() => setSelectedIconIndex(index)}
                                            >
                                                {React.cloneElement(iconObj.icon, { sx: { fontSize: 28 } })}
                                            </Avatar>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>

                            {/* 名称输入 */}
                            <TextField
                                fullWidth
                                required
                                id="app-name"
                                label="应用名称"
                                variant="outlined"
                                value={name}
                                onChange={handleNameChange}
                                sx={{
                                    mb: 4,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1.5
                                    }
                                }}
                            />

                            {/* 描述输入 */}
                            <TextField
                                fullWidth
                                id="app-description"
                                label="应用描述"
                                variant="outlined"
                                multiline
                                rows={4}
                                value={description}
                                onChange={handleDescriptionChange}
                                sx={{
                                    mb: 5,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1.5
                                    }
                                }}
                            />

                            {/* 标签管理 */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                                    标签
                                </Typography>

                                {/* 标签列表 */}
                                {tags.length > 0 ? (
                                    <Box sx={{ mb: 3 }}>
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                            {tags.map(tag => (
                                                <Chip
                                                    key={tag}
                                                    label={tag}
                                                    onDelete={() => handleDeleteTag(tag)}
                                                    sx={{
                                                        mb: 1,
                                                        borderRadius: 3,
                                                        bgcolor: 'rgba(0, 0, 0, 0.05)',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(0, 0, 0, 0.08)'
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>
                                ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        暂无标签
                                    </Typography>
                                )}

                                {/* 添加标签 */}
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        placeholder="添加标签"
                                        value={newTag}
                                        onChange={handleNewTagChange}
                                        onKeyDown={handleNewTagKeyDown}
                                        sx={{
                                            mr: 1,
                                            flex: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={handleAddTag}
                                        disabled={!newTag.trim()}
                                        sx={{
                                            borderRadius: 1.5,
                                            textTransform: 'none'
                                        }}
                                    >
                                        添加
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </TabPanel>

                    {/* 编排标签页 */}
                    <TabPanel value={value} index={1}>
                        <Box sx={{ maxWidth: 1100, mx: 'auto', height: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 4, fontWeight: 500 }}>
                                数据编排
                            </Typography>

                            <Box sx={{ 
                                height: 'calc(100% - 60px)',
                                bgcolor: 'rgba(0, 0, 0, 0.02)',
                                borderRadius: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                p: 4
                            }}>
                                <Box
                                    component="img"
                                    src="/workflow-placeholder.svg"
                                    alt="编排占位图"
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        opacity: 0.6,
                                        mb: 3
                                    }}
                                />
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 'normal' }}>
                                    数据流编排工作区
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 400 }}>
                                    在这里可以设计数据处理流程，配置业务逻辑规则，支持拖拽组件和可视化设计
                                </Typography>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        mt: 4,
                                        borderRadius: 6,
                                        px: 3,
                                        textTransform: 'none'
                                    }}
                                >
                                    开始设计
                                </Button>
                            </Box>
                        </Box>
                    </TabPanel>
                </Box>
            </Box>

            {/* 提示消息 */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ApplicationEditor; 