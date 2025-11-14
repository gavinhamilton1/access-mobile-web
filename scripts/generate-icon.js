#!/usr/bin/env node

/**
 * Helper script to generate React icon components from SVG files
 * 
 * Usage: node scripts/generate-icon.js <icon-name>
 * Example: node scripts/generate-icon.js Home
 * 
 * This will:
 * 1. Read public/images/<icon-name>.svg
 * 2. Extract the path elements
 * 3. Generate src/components/icons/<icon-name>.tsx
 * 4. Update src/components/icons/index.ts
 */

const fs = require('fs');
const path = require('path');

const iconName = process.argv[2];

if (!iconName) {
  console.error('Usage: node scripts/generate-icon.js <icon-name>');
  console.error('Example: node scripts/generate-icon.js Home');
  process.exit(1);
}

const svgPath = path.join(__dirname, '../public/images', `${iconName}.svg`);
const outputPath = path.join(__dirname, '../src/components/icons', `${iconName}.tsx`);
const indexPath = path.join(__dirname, '../src/components/icons/index.ts');

if (!fs.existsSync(svgPath)) {
  console.error(`SVG file not found: ${svgPath}`);
  process.exit(1);
}

// Read SVG file
const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Extract viewBox
const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 -960 960 960';

// Extract all path elements
const pathMatches = svgContent.match(/<path[^>]*>/g) || [];
const paths = pathMatches.map(path => {
  const dMatch = path.match(/d="([^"]+)"/);
  return dMatch ? dMatch[1] : null;
}).filter(Boolean);

if (paths.length === 0) {
  console.error('No path elements found in SVG');
  process.exit(1);
}

// Generate component code
const componentName = iconName;
const pathsJSX = paths.map((d, i) => `    <path d="${d}" />`).join('\n');

const componentCode = `import React from 'react';
import { Icon, IconProps } from './Icon';

export const ${componentName}: React.FC<Omit<IconProps, 'children'>> = (props) => (
  <Icon {...props}${viewBox !== '0 -960 960 960' ? ` viewBox="${viewBox}"` : ''}>
${pathsJSX}
  </Icon>
);
`;

// Write component file
fs.writeFileSync(outputPath, componentCode);
console.log(`✓ Created ${outputPath}`);

// Update index.ts
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf-8');
  
  // Check if already exported
  if (indexContent.includes(`export { ${componentName} }`)) {
    console.log(`⚠ ${componentName} already exported in index.ts`);
  } else {
    // Add export before the last line
    const lines = indexContent.split('\n');
    const lastExportIndex = lines.findLastIndex(line => line.startsWith('export {'));
    if (lastExportIndex >= 0) {
      lines.splice(lastExportIndex + 1, 0, `export { ${componentName} } from './${componentName}';`);
      fs.writeFileSync(indexPath, lines.join('\n'));
      console.log(`✓ Updated ${indexPath}`);
    }
  }
}

console.log(`\n✓ Icon component generated successfully!`);
console.log(`\nUsage:`);
console.log(`  import { ${componentName} } from '@/components/icons';`);
console.log(`  <${componentName} size={24} color="currentColor" />`);

