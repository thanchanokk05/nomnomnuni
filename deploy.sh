#!/bin/bash
set -e

echo "🔨 Building Expo web app..."
npx expo export --platform web

echo "📄 Copying landing page into dist..."
mkdir -p dist/landing-page
cp landing.html dist/landing-page/index.html

echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo ""
echo "✅ Done!"
echo "   App      → https://nomnomuni-97584.web.app/"
echo "   Landing  → https://nomnomuni-97584.web.app/landing-page/"
