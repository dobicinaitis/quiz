#!/bin/bash

# read variables from file if it's provided as an input argument
if [[ -n "$1" ]]; then
    ENV_FILE="$1"
    if [ -f $ENV_FILE ]; then
       # wraps needed values in quotes and exposed the variables
       eval "$(grep -Ev "^#" $ENV_FILE | sed '/="/! s/\(=\)\(.*$\)/\1"\2"/g;/^$/d ')"
    else
       echo "File [$ENV_FILE] does not exist"
       exit 1
    fi
fi

# create or update secrets
cat <<EOF | kubectl --namespace=quiz replace --force -f -
apiVersion: v1
kind: Secret
metadata:
  name: quiz-env-production
type: Opaque
data:
  NONE_YET: $(echo -n "$NONE_YET" | base64 -w0)
EOF
