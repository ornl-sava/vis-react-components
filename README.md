Vis
=======

Collection of React components for building visualizations.

## Prequisites

1. Node.js v4.2.3+
2. React 15.1.0+


## Installation

Make sure [node.js](https://nodejs.org/) v4.2.3 or greater is installed. Then run: `npm install`.

## Usage

To start the development server, run: `npm start`.

To build (minification, etc.) the source for running in production, run: `npm run build`. The output will be in the `public` directory. To serve it, run: `npm run server`.

To lint the code, run: `npm run lint`.

To view [webpack](https://webpack.github.io/) stats, run `npm run stats`, and then open the `stats.json` file in https://webpack.github.io/analyse/.

## Development

Make sure you've turned off cacheing in your browser.  Otherwise you run the risk of not being able to see updates to the code.  

Before committing a change to the repository run: `npm run build`
This will transpile the source code in the `src` directory from es2015 / es6 to es5 compatible source code in the `lib` directory
