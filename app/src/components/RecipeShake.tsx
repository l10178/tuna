import * as React from 'react'
import { LuckyWheel } from '@lucky-canvas/react';
import RecipeDetail from './RecipeDetail';
import { Recipe, RecipeApi } from '../api/RecipeApi';
import { ShakeApi, Block, Prize, Button } from '../api/ShakeApi';

export default function RecipeShake() {
  const [open, setOpen] = React.useState(false);
  const [recipe, setRecipe] = React.useState<Recipe>({
    id: '',
    name: '',
    category: '',
    tags: []
  });

  const [blocks, setBlocks] = React.useState<Block[]>([
    { padding: '10px', background: '#869cfa' }
  ]);
  const [prizes, setPrizes] = React.useState<Prize[]>([
    { background: '#e9e8fe', fonts: [{ text: '麻婆豆腐', top: '40%' }] },
    { background: '#b8c5f2', fonts: [{ text: '回锅肉', top: '40%' }] },
    { background: '#e9e8fe', fonts: [{ text: '宫保鸡丁', top: '40%' }] },
    { background: '#b8c5f2', fonts: [{ text: '水煮鱼', top: '40%' }] },
    { background: '#e9e8fe', fonts: [{ text: '鱼香肉丝', top: '40%' }] },
    { background: '#b8c5f2', fonts: [{ text: '辣子鸡', top: '40%' }] }
  ]);
  const [buttons, setButtons] = React.useState<Button[]>([
    { radius: '40%', background: '#617df2' },
    { radius: '35%', background: '#afc4f8' },
    {
      radius: '30%',
      background: '#869cfa',
      pointer: true,
      fonts: [{ text: '开始', top: '40%' }]
    }
  ]);

  React.useEffect(() => {
    ShakeApi.getConfig().then(config => {
      // 使用默认配置
      const defaultConfig = {
        blocks,
        prizes,
        buttons
      };
      // 合并配置
      const mergedConfig = {
        ...defaultConfig,
        ...config
      };
      // 更新状态
      if (mergedConfig.blocks) setBlocks(mergedConfig.blocks);
      if (mergedConfig.prizes) setPrizes(mergedConfig.prizes);
      if (mergedConfig.buttons) setButtons(mergedConfig.buttons);
    });
  }, []);

  const handleDetailOpen = () => {
    RecipeApi.random().then(recipe => {
      setRecipe(recipe);
      setOpen(true);
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const myLucky = React.useRef<any>(null);

  const handleStart = () => {
    // 开始旋转
    return new Promise<number>((resolve) => {
      const index = Math.floor(Math.random() * prizes.length);
      myLucky.current.play();
      setTimeout(() => {
        myLucky.current.stop(index);
      }, 2500);
      setTimeout(() => handleDetailOpen(), 5000);
      resolve(index);
    });
  };

  return (
    <div className="LuckyWheel">
      <LuckyWheel
        ref={myLucky}
        width="380px"
        height="380px"
        blocks={blocks}
        prizes={prizes}
        buttons={buttons}
        onStart={handleStart}
        defaultStyle={{
          fontSize: '18px',
          fontWeight: 600,
        }}
        defaultConfig={{
          stopRange: 0.8,
          accelerationTime: 2500,
          decelerationTime: 2500,
          speed: 8
        }}
      />
      <RecipeDetail handleClose={handleClose} open={open} recipe={recipe} />
    </div>
  );
}
