import type { Server } from 'miragejs';

export function startServer(config: {
  environment?: 'test' | 'development';
}): Server;
