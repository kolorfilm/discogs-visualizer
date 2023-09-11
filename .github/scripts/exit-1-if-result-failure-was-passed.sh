#!/usr/bin/env bash

# This script is used to evaluate the result of the jobs that a job depends on (`needs`).
#
# The script expects a string containing the JSON of the `needs` as a parameter. Example invocation:
# `./exit-1-if-result-failure-was-passed.sh "{ e2e_tests: { result: failure, outputs: {} } }"`
# If one of the `needs` had the result "failure", the script exits with 1. Otherwise, it exits with 0.

# Assign the parameters to constants to improve readability.
NEEDS_JSON="$1"

# Echo the passed JSON for easier debugging
echo "Evaluating the following JSON for failures:"
echo "$NEEDS_JSON"

if echo "$NEEDS_JSON" | grep -q "result: failure"; then
  echo "One or more jobs seem to have failed."
  exit 1
elif echo "$NEEDS_JSON" | grep -q "result: skipped"; then
    echo "One or more jobs seem to have been skipped."
    exit 1
else
  echo "Looks like all jobs succeeded."
  exit 0
fi
