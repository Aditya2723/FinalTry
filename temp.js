const { NodeTracerProvider } = require('@opentelemetry/sdk-node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { LokiExporter } = require('@opentelemetry/exporter-loki');
const { trace } = require('@opentelemetry/api');

const provider = new NodeTracerProvider();


const lokiExporter = new LokiExporter({
  endpoint: 'http://localhost:3100/loki/api/v1/push', 
});

provider.addSpanProcessor(new SimpleSpanProcessor(lokiExporter));
provider.register();

const tracer = trace.getTracer('my-application');


const span = tracer.startSpan('Custom Log');
const logMessage = 'This is a meaningful log message';


lokiExporter.export([{ 
  streams: [{
    labels: {
      key: 'value',
    },
    entries: [{ 
      ts: new Date().toISOString(),
      line: logMessage,
    }],
  }],
}]);

span.end();