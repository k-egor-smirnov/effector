---
title: Glossary
description: Glossary of basic terms in effector
redirectFrom:
  - /docs/glossary
  - /docs/explanation/glossary
  - /explanation/glossary
  - /en/glossary
---

Glossary of basic terms in effector

## Event

_Event_ is a function you can subscribe to. It can be an intention to change the store, indication of something happening in the application, a command to be executed, aggregated analytics trigger and so on.

[Event](/en/api/effector/Event) in api documentation

## Store

_Store_ is an object that holds state.
There can be multiple stores.

[Store](/en/api/effector/Store) in api documentation

## Effect

_Effect_ is a container for (possibly async) side effects.
It exposes special events and stores, such as `pending`, `done`, `fail`, `finally`, etc...

It can be safely used in place of the original async function.

It returns promise with the result of a function call

The only requirement for the function:

- **Must** have zero or one argument

[Effect](/en/api/effector/Effect) in api documentation

## Domain

_Domain_ is a namespace for your events, stores and effects.

Domains are notified when events, stores, effects, or nested domains are created via `onCreateEvent`, `onCreateStore`, `onCreateEffect`, `onCreateDomain` methods.

It is useful for logging or other side effects.

[Domain](/en/api/effector/Domain) in api documentation

## Unit

Data type used to describe business logic of applications. Most of the effector methods deal with unit processing.
There are five unit types: [Store](/en/api/effector/Store), [Event](/en/api/effector/Event), [Effect](/en/api/effector/Effect), [Domain](/en/api/effector/Domain) and [Scope](/en/api/effector/Scope)

## Common unit

Common units can be used to trigger updates of other units. There are three common unit types: [Store](/en/api/effector/Store), [Event](/en/api/effector/Event) and [Effect](/en/api/effector/Effect). **When a method accepts units, it means that it accepts events, effects, and stores** as a source of reactive updates

## Purity

Most of the functions in api must not call other events or effects: it's easier to reason about application's data flow when imperative triggers are grouped inside watchers and effect handlers rather than spread across entire business logic.

**Correct**, imperative:

```js
import { createStore, createEvent } from "effector";

const submitLoginSize = createEvent();

const $login = createStore("guest");
const $loginSize = $login.map((login) => login.length);

$loginSize.watch((size) => {
  submitLoginSize(size);
});
```

[Try it](https://share.effector.dev/D5hV8C70)

[store.map in docs](/en/api/effector/Store#map-fn)

[store.watch in docs](/en/api/effector/Store#watch-watcher)

**Correct**, declarative:

```js
import { createStore, createEvent, forward } from "effector";

const submitLoginSize = createEvent();

const $login = createStore("guest");
const $loginSize = $login.map((login) => login.length);

forward({
  from: $loginSize,
  to: submitLoginSize,
});
```

[Try it](https://share.effector.dev/it0gXQLI)

[forward in docs](/en/api/effector/forward)

**Incorrect**:

```js
import { createStore, createEvent, forward } from "effector";

const submitLoginSize = createEvent();

const $login = createStore("guest");
const $loginSize = $login.map((login) => {
  // no! use forward or watch instead
  submitLoginSize(login.length);
  return login.length;
});
```

## Reducer

```typescript
type StoreReducer<State, E> = (state: State, payload: E) => State | void;
type EventOrEffectReducer<T, E> = (state: T, payload: E) => T;
```

_Reducer_ calculates a new state given the previous state and an event's payload. For stores, if reducer returns undefined or the same state (===), then there will be no update for a given store.

## Watcher

```typescript
type Watcher<T> = (update: T) => any;
```

_Watcher_ is used for **side effects**. Accepted by [event.watch](/en/api/effector/Event#watch-watcher), [store.watch](/en/api/effector/Store#watchwatcher) and [domain.onCreate\* hooks](/en/api/effector/Domain#oncreateeventhook). Return value of a watcher is ignored.

## Subscription

```typescript
type Subscription = {
  (): void;
  unsubscribe(): void;
};
```

Function, returned by [forward](/en/api/effector/forward), [event.watch](/en/api/effector/Event#watch-watcher), [store.watch](/en/api/effector/Store#watchwatcher) and some other methods. Used for cancelling a subscription. After the first call, subscription will do nothing

:::warning
**Managing subscriptions manually distracts from business logic improvements.**
<br/><br/>
Effector provides a wide range of features to minimize the need to remove subscriptions. This sets it apart from most other reactive libraries
:::

[effect]: /en/api/effector/Effect
[store]: /en/api/effector/Store
[event]: /en/api/effector/Event
[domain]: /en/api/effector/Domain
[scope]: /en/api/effector/Scope
