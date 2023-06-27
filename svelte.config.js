import sveltePreprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import {
  vitePreprocess
} from '@sveltejs/kit/vite';

export default {
  preprocess: sveltePreprocess(),
  kit: {
    adapter: adapter({
        // default options are shown. On some platforms
        // these options are set automatically — see below
        pages: 'build',
        assets: 'build',
        fallback: undefined,
        precompress: false,
        strict: true,
        paths:{
          base:process.env.NODE_ENV === 'production' ? '/sveltekit-github-pages' : '',
        }
    })
}
};

