/**
 * Basic utility tests for SerenityAI
 */

describe('SerenityAI Utilities', () => {
  it('should validate environment variables format', () => {
    const fs = require('fs');
    const path = require('path');
    
    // Check if .env.example exists in backend
    const envExamplePath = path.join(__dirname, '../backend/.env.example');
    expect(fs.existsSync(envExamplePath)).toBe(true);
    
    // Read and validate format
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    expect(envContent).toContain('NODE_ENV=development');
    expect(envContent).toContain('PORT=3000');
    expect(envContent).toContain('DATABASE_URL=');
  });

  it('should have proper README documentation', () => {
    const fs = require('fs');
    const path = require('path');
    
    const readmePath = path.join(__dirname, '../README.md');
    expect(fs.existsSync(readmePath)).toBe(true);
    
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    expect(readmeContent).toContain('SerenityAI');
    expect(readmeContent.length).toBeGreaterThan(100);
  });

  it('should have proper license', () => {
    const fs = require('fs');
    const path = require('path');
    
    const licensePath = path.join(__dirname, '../LICENSE');
    expect(fs.existsSync(licensePath)).toBe(true);
  });
});
