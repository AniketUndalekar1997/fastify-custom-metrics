### Issue Title
Default Metrics Prefix Not Always Applied in fastify-metrics v12.1.0 with Fastify v5

### Description
Custom metrics (`Histogram` and `Counter`) work correctly after adjustments, but default metrics sometimes lack the `prefix: 'sample_service_'` (e.g., `http_request_summary_seconds` instead of `sample_service_http_request_summary_seconds`). This was inconsistent in earlier tests but resolved in the latest example.

### Steps to Reproduce
1. Clone: [https://github.com/yourusername/fastify-custom-metrics-issue](https://github.com/yourusername/fastify-custom-metrics-issue)
2. Install: `npm install`
3. Start: `npm start`
4. Test: `curl -X POST http://localhost:3000/track-error`
5. Check: `curl http://localhost:3000/metrics`

### Expected Behavior
- Default: `sample_service_http_request_summary_seconds{...}`
- Custom: `custom_error_count{tenant="errorApp",...}`

### Actual Behavior (Earlier)
- Default metrics occasionally unprefixed: `http_request_summary_seconds`
- Custom error metric initially missing due to error handling; now fixed.

### Environment
- Node.js: [e.g., v18.19.0]
- Fastify: 5.0.0
- fastify-metrics: 12.1.0
- OS: [e.g., Windows 10]
