# PDF to JPG CLI

A Node.js CLI tool that converts all PDF files in the current directory to high-quality JPG images with customizable maximum width. Useful for mass generating thumbnails.

## Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Navigate to a directory containing PDF files and run:

```bash
node index.js [options]
```

### Options

- `-w, --width <number>` - Maximum width in pixels (default: 1275)
- `-h, --help` - Show help message

### Examples

```bash
# Convert with default max width (1275px)
node index.js

# Convert with custom max width (800px)
node index.js -w 800

# Convert with custom max width (2000px)  
node index.js --width 2000

# Show help
node index.js --help
```

### Global Installation

Install globally to use the `pdf-to-jpg` command:

```bash
npm install -g .
pdf-to-jpg -w 1500
```

## Features

- Converts all PDF files in the current directory to JPG format
- High-quality output at 200 DPI
- Maintains original aspect ratio
- Customizable maximum width with automatic height scaling
- Shows conversion progress and final dimensions
- Automatic PDF dimension detection

## Requirements

- Node.js
- System dependencies for PDF processing:
  - **Poppler** - Provides `pdfinfo` command to read PDF dimensions and metadata
  - **GraphicsMagick** - Image processing library for high-quality PDF to image conversion
  - **Ghostscript** - PostScript and PDF interpreter required by GraphicsMagick for PDF rendering

### Installing System Dependencies

**macOS:**
```bash
brew install poppler graphicsmagick ghostscript
```

**Ubuntu/Debian:**
```bash
sudo apt-get install poppler-utils graphicsmagick ghostscript
```

**Windows:**
- Install poppler: Download from http://blog.alivate.com.au/poppler-windows/
- Install GraphicsMagick: http://www.graphicsmagick.org/download.html
- Install Ghostscript: https://www.ghostscript.com/download/gsdnld.html

## How It Works

1. Scans current directory for PDF files
2. Uses `pdfinfo` to detect original PDF dimensions
3. Calculates scaling to fit within specified maximum width
4. Converts PDF to JPG using GraphicsMagick with Ghostscript backend
5. Outputs high-resolution JPG files with preserved aspect ratios