'use strict';

/* Require the path module */
const path = require('path');

/* Require the Fractal module */
const fractal = module.exports = require('@frctl/fractal').create();

/* Give your project a title. */
fractal.set('project.title', 'Design System');

/* Tell Fractal where to look for components. */
fractal.components.set('path', path.join(__dirname, 'src/components'));

/* Tell Fractal where to look for documentation pages. */
fractal.docs.set('path', path.join(__dirname, 'src/docs'));

/* Tell the Fractal web preview plugin where to look for static assets. */
fractal.web.set('static.path', path.join(__dirname, 'tmp'));

/* Build destination for web UI */
fractal.web.set('builder.dest', __dirname + '/www');

/* Tell Fractal that this preview layout should be used as the default layout for our components */
fractal.components.set('default.preview', '@preview');

/* Change default status of components */
fractal.components.set('default.status', 'wip'); // default is 'ready'


// FRACTAL Theme
const mandelbrot = require('@frctl/mandelbrot'); // require the Mandelbrot theme module

// create a new instance with custom config options
const customisedTheme = mandelbrot({
    skin: "navy",
    panels: ["info", "html", "notes",  "view", "context", "resources" ]
    // any other theme configuration values here
});

fractal.web.theme(customisedTheme); // tell Fractal to use the configured theme by default