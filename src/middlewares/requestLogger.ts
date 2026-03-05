import type { IncomingMessage, ServerResponse } from "node:http";

import pinoHttp from "pino-http";

import { logger } from "#utils/logger";

type HttpRequest = IncomingMessage & {
  method?: string;
  url?: string;
  headers?: Record<string, unknown>;
  socket?: { remoteAddress?: string };
  connection?: { remoteAddress?: string };
};

type HttpResponse = ServerResponse<IncomingMessage> & {
  statusCode: number;
};

/**
 * Extrai o endereço IP do cliente.
 */
function getClientIp(req: unknown): string | undefined {
  if (!req || typeof req !== "object") {
    return undefined;
  }

  const headers = (req as { headers?: Record<string, unknown> }).headers;
  const forwardedFor = headers?.["x-forwarded-for"];

  if (typeof forwardedFor === "string") {
    const [ip] = forwardedFor.split(",");

    return ip?.trim();
  }

  if (Array.isArray(forwardedFor) && typeof forwardedFor[0] === "string") {
    const [ip] = forwardedFor;
    const [firstIp] = ip.split(",");

    return firstIp?.trim();
  }

  const socket = (req as { socket?: { remoteAddress?: string } }).socket;

  if (socket?.remoteAddress) {
    return socket.remoteAddress;
  }

  const connection = (req as { connection?: { remoteAddress?: string } }).connection;

  if (connection?.remoteAddress) {
    return connection.remoteAddress;
  }

  return undefined;
}

/**
 * Formata o tempo de resposta da requisição.
 */
function formatResponseTime(responseTime: unknown): string | undefined {
  if (typeof responseTime !== "number") {
    return undefined;
  }

  return `${Math.round(responseTime)}ms`;
}

/**
 * Middleware responsável por registrar logs de requisições HTTP.
 */
export const requestLogger = pinoHttp({
  logger,

  /**
   * Define o nível do log com base no status HTTP.
   */
  customLogLevel(_req: HttpRequest, res: HttpResponse, err?: Error) {
    if (err || res.statusCode >= 500) {
      return "error";
    }

    if (res.statusCode >= 400) {
      return "warn";
    }

    return "info";
  },

  /**
   * Mensagem exibida quando a requisição termina com sucesso.
   */
  customSuccessMessage: ((req: HttpRequest, res: HttpResponse, responseTime: number) => {
    const ip = getClientIp(req);
    const time = formatResponseTime(responseTime);

    if (time) {
      return `${req.method} ${req.url} -> ${res.statusCode} (${time}) ip=${ip ?? "-"}`;
    }

    return `${req.method} ${req.url} -> ${res.statusCode} ip=${ip ?? "-"}`;
  }) as unknown as (req: HttpRequest, res: HttpResponse) => string,

  /**
   * Mensagem exibida quando ocorre erro durante a requisição.
   */
  customErrorMessage: ((req: HttpRequest, res: HttpResponse, err: Error, responseTime: number) => {
    const ip = getClientIp(req);
    const time = formatResponseTime(responseTime);

    if (time) {
      return `${req.method} ${req.url} -> ${res.statusCode} (${time}) ip=${ip ?? "-"} (${
        err?.message ?? "error"
      })`;
    }

    return `${req.method} ${req.url} -> ${res.statusCode} ip=${ip ?? "-"} (${
      err?.message ?? "error"
    })`;
  }) as unknown as (req: HttpRequest, res: HttpResponse, err: Error) => string,

  /**
   * Serializadores utilizados para reduzir o volume de dados registrados no log.
   */
  serializers: {
    req(req: HttpRequest) {
      return {
        method: req.method,
        url: req.url,
        ip: getClientIp(req),
      };
    },

    res(res: HttpResponse) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});
