import * as React from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import { Application } from '../api/Modules';
import { getApplicationById, updateApplication } from '../api/ApplicationApi';
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
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: index === 0 ? 20 : 0
      }}
      {...other}
    >
      {value === index && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
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
    'aria-controls': `vertical-tabpanel-${index}`
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
        logo: selectedIconIndex.toString()
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
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', width: '100%', height: 'calc(100vh - 64px)' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="应用编辑标签页"
        sx={{
          borderRight: 1,
          borderColor: 'divider',
          width: 200,
          '& .MuiTabs-indicator': {
            left: 0
          },
          '& .MuiTab-root': {
            alignItems: 'flex-start',
            textAlign: 'left'
          }
        }}
      >
        <Tab label="基本信息" {...a11yProps(0)} />
        <Tab label="数据编排" {...a11yProps(1)} />
      </Tabs>
      <Box sx={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        <TabPanel value={value} index={0}>
          <ApplicationBasicInfo
            _application={application}
            initialData={{
              name,
              description,
              tags,
              selectedIconIndex,
              newTag
            }}
            loading={saving}
            onNameChange={handleNameChange}
            onDescriptionChange={handleDescriptionChange}
            onIconSelect={setSelectedIconIndex}
            onAddTag={handleAddTag}
            onDeleteTag={handleDeleteTag}
            onNewTagChange={handleNewTagChange}
            onNewTagKeyDown={handleNewTagKeyDown}
            onSave={handleSave}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ApplicationDatasetEditor application={application} loading={loading} />
        </TabPanel>
      </Box>
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
