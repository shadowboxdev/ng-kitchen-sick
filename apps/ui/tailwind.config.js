const plugin = require('tailwindcss/plugin');
const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const colors = require('tailwindcss/colors');
const { join } = require('path');

const utilityClasses = plugin(({ addUtilities }) => {
  // Add Utility Classes here
  addUtilities({});
});

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
  corePlugins: {
    aspectRatio: false
  },
  plugins: [
    utilityClasses,
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio')
  ]
};
