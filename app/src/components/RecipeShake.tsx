import * as React from 'react'
import { LuckyWheel } from 'lucky-canvas';
import RecipeDetail from './RecipeDetail';
import { RecipeApi } from '../api/RecipeApi';
import { ShakeApi } from '../api/ShakeApi';

interface Recipe {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
}

export default function RecipeShake() {
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const myLucky = React.useRef<LuckyWheel>(null);
  const [open, setOpen] = React.useState(false);
  const [recipe, setRecipe] = React.useState<Recipe>({
    id: '',
    name: '',
    category: '',
    tags: []
  });

  React.useEffect(() => {
    if (wheelRef.current) {
      ShakeApi.getConfig().then(config => {
        myLucky.current = new LuckyWheel(wheelRef.current as HTMLDivElement, {
          width: '380px',
          height: '380px',
          blocks: config.blocks,
          prizes: config.prizes,
          buttons: config.buttons,
          end: () => {
            handleDetailOpen();
          }
        });
      });
    }
  }, []);

  const handleDetailOpen = () => {
    setOpen(true);
    RecipeApi.random().then(setRecipe);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStart = () => {
    if (myLucky.current) {
      myLucky.current.play();
      setTimeout(() => {
        ShakeApi.getConfig().then(config => {
          const index = Math.floor(Math.random() * config.prizes.length);
          myLucky.current?.stop(index);
        });
      }, 2500);
    }
  };

  return (
    <div className="LuckyWheel">
      <div
        ref={wheelRef}
        style={{
          width: '380px',
          height: '380px',
          margin: '0 auto'
        }}
        onClick={handleStart}
      />
      <RecipeDetail handleClose={handleClose} open={open} recipe={recipe} />
    </div>
  );
}
