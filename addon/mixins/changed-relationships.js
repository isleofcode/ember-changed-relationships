import Ember from 'ember';
import lodash from 'lodash';
const { isEqual } = lodash;

const { Mixin } = Ember;
const mapById = function(member) {
  return member.id;
};

export default Mixin.create({
  changedRelationships() {
    //ids are always undefined until initialized
    if (this.get('_internalModel.dataHasInitialized') === false) { return; }

    let relationships = {};

    this.eachRelationship((name, meta) => {
      let basePath = `_internalModel._relationships.initializedRelationships.${name}`;
      let hasCanonical = this.get(`${basePath}.canonicalMembers.list.length`) > 0;

      if (meta.kind === 'belongsTo') {
        let newId = this.get(`${name}.id`);

        let initialId;
        if (hasCanonical) {
          let firstObject = this.get(`${basePath}.canonicalMembers.list`)[0];
          if (firstObject) {
            initialId = firstObject.id;
          }
        }

        if (initialId !== newId) {
          relationships[name] = [ initialId, newId ];
        }

      } else if (meta.kind === 'hasMany') {
        let newIds = this.get(`${basePath}.members.list`).map(mapById);

        let initialIds;
        if (hasCanonical) {
          initialIds = this.get(`${basePath}.canonicalMembers.list`).map(mapById);
        } else {
          initialIds = [];
        }

        if (isEqual(initialIds, newIds) === false) {
          relationships[name] = [ initialIds, newIds ];
        }
      }
    });

    return relationships;
  }
});
