import minimatch from 'minimatch';
import path from 'path';
import { Application, Request, Response } from 'express';
import { IFixtureConfig, IRule } from './contracts';

export function MockDevServer(configPath: string = './mock-dev-server.config') {
  const fixtureConfig: IFixtureConfig = require(configPath);

  return function DevServerBefore(app: Application) {
    app.get(fixtureConfig.entry || '*', function (req: Request, res: Response) {
      const rule = getRule(req.originalUrl);

      if (rule) {
        setResponseHeaders(res, rule);
        setResponseBody(res, rule);
      } else {
        console.warn('No fixture found for \'' + req.originalUrl + '\'');
      }
    });
  };

  function getRule(url: string): IRule | null {
    const rules = fixtureConfig.rules;

    if (rules) {
      for (let i = 0, y = rules.length; i < y; i++) {
        const rule = rules[i];

        if (minimatch(url, rule.test)) {
          return rule;
        }
      }
    }

    return null;
  }

  function setResponseBody(res: Response, rule: IRule): void {
    const fixturePath = path.join(fixtureConfig.src || '', rule.filename);

    res.json(require(fixturePath));
  }

  function setResponseHeaders(res: Response, rule: IRule): void {
    if (rule.headers) {
      Object.keys(rule.headers).forEach(header => {
        // @ts-ignore
        res.setHeader(header, rule.headers[header])
      });
    }
  }
}

