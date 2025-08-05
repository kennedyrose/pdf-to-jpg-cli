# PDF to JPG CLI

A Node.js command-line tool that converts all PDF files in the current directory to high-quality JPG images with customizable maximum width. Perfect for batch converting PDFs to images for thumbnails, previews, or web use.

## Installation

Install globally from npm to use the `pdftojpg` command anywhere:

```bash
npm install -g pdf-to-jpg-cli
```

## Usage

After global installation, navigate to any directory containing PDF files and run:

```bash
pdftojpg [options]
```

### Options

- `-w, --width <number>` - Maximum width in pixels (default: 1275)
- `-h, --help` - Show help message

### Examples

```bash
# Convert all PDFs with default settings (max width: 1275px)
pdftojpg

# Convert with custom max width (800px)
pdftojpg -w 800

# Convert with custom max width (2000px)  
pdftojpg --width 2000

# Show help
pdftojpg --help
```

## Development

If you want to contribute or modify this tool:

```bash
# Clone the repository
git clone https://github.com/kennedyrose/pdf-to-jpg-cli.git
cd pdf-to-jpg-cli

# Install dependencies
npm install

# Run locally
node index.js -w 1500

# Or install globally from source
npm install -g .
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