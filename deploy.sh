#!/bin/bash

PROJECT_ID=activate-website-2

echo
echo "Project ID: $PROJECT_ID" 
echo
echo "Type of deployment:"
echo 
echo " 1 = only hosting"
echo " 2 = only function"
echo " 3 = complete project"
echo
echo "Please, choose the deployment method [1/2/3]:"

read typeofdep

case $typeofdep in
1)
echo "Only hosting deployment"
firebase deploy --only hosting --project $PROJECT_ID
;;
2)
echo "Only functions deployment"
firebase deploy --only functions --project $PROJECT_ID
;;
3)
echo "Complete project"
firebase deploy  --project $PROJECT_ID
;;
*)
echo "No matching method found"
;;
esac
