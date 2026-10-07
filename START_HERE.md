# Start TrialBridge on your Mac

1. Open this folder in Finder and double-click **Start TrialBridge.command**.
   (First time only: if macOS says it cannot be opened, right-click the file, choose Open, then Open.)
2. A Terminal window opens. The first time it installs what it needs and downloads a small search model; this can take a few minutes. After that it starts in under a minute.
3. It then runs a quick **self-check** and prints PASS or FAIL for each item (home page, find page, trial data, search model, AI, offline worker). If everything passes, your browser opens at http://localhost:8787. If anything fails, the browser does not open and the window tells you which check failed.

You will see "TrialBridge is running at http://localhost:8787". Leave the window open while you use the app.

## Stop it
Press **Ctrl+C** in the Terminal window, or just close the window.

## Get all national trials (about 5,700)
By default the app uses the data already on this computer (a small sample the first time). For all cancer trials from ClinicalTrials.gov, open Terminal in this folder and run `npm run local:national`. The first run downloads data and takes a while; later runs are quick. Use `npm run local:seed` to go back to the small sample.

## AI keys (optional)
Without keys the app uses a built-in practice AI, which is fine for trying everything out. To use a real AI service, paste your keys into the file `.dev.vars` in this folder yourself (never share them in chat). The Terminal says whether real or practice AI is active.

## If something fails
- "Node is broken / libsimdjson": in Terminal run `brew reinstall node`, then double-click again.
- "Node not installed or too old": install Node 22 or newer from https://nodejs.org.
- "Port 8787 is in use": close the other copy of TrialBridge, or run `npm run local -- --port=8800`.
- Page looks out of date: run `npm run local -- --rebuild`.
- Already running and want to re-test: `npm run local:check`.
- Plan only, no changes: `npm run local -- --check`.
