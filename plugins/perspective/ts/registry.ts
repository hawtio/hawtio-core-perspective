/// <reference path="../../includes.ts"/>
/// <reference path="globals.ts"/>
module HawtioPerspective {

  interface PerspectiveMap {
    [id:string]:Perspective;
  }

  export class RegistryImpl implements Registry {

    private perspectives:PerspectiveMap = {};
    private current:Perspective = undefined;
    private currentId: string = undefined;
    private labels:PerspectiveLabel[] = [];

    add(id:string, perspective:Perspective): void {
      this.perspectives[id] = perspective;
      if (!this.current) {
        this.setCurrent(id);
      }
    }

    remove(id:string): Perspective {
      var answer = this.perspectives[id];
      this.perspectives[id] = undefined;
      return answer;
    }

    setCurrent(id:string): void {
      var current = this.perspectives[id];
      if (current) {
        this.current = current;
        this.currentId = id;
      }
    }

    getCurrent():Perspective {
      return this.current;
    }

    getLabels():PerspectiveLabel[] {
      _.remove(this.labels, (item) => item.id === this.currentId);

      _.forOwn(this.perspectives, (perspective, id) => {
        if (id === this.currentId) {
          return;
        }
        if (perspective.isValid && angular.isFunction(perspective.isValid) && !perspective.isValid()) {
          _.remove(this.labels, id);
          return;
        }
        if (_.any(this.labels, (item) => id === item.id )) {
          // already present
          return;
        }
        // was added
        this.labels.push({
          id: id,
          $$hashKey: id,
          label: perspective.label,
          icon: perspective.icon
        });
      });
      return this.labels;

    }

  }

}
