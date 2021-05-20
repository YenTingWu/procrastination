import morgan from 'morgan';
import chalk from 'chalk';

export const morganMiddleware = morgan(function (tokens, req, res) {
  return [
    chalk.hex('#34ace0').bold(tokens.method(req, res)),
    chalk.hex('#34ace0').bold(tokens.url(req, res)),
    chalk.hex('#F56565').bold(tokens.status(req, res)),
    '\n',
    chalk.hex('#ED8936').bold(tokens['response-time'](req, res) + ' ms'),
    chalk.hex('#4FD1C5').bold('@ ' + tokens.date(req, res)),
    chalk.bold(tokens.res(req, res, 'content-type')),
    '\n',
  ].join(' ');
});
