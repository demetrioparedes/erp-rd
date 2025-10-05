#!/bin/bash
set -e

echo "🚀 Iniciando despliegue del ERP RD..."

cd nextjs-app
echo "📡 Aplicando migraciones..."
npx supabase db push --project-ref obdexnkzfklejnyhrgvc

SUPABASE_URL="https://obdexnkzfklejnyhrgvc.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iZGV4bmt6ZmtsZWpueWhyZ3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MDU3MTEsImV4cCI6MjA3NTE4MTcxMX0.7aPH6AXuIeN1iXrytG-qQrvBLEwZJno16RxiiiYPGZA"

echo "🌐 Desplegando en Vercel..."
vercel env add NEXT_PUBLIC_SUPABASE_URL $SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY $SUPABASE_ANON_KEY production
vercel --prod --confirm

cd ../python-service
echo "🐍 Desplegando microservicio en Railway..."
railway up --service dgii-service

echo "✅ ¡Despliegue completado!"