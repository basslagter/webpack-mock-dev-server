export default interface IRule {
  method?: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'OPTIONS';
  test: string;
  filename: string;
  headers?: { [h: string]: string | number; };
}