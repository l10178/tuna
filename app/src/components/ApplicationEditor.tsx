import * as React from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Application } from '../api/Modules';
import { getApplicationById, updateApplication } from '../api/ApplicationApi';
import { addDatasetItem, updateDatasetItem, deleteDatasetItem } from '../api/DatasetApi';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ApplicationBasicInfo from './ApplicationBasicInfo';
import ApplicationDatasetEditor from './ApplicationDatasetEditor';

// 定义标签页内容接口
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

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
                <Box sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    overflow: 'auto',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start'
                }}>
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
                        <ApplicationBasicInfo
                            application={application}
                            name={name}
                            description={description}
                            tags={tags}
                            selectedIconIndex={selectedIconIndex}
                            newTag={newTag}
                            onNameChange={handleNameChange}
                            onDescriptionChange={handleDescriptionChange}
                            onIconSelect={setSelectedIconIndex}
                            onAddTag={handleAddTag}
                            onDeleteTag={handleDeleteTag}
                            onNewTagChange={handleNewTagChange}
                            onNewTagKeyDown={handleNewTagKeyDown}
                            onSave={handleSave}
                            saving={saving}
                        />
                    </TabPanel>

                    {/* 编排标签页 */}
                    <TabPanel value={value} index={1}>
                        <ApplicationDatasetEditor
                            application={application}
                            loading={loading}
                            onAddItem={handleAddItem}
                            onEditItem={handleEditItem}
                            onDeleteConfirm={handleDeleteConfirm}
                            dataItemDialogState={dataItemDialogState}
                            deleteDialogState={deleteDialogState}
                            handleCloseItemDialog={handleCloseItemDialog}
                            handleSaveDataItem={handleSaveDataItem}
                            handleCloseDeleteDialog={handleCloseDeleteDialog}
                            handleDeleteItem={handleDeleteItem}
                        />
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