@'
module.exports = {
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic'
      }
    ]
  ]
};
'@ | Set-Content -Path babel.config.js