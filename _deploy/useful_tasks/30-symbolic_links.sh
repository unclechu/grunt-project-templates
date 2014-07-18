#!/bin/bash
if [ -z "$PARENT_DEPLOY_SCRIPT" ]; then YOUR_SUBJECT="./_deploy/$(basename "$0")" WD="$(dirname "$0")/../" ../deploy.sh; exit "$?"; fi

# Creating relative symbolic links to master site directory
#
# Put serapator "#SYMBOLIC_LINKS_START#" to ".gitignore"
# Will be created symbolic links for all paths that after separator in .gitignore
#
# Put file ".source_of_symbolic_links" to site root for ignoring this action for master site

info "Creating symbolic links"
if [ -f '.source_of_symbolic_links' ]; then
	info "Is source of symbolic links [ SKIPPED ]"
elif ask "Create symbolic links to master project?"; then
	please_type "Please enter the relative path to master copy of this project"
	read master_path
	wait_separator=0
	cat ".gitignore" | while read line; do
		if [ "$line" == "#SYMBOLIC_LINKS_START#" ]; then
			wait_separator=1
		fi

		line=$(echo "$line" | sed -e 's/#.*$//g' | sed -e 's/\s\+$//g')
		count=$(echo "$line" | tr '/' '\n' | wc -l)
		up=

		for (( i=1; i<$count; i++ )); do
			up="../$up"
		done

		if [ $wait_separator -ne 0 ] && [ "$line" != "" ]; then
			if [ -h "$line" ] || ! test -e "$line"; then
				if [ -h "$line" ]; then
					info "rm \"$line\""
					rm "$line"
				fi

				file_in_master="${master_path}/${line}"
				relative_path="${up}${file_in_master}"
				if [ -f "$file_in_master" ] || [ -d "$file_in_master" ] || [ -L "$file_in_master" ]; then
					info "ln -s \"$relative_path\" \"$line\""
					ln -s "$relative_path" "$line"
				else
					info_err_clean "[ SKIPPED ] \"$relative_path\" is not exists"
				fi
			else
				info_err_clean "[ SKIPPED ] \"$line\" is not symbolic link"
			fi
		fi
	done
else
	info "[ SKIPPED ]"
fi
