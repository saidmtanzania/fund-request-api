/* eslint-disable @typescript-eslint/no-explicit-any */
export default (fn: any) => (req: any, res: any, next: any) => {
  fn(req, res, next).catch(next);
};
