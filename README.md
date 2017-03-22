# Make a Website

```
npm install maw
```

Make a static HTML page with some CSS, JS, and assets. No BS.

## Using the tool

`maw build` builds the site and puts the output in `/build`.

`maw dev` in the root of the project watches the `/src` directory, and puts the output in `/build` whenever files change.

## Directories

All of these are nested inside `/src`.

### /public

This is for static files, these are copied directly into the output.

### /index.less and /less

`index.less` is compiled into `index.css`, and `/less` is used for imports.

### /index.html and /templates

`index.html` is compiled into `index.html` and any handlebars code is evaluated against the files in `/templates`. The name of the template is the filename without the extension, for example `nav.html` can be included with `{{> nav}}`.

### /data.js

`data.js` should export any data you want to use in your handlebars templates, like so:

```js
module.exports = {
  hello: 'world',
};
```

And then you can use it with:

```html
<div>
  Hello, {{hello}}!
</div>
```

## Important

- [ ] Support multiple output HTML files/pages, perhaps by crawling all HTML in `/src`.
- [ ] Don't use nodemon, use Gulp to watch files individually for better efficiency

## TODO

- [ ] Do JavaScript bundling for the client
- [ ] Minification
- [ ] Make it possible to set root directory to either the root of the repo or something other than `/src`

