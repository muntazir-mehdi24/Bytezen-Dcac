import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

// Get the current directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the bytelogs directory exists
const bytelogsDir = path.join(__dirname, '../public/bytelogs');

/**
 * @route   GET /api/bytelogs/download/:fileName
 * @desc    Download a ByteLog PDF file
 * @access  Public
 */
router.get('/download/:fileName', (req, res) => {
    try {
        const { fileName } = req.params;
        
        // Prevent directory traversal attacks
        if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
            return res.status(400).json({ success: false, error: 'Invalid file name' });
        }
        
        const filePath = path.join(bytelogsDir, fileName);
        const safeFileName = encodeURIComponent(fileName);
        
        // Set headers for file download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"`);
        
        // Send the file
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                if (!res.headersSent) {
                    res.status(404).json({ 
                        success: false, 
                        error: 'File not found or error in file transfer' 
                    });
                }
            }
        });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error while processing your request' 
        });
    }
});

/**
 * @route   GET /api/bytelogs/list
 * @desc    Get list of available ByteLog issues
 * @access  Public
 */
router.get('/list', async (req, res) => {
    try {
        const fs = await import('fs/promises');
        
        // Read the directory
        const files = await fs.readdir(bytelogsDir);
        
        // Filter for PDF files and map to desired format
        const bytelogs = files
            .filter(file => file.toLowerCase().endsWith('.pdf'))
            .map(file => ({
                id: file.replace(/\.pdf$/i, '').toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                fileName: file,
                title: formatTitle(file),
                thumbnail: `/bytelogs/thumbnails/${file.replace(/\.pdf$/i, '.jpg')}`,
                downloadUrl: `/api/bytelogs/download/${encodeURIComponent(file)}`,
                date: extractDateFromFileName(file)
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
            
        res.json({ success: true, data: bytelogs });
    } catch (error) {
        console.error('Error listing bytelogs:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error retrieving ByteLog list' 
        });
    }
});

// Helper function to format title from filename
function formatTitle(filename) {
    // Remove .pdf extension and replace hyphens with spaces
    return filename
        .replace(/\.pdf$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

// Helper function to extract date from filename
function extractDateFromFileName(filename) {
    // Try to extract date in format YYYY-MM or MM-YYYY or similar
    const dateMatch = filename.match(/(\d{1,2})[-_](\d{1,2})[-_](\d{2,4})/) || 
                     filename.match(/(\d{4})[-_](\d{1,2})/);
    
    if (dateMatch) {
        // Try to create a date object from the matched parts
        const parts = dateMatch.slice(1).map(Number);
        // If we have year, month, day
        if (parts.length >= 3) {
            // Handle 2-digit year
            const year = parts[2] < 100 ? 2000 + parts[2] : parts[2];
            return new Date(year, parts[1] - 1, parts[0]);
        }
        // If we have year and month
        if (parts.length === 2) {
            return new Date(parts[0], parts[1] - 1);
        }
    }
    
    // Fallback to file modification time or current date
    return new Date();
}

export default router;
