/**
 * Basic integration test for SerenityAI project
 */

describe('SerenityAI Project', () => {
  it('should have proper project structure', () => {
    const fs = require('fs');
    const path = require('path');
    
    // Check if main directories exist
    expect(fs.existsSync(path.join(__dirname, '../mobile'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../backend'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../ai-services'))).toBe(true);
  });

  it('should have package.json files', () => {
    const fs = require('fs');
    const path = require('path');
    
    // Check package.json files
    expect(fs.existsSync(path.join(__dirname, '../package.json'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../mobile/package.json'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../backend/package.json'))).toBe(true);
  });

  it('should have required configuration files', () => {
    const fs = require('fs');
    const path = require('path');
    
    // Check configuration files
    expect(fs.existsSync(path.join(__dirname, '../.eslintrc.json'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../.editorconfig'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../.gitignore'))).toBe(true);
  });
});
