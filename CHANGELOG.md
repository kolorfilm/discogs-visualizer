# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.8] - 2025-08-04

### Changed

- bump packages + dependencies to latest versions
- use latest node version in GitHub Actions workflow

### Fixed
- adjust jest config to fix "outdated JSX transform" warning when running tests

## [2.0.7] - 2024-10-24

### Changed

- migrate eslint to version 9

## [2.0.6] - 2023-09-06

### Changed

- use ts-node (instead of nodemon) for start (bundled) application in production

## [2.0.5]

### Changed

- bump packages + dependencies to latest versions
- change jest + tsconfig config to fit updated dependencies

## [2.0.2] - 2022-06-19

### Added

- simple github actions pipeline

## [2.0.1] - 2022-06-19

### Added

- unit tests for the frontend (more to be added)
- small styling improvements
- complete types for [OrdersPagination](./types/OrdersPagination.ts)

## [2.0.0] - 2022-06-18

### Changed

- complete refactoring: using [Next.js](https://nextjs.org/) + custom [Express](https://expressjs.com) server
