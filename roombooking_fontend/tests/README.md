# Frontend tests

Create React App discovers tests under src, so the runnable Jest suites live in src/tests and src/App.test.js. Run them with:

    npm test -- --watchAll=false --runInBand

Coverage includes route guards, the Bearer/refresh interceptor, booking form payloads, multipart CRUD requests, attachments, and notification mutations.
