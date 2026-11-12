
const PRODUCTS = [
  // IMPULSIVOS
  {
    id: 16,
    name: 'Agua "May Cream" (Caja x 40 un.)',
    price: 5900,
    category: 'Impulsivos',
    emoji: '🍦',
    flavors: ['ANANÁ', 'FRUTILLA', 'MANZANA', 'UVA', 'NARANJA', 'CHICLE', 'LIMÓN']
  },
  {
    id: 23,
    name: 'Agua "Val Cream" (Caja x 36 un.)',
    price: 6500,
    category: 'Impulsivos',
    emoji: '🍦',
    flavors: ['ANANÁ', 'FRUTILLA', 'MANZANA', 'UVA', 'NARANJA', 'CHICLE', 'LIMÓN']
  },
  { id: 17, name: 'Crema "Val Cream" (Caja x 30 un.)', price: 9000, category: 'Impulsivos', emoji: '🍦' },
  { id: 18, name: 'Rulito "May Cream" (Caja x 24 un.)', price: 6000, category: 'Impulsivos', emoji: '🍦' },
  { id: 14, name: 'Rulo Relleno "May Cream" (Caja x 24 un.)', price: 12000, category: 'Impulsivos', emoji: '🌀' },
  { id: 12, name: 'Carita "May Cream" (Caja x 20 un.)', price: 9000, category: 'Impulsivos', emoji: '🧒' },
  { id: 33, name: 'Chupa Chups (Caja x 25 un.)', price: 10500, category: 'Impulsivos', emoji: '🍭' },
  { id: 34, name: 'Alfa Granizado "May Cream" (Caja x 18 un.)', price: 12500, category: 'Impulsivos', emoji: '🍦' },

  // BOMBONES
  { id: 26, name: 'Mini Bombón "Val Cream" (Caja x 24 un.)', price: 12000, category: 'Bombones', emoji: '🍫' },
  { id: 28, name: 'Mini Bombón Crocante "Val Cream" (Caja x 24 un.)', price: 12000, category: 'Bombones', emoji: '🍫' },
  { id: 7, name: 'Mini Bombón Split "Val Cream" (Caja x 24 un.)', price: 12000, category: 'Bombones', emoji: '🍌' },
  { id: 3, name: 'Bombón "Val Cream" (Caja x 24 un.)', price: 14200, category: 'Bombones', emoji: '🍫' },
  { id: 5, name: 'Bombón Crocante "Val Cream" (Caja x 24 un.)', price: 14200, category: 'Bombones', emoji: '🍫' },
  { id: 13, name: 'Alfabom "May Cream" (Caja x 18 un.)', price: 12500, category: 'Bombones', emoji: '🍪' },
  { id: 32, name: 'Latidos "Val Cream" (Caja x 18 un.)', price: 13000, category: 'Bombones', emoji: '🍫' },
  {
    id: 35,
    name: 'ALFATUR (Caja x 12 un.)',
    price: 15000,
    category: 'Bombones',
    emoji: '🍫',
    isNew: true,
    flavors: ['Pink', 'Cielo', 'Menta', 'White']
  },
  {
    id: 36,
    name: 'Nevado (Caja x 24 un.)',
    price: 9500,
    category: 'Bombones',
    emoji: '🍫',
    isNew: true,
    flavors: ['Dulce de leche', 'Americana']
  },

  // CONOS
  { id: 1, name: 'Cono "Val Cream" (Caja x 12 un.)', price: 14600, category: 'Conos', emoji: '🍦' },

  // POSTRES
  { id: 9, name: 'Pote 360cc "May Cream" (Pack x 12 un.)', price: 13000, category: 'Postres', emoji: '🍨' },
  { id: 27, name: 'Tortas Heladas (Por unidad)', price: 14500, category: 'Postres', emoji: '🎂' },
  { id: 19, name: 'Copón "May Cream" (Caja x 12 un.)', price: 21000, category: 'Postres', emoji: '🍨' },
  { id: 15, name: 'Cassatas "May Cream" (Caja x 12 un.)', price: 16300, category: 'Postres', emoji: '🍰' },
  {
    id: 29,
    name: 'Tricolor "Postre helado" (Caja x 8 un.)',
    price: 15000,
    category: 'Postres',
    emoji: '🍰',
    isNew: true
  },
  {
    id: 30,
    name: 'Tricolor "Postre helado" (Caja x 20 un.)',
    price: 36500,
    category: 'Postres',
    emoji: '🍰',
    isNew: true
  },
  { id: 31, name: 'Tacitas 90cc (Caja x 24 un.)', price: 15500, category: 'Postres', emoji: '🍨' },

  // HOGAR
  { id: 10, name: 'Pote 1400cc (Por unidad)', price: 3500, category: 'Hogar', emoji: '🍨' },
  { id: 11, name: 'Balde 3 Litros (Por unidad)', price: 8500, category: 'Hogar', emoji: '🪣' },
  { id: 25, name: 'Balde 5 Litros (Por unidad)', price: 11000, category: 'Hogar', emoji: '🪣' }
];
