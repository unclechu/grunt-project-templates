#!/bin/bash
#
# Author: Viacheslav Lotsmanov
#

if [ ! "$PARENT_DEPLOY_SCRIPT" = true ]; then
    echo 'This script cannot be run independently.'
    echo 'Run parent deploy script.'
    exit 1
fi

info_inline "Deprivation of privileges group and others"
run_inline_answer chmod go-rwx ./ -R
