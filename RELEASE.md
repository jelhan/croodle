# Release

Releases are mostly automated using
[release-it](https://github.com/release-it/release-it/) and
[lerna-changelog](https://github.com/lerna/lerna-changelog/).

## Preparation

Since the majority of the actual release process is automated, the primary
remaining task prior to releasing is confirming that all pull requests that
have been merged since the last release have been labeled with the appropriate
`lerna-changelog` labels and the titles have been updated to ensure they
represent something that would make sense to our users. Some great information
on why this is important can be found at
[keepachangelog.com](https://keepachangelog.com/en/1.0.0/), but the overall
guiding principles here is that changelogs are for humans, not machines.

When reviewing merged PR's the labels to be used are:

* breaking - Used when the PR is considered a breaking change.
* enhancement - Used when the PR adds a new feature or enhancement.
* bug - Used when the PR fixes a bug included in a previous release.
* documentation - Used when the PR adds or updates documentation.
* i18n - Used when the PR adds new locales or improves existing translations.
* internal - Used for internal changes that still require a mention in the
  changelog/release notes.

## Release

Once the prep work is completed, the actual release is straight forward:

* First ensure that you have installed the project dependencies:
  
  ```sh
  pnpm install --frozen-lockfile
  ```

* Second, do your release:

  ```sh
  export GITHUB_AUTH="github-personal-access-token"
  pnpm run release
  ```

[release-it](https://github.com/release-it/release-it/) manages the actual
release process. It will prompt you through the process of choosing the version
number, tagging, pushing the tag and commits, building and bundling assets,
creating a release on GitHub etc.
