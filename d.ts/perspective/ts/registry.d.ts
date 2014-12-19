/// <reference path="../../includes.d.ts" />
/// <reference path="globals.d.ts" />
declare module HawtioPerspective {
    class RegistryImpl implements Registry {
        private perspectives;
        private current;
        private currentId;
        private labels;
        add(id: string, perspective: Perspective): void;
        remove(id: string): Perspective;
        setCurrent(id: string): void;
        getCurrent(): Perspective;
        getLabels(): PerspectiveLabel[];
    }
}
