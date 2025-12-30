#!/bin/bash
# AtlasDev Clean Deployment Script
# Run this from: /workspaces/atlas-dev-app/atlasdev-build

echo "=== AtlasDev Clean Deployment ==="
echo ""

# Step 1: Clean up any existing extracted folders
echo "1. Cleaning up old extractions..."
rm -rf complete-app/
rm -rf atlasdev-complete-app/

# Step 2: Unzip fresh copy
echo "2. Extracting fresh package..."
unzip -o atlasdev-complete-app.zip

# Step 3: Remove duplicate/old files from src
echo "3. Removing old component files..."
rm -f src/components/TopNavigation.jsx
rm -f src/components/ProjectSidebar.jsx
rm -f src/components/OpportunitySidebar.jsx
rm -f src/components/EntityAccountingSidebar.jsx
rm -f src/components/AdminSidebar.jsx
rm -f src/components/UserSettingsSidebar.jsx

# Step 4: Remove old page directories to prevent duplicates
echo "4. Cleaning old page directories..."
rm -rf src/pages/admin/
rm -rf src/pages/accounting/
rm -rf src/pages/investors/
rm -rf src/pages/operations/
rm -rf src/pages/user-settings/
rm -rf src/pages/pipeline/
rm -rf src/pages/projects/

# Step 5: Create fresh directories
echo "5. Creating fresh directories..."
mkdir -p src/pages/admin
mkdir -p src/pages/accounting
mkdir -p src/pages/investors
mkdir -p src/pages/operations
mkdir -p src/pages/user-settings

# Step 6: Copy all files
echo "6. Copying components..."
cp -f complete-app/components/*.jsx src/components/

echo "7. Copying App.jsx..."
cp -f complete-app/App.jsx src/

echo "8. Copying root pages..."
cp -f complete-app/pages/*.jsx src/pages/

echo "9. Copying admin pages..."
cp -f complete-app/pages/admin/*.jsx src/pages/admin/

echo "10. Copying accounting pages..."
cp -f complete-app/pages/accounting/*.jsx src/pages/accounting/

echo "11. Copying investor pages..."
cp -f complete-app/pages/investors/*.jsx src/pages/investors/

echo "12. Copying operations pages..."
cp -f complete-app/pages/operations/*.jsx src/pages/operations/

echo "13. Copying user-settings pages..."
cp -f complete-app/pages/user-settings/*.jsx src/pages/user-settings/

# Step 7: Clean up extraction
echo "14. Cleaning up extracted folder..."
rm -rf complete-app/

# Step 8: Clear Vite cache
echo "15. Clearing Vite cache..."
rm -rf node_modules/.vite

# Step 9: Verify file counts
echo ""
echo "=== Verification ==="
echo "Components: $(ls -1 src/components/*.jsx 2>/dev/null | wc -l) files"
echo "Root Pages: $(ls -1 src/pages/*.jsx 2>/dev/null | wc -l) files"
echo "Admin Pages: $(ls -1 src/pages/admin/*.jsx 2>/dev/null | wc -l) files"
echo "Accounting Pages: $(ls -1 src/pages/accounting/*.jsx 2>/dev/null | wc -l) files"
echo "Investor Pages: $(ls -1 src/pages/investors/*.jsx 2>/dev/null | wc -l) files"
echo "Operations Pages: $(ls -1 src/pages/operations/*.jsx 2>/dev/null | wc -l) files"
echo "User Settings Pages: $(ls -1 src/pages/user-settings/*.jsx 2>/dev/null | wc -l) files"
echo ""
echo "Total JSX files: $(find src -name '*.jsx' | wc -l)"

# Step 10: Check for duplicates
echo ""
echo "=== Checking for Duplicates ==="
DUPES=$(find src -name "*.jsx" | xargs -I {} basename {} | sort | uniq -d)
if [ -z "$DUPES" ]; then
    echo "✅ No duplicate filenames found"
else
    echo "⚠️ Duplicate filenames detected:"
    echo "$DUPES"
    echo ""
    echo "Locations:"
    for dupe in $DUPES; do
        find src -name "$dupe"
    done
fi

echo ""
echo "=== Deployment Complete ==="
echo "Run 'npm run dev' to start the development server"
