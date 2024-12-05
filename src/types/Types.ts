export type Controls<T> = {
  [key in keyof T]?: key;
};
