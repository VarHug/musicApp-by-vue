export default function queue(arr) {
  let promise = Promise.resolve();
  arr.forEach(func => {
    promise = promise.then(() => {
      return func();
    });
  });
};
