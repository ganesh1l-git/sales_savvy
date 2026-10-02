/**
 * Sales Savvy Performance Benchmark Script
 * Targets: 100 concurrent requests, response time < 2000 ms
 */

const http = require('http');

async function makeRequest(url) {
  const start = Date.now();
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const duration = Date.now() - start;
        resolve({
          statusCode: res.statusCode,
          duration,
          success: res.statusCode >= 200 && res.statusCode < 300,
        });
      });
    }).on('error', (err) => {
      resolve({
        statusCode: 500,
        duration: Date.now() - start,
        success: false,
        error: err.message,
      });
    });
  });
}

async function runBenchmark(concurrentUsers = 100) {
  console.log(`=======================================================`);
  console.log(`Starting Performance Benchmark: ${concurrentUsers} Concurrent Requests`);
  console.log(`Endpoint: http://localhost:8080/api/products?page=0&size=10`);
  console.log(`Target: 100 concurrent requests, response time < 2000 ms`);
  console.log(`=======================================================\n`);

  const url = 'http://localhost:8080/api/products?page=0&size=10';
  const overallStart = Date.now();

  const promises = [];
  for (let i = 0; i < concurrentUsers; i++) {
    promises.push(makeRequest(url));
  }

  const results = await Promise.all(promises);
  const totalElapsed = Date.now() - overallStart;

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  const durations = results.map((r) => r.duration).sort((a, b) => a - b);

  const min = durations[0];
  const max = durations[durations.length - 1];
  const avg = (durations.reduce((sum, d) => sum + d, 0) / durations.length).toFixed(2);
  const p95 = durations[Math.floor(durations.length * 0.95)];

  console.log(`Benchmark Results:`);
  console.log(`-------------------------------------------------------`);
  console.log(`Total Requests:         ${concurrentUsers}`);
  console.log(`Successful Requests:    ${successful}`);
  console.log(`Failed Requests:        ${failed}`);
  console.log(`Total Wall Clock Time:  ${totalElapsed} ms`);
  console.log(`Min Latency:            ${min} ms`);
  console.log(`Max Latency:            ${max} ms`);
  console.log(`Avg Latency:            ${avg} ms`);
  console.log(`P95 Latency:            ${p95} ms`);
  console.log(`Throughput:             ${((concurrentUsers / (totalElapsed / 1000))).toFixed(2)} req/sec`);
  console.log(`-------------------------------------------------------`);

  if (max < 2000 && failed === 0) {
    console.log(`\n Target Met! All ${concurrentUsers} concurrent requests finished under 2.0s without errors.`);
  } else {
    console.log(`\n Target Not Met. Max latency exceeded 2000 ms or requests failed.`);
  }
}

runBenchmark(100);
