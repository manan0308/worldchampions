

git filter-branch --force --index-filter \

"git rm --cached --ignore-unmatch backend/.clinic/7531.clinic-bubbleprof/7531.clinic-bubbleprof-stacktrace" \

--prune-empty --tag-name-filter cat -- --all


