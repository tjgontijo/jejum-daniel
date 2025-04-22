/**
 * Logger simples para a aplicação
 */
const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    console.log(`[INFO] ${message}`, meta || '');
  },
  
  error: (message: string, meta?: Record<string, any>) => {
    console.error(`[ERROR] ${message}`, meta || '');
  },
  
  warn: (message: string, meta?: Record<string, any>) => {
    console.warn(`[WARN] ${message}`, meta || '');
  },
  
  debug: (message: string, meta?: Record<string, any>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, meta || '');
    }
  }
};

export default logger;
