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
import { getDatasetItems, addDatasetItem, updateDatasetItem, deleteDatasetItem } from '../api/DatasetApi';
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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Tooltip from '@mui/material/Tooltip';
import { InputAdornment } from '@mui/material';

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
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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

    // 数据项弹窗状态
    const [dataItemDialogState, setDataItemDialogState] = React.useState<{
        open: boolean;
        mode: 'add' | 'edit';
        item: any | null;
    }>({
        open: false,
        mode: 'add',
        item: null
    });

    // 删除确认弹窗状态
    const [deleteDialogState, setDeleteDialogState] = React.useState<{
        open: boolean;
        item: any | null;
    }>({
        open: false,
        item: null
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

    // 打开添加数据项弹窗
    const handleAddItem = (appId: string) => {
        setDataItemDialogState({
            open: true,
            mode: 'add',
            item: {
                applicationId: appId,
                name: '',
                description: '',
                tags: [],
                createdAt: new Date().toISOString()
            }
        });
    };

    // 打开编辑数据项弹窗
    const handleEditItem = (item: any) => {
        setDataItemDialogState({
            open: true,
            mode: 'edit',
            item: { ...item }
        });
    };

    // 打开删除确认弹窗
    const handleDeleteConfirm = (item: any) => {
        setDeleteDialogState({
            open: true,
            item
        });
    };

    // 关闭删除确认弹窗
    const handleCloseDeleteDialog = () => {
        setDeleteDialogState({
            ...deleteDialogState,
            open: false
        });
    };

    // 处理删除数据项
    const handleDeleteItem = async () => {
        try {
            if (!application?.id || !deleteDialogState.item) return;

            // 如果应用有数据集ID，使用数据集ID进行操作
            if (application.datasetId) {
                await deleteDatasetItem(application.datasetId, deleteDialogState.item.id);
            } else {
                throw new Error('应用未关联数据集');
            }

            showSuccessMessage('数据项已删除');

            // 关闭弹窗
            setDeleteDialogState({
                open: false,
                item: null
            });

            // 刷新列表 - 通过修改应用ID触发useEffect刷新
            setApplication(prev => prev ? { ...prev } : null);
        } catch (error) {
            console.error('删除数据项失败:', error);
            showErrorMessage('删除失败');
        }
    };

    // 关闭数据项弹窗
    const handleCloseItemDialog = () => {
        setDataItemDialogState({
            ...dataItemDialogState,
            open: false
        });
    };

    // 保存数据项
    const handleSaveDataItem = async (data: any) => {
        try {
            if (!application?.id) return;

            // 如果应用有数据集ID，使用数据集ID进行操作
            if (application.datasetId) {
                if (dataItemDialogState.mode === 'add') {
                    await addDatasetItem(application.datasetId, data);
                    showSuccessMessage('数据项已添加');
                } else {
                    await updateDatasetItem(application.datasetId, data.id, data);
                    showSuccessMessage('数据项已更新');
                }
            } else {
                throw new Error('应用未关联数据集');
            }

            // 关闭弹窗
            setDataItemDialogState({
                ...dataItemDialogState,
                open: false
            });

            // 刷新列表 - 通过修改应用ID触发useEffect刷新
            setApplication(prev => prev ? { ...prev } : null);
        } catch (error) {
            console.error('保存数据项失败:', error);
            showErrorMessage('保存失败');
        }
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
                    overflow: 'hidden',
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* 基本信息标签页 */}
                    <TabPanel value={value} index={0}>
                        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                            {/* 图标选择器 */}
                            <Box sx={{ mb: 5, alignContent: 'left' }}>
                                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, alignContent: 'left' }}>
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

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <React.Fragment>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                        <TextField
                                            placeholder="搜索数据集..."
                                            variant="outlined"
                                            size="small"
                                            sx={{ width: 300 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={() => application && application.id && handleAddItem(application.id)}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                添加数据项
                                            </Button>
                                        </Box>

                                        <Paper
                                            sx={{ 
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                flexGrow: 1
                                            }}
                                        >
                                            {application && application.id ? (
                                                <DatasetTable
                                                    applicationId={application.id}
                                                    onEdit={handleEditItem}
                                                    onDelete={handleDeleteConfirm}
                                                />
                                            ) : (
                                                <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                                                    请先保存应用基本信息
                                                </Box>
                                        )}
                                    </Paper>
                                </React.Fragment>
                        )}

                        {/* 数据项编辑弹窗 */}
                        <DataItemDialog
                            open={dataItemDialogState.open}
                            mode={dataItemDialogState.mode}
                            initialData={dataItemDialogState.item}
                            availableTags={application?.tags || []}
                            applicationId={application?.id || ''}
                            onClose={handleCloseItemDialog}
                            onSave={handleSaveDataItem}
                        />

                        {/* 删除确认弹窗 */}
                        <Dialog
                            open={deleteDialogState.open}
                            onClose={handleCloseDeleteDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            PaperProps={{
                                sx: { borderRadius: 2 }
                            }}
                        >
                            <DialogTitle id="alert-dialog-title">
                                确认删除
                            </DialogTitle>
                            <DialogContent>
                                <Typography variant="body1">
                                    确定要删除「{deleteDialogState.item?.name}」数据项吗？此操作不可撤销。
                                </Typography>
                            </DialogContent>
                            <DialogActions sx={{ p: 2 }}>
                                <Button onClick={handleCloseDeleteDialog} color="inherit">取消</Button>
                                <Button onClick={handleDeleteItem} color="error" variant="contained" autoFocus>
                                    删除
                                </Button>
                            </DialogActions>
                        </Dialog>
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

// DatasetTable 组件 - 使用MUI Table组件实现的数据集表格
const DatasetTable = ({
    applicationId,
    onEdit,
    onDelete
}: {
    applicationId: string,
    onEdit: (item: any) => void,
    onDelete: (item: any) => void
}) => {
    const [datasetItems, setDatasetItems] = React.useState<any[]>([]);
    const [loadingItems, setLoadingItems] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    React.useEffect(() => {
        const fetchDatasetItems = async () => {
            try {
                setLoadingItems(true);
                if (applicationId) {
                    // 获取应用信息
                    const app = await getApplicationById(applicationId);

                    if (app.datasetId) {
                        // 如果应用有关联的数据集ID，使用它获取数据项
                        const items = await getDatasetItems(app.datasetId);
                        setDatasetItems(items || []);
                    } else {
                        setError('应用未关联数据集');
                    }
                }
            } catch (err) {
                console.error('Error loading dataset items:', err);
                setError('无法加载数据项');
            } finally {
                setLoadingItems(false);
            }
        };

        fetchDatasetItems();
    }, [applicationId]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loadingItems) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (datasetItems.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                暂无数据项，请点击"添加数据项"按钮创建
            </Box>
        );
    }

    // 当前页的数据
    const currentItems = datasetItems.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <React.Fragment>
            <TableContainer component={Paper} sx={{
                boxShadow: 'none',
                borderRadius: 0,
                flexGrow: 1
            }}>
                <Table sx={{ minWidth: 650 }} size="medium" stickyHeader aria-label="数据集表格">
                    <TableHead>
                        <TableRow>
                            <TableCell>名称</TableCell>
                            <TableCell>描述</TableCell>
                            <TableCell>标签</TableCell>
                            <TableCell>创建时间</TableCell>
                            <TableCell align="right">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map((item) => (
                            <TableRow
                                key={item.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                hover
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="body2" fontWeight={500}>
                                        {item.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary" sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        maxWidth: 250
                                    }}>
                                        {item.description || '暂无描述'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                        {item.tags && item.tags.length > 0 ? (
                                            item.tags.map((tag: string) => (
                                                <Chip
                                                    key={tag}
                                                    label={tag}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(0,0,0,0.05)',
                                                        borderRadius: 1,
                                                        height: 24
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">无标签</Typography>
                                        )}
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    {item.createdAt
                                        ? new Date(item.createdAt).toLocaleDateString()
                                        : '未知时间'
                                    }
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="编辑">
                                        <IconButton
                                            size="small"
                                            onClick={() => onEdit(item)}
                                            sx={{ ml: 1 }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="删除">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => onDelete(item)}
                                            sx={{ ml: 1 }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={datasetItems.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="每页行数:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} / 共${count}项`}
            />
        </React.Fragment>
    );
};

// 数据项编辑弹窗组件
const DataItemDialog = ({
    open,
    mode,
    initialData,
    availableTags,
    applicationId,
    onClose,
    onSave
}: {
    open: boolean;
    mode: 'add' | 'edit';
    initialData: any;
    availableTags: string[];
    applicationId: string;
    onClose: () => void;
    onSave: (data: any) => void;
}) => {
    const [formData, setFormData] = React.useState({
        id: '',
        applicationId: '',
        name: '',
        description: '',
        tags: [] as string[],
        createdAt: ''
    });
    const [newTag, setNewTag] = React.useState('');
    const [errors, setErrors] = React.useState<{
        name?: string;
    }>({});

    // 初始化表单数据
    React.useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id || '',
                applicationId: initialData.applicationId || applicationId,
                name: initialData.name || '',
                description: initialData.description || '',
                tags: initialData.tags || [],
                createdAt: initialData.createdAt || new Date().toISOString()
            });
        }
    }, [initialData, applicationId]);

    // 处理输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // 清除错误
        if (name === 'name' && errors.name) {
            setErrors({ ...errors, name: undefined });
        }
    };

    // 添加标签
    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, newTag.trim()]
            });
            setNewTag('');
        }
    };

    // 删除标签
    const handleDeleteTag = (tagToDelete: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToDelete)
        });
    };

    // 选择现有标签
    const handleSelectExistingTag = (tag: string) => {
        if (!formData.tags.includes(tag)) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tag]
            });
        }
    };

    // 处理保存
    const handleSave = () => {
        // 验证
        const newErrors: { name?: string } = {};
        if (!formData.name.trim()) {
            newErrors.name = '名称不能为空';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave(formData);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 500 }}>
                {mode === 'add' ? '添加数据项' : '编辑数据项'}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ p: 1 }}>
                    <TextField
                        fullWidth
                        required
                        label="名称"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        fullWidth
                        label="描述"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                        sx={{ mb: 4 }}
                    />

                    <Typography variant="subtitle2" sx={{ mb: 2 }}>标签</Typography>

                    {/* 已选标签 */}
                    <Box sx={{ mb: 3 }}>
                        {formData.tags.length > 0 ? (
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                {formData.tags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={() => handleDeleteTag(tag)}
                                        sx={{ mb: 1 }}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                未添加标签
                            </Typography>
                        )}
                    </Box>

                    {/* 应用现有标签 */}
                    {availableTags.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>从应用标签中选择:</Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                {availableTags
                                    .filter(tag => !formData.tags.includes(tag))
                                    .map((tag) => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            variant="outlined"
                                            onClick={() => handleSelectExistingTag(tag)}
                                            sx={{ mb: 1 }}
                                        />
                                    ))}
                            </Stack>
                        </Box>
                    )}

                    {/* 添加新标签 */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            size="small"
                            variant="outlined"
                            placeholder="添加新标签"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            sx={{ mr: 1, flex: 1 }}
                        />
                        <Button
                            variant="outlined"
                            onClick={handleAddTag}
                            disabled={!newTag.trim()}
                        >
                            添加
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} color="inherit">
                    取消
                </Button>
                <Button onClick={handleSave} variant="contained">
                    保存
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 