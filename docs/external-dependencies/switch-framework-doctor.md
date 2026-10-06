## Switch Framework Doctor

**`switch-framework-doctor@0.3.0`** is the health check for a Switch app. It is the Expo Doctor equivalent: one command that reads your **app**, compares installed first-party versions, and reports peer mismatches **before** the browser hits a blank screen.

It is a **CLI**, not a runtime import. Do **not** add it to `switchFramework.imports`. The backend never serves it to the browser.

> [!TIP]
> Scaffold with `npx create-switch-framework-app my-app` and accept the doctor prompt, or pass `--doctor`. Then run `npx switch-framework-doctor` from the app root.

### What it checks

- `switch-framework` is installed and readable
- `switch-framework-backend` is on the same **major.minor** line (0.3 with 0.3)
- `switch-framework-icons` and `switch-framework-router` match that line (CLI-installed first-party packs)
- `switch-framework-electron` matches that line **when the app depends on it**
- Node is 18+
- Every name in `switchFramework.imports` is installed
- Each allowlisted package’s `peerDependencies.switch-framework` **satisfies** the installed framework version
- Fail packages that nest `switch-framework` under `dependencies` (two state stores)

It does **not** scaffold an app (`create-switch-framework-app`) and it does **not** serve the browser (`switch-framework-backend`).

### Install

From the create-app CLI:

```bash title:Scaffold (asks about doctor)
npx create-switch-framework-app my-app
# Also install switch-framework-doctor? (npx switch-framework-doctor)
```

Or add it to an existing Switch app:

```bash title:Existing app
npm i -D switch-framework-doctor
```

```json title:package.json
{
  "scripts": {
    "doctor": "switch-framework-doctor"
  }
}
```

You can also run it without a project dependency:

```bash title:npx
npx switch-framework-doctor
```

### Commands

```bash title:Commands
npx switch-framework-doctor
npx switch-framework-doctor check
npx switch-framework-doctor --json
npx switch-framework-doctor --fix
npx switch-framework-doctor --cwd /path/to/app
npx switch-framework-doctor -h
```

```params-table
{"headers":["Command / flag","What it does"],"htmlColumns":[0,1],"rows":[["<code>check</code>","Default. Run health checks and print a human report"],["<code>--json</code>","Machine-readable results for CI. Exit <code>1</code> when any check fails"],["<code>--fix</code>","Safe first-party / missing-install fixes only. Never auto-edits the allowlist"],["<code>--cwd &lt;dir&gt;</code>","App or <code>switch-framework</code> package root (default: current directory)"],["<code>-h</code>, <code>--help</code>","Show help"]]}
```

`check` is the default. `--fix` installs missing allowlisted packages and aligns first-party versions (`switch-framework`, backend, icons, router, electron). Peer mismatches for **third-party** packs print a hint and stay manual.

### Example

```text title:Healthy app
✔ Project my-app (app)
✔ Node 22.17.1
✔ switch-framework@0.3.0
✔ switch-framework-backend@0.3.0 matches 0.3
✔ switch-framework-icons@0.3.0 matches 0.3
✔ switch-framework-router@0.3.0 matches 0.3
✔ @faiz/tw-masonry@0.1.0 peer switch-framework@>=0.3.0 satisfies 0.3.0
```

### CI

```yaml title:.github/workflows/doctor.yml (sketch)
- run: npx switch-framework-doctor --json
```

`--json` prints the findings object. A failed check sets exit code `1`.

### Do not

- Allowlist `switch-framework-doctor` in `switchFramework.imports` — it is Node-only.
- Expect `--fix` to rewrite a third-party package’s `peerDependencies` or nested `dependencies.switch-framework`.
- Treat doctor as a substitute for restarting the backend after you change `imports`.

Related: [[CLI|docs/cli]] · [[Importing packages|docs/external-dependencies]] · [[Allowlisting in package.json|docs/external-dependencies/package-json]]
