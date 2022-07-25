const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const colors = require('tailwindcss/colors');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
