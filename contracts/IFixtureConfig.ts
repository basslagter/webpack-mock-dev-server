import IRule from './IRule';

export default interface IFixtureConfig {
  src?: string;
  entry?: string;
  rules?: IRule[];
}