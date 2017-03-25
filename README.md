# Make a Website

```
npm install maw
```

[![npm version](https://badge.fury.io/js/maw.svg)](https://badge.fury.io/js/maw)

Make a static HTML page with some CSS, JS, and assets. Contains just the tools you need to write modern code and avoid repeating yourself. A gulpfile and webpack config in a box. It's written for internal needs, but I'd be happy to accept improvements if you find it useful too.

> If you want to make a serious website with lots of pages, or you need a lot of customization or features, this is probably not going to work for you. You'll be much better served by something like [Gatsby](https://github.com/gatsbyjs/gatsby) or [Hexo](https://github.com/hexojs/hexo).

This tool is 100% convention over configuration. [Check out a site built with it here.](https://github.com/apollographql/dev.apollodata.com)

## Using the tool

`maw dev` in the root of the project watches the `/src` directory, and puts the output in `/build` whenever files change.

`maw build` builds the site and puts the output in `/build`.

You probably want to `npm install --save-dev maw` and then add the above commands to a `package.json`, like [in this site](https://github.com/apollographql/dev.apollodata.com/blob/master/package.json).

## Directories

All of these are nested inside `/src` in the root of your project.

### /public

This is for static files, which are copied directly into the output. That includes images, fonts, and pre-bundled libraries you want to use.

### /index.less and /less

`index.less` is compiled into `index.css`. The `/less` directory is watched for LESS imports, so basically put everything except `index.less` in there.

### /index.html and /templates

`index.html` is compiled into `index.html` and any handlebars code is evaluated against the files in `/templates`. The name of the template is the filename without the extension, for example `nav.html` can be included with `{{> nav}}`.

### Multiple `index.html` files

You can nest multiple `index.html` files, for example `/about/index.html`, to give your website multiple pages.

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

### /index.js

`index.js` is a JavaScript entry point module that will be compiled with Webpack. Currently, no loaders are enabled.

## TODO

- [ ] Minification
- [ ] Make it possible to set root directory to either the root of the repo or something other than `/src`
