/**
 * Configuration validation tests for SerenityAI
 */

describe('SerenityAI Configuration', () => {
  it('should have valid ESLint configuration', () => {
    const fs = require('fs');
    const path = require('path');
    
    const eslintConfigPath = path.join(__dirname, '../.eslintrc.json');
    expect(fs.existsSync(eslintConfigPath)).toBe(true);
    
    const eslintConfig = JSON.parse(fs.readFileSync(eslintConfigPath, 'utf8'));
    expect(eslintConfig.rules).toBeDefined();
    expect(eslintConfig.env).toBeDefined();
  });

  it('should have valid Jest configuration', () => {
    const fs = require('fs');
    const path = require('path');
    
    const jestConfigPath = path.join(__dirname, '../jest.config.json');
    expect(fs.existsSync(jestConfigPath)).toBe(true);
    
    const jestConfig = JSON.parse(fs.readFileSync(jestConfigPath, 'utf8'));
    expect(jestConfig.testEnvironment).toBe('node');
    expect(jestConfig.testMatch).toBeDefined();
  });

  it('should have valid Babel configuration', () => {
    const fs = require('fs');
    const path = require('path');
    
    const babelConfigPath = path.join(__dirname, '../babel.config.json');
    expect(fs.existsSync(babelConfigPath)).toBe(true);
    
    const babelConfig = JSON.parse(fs.readFileSync(babelConfigPath, 'utf8'));
    expect(babelConfig.presets).toBeDefined();
    expect(babelConfig.presets.length).toBeGreaterThan(0);
  });

  it('should have valid EditorConfig', () => {
    const fs = require('fs');
    const path = require('path');
    
    const editorConfigPath = path.join(__dirname, '../.editorconfig');
    expect(fs.existsSync(editorConfigPath)).toBe(true);
    
    const content = fs.readFileSync(editorConfigPath, 'utf8');
    expect(content).toContain('root = true');
    expect(content).toContain('indent_style = space');
  });
});
