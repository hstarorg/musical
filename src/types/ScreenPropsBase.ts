export type ScreenPropsBase = {
  navigation: {
    navigate: (name: string) => void;
  };
  route: {
    name: string;
    key: string;
    params: unknown;
  };
};

// {"addListener": [Function addListener], "canGoBack": [Function canGoBack], "dispatch": [Function dispatch], "getParent": [Function getParent], "getState": [Function anonymous], "goBack": [Function anonymous], "isFocused": [Function isFocused], "jumpTo": [Function anonymous], "navigate": [Function anonymous], "removeListener": [Function removeListener], "reset": [Function anonymous], "setOptions": [Function setOptions], "setParams": [Function anonymous]}
