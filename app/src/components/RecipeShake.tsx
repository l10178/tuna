import * as React from 'react'
import { LuckyWheel } from 'lucky-canvas';
import RecipeDetail from './RecipeDetail';
import { getShakeConfig, getRecipes, randomRecipe } from '../api/RecipeApi';

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
      const config = getShakeConfig();
      myLucky.current = new LuckyWheel(wheelRef.current, {
        width: '380px',
        height: '380px',
        blocks: config.blocks,
        prizes: config.prizes,
        buttons: config.buttons,
        end: () => {
          handleDetailOpen();
        }
      });
    }
  }, []);

  const handleDetailOpen = () => {
    setOpen(true);
    const recipes = getRecipes();
    const randomIndex = Math.floor(Math.random() * recipes.length);
    setRecipe(recipes[randomIndex]);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStart = () => {
    if (myLucky.current) {
      myLucky.current.play();
      setTimeout(() => {
        const index = Math.floor(Math.random() * getShakeConfig().prizes.length);
        myLucky.current?.stop(index);
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
