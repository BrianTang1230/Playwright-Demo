# Playwright API and UI Automation Testing
## 📥 How to Download and View the Playwright Test Report
- After the workflow run is done running, click here to open the workflow run 👇
<img width="864" height="376" alt="2025-09-09 09 36 13" src="https://github.com/user-attachments/assets/75659bda-34ee-4ac6-b409-9f4de88bf763" />

&nbsp;

- Scroll down to the Artifacts section and download the report
<img width="1928" height="1080" alt="2025-09-09 09 50 47" src="https://github.com/user-attachments/assets/c389371d-b0ca-424f-8121-3b33127fa40e" />

&nbsp;

- Unzip the downloaded .zip file and click on index.html to view the report
<img width="1140" height="642" alt="2025-09-09 09 51 54" src="https://github.com/user-attachments/assets/5f4d3d6e-5138-4dcd-bf8f-e96dac7b0a27" />

⚠️ Important: You must extract the .zip before opening the report.

If you open it directly from the zip, screenshots and videos will not display correctly.

## UI failure diagnostics

When a UI test still fails after its configured retries, the report includes `ui-failure-diagnostics.json`. It records the test and current page, the error chain with form/phase metadata when available, and a bounded set of browser console and network signals. Sensitive URL query strings and common credential patterns are redacted. Collecting or attaching diagnostics is best-effort and does not change the test result. No AI service is called.

