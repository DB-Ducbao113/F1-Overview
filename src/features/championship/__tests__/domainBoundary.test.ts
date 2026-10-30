import { describe, it, expect } from 'vitest';

describe('Architecture Boundary — Championship Domain Purity', () => {
  // Use Vite's native static globbing to load domain TS files as raw text
  const domainRawModules = import.meta.glob('../domain/**/*.ts', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;

  const fileEntries = Object.entries(domainRawModules).filter(
    ([path]) => !path.includes('.test.ts'),
  );

  it('finds domain TypeScript files for validation', () => {
    expect(fileEntries.length).toBeGreaterThan(0);
  });

  it.each(fileEntries)(
    'verifies %s has ZERO prohibited framework/runtime imports',
    (filePath, content) => {
      // Forbidden libraries & frameworks
      expect(content).not.toMatch(/from\s+['"]react['"]/i);
      expect(content).not.toMatch(/from\s+['"]react-dom['"]/i);
      expect(content).not.toMatch(/from\s+['"]zustand['"]/i);
      expect(content).not.toMatch(/from\s+['"]three['"]/i);
      expect(content).not.toMatch(/from\s+['"]@react-three/i);
      expect(content).not.toMatch(/from\s+['"]@vercel/i);

      // Strip comments first to avoid false positives in documentation
      const codeWithoutComments = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

      // Forbidden browser runtime globals & side-effect APIs
      expect(codeWithoutComments).not.toMatch(/\bwindow\./);
      expect(codeWithoutComments).not.toMatch(/\bdocument\./);
      expect(codeWithoutComments).not.toMatch(/\blocalStorage\./);
      expect(codeWithoutComments).not.toMatch(/\bsessionStorage\./);
      expect(codeWithoutComments).not.toMatch(/\bfetch\s*\(/);
    },
  );
});
