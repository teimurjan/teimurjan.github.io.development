---
title: Effective React. Ways to optimize your app.
date: 2018-05-06T16:15:47.000Z
excerpt: Make your React app faster.
hidden: false
tags:
  - javascript
  - optimization
  - react
---
Everybody, everywhere and every time wants to get the fastest response from the application. It's humanity's nature. We are not the most patient creatures all over the galaxy. This should be the thought of any Frontend engineer. All the materials for this post are given from my public talk at GDG IWD 2018 Kyrgyzstan, Bishkek, and can be found [<b>here</b>](https://github.com/teimurjan/react-optimization-presentation).

## Optimization ways

To improve the performance we need to identify the areas which may be improved. First of all, we are talking about a Javascript application which is always a result of running a file of instructions - bundle file. The smaller this file is the faster it'll be loaded. Respectively the web page's loading time will be reduced.

The secondary influencer is rendering. Before a user sees a painting on the page, there is an unknown amount of rendering operations. Some of them are useful and some are not. The time between a user's interaction and the result painted on the page is the straight-forward factor of the app's efficiency.

From the above, we can conclude with the following action items:

* Reduce `bundle.js` size.
* Avoid unnecessary calls of `render()`.

## Bundle size

### CSS

The first thing we can do is to extract our CSS from our bundle. The use of this method is to make `css` an `js` bundles loading in parallel. Fortunately, there is a webpack plugin that allows doing that very easily.

```js
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
              /* your loader here */
            })
          }
        ]
      }
    ]
  }
};
```

Now we've done with extracting `css` file. As the last step with CSS let's minify this file by providing an option to css-loader.

```js
loader: ExtractTextPlugin.extract({
  use: [
    {
      loader: require.resolve("css-loader"),
      options: {
        minimize: true
      }
    }
  ]
});
```

By these simple actions, we could divide one big bundle into two smaller ones and then reduce the CSS file's size by about 25%.

### Javascript

Let's move to a more compound part - Javascript file optimization. Here I suggest, beginning with the setting environment variable `NODE_ENV=production`. Why do we need to do that? Because without knowing that we are in production React will be using its development file which is 7 times greater than the minified one for production.

```js
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ]
};
```

Well, React supports optimization out of the box, but our code is not. How to make it minified? UglifyJsPlugin is our assistant in solving this problem. This plugin reduces the bundle's size by about 47%! 🙀

```js
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      /* settings */
    })
  ]
};
```

### Analysis

Suppose that you've done everything written earlier but your problems have not disappeared. In that case, we might need to abandon some libraries. To detect useless and heavy libraries we can use 2 popular tools:

* source-map-explorer(needs a source map file)

```sh
npm install -g source-map-explorer
source-map-explorer bundle.js bundle.js.map
```

* webpack-bundle-analyzer(run as a local app after each webpack build)

```js
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  plugins: [new BundleAnalyzerPlugin()]
};
```

These tools are almost the same, but the last one is much prettier.

### Code splitting

We're done with the single bundle manipulations. It's time to split it into chunks so we don't have to load a huge pie at once.

First of all, we need to divide the client and vendor code. It will be a useful action if your code is updated often but the libraries remain the same. The browser won't update the libraries' as they are cached. It'll only re-fetch your updated code.

```js
const webpack = require("webpack");

module.exports = {
  entry: {
    client: "./src/index.js",
    vendor: ["react", "react-dom", "react-router", "react-router-dom"]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.[chunkhash].js"
    })
  ]
};
```

In this example, we extracted from the main bundle some vendors like react(-dom), react-router(-dom).

Now, the client code can also be split based on the routes. This way of optimization requires changing not only the configs but also the code. The process can be done in 2 simple steps:

1. Modify webpack configuration.

```js
const webpack = require("webpack");
const path = require("path");

const buildPath = path.resolve("build");

module.exports = {
  output: {
    path: buildPath,
    filename: "[name].[chunkhash:8].js",
    chunkFilename: "[name].[chunkhash:8].chunk.js"
  }
};
```

2. Make a component loaded asynchronously.

```js
// home-container.js
import Loadable from "react-loadable";
import Spinner from "../Common/Spinner";

export default Loadable({
  loader: () => import("./Home" /*webpackChunkName: 'home' */),
  loading: Spinner
});
```

The component exported from \`home-container.js\` file can be used as a separate chunk file.

## Rendering

The size of the bundle is reduced as much as we can. It's time to optimize rendering.

### Reconciliation

Before an improvement, we have to know how the mechanism is working. The most valuable process in React is reconciliation - an algorithm used to update React's Virtual DOM. Here is a simple scheme illustrating how it works.

Below is an elementary visualization of this algorithm.

![](/media/reconciliation.png)

Assume we have a state update in the root component - **(1)**. Consider this update as a signal. The signal goes deeper to the **(1)**'s children. **(2)**'s SCU method returns `false`, so this component ignores the signal and not pass it deeper. **(3)**'s SCU returns `true` meaning the signal won't be ignored and the node will be re-rendered if React's comparison algorithm finds differences between the previous and current nodes. To detect these differences the same process is made for the children. Child **(6)**'s SCU returns `true` and the comparison algorithm recognizes that this node is changed, so it'll be rerendered. **(6)** will be re-rendered. **(7)**'s SCU result is `false`, then no rerender needed.

That's how React updates work. As you notice `shouldComponentUpdate` plays a huge role in this process. Here is how default SCU looks like:

```js
export default class extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
}
```

It means that your component will always handle the update signal. To avoid this, `React.PureComponent` can be used. This thing is a copy of `React.Component` but with a significant change. It has a different realization of `shouldComponentUpdate` method.

```js
export default class extends React.PureComponent {
  shouldComponentUpdate(nextProps, nextState) {
    return !(
      shallowEqual(nextProps, this.props) && shallowEqual(nextState, this.state)
    );
  }
}
```

Next and previous props/state are compared by shallowEqual which works like:

```js
const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];

arr1 === arr2; // false

const obj1 = { foo: "bar" };
const obj2 = { foo: "bar" };

obj1 === obj2; // false
```

The same objects' content does not mean they are shallowly equal. `arr1/obj1` and `arr2/obj2` are just the pointers to the values located in a machine's memory. These pointers are different because the machine doesn't care about the content. This issue often causes performance drops. There are the most popular mistakes below:

* arrow functions and `.bind(this)` in `render`
* using a constant object in `render`

### Arrow functions and .bind(this)

Suppose you have such a component:

```js
class Todo extends React.Component {
  render() {
    return (
      <li className="todo" onClick={this.props.onClick}>
        {this.props.todo}
      </li>
    );
  }
}
```

You use it in the following way:

```js
render() {
  return (
    <ul>
      {this.props.todos.map(todo => (
        <Todo todo={todo} onClick={() => this.props.onTodoClick(todo.id)} />
      ))}
    </ul>
  );
}
```

When you use `() => this.props.onTodoClick(todo.id)` in such a way, a new function will be created at every call of render. As you know JS functions are objects. We've seen earlier a new object means a new pointer in the memory. That's why our `React.PureComponent` will always detect differences. As a possible solution `onTodoClick` can be passed as a prop and called inside the `Todo` component.

```js
class Todo extends React.Component {
  handleClick = e => {
    this.props.onClick(this.props.todo.id);
  };

  render() {
    return (
      <li className="todo" onClick={this.handleClick}>
        {this.props.todo}
      </li>
    );
  }
}

class TodoList extends React.PureComponent {
  render() {
    return (
      <ul>
        {this.props.todos.map(todo => (
          <Todo todo={todo} onClick={this.props.onTodoClick} />
        ))}
      </ul>
    );
  }
}
```

\`.bind(this)\` causes a similar problem because binding a context creates a completely new function too.

```js
render() {
    return (
        <ul>
            {this.props.todos.map(todo => (
                <Todo
                    todo={todo}
                    onClick={this.props.handleClick.bind(this)}
                />
            ))}
        </ul>
    );
}
```

Instead of doing like that, binding `this` can be moved to the constructor, so it'll only be called once:

```js
constructor(props) {
  super(props);
  this.handleClick = this.handleClick.bind(this);
}
```

Usage of the ES6 arrow function is even better because you don't need to bind context in this way:

```js
handleClick = todoId => {
  this.setState({
    [todoId]: { clicked: true }
  });
};
```

### Constant object in render

Passing a static property to a component is a frequent fact. For example, we have a `TodoList` that demands `option` prop.

```js
export default class extends React.PureComponent {
  render() {
    return (
      <TodoList
        options={{
          wrap: false,
          maximizeOnFoucs: true
        }}
      />
    );
  }
}
```

It's not obvious that the options are a newly created object on every call of `render`. The values are always the same, the pointers are not. Let's extract this property to a variable, so the object is created outside of the `render`.

```js
const TODO_LIST_OPTIONS = {
  wrap: false,
  maximizeOnFoucs: true
};

export default class extends React.PureComponent {
  render() {
    return <TodoList options={TODO_LIST_OPTIONS} />;
  }
}
```

### Keys

Another most common problem is using the index of an element as the key. Keys' mission is not familiar to many young engineers. Keys are the unique identifiers making operations with the components faster. Let's review the code below:

```js
// You have this 4 components
const elements = [
  { type: "div", key: 0, textContent: "Container #0" },
  { type: "div", key: 1, textContent: "Container #1" },
  { type: "div", key: 2, textContent: "Container #2" },
  { type: "div", key: 3, textContent: "Container #3" }
];

// Delete Container #1
const elements = [
  { type: "div", key: 0, textContent: "Container #0" },
  // Components with text Container #2 and Container #3 has new indexes
  { type: "div", key: 1, textContent: "Container #2" },
  { type: "div", key: 2, textContent: "Container #3" }
];
```

After deletion Container #1, indexes of all the subsequent elements are changed. If the keys are the indexes, they will be changed, however, the components are the same. When the comparison algorithm is run, all the components with the updated keys will be rerendered despite the actual state of their nodes. Imagine if there are 1000 elements and the first one is deleted. 999 rerenders happen uselessly.

![](/media/keys-table.png)

You need to create a rule for yourself not to use dynamic keys. It's good if your objects have an \`id\` attribute to rely on.  If they don't have \`id\`s can be generated before the components are used (outside of `render`).

### Avoiding lifecycle

It's said that using functional components is a way to get rid of the component lifecycle in favor of faster rendering. It's not true if we render a component with \`React.createElement\` or as JSX. However, if a component is rendered as a pure function call the lifecycle will be completely ignored. 

```js
const TodoFactory = ({ todo, onClick }) => (
  <li className="todo" onClick={onClick}>
    {todo.title}
  </li>
);

export default ({ todos }) => (
  <ul>{todos.map(todo => TodoFactory({ todo, onClick: console.log }))}</ul>
);
```

Here is [the link](https://github.com/missive/functional-components-benchmark) to the benchmark.

## Conclusion

Above, you can find the most popular and efficient methods to optimize an application. These methods are implemented using `React 16.2` and `Webpack 3.8.1`, though I'd advise you to ignore it. The idea of the article is to show possible bottlenecks without binding to a version of a library. Following this guide will make you understand the threats of your app's slowness and the ways to fight them.