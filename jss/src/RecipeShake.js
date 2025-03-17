import * as React from 'react';

import { LuckyWheel } from '@lucky-canvas/react';
import RecipeDetail from './RecipeDetail';
import { getShakeConfig, getRecipes, randomRecipe } from './RecipeApi';

export default function RecipeShake() {
  const [blocks] = React.useState(getShakeConfig().blocks);
  const [prizes] = React.useState(getShakeConfig().prizes);
  const [buttons] = React.useState(getShakeConfig().buttons);
  const selfLucky = React.useRef();

  const [open, setOpen] = React.useState(false);
  const [recipe, setRecipe] = React.useState({});

  const handleDetailOpen = () => {
    setOpen(true);
    setRecipe(randomRecipe(getRecipes()));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="LuckyWheel">
      <LuckyWheel
        ref={selfLucky}
        width="380px"
        height="380px"
        blocks={blocks}
        prizes={prizes}
        buttons={buttons}
        onStart={() => {
          selfLucky.current.play();
          setTimeout(() => {
            const index = (Math.random() * prizes.length) >> 0;
            selfLucky.current.stop(index);
          }, 2500);
        }}
        onEnd={(recipe) => {
          handleDetailOpen();
        }}
      />

      <RecipeDetail handleClose={handleClose} open={open} recipe={recipe} />
    </div>
  );
}
