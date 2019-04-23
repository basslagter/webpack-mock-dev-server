import minimatch from 'minimatch';
import path from 'path';
import { Application, NextFunction, Request, Response } from 'express';
import { IFixtureConfig, IRule } from './contracts';

const DEFAULT_METHOD = 'GET';

export function MockDevServer(configPath: string = './mock-dev-server.config') {
  const fixtureConfig: IFixtureConfig = require(configPath);

  return function DevServerBefore(app: Application) {
    app.all(fixtureConfig.entry || '*', function (req: Request, res: Response, next: NextFunction) {
      const { method, originalUrl } = req;
      const rule = getRule(req);

      if (rule) {
        setResponseHeaders(res, rule);
        setResponseBody(res, rule);
      } else {
        console.warn(`No rule found for ${method} '${originalUrl}'`);
        next();
      }
    });
  };

  function getRule(req: Request): IRule | null {
    const { method, originalUrl } = req;
    const rules = fixtureConfig.rules;

    if (rules) {
      for (let i = 0, y = rules.length; i < y; i++) {
        const rule = rules[i];

        if (isMatch(rule)) {
          return rule;
        }
      }
    }

    function isMatch(rule: IRule) {
      return (isMethodMatch(rule) && isTestMatch(rule));
    }

    function isMethodMatch(rule: IRule) {
      const ruleMethod = rule.method || DEFAULT_METHOD;

      return (ruleMethod === method);
    }

    function isTestMatch(rule: IRule) {
      return minimatch(originalUrl, rule.test);
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

