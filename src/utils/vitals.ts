import { type Metric, onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

export type MetricReporter = (metric: Metric) => void;

const defaultReporter: MetricReporter = import.meta.env.DEV
	? (metric) => {
			console.info("[web-vitals]", metric.name, metric.value, metric);
		}
	: () => {
			/* no-op in production until an analytics endpoint is wired */
		};

export function reportWebVitals(reporter: MetricReporter = defaultReporter) {
	onCLS(reporter);
	onFCP(reporter);
	onLCP(reporter);
	onTTFB(reporter);
	onINP(reporter);
}
