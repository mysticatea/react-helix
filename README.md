# react-helix

A minimal library for [Flux](http://facebook.github.io/flux)-like architecture.

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
  - [StageComponent / StageMixin](#stagecomponent--stagemixin)
  - [AgentComponent / AgentMixin](#agentcomponent--agentmixin)
- [Helix in depth](#helix-in-depth)
  - [More Actions (Promise / Generator)](#more-actions-promise--generator)
  - [Nested StageComponent](#nested-stagecomponent)
  - [Server-side Rendering](#server-side-rendering)
- [Examples](https://github.com/mysticatea/react-helix-examples)


## Overview

```
                               This has the Application Model
                              +-------------------------------
                             /
                       +---------------------+
                       | The Root Component  |
                   +---| (Application class) |<<-+
                   |   +---------------------+   |
                   |                             |
Distribute changes |                             | Send actions
  via Virtual DOMs |                             | via Event Bubblings
                   |                             |
                   |   +---------------------+   |
                   |   |  Detail Components  |   |
                   +->>|                     |---+
                       +---------------------+
                                       /
     Those accept user's interactions /
    ---------------------------------+
```

Helix inherits Flux's basic concept -- unidirectional data flow.
And it makes symmetry in the flow in order to simplify entire.

- *Downward Flow* is to distribute changes via Virtual DOMs (diff & patch).
- *Upward Flow* is to send actions via Event Bubbling.

Those flows don't depend on outside objects (e.g. Singleton dispatcher).
Those depend on only its component tree.

Next, Helix defines Action.
Action is functions that converts to the next world from the previous world.
Action is *just* functions.

The root component has the application model as its state.
When it received actions, then it applies the action to its state, thus view
updating is triggered.

In this way, we can make models become immutable and provide actions.

Helix is suited to immutable models.

See Also [Examples](https://github.com/mysticatea/react-helix-examples)


## Installation

```
npm install react react-helix
```


## Usage

react-helix provides two classes (and mixins).

- `StageComponent` (or `StageMixin`) has an ability to catch actions that sent
  from its descendant, and apply the action to its state.
- `AgentComponent` (or `AgentMixin`) has an ability to dispatch bubbling events
  to send actions.


### StageComponent / StageMixin

```ts
declare class StageComponent extends React.Component {
  constructor(props: any, stageValuePath: string = "");
  stageValue: any;
  setStageValue(value: any, callback?: () => void);
  filterAction(event: SendActionEvent): boolean
}

const StageMixin = {
  stageValue: any;
  setStageValue(value: any, callback?: () => void);

  // stageValuePath: string = "";
  //   You can define `stageValuePath` property.
  //   The property is used from `componentWillMount` in order to define
  //   `stageValue` and `setStageValue`.

  // filterAction(event: SendActionEvent): boolean
  //   You can define `filterAction` method.
};
```

> `StageComponent` manages an event handler at `componentDidMount` and
> `componentWillUnmount`.  When you would override the methods, must call
> `super`.

#### stageValuePath

`StageComponent` has one parameter `stageValuePath`.
This string is a path to store value in its state.

For example, when you set `model` to `stageValuePath`, then the component saves
its stage value into `this.state.model`.
Other example, when `stageValuePath` is `myapp.model`, then then the component
saves its stage value into `this.state.myapp.model`.

#### stageValue

`stageValue` is a getter property to get the value of `stageValuePath`.

#### setStageValue

`setStageValue` is a method to set the value of `stageValuePath`.

#### filterAction

`filterAction` is a method to determine whether it should handle the action.

* `event.action` is the action.
* `event.arguments` is an array of arguments for the action.
* If returns `false`, this component ignores the action.

By default, always returns `true`.


### AgentComponent / AgentMixin

```ts
declare class AgentComponent extends React.Component {
  constructor(props: any);
  request(action: (stageValue: any, ...args: any[]) => any, ...args: any[]);
}

const AgentMixin = {
  request(action: (stageValue: any, ...args: any[]) => any, ...args: any[]);
};
```

#### request

`request` is a method to send an action.
`action` is a function.

For example,

* Action Definition:

  ```js
  export function removeTodoItem(model, id) {
    return model.withItems(items =>
      items.filter(item => item.id !== id)
    );
  }
  ```

* Send Action:

  ```js
  onRemoveButtonClick(/*event*/) {
    const id = this.props.value.id;
    this.request(removeTodoItem, id);
  }
  ```


## Helix in depth

### More Actions (Promise / Generator)

react-helix allows actions return a promise or a generator.
In this case, `StageComponent` treats the return value specially.

> Implementation of react-helix does NOT depend on Promise/Generator.
> Thus react-helix works even if those are not implemented.
> However, if application want to use Promise/Generator, will require Polyfills.

#### Promise

If the return value is a promise, `StageComponent` waits for the promise
fulfilled, then sets the result to its stage value.
If the result of the promise is a function, `StageComponent` calls the function
with its stage value immediately, then sets the result to its stage value.

```js
function promiseAction(model) {
  // ↑ This model is a instance at the time of this action was called.
  return hogeAsync()
    .then(function() {
      // ↓ This currentModel is a instance at the time of this promise became
      //    fulfilled.
      return function(currentModel) { ... };
    });
}
```

#### Generator

If the return value is a generator, `StageComponent` advances it until done.
While advancing, `StageComponent` treats yielded values.

* If undefined was yielded, just ignores it.
* If a function was yielded, `StageComponent` calls the function with its stage
  value immediately, then sets the result to its stage value.
* If a promise was yielded, `StageComponent` backs the result of the promise
  (it is similar to [co](https://github.com/tj/co)).
* If a generator was yielded, it is processed recurcively.
* Otherwise, `StageComponent` sets the value to its stage value.
* `yield` (excludes case of give a promise) backs the current stage value.

```js
function* generatorAction(model) {
  // ↑ This model is a instance at the time of this action was called.

  // Lonly `yield` just returns the current model.
  const model2 = yield;

  // Give an object to `yield`, it updates model, and returns new model.
  const model3 = yield model.withStatus(1);

  // Give a promise to `yield`, it returns the result.
  const threeSevens = yield Promise.resolve(777);

  // Give a promise (will be rejected) to `yield`, it throws.
  try {
    yield Promise.reject(new Error());
  }
  catch (err) {
    //...
  }
}
```


### Nested StageComponent

Actions is carried by event bubbling, it will handled at the first
`StageComponent`.  At this time, the `StageComponent` confirms whether it should
handle the action to `this.filterAction()`.

```
        +-------+
        | Stage |<---------+
        +-------+          |
         /     \           |
       +--+   +--+         |
       |  |   |  |         |
       +--+   +--+         |
      /   \      \         |
  +--+   +--+   +-------+  |
  |  |   |  |   | Stage |<-+ If filterAction() determines ignore, more bubbles.
  +--+   +--+   +-------+  |
  /      /      /     \    |
+--+   +--+   +--+   +--+  |
|  |   |  |   |  |   |//|--+
+--+   +--+   +--+   +--+
```

This will allow us to use nested `StageComponent`.


### Server-side Rendering

Event bubbling to carry actions does not work in server side. (just ignored)
But, react-helix does not prevent rendering.


### Browser Compatibility

Implementation of react-helix is using:

* `Object.defineProperties`
* `Function.prototype.bind`
* `EventTarget.prototype.addEventListener`
* `EventTarget.prototype.removeEventListener`

Thus IE8 and older are not supported.
