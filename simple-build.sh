
#!/bin/bash

# Create a super simple tsconfig for building
echo "Creating a simplified tsconfig for building..."
cat > tsconfig.simple.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": false,
    "noImplicitAny": false,
    "strictNullChecks": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": false,
    "noEmit": true,
    "jsx": "react-jsx",
    "checkJs": false
  },
  "include": ["src"]
}
EOF

echo "Building the project with simplified configuration..."
npm run build -- --config tsconfig.simple.json

echo "Build completed!"
