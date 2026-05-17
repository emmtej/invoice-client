import { describe, expect, it } from "vitest";
import { formatTime } from "./useTimer";

describe("formatTime", () => {
	it("should format milliseconds as MM:SS", () => {
		expect(formatTime(0)).toBe("00:00");
		expect(formatTime(1000)).toBe("00:01");
		expect(formatTime(61000)).toBe("01:01");
		expect(formatTime(599000)).toBe("09:59");
	});

	it("should format hours as HH:MM:SS when duration exceeds 1 hour", () => {
		expect(formatTime(3600000)).toBe("01:00:00");
		expect(formatTime(3661000)).toBe("01:01:01");
		expect(formatTime(35999000)).toBe("09:59:59");
	});

	it("should handle large durations", () => {
		expect(formatTime(360000000)).toBe("100:00:00");
	});
});
