export default function (namespace?: string, style?: string) {
  const validatedStyle = style || 'color:yellow;background-color:#333';
  if (namespace === undefined) return console;

  return {
    log: console.log.bind(console, `%c${namespace}`, validatedStyle),
    warn: console.warn.bind(console, `%c${namespace}`, validatedStyle),
    debug: console.debug.bind(console, `%c${namespace}`, validatedStyle),
    error: console.error.bind(console, `%c${namespace}`, validatedStyle),
  };
}
