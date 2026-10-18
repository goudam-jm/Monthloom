# Releasing Monthloom

The npm package is `monthloom`. The source repository remains `goudam-jm/calendarJS`.

## First publish

Use Node.js 24 and npm 11.5.1 or newer. Authenticate interactively with `npm login`; complete the browser authentication and any npm 2FA prompts. Never commit credentials.

From a clean checkout of the reviewed release commit:

```sh
npm ci
npm run check
npm pack --dry-run
npm publish --access public
npm view monthloom version
```

The package's `prepublishOnly` hook runs the build and tests again before publication. `prepack` rebuilds the distributable. Package contents are restricted to the built exports, declarations, stylesheet, README, license, and manifest. Runtime dependencies are empty.

The initial 0.1.0 release can be bootstrapped manually from the PR branch once its commit is pushed. Merge that same commit into the default branch before starting the automated release cadence.

## Enable trusted publishing after bootstrap

In the npm package settings, add a GitHub Actions trusted publisher:

- GitHub owner: `goudam-jm`
- Repository: `calendarJS`
- Workflow filename: `publish.yml`
- Environment: leave blank (the workflow does not use a named environment)
- Allow direct publishing with `npm publish`

The publisher must be configured on npm before the workflow can publish. No long-lived npm token is required. GitHub-hosted runners use OIDC and generate provenance automatically. See the [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/).

## Subsequent releases

1. Create a release branch from the default branch. Run `npm version patch --no-git-tag-version` (or `minor`/`major` as appropriate); this updates the manifest and lockfile. Record release notes in the PR. While below 1.0, use a minor bump for breaking API changes and a patch bump for compatible fixes.
2. Run `npm run check` and `npm pack --dry-run`, then commit, open a PR, and merge after CI passes.
3. Create a GitHub release targeting the default branch with tag `v` followed by the package version, for example `v0.1.1`. Publishing the release triggers `.github/workflows/publish.yml`.
4. The workflow verifies that the tag matches the manifest version, installs locked dependencies, builds, tests, and publishes publicly using npm trusted publishing.
5. Verify `npm view monthloom version` and install the new version in a clean consumer project.

The workflow only handles releases targeting the default branch. This avoids accidentally publishing ordinary branch pushes. The manually bootstrapped 0.1.0 version must not be published again by the workflow: document that version with a release before enabling trusted publishing, or start automated releases at 0.1.1. npm versions are immutable; fixes require a new version. Never change a published version's source tag.
