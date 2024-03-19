import {Linking, PermissionsAndroid} from 'react-native';
import {Edge, useSafeAreaInsets} from 'react-native-safe-area-context';

/**
 * Helper for opening a give URL in an external browser.
 */
export function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then(canOpen => canOpen && Linking.openURL(url));
}

export type ExtendedEdge = Edge | 'start' | 'end';

const propertySuffixMap = {
  top: 'Top',
  bottom: 'Bottom',
  left: 'Start',
  right: 'End',
  start: 'Start',
  end: 'End',
};

const edgeInsetMap: Record<string, Edge> = {
  start: 'left',
  end: 'right',
};

export type SafeAreaInsetsStyle<
  Property extends 'padding' | 'margin' = 'padding',
  Edges extends Array<ExtendedEdge> = Array<ExtendedEdge>,
> = {
  [K in Edges[number] as `${Property}${Capitalize<K>}`]: number;
};

/**
 * A hook that can be used to create a safe-area-aware style object that can be passed directly to a View.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/utility/useSafeAreaInsetsStyle/}
 * @param {ExtendedEdge[]} safeAreaEdges - The edges to apply the safe area insets to.
 * @param {"padding" | "margin"} property - The property to apply the safe area insets to.
 * @returns {SafeAreaInsetsStyle<Property, Edges>} - The style object with the safe area insets applied.
 */
export function useSafeAreaInsetsStyle<
  Property extends 'padding' | 'margin' = 'padding',
  Edges extends Array<ExtendedEdge> = [],
>(
  safeAreaEdges: Edges = [] as unknown as Edges,
  property: Property = 'padding' as Property,
): SafeAreaInsetsStyle<Property, Edges> {
  const insets = useSafeAreaInsets();

  return safeAreaEdges.reduce((acc, e) => {
    const value = edgeInsetMap[e] ?? e;
    return {...acc, [`${property}${propertySuffixMap[e]}`]: insets[value]};
  }, {}) as SafeAreaInsetsStyle<Property, Edges>;
}

export async function requestPermissionAndroid(permissionName: any) {
  return PermissionsAndroid.request(permissionName, {
    title: 'Cool Photo App Camera Permission',
    message:
      'Cool Photo App needs access to your camera ' +
      'so you can take awesome pictures.',
    buttonNeutral: '稍后询问',
    buttonNegative: '取消',
    buttonPositive: '确认',
  }).then(value => {
    return value === PermissionsAndroid.RESULTS.GRANTED;
  });
}
