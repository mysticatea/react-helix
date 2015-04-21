# react-helix

[![npm](https://img.shields.io/npm/v/react-helix.svg)](https://www.npmjs.com/package/react-helix)

A minimal library for [Flux](http://facebook.github.io/flux)-like architecture.

- [Motivation](#motivation)
- [Overview Helix](#overview-helix)
- [Overview react-helix](#overview-react-helix)
- [Installation](#installation)
- [Usage](#usage)
  - [StageComponent / StageMixin](#stagecomponent--stagemixin)
  - [AgentComponent / AgentMixin](#agentcomponent--agentmixin)
- [Helix in depth](#helix-in-depth)
  - [More Actions (together Promise / Generator)](#more-actions-together-promise--generator)
  - [Nested StageComponent](#nested-stagecomponent)
  - [Server-side Rendering](#server-side-rendering)
- [Examples](https://github.com/mysticatea/react-helix-examples)


## Motivation

- Makes *Model* to be immutable.
- Makes the border of *Model* and *View* to be clearly.
- No boilerplate. Minimal requisite.
- Doesn't block the server-side rendering.


## Overview Helix

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

First, I named this Flux-like design. It's Helix.
This section explains about Helix.

Helix inherits the most basic concept of Flux, Unidirectional Data Flow, and provides better way that works immutable data.

### Three elements

Helix has three elements:

* *Model* is immutable data structures.
* *Action* is domain logics, they are just functions that transforms from the previous *Model* to the next *Model*.
* *View* is appearance, they show the *Model* and send *Action* by user operations.

It's important, *Action* is just a function.

### Two dataflows

Since *Model* is immutable, the root component has ownership of the application model uniquely. But the model will be updated by detail components (they would not know the root component).
Helix has two symmetric flows as solution of this gap.

- *Downward Flow* is to distribute changes via Virtual DOMs (diff & patch).
- *Upward Flow* is to send actions via Event Bubbling.

Let's see the flow of the whole.

When a necessity to update *Model* was occurred by user operations, then a detail component fires a send action event with an *Action* and parameters.  The event carries the action and parameters to the root component via event bubbling. (*Upward Flow*).

The root component has the application model. When it received a send action event, it takes *Action* and parameters from the event, then it applies the *Action* with the parameters to its model. And the root component distributes changes via Virtual DOM (Diff & Patch). (Downward Flow).

Thus, the root component keeps ownership of the application model, and detail components can determine details of updating completely.  And we don't need boilerplates (e.g. declares constants, registers handlers to Dispatcher/Store, ...), and and it's scalable to increase *Action*s.


## Overview react-helix

`react-helix` is a library for Helix, provides two classes (and mixins).

- `StageComponent` (or `StageMixin`) has an ability to catch *Action*s that sent
  from its descendant, and apply the *Action* to its state automatically.
  This is an implement for the root component.
- `AgentComponent` (or `AgentMixin`) has an ability to dispatch bubbling events
  to send *Action*s.
  This is an implement for detail components.

For example:

* [Action Definition](https://github.com/mysticatea/react-helix-examples/blob/master/src/todos/client/action/TodoApp.js#L41-50):

  ```js
  export function removeTodoItem(model, id) {
    return model.withItems(items =>
      items.filter(item => item.id !== id)
    );
  }
  ```

* [Send Action](https://github.com/mysticatea/react-helix-examples/blob/master/src/todos/client/view/TodoItem.js#L89-92):

  ```js
  onRemoveButtonClick(/*event*/) {
    const id = this.props.value.id;
    this.request(removeTodoItem, id);
  }
  ```

That's almost all.

See Also [Examples](https://github.com/mysticatea/react-helix-examples)


## Installation

```
npm install react react-helix
```

## Usage

### StageComponent / StageMixin

```ts
declare class StageComponent extends React.Component {
  constructor(props: any, stageValuePath: string = "");

  stageValue: any;
  setStageValue(value: any, callback?: () => void): void;

  filterAction(event: SendActionEvent): boolean;

  // When you would override those methods, must call `super`.
  componentDidMount(): void;
  componentWillUnmount(): void;
  componentWillUpdate(): void;
  componentDidUpdate(): void;
}

const StageMixin = {
  stageValue: any;
  setStageValue(value: any, callback?: () => void): void;

  // stageValuePath: string = "";
  //   You can define `stageValuePath` property.
  //   The property is used from `componentWillMount` in order to define
  //   `stageValue` and `setStageValue`.

  // filterAction(event: SendActionEvent): boolean
  //   You can define `filterAction` method.
};
```

#### stageValuePath

`StageComponent` has one parameter `stageValuePath`.
This string is a path to stage value in its state.

For example, when you set `model` to `stageValuePath`, then the component saves
its stage value into `this.state.model`.
Other example, when `stageValuePath` is `myapp.model`, then the component saves
its stage value into `this.state.myapp.model`.

#### stageValue

`stageValue` is a getter property to get the value of `stageValuePath`.

#### setStageValue

`setStageValue` is a method to set the value of `stageValuePath`.

#### filterAction

`filterAction` is a method to determine whether it should handle the action.

* `event.action` is the action.
* `event.arguments` is an array of arguments for the action.
* If returned `false`, this component ignores the action.

By default, always returns `true`.


### AgentComponent / AgentMixin

```ts
declare class AgentComponent extends React.Component {
  constructor(props: any);
  request(action: (stageValue: any, ...) => any, ...args: any[]): void;
}

const AgentMixin = {
  request(action: (stageValue: any, ...) => any, ...args: any[]): void;
};
```

#### request

`request` is a method to send an action.
`action` is a function.
`args` is an array of arguments for `action`.

You can replace this method to a spy for unit tests.
User interactions will trigger this method in the end.

--------------------------------------------------------------------------------

## Helix in depth

### More Actions (together Promise / Generator)

react-helix allows actions return a promise or a generator.
In this case, `StageComponent` treats the return value specially.

> Implementation of react-helix does NOT depend on Promise/Generator.
> Thus react-helix works even if those are not implemented.
> However, if application want to use Promise/Generator, will require Polyfills.

#### Promise

If the return value is a promise, `StageComponent` waits for the promise
fulfilled, then sets the result to its stage value.
If the result of the promise is a function, `StageComponent` calls the function
with its stage value immediately, and sets the result of the function to its
stage value.

```js
function promiseAction(model) {
  // ↑ This model is a instance at the time of this action was called.
  return hogeAsync()
    .then(function() {
      // ↓ This model2 is a instance at the time of this promise became
      //   fulfilled.
      return function(model2) { ... };
    });
}
```

#### Generator

If the return value is a generator, `StageComponent` advances it until done.
While advancing, `StageComponent` treats yielded values.

* If undefined was yielded, just ignores it.
* If a function was yielded, `StageComponent` calls the function with its stage
  value immediately, and sets the result to its stage value.
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

The Action with a generator is useful to implement complex business logics.


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

Event bubbling to carry actions does not work in server side.
But, react-helix does not prevent rendering (maybe. NEEDS TEST).


### Browser Compatibility

Implementation of react-helix is using:

* `Object.defineProperties`
* `Function.prototype.bind`
* `EventTarget.prototype.addEventListener`
* `EventTarget.prototype.removeEventListener`

Thus IE8 and older are not supported.
