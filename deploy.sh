#!/bin/bash
#
# Author: Viacheslav Lotsmanov
# License: GNU/GPLv3 by Free Software Foundation
#

PARENT_DEPLOY_SCRIPT=true

clr_info='\e[0;36m'
clr_ok='\e[0;32m'
clr_ask='\e[0;34m'
clr_err='\e[1;31m'
clr_end='\e[0m'

# private
# args:
#   $1 - additional flags for 'echo'
#   $2 - write to (1 - stdout, 2 - stderr)
#   $3 - color
#   $4 - suffix (no color)
#   $@ - info text
function _info_pattern {
    color="$clr_info"

    flags=$1
    shift
    write_to=$1
    shift
    color=$1
    shift
    suffix=$1
    shift

    echo -e $flags "${color}${@}${clr_end}${suffix}" 1>&$write_to
}

# simple info

function info {
    _info_pattern "" 1 "$clr_info" " ... " "$@"
}

function info_ok {
    _info_pattern "" 1 "$clr_ok" " ... " "$@"
}

function info_err {
    _info_pattern "" 2 "$clr_err" " ... " "$@"
}

# inline info

function info_inline {
    _info_pattern "-n" 1 "$clr_info" " ... " "$@"
}

function info_ok_inline {
    _info_pattern "-n" 1 "$clr_ok" " ... " "$@"
}

function info_err_inline {
    _info_pattern "-n" 2 "$clr_err" " ... " "$@"
}

# info clean

function info_clean {
    _info_pattern "" 1 "$clr_info" "" "$@"
}

function info_ok_clean {
    _info_pattern "" 1 "$clr_ok" "" "$@"
}

function info_err_clean {
    _info_pattern "" 2 "$clr_err" "" "$@"
}

# info inline clean

function info_inline_clean {
    _info_pattern "-n" 1 "$clr_info" "" "$@"
}

function info_inline_ok_clean {
    _info_pattern "-n" 1 "$clr_ok" "" "$@"
}

function info_inline_err_clean {
    _info_pattern "-n" 2 "$clr_err" "" "$@"
}

# run wrappers

function run_inline_answer_silent {
    errlog=$("${@}" 2>&1)
    if [ $? -ne 0 ]; then
        err 1
        info_clean "Command: '${@}'"
        info_err_clean "Error log: '${errlog}'"
        exit 1
    fi
}

function run_inline_answer {
    run_inline_answer_silent "${@}"
    ok
}

# statuses

function ok {
    echo -e "${clr_ok}[ OK ]${clr_end}"
    return 0
}

function err {
    echo -e "${clr_err}[ ERR ]${clr_end}" 1>&2
    [ -z $1 ] && exit 1
}

function ask {
    echo -en "${clr_ask}${@}${clr_end} [Y/n] "
    read answer

    if echo "$answer" | grep -i '^y\(es\)\?$' &>/dev/null; then
        return 0
    elif echo "$answer" | grep -i '^n\(o\)\?$' &>/dev/null; then
        return 1
    else
        info_err_clean "Incorrect answer!"
        exit 1
    fi
}

function please_type {
    echo -en "${clr_ask}${@}${clr_end}: "
}

# default deploy actions

info_inline "Checking for grunt"
if [ -e ./node_modules/.bin/grunt ]; then ok; else
    err 1;
    info_err_clean "No grunt!" \
        "You need to do \`${clr_info}npm install${clr_err}\`" \
        "before deploy script!"

    if ask "Do \`${clr_info}npm install${clr_ask}\` now?"; then
        if ! npm install; then exit 1; fi
        exit 0
    else
        info_clean "You need to do \`${clr_ask}npm install${clr_info}\` first."
        exit 1
    fi
fi

info_inline "Creating symbolic link to grunt-cli"
rm ./grunt &>/dev/null
if ln -s ./node_modules/.bin/grunt ./grunt &>/dev/null; then ok; else err; fi

info "Starting grunt default tasks"
if ./grunt; then
    info_inline "Grunt default tasks status:"; ok;
else err; fi

# custom deploy actions

info_inline "Deprivation of privileges group and others"
run_inline_answer chmod -R go-rwx .

# finishing of deploying

info_ok_clean "This repository is successfully deployed!"
exit 0

# vim:set ts=4 sw=4 et:
