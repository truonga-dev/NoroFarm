from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.resources import Resource
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from fastapi import FastAPI
from app.core.config import settings

def setup_telemetry(app: FastAPI):
    """
    Cấu hình OpenTelemetry để tracing (Jaeger/Zipkin)
    """
    if not settings.OTLP_ENDPOINT:
        return

    resource = Resource.create(attributes={
        "service.name": settings.PROJECT_NAME
    })

    provider = TracerProvider(resource=resource)
    processor = BatchSpanProcessor(OTLPSpanExporter(endpoint=settings.OTLP_ENDPOINT, insecure=True))
    provider.add_span_processor(processor)
    trace.set_tracer_provider(provider)

    FastAPIInstrumentor.instrument_app(app)
    # SQLAlchemyInstrumentor().instrument(engine=...) # Sẽ được bind sau
