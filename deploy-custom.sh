#!/bin/bash
#
# Author: Viacheslav Lotsmanov
# License: GNU/GPLv3 by Free Software Foundation
#

if [ ! "$PARENT_DEPLOY_SCRIPT" = true ]; then
    echo 'This script cannot be run independently.'
    echo 'Run parent deploy script.'
    exit 1
fi

not_indexed="./dev_files/not_indexed"

info_inline "Deprivation of privileges group and others"
run_inline_answer chmod go-rwx -R .

safe_perm_dir="0700"
safe_perm_file="0600"

if [ ! -d "$not_indexed" ]; then
    info_inline "Creating '$not_indexed' directory"
    run_inline_answer mkdir --parent "$not_indexed"
    info_inline "Set safe permissions for '$not_indexed' directory"
    run_inline_answer chmod "$safe_perm_dir" "$not_indexed"
fi
