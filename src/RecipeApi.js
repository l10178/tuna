export const getShakeConfig = () => {
  return {
    blocks: [{ padding: '10px', background: '#869cfa' }],
    prizes: [
      { background: '#e9e8fe', fonts: [{ text: '0' }] },
      { background: '#b8c5f2', fonts: [{ text: '1' }] },
      { background: '#e9e8fe', fonts: [{ text: '2' }] },
      { background: '#b8c5f2', fonts: [{ text: '3' }] },
      { background: '#e9e8fe', fonts: [{ text: '4' }] },
      { background: '#b8c5f2', fonts: [{ text: '5' }] },
      { background: '#e9e8fe', fonts: [{ text: '6' }] },
      { background: '#b8c5f2', fonts: [{ text: '7' }] },
      { background: '#e9e8fe', fonts: [{ text: '8' }] },
      { background: '#b8c5f2', fonts: [{ text: '9' }] },
    ],
    buttons: [
      { radius: '40%', background: '#617df2' },
      { radius: '35%', background: '#afc8ff' },
      {
        radius: '30%',
        background: '#869cfa',
        pointer: true,
        fonts: [{ text: '摇一摇', top: '-10px' }],
      },
    ],
  };
};

export const getCatalogs = () => {
  return [
    {
      id: 'xlabs-club',
      name: '知春路午饭',
      order: 1,
    },
    {
      id: 'jdcloud',
      name: '京东科技大厦晚餐',
      order: 2,
    },
  ];
};

export const getRecipes = () => {
  return [
    {
      name: '酸汤水饺',
      description: '酸汤水饺微微辣',
    },
    {
      name: '酸辣油泼面',
      description: '酸辣油泼面最好配个肉夹馍',
    },
  ];
};

export const randomRecipe = (recipes) => {
  return recipes[Math.floor(Math.random() * recipes.length)];
};
