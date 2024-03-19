export type MusicInfo = {
  id?: number;
  name: string;
  path: string;
};

export type ScreenPropsBase = {
  navigation: {
    navigate: (name: string) => void;
    jumpTo: (name: string) => void;
    addListener: (eventName: string, eventHandler: () => void) => any;
  };
  route: {
    name: string;
    key: string;
    params: unknown;
  };
};
