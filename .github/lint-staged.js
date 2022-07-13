const config = {
  '*.{ts,tsx,js,jsx}': ['xo --fix', () => 'npm run build-action', () => 'ava'],
  '*.{vue,css,less,scss,html,htm,json,md,markdown,yml,yaml}':
    'prettier --write',
};

export default config;
