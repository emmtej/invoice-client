// Spring Boot Response
// {
//   "timestamp": "2026-01-20T18:59:36Z",
//   "status": 400,
//   "error": "Bad Request",
//   "message": "Validation failed for object='user'. Error count: 1",
//   "path": "/api/v1/users",
//   "errors": [
//     {
//       "field": "email",
//       "message": "Email should be a valid address",
//       "rejectedValue": "invalid-email"
//     }
//   ]
// }

export interface ApiErrorResponse {
	timestamp: string; // ISO 8601 string
	status: number; // HTTP Status Code (e.g., 400)
	error: string; // HTTP Error phrase (e.g., "Bad Request")
	message: string; // Human-readable message
	path: string; // The endpoint that triggered the error
	errors?: ValidationError[]; // Optional: only present in validation scenarios
}

/**
 * Represents specific field-level validation failures.
 */
export interface ValidationError {
	field: string;
	message: string;
	rejectedValue?: unknown; // The value that caused the validation to fail
}
