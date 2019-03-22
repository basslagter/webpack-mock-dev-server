export default interface IRule {
  test: string;
  filename: string;
  headers?: { [h: string]: string | number; };
}