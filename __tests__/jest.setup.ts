process.env.NODE_ENV = 'test';

export const awaitDb = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
