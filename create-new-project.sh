#!/bin/bash
#
# Author: Viacheslav Lotsmanov
# License: GPLv3
#

SUBM_REPO="https://github.com/unclechu/grunt-project-templates/"
SUBM_NAME="grunt-template"
SUBM_BRANCH="markup" # default value

THIS_FILENAME="create-new-project.sh"

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

# get first element in array (by delimiter)
function get_delim_first {
    echo "$1" | sed -e 's/^\([^:]\+\).*$/\1/'
}

function remove_delim_first {
    item=$(echo "$1" | sed -e 's/^\([^:]\+\).*$/\1/')
    echo "${1:$[${#item}+1]}"
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
run cd "./$SUBM_NAME/"
run git checkout "$SUBM_BRANCH"
run cd ..
run git add "./.gitmodules" "$SUBM_NAME"
run git commit -m "$SUBM_NAME submodule"

run ln -s "./$SUBM_NAME/Gruntfile.js"
run ln -s "./$SUBM_NAME/deploy.sh"

arr="$(ls "./$SUBM_NAME/" \
    | grep -iv README \
    | grep -iv node_modules \
    | grep -iv LICENSE \
    | grep -iv grunt \
    | grep -ivF deploy.sh \
    | grep -ivF "$THIS_FILENAME" \
    | tr '\n' ':')"
while true; do
    [ -z "$arr" ] && break
    item=$(get_delim_first "$arr")
    arr=$(remove_delim_first "$arr")

    if [ -d "./$SUBM_NAME/$item" ]; then
        run cp "./$SUBM_NAME/$item/" ./ -R
    else
        run cp "./$SUBM_NAME/$item" ./
    fi
done

run cp "./$SUBM_NAME/.gitignore" ./

run npm install

echo -e "${clr_ok}Success! Project created by template \"$SUBM_BRANCH\".${clr_end}"

if [ -f "$THIS_FILENAME" ]; then
    ask "Remove \"${clr_info}${THIS_FILENAME}${clr_ask}\" script?" && rm "$THIS_FILENAME"
fi
exit 0

# vim:set ts=4 sw=4 et:
