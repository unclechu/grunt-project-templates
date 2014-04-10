#!/bin/bash
#
# Author: Viacheslav Lotsmanov
# License: GPLv3
#

SUBM_REPO="https://github.com/unclechu/grunt-project-templates/"
SUBM_NAME="grunt-template"
SUBM_BRANCH="markup" # default value

clr_info='\e[0;36m'
clr_ok='\e[0;32m'
clr_ask='\e[0;34m'
clr_err='\e[0;31m'
clr_end='\e[0m'

function ok {
    echo -e "${clr_ok}[ OK ]${clr_end}"
    return 0
}

function err {
    echo -e "${clr_err}[ ERR ]${clr_end}" 1>&2
    exit 1
}

function run {
    echo -e "${clr_info}${@}${clr_end} ... "
    "$@" && ok || err
    return 0
}

function ask {
    echo -en "${clr_ask}${@}${clr_end} [Y/n] "
    read answer

    if echo "$answer" | grep -i '^y\(es\)\?$' &>/dev/null; then
        return 0
    elif echo "$answer" | grep -i '^n\(o\)\?$' &>/dev/null; then
        return 1
    else
        echo -e "${clr_err}Incorrect answer!${clr_end}" 1>&2
        exit 1
    fi
}

if [ -z "$1" ]; then
    if ask "You not specify branch of template in first argument," \
           "use the \"${clr_info}markup${clr_ask}\" template branch?"; then
        run "$0" "$SUBM_BRANCH"
        exit $?
    else
        exit 1
    fi
else
    SUBM_BRANCH="$1"
fi

run git init
run git submodule add "$SUBM_REPO" "$SUBM_NAME"
run git config -f "./.gitmodules" "submodule.${SUBM_NAME}.branch" "$SUBM_BRANCH"
run git submodule update --init
run git add "./.gitmodules" "$SUBM_NAME"
run git commit -m "$SUBM_NAME submodule"

run ln -s "./$SUBM_NAME/Gruntfile.js"
run ln -s "./$SUBM_NAME/deploy.sh"

run ls "./$SUBM_NAME/" \
    | grep -iv README \
    | grep -iv node_modules \
    | grep -iv LICENSE \
    | grep -iv grunt \
    | grep -iv init \
    | xargs -I {} cp "./$SUBM_NAME/{}" ./ -R

run cp "./$SUBM_NAME/.gitignore" ./

run npm install

echo -e "${clr_ok}Success! Project created by template \"$SUBM_BRANCH\".${clr_end}"

ask "Remove \"${clr_info}${0}${clr_ask}\" script?" && rm "$0"
exit 0

# vim:set ts=4 sw=4 et:
