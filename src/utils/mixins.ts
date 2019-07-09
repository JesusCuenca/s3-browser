// eslint-ignore-file
import Vue, { VueConstructor } from 'vue';

export type VueExtendCtor<T> = VueConstructor<Vue & T>;
export default function mixins<A>(Ctor1: VueExtendCtor<A>): VueExtendCtor<A>;
export default function mixins<A, B>(
  Ctor1: VueExtendCtor<A>,
  Ctor2: VueExtendCtor<B>,
): VueExtendCtor<A & B>;
export default function mixins<A, B, C>(
  Ctor1: VueExtendCtor<A>,
  Ctor2: VueExtendCtor<B>,
  Ctor3: VueExtendCtor<C>,
): VueExtendCtor<A & B & C>;
// ... Desired count of overloads ...
export default function mixins<V extends VueConstructor[]>(
  ...objectsToBeMixed: V
): VueExtendCtor<ExtractVue<V>>;
export default function mixins(...Ctors: VueConstructor[]): VueConstructor {
  return Vue.extend({ mixins: Ctors });
}

/**
 * Borrowed from Vuetify {@link https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/util/mixins.ts}
 * Returns the instance type from a VueConstructor
 * Useful for adding types when using mixins().extend()
 */
export type ExtractVue<T extends VueConstructor | VueConstructor[]> = T extends (infer U)[]
  ? UnionToIntersection<U extends VueConstructor<infer V> ? V : never>
  : T extends VueConstructor<infer V>
  ? V
  : never;
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((
  k: infer I,
) => void)
  ? I
  : never;
