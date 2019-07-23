# Kettle

The templating engine tailored for boilerplates

# Design philosophy

As templating engines were historically tailored for the needs of server side rendering they allow for powerful integration of conditions, loops, replacements, includes, ... but don't care about breaking syntax.

The consequence is that when using those engines for boilerplate templating it breaks the code and prevents you from using tools such as linting, typings and unit tests live while templating. Thus, making the development cycle of a boilerplate tedious.

Kettle aims to bring the power of templating without breaking any syntax by focusing only on basic tools and leveraging comments available in (almost) any programing language.

# Usage

## Install Kettle

```
yarn add @bam.tech/kettle
npm install @bam.tech/kettle
```

## Running Kettle

It is recommended to use Kettle using Gulp

```javascript
const { src, dest } = require('gulp');
const { transformFactory } = require('kettle');

src(['path/to/template'])
  .pipe(
    transformFactory({
      isTrue: true,
      isFalse: false,
      appName: 'myApp',
      functionName: 'myFunction',
    })
  )
  .pipe(dest('path/to/output'));
```

## Using Kettle templates in paths

Kettle replaces values in paths:

- Input: `path/to/__replace__appName__/file.env` will output `path/to/myApp/file.env`

To add a folder/file conditionnaly:

- With `path/to/__replace__appName____if__isTrue__/subFolder__if__isTrue__/file.env`, the resulting file will appear in the written file at the path `path/to/myApp/subFolder/file.env`

- With `path/to/__replace__appName__/subFolder__if__isFalse__/file.env`, Kettle will not write any file

## Reverse assertions

It is possible to reverse assertions using `!`

For example, `path/to/__replace__appName__/subFolder__if__!isFalse__/file.env` will render `path/to/myApp/subFolder/file.env`

## Using Kettle templates in files

In files content, Kettle will turn this:

```javascript
const import1 = require('path/to/imports1__if__isFalse__/import1.js');
const import2 = require('path/to/imports2__if__isTrue__/import2.js');
const import2 = require('path/to/imports2__if__!isTrue__/import2.js');

// __if__isTrue__
__replace__functionName__();
console.log('__replace__appName__');
// __endif__
// __if__isFalse__
shouldNotAppear();
// __endif__
// __if__!isTrue__
shouldNotAppear();
// __endif__
```

into

```javascript
const import2 = require('path/to/imports1/import1.js');

myFunction();
console.log('myApp');
```

## Supported comment syntax:

- `//`
- `#`
- _Please open an issue if you find a comment syntax which doesn't work with Kettle_

## Syntax highlighting

### VSCode

To highlight Kettle syntax it is advised to install the [VSCode Highlight](https://github.com/fabiospampinato/vscode-highlight.git) plugin and use the following rules in `.vscode/settings.json`:

```json
{
  "highlight.regexes": {
    "(.*?__if__)(!.+?)(__.*?)\\n": [
      {
        "backgroundColor": "#a06f5f",
        "color": "#FFF"
      },
      {
        "backgroundColor": "#a06f5f",
        "color": "#ffbfb4",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#a06f5f",
        "color": "#FFF"
      }
    ],
    "(.*?__if__)([^!]+?)(__.*?)\\n": [
      {
        "backgroundColor": "#a06f5f",
        "color": "#FFF"
      },
      {
        "backgroundColor": "#a06f5f",
        "color": "#c7ffa4",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#a06f5f",
        "color": "#FFF"
      }
    ],
    "((?:\\/\\/|#) __if__)([^!]+?)(__)": [
      {
        "backgroundColor": "#808080",
        "color": "#FFF"
      },
      {
        "backgroundColor": "#808080",
        "color": "#c7ffa4",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#808080",
        "color": "#FFF"
      }
    ],
    "((?:\\/\\/|#) __if__)(!.+?)(__)": [
      {
        "backgroundColor": "#808080",
        "color": "#FFF"
      },
      {
        "backgroundColor": "#808080",
        "color": "#ffbfb4",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#808080",
        "color": "#FFF"
      }
    ],
    "((?:\\/\\/|#) __endif__)": [
      {
        "backgroundColor": "#808080",
        "color": "#FFF"
      }
    ],
    "(__replace__)(.+?)(__)": [
      {
        "backgroundColor": "#5F9EA0",
        "color": "#FFF"
      },
      {
        "backgroundColor": "#5F9EA0",
        "color": "#FFF",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#5F9EA0",
        "color": "#FFF"
      }
    ]
  }
}
```
