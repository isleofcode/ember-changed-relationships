# ember-changed-relationships

[![Build Status](https://travis-ci.org/isleofcode/ember-changed-relationships.svg?branch=feat%2Ftravis)](https://travis-ci.org/isleofcode/ember-changed-relationships)

Provides a mixin that can be imported to your models adding a single function, `changedRelationships`. It works similar to `changedAttributes`. Use selectively.

## Installation

* `ember install ember-changed-relationships`

## Usage

Simply call `changedRelationships` on a model.

Given:

```
import ChangedRelationships from 'ember-changed-relationships';

const {
  Model,
  belongsTo,
  hasMany
} = DS;

export default Model.extend(
  ChangedRelationships, {

  user: belongsTo(), //initial state to user with id 1
  items: hasMany() //inital state to ids [1,2,3]
}
```

after calling:
```
model.set('user', newUser); //id 2
model.set('items', newItems); //ids [2,3]
```

You would be returned:
```
relationships: {
  user: [1,2],
  items: [ [1,2,3], [2,3] ]
}
```

After each `model.save()`, the canonical state will reset.

## Credits

ember-changed-relationships is maintained by [Isle of Code](https://isleofcode.com).
