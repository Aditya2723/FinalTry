const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { WinstonInstrumentation } = require('@opentelemetry/instrumentation-winston');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

const provider = new NodeTracerProvider();
provider.register();

registerInstrumentations({
  instrumentations: [
    new WinstonInstrumentation({
      logHook: (span, record) => {
        record['resource.service.name'] = provider.resource.attributes['service.name'];
      },
    }),
  ],
});

const winston = require('winston');
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
})
logger.info('foobar');
