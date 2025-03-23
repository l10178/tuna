import * as React from 'react'
import { LuckyWheel } from '@lucky-canvas/react';
import { Block } from '../api/ShakeApi';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import { Application } from '../api/Modules';
import { getApplicationById } from '../api/ApplicationApi';
import { getDatasetItems } from '../api/DatasetApi';
import ShakeDataDetail from './ShakeDataDetail';
import { defaultPrizeList } from '../api/MockApi';

export default function ApplicationShake() {
    const { appId } = useParams<{ appId?: string }>();
    const [currentApp, setCurrentApp] = React.useState<Application | null>(null);
    const [loading, setLoading] = React.useState<boolean>(!!appId);
    const [error, setError] = React.useState<string | null>(null);
    const [open, setOpen] = React.useState(false);
    const [selectedData, setSelectedData] = React.useState<any>(null);
    // 数据集存储，用于查询获取详细信息
    const [datasetItems, setDatasetItems] = React.useState<any[]>([]);

    // 固定的旋转盘配置
    const [blocks] = React.useState<Block[]>([
        { padding: '10px', background: '#869cfa' }
    ]);

    // 固定的奖品配置
    const [prizes] = React.useState(defaultPrizeList);

    // 固定的按钮配置
    const [buttons] = React.useState([
        { radius: '40%', background: '#617df2' },
        { radius: '35%', background: '#afc4f8' },
        {
            radius: '30%',
            background: '#869cfa',
            pointer: true,
            fonts: [{ text: '摇一摇', top: '-10px' }]
        }
    ]);

    // 更新浏览器标题
    React.useEffect(() => {
        if (currentApp) {
            // 设置浏览器标题为应用名称
            document.title = currentApp.name;

            // 组件卸载时恢复原标题
            return () => {
                document.title = '庄周吃鱼';
            };
        }
    }, [currentApp]);

    // 加载应用数据
    React.useEffect(() => {
        if (appId) {
            setLoading(true);
            setError(null);

            // 首先获取应用信息
            getApplicationById(appId)
                .then(app => {
                    setCurrentApp(app);

                    // 如果应用有数据集ID，获取数据集项
                    let datasetPromise;
                    if (app.datasetId) {
                        datasetPromise = getDatasetItems(app.datasetId);
                    } else {
                        datasetPromise = Promise.resolve([]);
                    }

                    return Promise.all([Promise.resolve(app), datasetPromise]);
                })
                .then(([app, dataset]) => {
                    setDatasetItems(dataset || []);
                })
                .catch(error => {
                    console.error('加载应用数据失败:', error);
                    setError('无法加载应用数据，请稍后再试');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [appId]);

    const handleDetailOpen = async (selectedPrize: any, prizeIndex: number) => {
        try {
            const tagName = selectedPrize.fonts?.[0]?.text;

            if (!tagName || !appId || !currentApp) {
                // 无标签或应用ID时使用默认数据
                setSelectedData({
                    id: `${currentApp?.id || 'app'}_${prizeIndex}`,
                    name: tagName || '未知标签',
                    category: currentApp?.name || '应用',
                    description: `应用 "${currentApp?.name || ''}" 的标签内容`,
                    tags: currentApp?.tags || []
                });
                setOpen(true);
                return;
            }

            // 首先尝试从已加载的数据集中查找匹配标签的数据
            const matchingItems = datasetItems.filter(item =>
                item.tags && Array.isArray(item.tags) && item.tags.includes(tagName)
            );

            if (matchingItems.length > 0) {
                // 如果找到匹配的数据项，随机选择一个
                const randomItem = matchingItems[Math.floor(Math.random() * matchingItems.length)];
                setSelectedData(randomItem);
                setOpen(true);
                return;
            }

            // 如果本地没有找到匹配的数据，则尝试重新获取全部数据集并过滤
            if (datasetItems.length === 0 && currentApp.datasetId) {
                const allDataItems = await getDatasetItems(currentApp.datasetId);
                setDatasetItems(allDataItems);

                // 过滤包含所选标签的数据项
                const filteredItems = allDataItems.filter(item =>
                    item.tags && Array.isArray(item.tags) && item.tags.includes(tagName)
                );

                if (filteredItems.length > 0) {
                    const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];
                    setSelectedData(randomItem);
                    setOpen(true);
                    return;
                }
            }

            // 无匹配数据时使用默认数据
            setSelectedData({
                id: `${currentApp?.id || 'app'}_${prizeIndex}`,
                name: tagName || '未知标签',
                category: currentApp?.name || '应用',
                description: `暂无数据: "${tagName}" 标签下没有数据项`,
                tags: [tagName].filter(Boolean)
            });

            setOpen(true);
        } catch (error) {
            console.error('获取数据集失败:', error);
            // 错误时使用默认数据
            setSelectedData({
                id: `${currentApp?.id || 'app'}_${prizeIndex}`,
                name: selectedPrize.fonts?.[0]?.text || '未知标签',
                category: currentApp?.name || '应用',
                description: '获取数据失败，请稍后再试',
                tags: currentApp?.tags || []
            });
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const selfLucky = React.useRef<any>(null);

    const handleStart = () => {
        // 开始旋转
        return new Promise<number>((resolve) => {
            const index = Math.floor(Math.random() * prizes.length);
            selfLucky.current.play();
            setTimeout(() => {
                selfLucky.current.stop(index);
                // 记录选中的奖品
                const selectedPrize = prizes[index];
                setTimeout(() => handleDetailOpen(selectedPrize, index), 2500);
            }, 2500);
            resolve(index);
        });
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
                <Skeleton variant="rectangular" sx={{ height: 380, width: 380, mx: 'auto', borderRadius: 2 }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', display: 'flex', justifyContent: 'center' }}>
            <div className="LuckyWheel">
                <LuckyWheel
                    ref={selfLucky}
                    width="380px"
                    height="380px"
                    blocks={blocks}
                    prizes={prizes}
                    buttons={buttons}
                    onStart={handleStart}
                />
                {selectedData && (
                    <ShakeDataDetail
                        handleClose={handleClose}
                        open={open}
                        data={selectedData}
                    />
                )}
            </div>
        </Box>
    );
} 