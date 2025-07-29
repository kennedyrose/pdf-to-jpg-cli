#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { fromPath } = require('pdf2pic');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

async function getPdfDimensions(pdfPath) {
  try {
    const { stdout } = await execAsync(`pdfinfo "${pdfPath}"`);
    const lines = stdout.split('\n');
    const pageSizeLine = lines.find(line => line.startsWith('Page size:'));
    if (pageSizeLine) {
      const match = pageSizeLine.match(/(\d+(?:\.\d+)?) x (\d+(?:\.\d+)?)/);
      if (match) {
        return {
          width: Math.round(parseFloat(match[1])),
          height: Math.round(parseFloat(match[2]))
        };
      }
    }
  } catch (error) {
    console.warn(`Could not get PDF dimensions for ${path.basename(pdfPath)}, using default`);
  }
  return null;
}

async function convertPdfToJpg(pdfPath, outputDir, maxWidth = 1275) {
  try {
    const dimensions = await getPdfDimensions(pdfPath);
    
    const baseFilename = path.basename(pdfPath, '.pdf');
    const options = {
      density: 200,
      saveFilename: `${baseFilename}`,
      savePath: outputDir,
      format: 'jpg'
    };
    
    if (dimensions) {
      const aspectRatio = dimensions.height / dimensions.width;
      
      if (dimensions.width > maxWidth) {
        options.width = maxWidth;
        options.height = Math.round(maxWidth * aspectRatio);
      } else {
        const scaleFactor = maxWidth / dimensions.width;
        options.width = Math.round(dimensions.width * scaleFactor);
        options.height = Math.round(dimensions.height * scaleFactor);
      }
      
      console.log(`✓ Converted: ${path.basename(pdfPath)} (${options.width}x${options.height})`);
    } else {
      console.log(`✓ Converted: ${path.basename(pdfPath)}`);
    }
    
    const convert = fromPath(pdfPath, options);
    await convert.bulk(-1);
    
    // Rename the output file to remove the page number
    const generatedFile = path.join(outputDir, `${baseFilename}.1.jpg`);
    const targetFile = path.join(outputDir, `${baseFilename}.jpg`);
    
    if (fs.existsSync(generatedFile)) {
      fs.renameSync(generatedFile, targetFile);
    }
  } catch (error) {
    console.error(`✗ Failed to convert ${path.basename(pdfPath)}:`, error.message);
  }
}

async function convertAllPdfsInDirectory() {
  const currentDir = process.cwd();
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  let maxWidth = 1275;
  
  // Look for --width or -w flag
  const widthIndex = args.findIndex(arg => arg === '--width' || arg === '-w');
  if (widthIndex !== -1 && args[widthIndex + 1]) {
    const parsedWidth = parseInt(args[widthIndex + 1]);
    if (parsedWidth > 0) {
      maxWidth = parsedWidth;
    } else {
      console.error('Error: Width must be a positive number');
      process.exit(1);
    }
  }
  
  // Show help if requested
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
PDF to JPG Converter

Usage: node index.js [options]

Options:
  -w, --width <number>  Maximum width in pixels (default: 1275)
  -h, --help           Show this help message

Examples:
  node index.js                 # Convert with default width (1275px)
  node index.js -w 800          # Convert with max width of 800px
  node index.js --width 2000    # Convert with max width of 2000px
`);
    process.exit(0);
  }
  
  try {
    const files = fs.readdirSync(currentDir);
    const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
    
    if (pdfFiles.length === 0) {
      console.log('No PDF files found in current directory.');
      return;
    }
    
    console.log(`Found ${pdfFiles.length} PDF file(s). Converting with max width: ${maxWidth}px...`);
    
    for (const pdfFile of pdfFiles) {
      const pdfPath = path.join(currentDir, pdfFile);
      await convertPdfToJpg(pdfPath, currentDir, maxWidth);
    }
    
    console.log('Conversion complete!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

convertAllPdfsInDirectory();