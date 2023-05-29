import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

export default {
	input: ['js/index.js'],
	output: {
		file: 'static/index.js',
		format: 'iife',
		sourcemap: true
	},
	plugins: [
		replace({
			// If you would like DEV messages, specify 'development'
			// Otherwise use 'production'
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
		resolve(),
		commonjs({}),
		// minify
		terser()
	]
};