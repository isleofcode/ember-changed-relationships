import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const {
  RSVP,
  run
} = Ember;

let store, parent, children;

moduleFor("integration/changed-relationships-mixin", {
  integration: true,

  beforeEach: function() {
    store = this.container.lookup('service:store');

    parent = store.createRecord('parent', { id: 1 });
    children = [
      store.createRecord('child', { id: 2 }),
      store.createRecord('child', { id: 3 })
    ];
  }
});

test('it returns empty when there has been no change', function(assert) {
  run(() => {
    let changed = parent.changedRelationships();
    assert.deepEqual(changed, {});
  });
});

test('it maps changes in belongsTo relationships', function(assert) {
  run(() => {
    let child = children[0];
    child.set('parent', parent);

    let changed = child.changedRelationships();
    let expected = {
      parent: [
        undefined,
        "1"
      ]
    };

    assert.deepEqual(changed, expected);
  });
});

test('it maps changes in hasMany relationships', function(assert) {
  run(() => {
    parent.set('children', children);

    let changed = parent.changedRelationships();
    let expected = {
      children: [
        [],
        ["2", "3"]
      ]
    };

    assert.deepEqual(changed, expected);
  });
});

test('after save it no longer maps changes', function(assert) {
  run(() => {
    let adapter = store.get('defaultAdapter');
    adapter.createRecord = function() {
      return RSVP.resolve({
        data: {
          type: "parent",
          id: "1",
          relationships: {
            children: {
              data: [
                { type: "child", id: "2" },
                { type: "child", id: "3" }
              ]
            }
          }
        }
      });
    };

    parent.set('children', children);
    parent.save().then(function() {
      let changed = parent.changedRelationships();
      assert.deepEqual(changed, {});
    });
  });
});
