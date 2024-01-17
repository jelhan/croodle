const { JSDOM } = require('jsdom');
const { readFile, writeFile } = require('node:fs/promises');
const { createHash } = require('node:crypto');
const path = require('node:path');

class SubresourceIntegrityPlugin {
  apply(compiler) {
    compiler.hooks.done.tapPromise(
      'WriteSRIToIndexHtmlPlugin',
      async (stats) => {
        const buildPath = stats.toJson().outputPath;
        const indexHtmlPath = path.join(buildPath, 'index.html');
        const indexHtmlContent = await readFile(indexHtmlPath, 'utf-8');
        const indexHtml = new JSDOM(indexHtmlContent);
        const scriptElements =
          indexHtml.window.document.querySelectorAll('script');
        const linkElements = indexHtml.window.document.querySelectorAll('link');
        await Promise.all(
          [...scriptElements, ...linkElements].map(async (element) => {
            // calculate integrity
            const hashAlgorith = 'sha384';
            const fileName =
              element.tagName === 'SCRIPT'
                ? element.getAttribute('src')
                : element.getAttribute('href');

            if (fileName === '/ember-cli-live-reload.js') {
              // ember-cli-live-reload.js does not exist on disk
              return;
            }

            const fileHash = createHash(hashAlgorith)
              .update(await readFile(path.join(buildPath, fileName)))
              .digest('hex');
            // set integrity attribute
            element.setAttribute('integrity', `${hashAlgorith}-${fileHash}`);
            // set crossorigin attribute
            element.setAttribute('crossorigin', 'anonymous');
          }),
        );
        await writeFile(indexHtmlPath, indexHtml.serialize());
      },
    );
  }
}

module.exports = SubresourceIntegrityPlugin;
