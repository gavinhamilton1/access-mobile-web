#!/usr/bin/env node

/**
 * Generate React icon components for all SVG files in public/images
 */

const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');
const iconsDir = path.join(__dirname, '../src/components/icons');
const indexPath = path.join(iconsDir, 'index.ts');

// Get all SVG files
const svgFiles = fs.readdirSync(imagesDir)
  .filter(file => file.endsWith('.svg'))
  .sort();

console.log(`Found ${svgFiles.length} SVG files\n`);

const exports = [];
const existingFiles = new Set();

// Read existing index.ts to see what's already exported
if (fs.existsSync(indexPath)) {
  const existingContent = fs.readFileSync(indexPath, 'utf-8');
  const existingExports = existingContent.match(/export \{ (\w+) \}/g) || [];
  existingExports.forEach(exp => {
    const match = exp.match(/export \{ (\w+) \}/);
    if (match) existingFiles.add(match[1]);
  });
}

svgFiles.forEach(svgFile => {
  const svgPath = path.join(imagesDir, svgFile);
  const iconName = path.basename(svgFile, '.svg');
  const componentPath = path.join(iconsDir, `${iconName}.tsx`);

  // Skip if already exists
  if (existingFiles.has(iconName)) {
    console.log(`⏭️  Skipping ${iconName} (already exists)`);
    exports.push(`export { ${iconName} } from './${iconName}';`);
    return;
  }

  // Read SVG file
  const svgContent = fs.readFileSync(svgPath, 'utf-8');

  // Extract viewBox
  const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 -960 960 960';

  // Extract all path elements (handle both <path> and <Path>)
  const pathMatches = svgContent.match(/<path[^>]*>/gi) || [];
  const paths = pathMatches.map(pathTag => {
    const dMatch = pathTag.match(/d=["']([^"']+)["']/i);
    return dMatch ? dMatch[1] : null;
  }).filter(Boolean);

  // Extract rect elements (for some SVGs that use rects)
  const rectMatches = svgContent.match(/<rect[^>]*>/gi) || [];
  const rects = rectMatches.map(rectTag => {
    const attrs = {};
    ['x', 'y', 'width', 'height', 'rx', 'ry'].forEach(attr => {
      const match = rectTag.match(new RegExp(`${attr}=["']([^"']+)["']`, 'i'));
      if (match) attrs[attr] = match[1];
    });
    return Object.keys(attrs).length > 0 ? attrs : null;
  }).filter(Boolean);

  // Extract circle elements
  const circleMatches = svgContent.match(/<circle[^>]*>/gi) || [];
  const circles = circleMatches.map(circleTag => {
    const attrs = {};
    ['cx', 'cy', 'r'].forEach(attr => {
      const match = circleTag.match(new RegExp(`${attr}=["']([^"']+)["']`, 'i'));
      if (match) attrs[attr] = match[1];
    });
    return Object.keys(attrs).length > 0 ? attrs : null;
  }).filter(Boolean);

  if (paths.length === 0 && rects.length === 0 && circles.length === 0) {
    console.log(`⚠️  Skipping ${iconName} (no paths/rects/circles found)`);
    return;
  }

  // Generate component code
  const elements = [];

  // Add paths
  paths.forEach(d => {
    elements.push(`    <path d="${d}" />`);
  });

  // Add rects
  rects.forEach(rect => {
    const attrs = Object.entries(rect)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    elements.push(`    <rect ${attrs} />`);
  });

  // Add circles
  circles.forEach(circle => {
    const attrs = Object.entries(circle)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    elements.push(`    <circle ${attrs} />`);
  });

  const elementsJSX = elements.join('\n');

  const componentCode = `import React from 'react';
import { Icon, IconProps } from './Icon';

export const ${iconName}: React.FC<Omit<IconProps, 'children'>> = (props) => (
  <Icon {...props}${viewBox !== '0 -960 960 960' ? ` viewBox="${viewBox}"` : ''}>
${elementsJSX}
  </Icon>
);
`;

  // Write component file
  fs.writeFileSync(componentPath, componentCode);
  console.log(`✓ Created ${iconName}.tsx`);

  exports.push(`export { ${iconName} } from './${iconName}';`);
});

// Update index.ts
const indexContent = `// Export all icons for easy importing
export { Icon, type IconProps } from './Icon';
${exports.sort().join('\n')}
`;

fs.writeFileSync(indexPath, indexContent);
console.log(`\n✓ Updated index.ts with ${exports.length} exports`);

console.log(`\n✅ Done! Generated ${svgFiles.length} icon components.`);

