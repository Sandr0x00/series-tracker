import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';

export default {
	input: ['js/index.js'],
	output: {
		file: 'static/index.js',
		format: 'iife',
		sourcemap: true
	},
	plugins: [
		resolve(),
		commonjs({
            namedExports: {
                'node_modules/bootstrap/dist/js/bootstrap.min.js' : ['bootstrap']
            }
		}),
		// minify
		terser()
	]
};