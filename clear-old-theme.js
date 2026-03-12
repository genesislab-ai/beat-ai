// Clear old theme localStorage data to prevent conflicts
// This script should be run once after updating to the new theme system

(function() {
  console.log('🎨 Theme system initializing...');

  // Remove old 'theme' key (which was conflicting with gradient themes)
  const oldTheme = localStorage.getItem('theme');
  if (oldTheme === 'dark' || oldTheme === 'light') {
    console.log('Migrating old theme data...');
    localStorage.setItem('theme-mode', oldTheme);
    localStorage.removeItem('theme');
    console.log('✓ Migration complete: theme-mode =', oldTheme);
  }

  // Ensure both attributes are set correctly
  // Default to 'light' mode if not set (better for first-time users)
  const themeMode = localStorage.getItem('theme-mode') || 'light';
  const gradientTheme = localStorage.getItem('docs-theme') || 'purple-pink';

  // Set attributes on document element BEFORE React loads
  document.documentElement.setAttribute('data-theme-mode', themeMode);
  document.documentElement.setAttribute('data-theme', gradientTheme);

  console.log('✓ Theme system initialized:');
  console.log('  - Mode:', themeMode);
  console.log('  - Gradient:', gradientTheme);
})();
