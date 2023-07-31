export const debounce = <Args extends unknown[], Return>(callback: (...args: Args) => Return, milliseconds: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Args) => new Promise<Return>(resolve => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(
      () => {
        resolve(callback(...args));
      },
      milliseconds
    );
  });
};