export let getId = (
  (id) => () =>
    id++
)(0);
