# SCSS Architecture & Responsive Design

## Estrutura de Pastas (Padrão 7-1)

Organize os arquivos SCSS em 7 pastas e 1 arquivo principal:

```
src/
├── styles/
│   ├── abstracts/          # Variáveis, mixins, functions
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _functions.scss
│   │   └── _index.scss
│   ├── base/               # Reset, tipografia, elementos base
│   │   ├── _reset.scss
│   │   ├── _typography.scss
│   │   ├── _global.scss
│   │   └── _index.scss
│   ├── components/         # Componentes de UI
│   │   ├── _buttons.scss
│   │   ├── _forms.scss
│   │   ├── _cards.scss
│   │   ├── _modals.scss
│   │   └── _index.scss
│   ├── layout/             # Estrutura de layout
│   │   ├── _header.scss
│   │   ├── _footer.scss
│   │   ├── _grid.scss
│   │   ├── _container.scss
│   │   └── _index.scss
│   ├── pages/              # Estilos específicos de páginas
│   │   ├── _home.scss
│   │   ├── _dashboard.scss
│   │   └── _index.scss
│   ├── themes/             # Variações de tema
│   │   ├── _light.scss
│   │   ├── _dark.scss
│   │   └── _index.scss
│   ├── vendors/            # Bibliotecas externas
│   │   ├── _bootstrap.scss
│   │   └── _index.scss
│   └── main.scss           # Arquivo principal (importa todos)
└── app/
    ├── components/
    │   └── user-card/
    │       ├── user-card.component.ts
    │       ├── user-card.component.html
    │       └── user-card.component.scss  # Styles scoped do componente
```

---

## Arquivo Principal (main.scss)

```scss
// main.scss - Ponto de entrada de todos os estilos

// 1. Abstracts - Variáveis, mixins, functions
@use 'abstracts/variables';
@use 'abstracts/mixins';
@use 'abstracts/functions';

// 2. Base - Reset, tipografia, global
@use 'base/reset';
@use 'base/typography';
@use 'base/global';

// 3. Components - Componentes de UI
@use 'components/buttons';
@use 'components/forms';
@use 'components/cards';
@use 'components/modals';

// 4. Layout - Estrutura
@use 'layout/header';
@use 'layout/footer';
@use 'layout/grid';
@use 'layout/container';

// 5. Pages - Páginas específicas
@use 'pages/home';
@use 'pages/dashboard';

// 6. Themes - Temas
@use 'themes/light';
@use 'themes/dark';

// 7. Vendors - Bibliotecas externas
// @use 'vendors/bootstrap';
```

---

## Variáveis (_variables.scss)

### Cores

```scss
// Paleta de cores principal
$color-primary: #0066cc;
$color-primary-dark: #004c99;
$color-primary-light: #3385d9;

$color-secondary: #6c757d;
$color-secondary-dark: #545b62;
$color-secondary-light: #868e96;

// Cores de status
$color-success: #28a745;
$color-warning: #ffc107;
$color-error: #dc3545;
$color-info: #17a2b8;

// Cores neutras
$color-white: #ffffff;
$color-black: #000000;
$color-gray-100: #f8f9fa;
$color-gray-200: #e9ecef;
$color-gray-300: #dee2e6;
$color-gray-400: #ced4da;
$color-gray-500: #adb5bd;
$color-gray-600: #6c757d;
$color-gray-700: #495057;
$color-gray-800: #343a40;
$color-gray-900: #212529;

// Cores de texto
$color-text-primary: $color-gray-900;
$color-text-secondary: $color-gray-600;
$color-text-muted: $color-gray-500;
$color-text-disabled: $color-gray-400;
$color-text-inverse: $color-white;

// Cores de background
$color-bg-primary: $color-white;
$color-bg-secondary: $color-gray-100;
$color-bg-tertiary: $color-gray-200;

// Cores de border
$color-border-light: $color-gray-200;
$color-border: $color-gray-300;
$color-border-dark: $color-gray-400;
```

### Tipografia

```scss
// Fontes
$font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-family-heading: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
$font-family-mono: 'Fira Code', 'Consolas', 'Monaco', monospace;

// Tamanhos de fonte (escala modular)
$font-size-xs: 0.75rem;     // 12px
$font-size-sm: 0.875rem;    // 14px
$font-size-base: 1rem;      // 16px
$font-size-lg: 1.125rem;    // 18px
$font-size-xl: 1.25rem;     // 20px
$font-size-2xl: 1.5rem;     // 24px
$font-size-3xl: 1.875rem;   // 30px
$font-size-4xl: 2.25rem;    // 36px
$font-size-5xl: 3rem;       // 48px

// Pesos de fonte
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Altura de linha
$line-height-none: 1;
$line-height-tight: 1.25;
$line-height-snug: 1.375;
$line-height-normal: 1.5;
$line-height-relaxed: 1.625;
$line-height-loose: 2;
```

### Espaçamento

```scss
// Scale de espaçamento (base 4px)
$space-0: 0;
$space-1: 0.25rem;   // 4px
$space-2: 0.5rem;    // 8px
$space-3: 0.75rem;   // 12px
$space-4: 1rem;      // 16px
$space-5: 1.25rem;   // 20px
$space-6: 1.5rem;    // 24px
$space-8: 2rem;      // 32px
$space-10: 2.5rem;   // 40px
$space-12: 3rem;     // 48px
$space-16: 4rem;     // 64px
$space-20: 5rem;     // 80px
$space-24: 6rem;     // 96px

// Layout
$container-max-width: 1280px;
$container-padding-x: $space-4;
```

### Breakpoints (Responsive)

```scss
// Breakpoints baseados em dispositivos 2026
// Mobile-first approach (usar min-width)

$breakpoints: (
  'xs': 0,        // Mobile pequeno (base)
  'sm': 540px,    // Mobile grande
  'md': 768px,    // Tablet
  'lg': 1024px,   // Desktop
  'xl': 1280px,   // Desktop grande
  '2xl': 1536px,  // Desktop extra grande
  '4k': 2560px    // 4K displays
);

// Container widths por breakpoint
$container-max-widths: (
  sm: 540px,
  md: 720px,
  lg: 960px,
  xl: 1140px,
  '2xl': 1280px
);
```

### Border e Shadow

```scss
// Border radius
$radius-none: 0;
$radius-sm: 0.125rem;   // 2px
$radius: 0.25rem;       // 4px
$radius-md: 0.375rem;   // 6px
$radius-lg: 0.5rem;     // 8px
$radius-xl: 0.75rem;    // 12px
$radius-2xl: 1rem;      // 16px
$radius-3xl: 1.5rem;    // 24px
$radius-full: 9999px;

// Box shadow
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
$shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
$shadow-none: none;

// Transitions
$transition-fast: 150ms;
$transition-normal: 300ms;
$transition-slow: 500ms;

$transition-timing: ease-in-out;
```

### Z-index

```scss
// Z-index scale
$z-index-hidden: -1;
$z-index-base: 0;
$z-index-dropdown: 1000;
$z-index-sticky: 1020;
$z-index-fixed: 1030;
$z-index-modal-backdrop: 1040;
$z-index-modal: 1050;
$z-index-popover: 1060;
$z-index-tooltip: 1070;
$z-index-toast: 1080;
```

---

## Mixins (_mixins.scss)

### Responsive Breakpoints

```scss
// Mobile-first (min-width)
@mixin respond-to($breakpoint) {
  $value: map-get($breakpoints, $breakpoint);
  
  @if $value == null {
    @error "Breakpoint `#{$breakpoint}` not found. Available: #{map-keys($breakpoints)}";
  }
  
  @if $value == 0 {
    @content;
  } @else {
    @media (min-width: $value) {
      @content;
    }
  }
}

// Desktop-first (max-width) - usar com moderação
@mixin respond-to-down($breakpoint) {
  $value: map-get($breakpoints, $breakpoint);
  
  @if $value and $value > 0 {
    @media (max-width: $value - 1px) {
      @content;
    }
  } @else {
    @content;
  }
}

// Range entre breakpoints
@mixin respond-to-between($lower, $upper) {
  $lower-value: map-get($breakpoints, $lower);
  $upper-value: map-get($breakpoints, $upper);
  
  @if $lower-value and $upper-value {
    @media (min-width: $lower-value) and (max-width: $upper-value - 1px) {
      @content;
    }
  }
}

// Uso
.element {
  padding: $space-4;
  
  @include respond-to('md') {
    padding: $space-6;
  }
  
  @include respond-to('lg') {
    padding: $space-8;
  }
}
```

### Container

```scss
@mixin container($padding: $container-padding-x) {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: $padding;
  padding-left: $padding;
  
  @include respond-to('sm') {
    max-width: map-get($container-max-widths, 'sm');
  }
  
  @include respond-to('md') {
    max-width: map-get($container-max-widths, 'md');
  }
  
  @include respond-to('lg') {
    max-width: map-get($container-max-widths, 'lg');
  }
  
  @include respond-to('xl') {
    max-width: map-get($container-max-widths, 'xl');
  }
  
  @include respond-to('2xl') {
    max-width: map-get($container-max-widths, '2xl');
  }
}
```

### Flexbox Utilities

```scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin flex-start {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

@mixin flex-end {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

@mixin flex-column {
  display: flex;
  flex-direction: column;
}

@mixin flex-column-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
```

### Typography

```scss
@mixin text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin text-line-clamp($lines: 2) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@mixin heading-base {
  font-family: $font-family-heading;
  font-weight: $font-weight-bold;
  line-height: $line-height-tight;
  margin: 0;
}

@mixin h1 {
  @include heading-base;
  font-size: $font-size-4xl;
}

@mixin h2 {
  @include heading-base;
  font-size: $font-size-3xl;
}

@mixin h3 {
  @include heading-base;
  font-size: $font-size-2xl;
}

@mixin h4 {
  @include heading-base;
  font-size: $font-size-xl;
}

@mixin body-text {
  font-family: $font-family-base;
  font-size: $font-size-base;
  line-height: $line-height-normal;
}

@mixin small-text {
  font-family: $font-family-base;
  font-size: $font-size-sm;
  line-height: $line-height-normal;
}
```

### Buttons

```scss
@mixin button-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  padding: $space-3 $space-5;
  font-family: $font-family-base;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  line-height: $line-height-normal;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast $transition-timing;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@mixin button-primary {
  @include button-base;
  background-color: $color-primary;
  color: $color-white;
  
  &:hover:not(:disabled) {
    background-color: $color-primary-dark;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
}

@mixin button-secondary {
  @include button-base;
  background-color: $color-white;
  color: $color-text-primary;
  border-color: $color-border;
  
  &:hover:not(:disabled) {
    background-color: $color-gray-50;
  }
}

@mixin button-ghost {
  @include button-base;
  background-color: transparent;
  color: $color-primary;
  
  &:hover:not(:disabled) {
    background-color: rgba($color-primary, 0.1);
  }
}

@mixin button-danger {
  @include button-base;
  background-color: $color-error;
  color: $color-white;
  
  &:hover:not(:disabled) {
    background-color: darken($color-error, 10%);
  }
}

// Button sizes
@mixin button-sm {
  padding: $space-2 $space-3;
  font-size: $font-size-xs;
}

@mixin button-lg {
  padding: $space-4 $space-6;
  font-size: $font-size-base;
}
```

### Forms

```scss
@mixin input-base {
  display: block;
  width: 100%;
  padding: $space-3 $space-4;
  font-family: $font-family-base;
  font-size: $font-size-base;
  line-height: $line-height-normal;
  color: $color-text-primary;
  background-color: $color-white;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  transition: border-color $transition-fast, box-shadow $transition-fast;
  
  &::placeholder {
    color: $color-text-muted;
  }
  
  &:focus {
    outline: none;
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
  }
  
  &:disabled {
    background-color: $color-gray-100;
    cursor: not-allowed;
  }
  
  &.error {
    border-color: $color-error;
    
    &:focus {
      box-shadow: 0 0 0 3px rgba($color-error, 0.1);
    }
  }
}

@mixin input-sm {
  padding: $space-2 $space-3;
  font-size: $font-size-sm;
}

@mixin input-lg {
  padding: $space-4 $space-5;
  font-size: $font-size-lg;
}
```

### Cards

```scss
@mixin card {
  background-color: $color-bg-primary;
  border: 1px solid $color-border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  overflow: hidden;
}

@mixin card-hover {
  transition: box-shadow $transition-normal, transform $transition-normal;
  
  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }
}
```

### Utilities

```scss
// Visually hidden (acessibilidade)
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// Clearfix
@mixin clearfix {
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}

// Aspect ratio
@mixin aspect-ratio($width: 16, $height: 9) {
  position: relative;
  
  &::before {
    content: '';
    display: block;
    padding-top: ($height / $width) * 100%;
  }
  
  > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

// Center absolute
@mixin absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

// Sticky
@mixin sticky($top: 0) {
  position: sticky;
  top: $top;
  z-index: $z-index-sticky;
}
```

---

## Base Styles

### Reset (_reset.scss)

```scss
// Modern CSS Reset
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  font-family: $font-family-base;
  font-size: $font-size-base;
  line-height: $line-height-normal;
  color: $color-text-primary;
  background-color: $color-bg-primary;
  min-height: 100vh;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: $color-primary;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

input,
textarea,
select {
  font-family: inherit;
  font-size: inherit;
}

ul,
ol {
  list-style: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}
```

### Tipografia (_typography.scss)

```scss
h1, h2, h3, h4, h5, h6 {
  font-family: $font-family-heading;
  font-weight: $font-weight-bold;
  line-height: $line-height-tight;
  margin-bottom: $space-4;
  color: $color-text-primary;
}

h1 { @include h1; }
h2 { @include h2; }
h3 { @include h3; }
h4 { @include h4; }

p {
  @include body-text;
  margin-bottom: $space-4;
}

small {
  @include small-text;
}

strong {
  font-weight: $font-weight-semibold;
}

.text-muted {
  color: $color-text-muted;
}

.text-error {
  color: $color-error;
}

.text-success {
  color: $color-success;
}
```

### Global (_global.scss)

```scss
// Container utility
.container {
  @include container;
}

// Flex utilities
.flex {
  display: flex;
}

.flex-center {
  @include flex-center;
}

.flex-between {
  @include flex-between;
}

.flex-column {
  @include flex-column;
}

// Grid utilities
.grid {
  display: grid;
}

// Spacing utilities
.mt-1 { margin-top: $space-1; }
.mt-2 { margin-top: $space-2; }
.mt-3 { margin-top: $space-3; }
.mt-4 { margin-top: $space-4; }
.mt-6 { margin-top: $space-6; }
.mt-8 { margin-top: $space-8; }

.mb-1 { margin-bottom: $space-1; }
.mb-2 { margin-bottom: $space-2; }
.mb-3 { margin-bottom: $space-3; }
.mb-4 { margin-bottom: $space-4; }
.mb-6 { margin-bottom: $space-6; }
.mb-8 { margin-bottom: $space-8; }

.p-1 { padding: $space-1; }
.p-2 { padding: $space-2; }
.p-3 { padding: $space-3; }
.p-4 { padding: $space-4; }
.p-6 { padding: $space-6; }
.p-8 { padding: $space-8; }

// Visibility
.hidden {
  display: none !important;
}

.sr-only {
  @include visually-hidden;
}

// Overflow
.overflow-hidden {
  overflow: hidden;
}

.overflow-auto {
  overflow: auto;
}

// Text utilities
.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.text-truncate {
  @include text-truncate;
}

// Border utilities
.border {
  border: 1px solid $color-border;
}

.border-top {
  border-top: 1px solid $color-border;
}

.rounded {
  border-radius: $radius;
}

.rounded-lg {
  border-radius: $radius-lg;
}

.rounded-full {
  border-radius: $radius-full;
}

// Shadow utilities
.shadow-sm {
  box-shadow: $shadow-sm;
}

.shadow {
  box-shadow: $shadow;
}

.shadow-md {
  box-shadow: $shadow-md;
}

.shadow-lg {
  box-shadow: $shadow-lg;
}
```

---

## Component Styles Examples

### Buttons (_buttons.scss)

```scss
.btn {
  @include button-base;
}

.btn-primary {
  @include button-primary;
}

.btn-secondary {
  @include button-secondary;
}

.btn-ghost {
  @include button-ghost;
}

.btn-danger {
  @include button-danger;
}

.btn-sm {
  @include button-sm;
}

.btn-lg {
  @include button-lg;
}

.btn-block {
  width: 100%;
}

.btn-icon {
  padding: $space-2;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}
```

### Forms (_forms.scss)

```scss
.form-group {
  margin-bottom: $space-4;
}

.form-label {
  display: block;
  margin-bottom: $space-2;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
  
  &.required {
    &::after {
      content: ' *';
      color: $color-error;
    }
  }
}

.form-input {
  @include input-base;
}

.form-input-sm {
  @include input-sm;
}

.form-input-lg {
  @include input-lg;
}

.form-textarea {
  @include input-base;
  min-height: 100px;
  resize: vertical;
}

.form-select {
  @include input-base;
  appearance: none;
  background-image: url("data:image/svg+xml,...");
  background-repeat: no-repeat;
  background-position: right $space-3 center;
  background-size: 1rem;
  padding-right: $space-10;
}

.form-error {
  margin-top: $space-1;
  font-size: $font-size-sm;
  color: $color-error;
}

.form-hint {
  margin-top: $space-1;
  font-size: $font-size-sm;
  color: $color-text-muted;
}

.form-checkbox,
.form-radio {
  display: flex;
  align-items: center;
  gap: $space-2;
  
  input[type="checkbox"],
  input[type="radio"] {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
  }
  
  label {
    cursor: pointer;
    user-select: none;
  }
}
```

### Cards (_cards.scss)

```scss
.card {
  @include card;
}

.card-hover {
  @include card;
  @include card-hover;
}

.card-header {
  padding: $space-4 $space-6;
  border-bottom: 1px solid $color-border-light;
  background-color: $color-bg-secondary;
}

.card-body {
  padding: $space-6;
}

.card-footer {
  padding: $space-4 $space-6;
  border-top: 1px solid $color-border-light;
  background-color: $color-bg-secondary;
}

.card-title {
  @include h4;
  margin-bottom: $space-2;
}

.card-subtitle {
  @include small-text;
  color: $color-text-muted;
  margin-bottom: $space-4;
}
```

---

## Layout Styles

### Grid System (_grid.scss)

```scss
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -$space-4;
  margin-left: -$space-4;
}

.col {
  flex: 1;
  padding-right: $space-4;
  padding-left: $space-4;
}

// Generate column classes
@for $i from 1 through 12 {
  .col-#{$i} {
    flex: 0 0 calc(#{$i} / 12 * 100%);
    max-width: calc(#{$i} / 12 * 100%);
    padding-right: $space-4;
    padding-left: $space-4;
  }
}

// Responsive columns
@include respond-to('md') {
  @for $i from 1 through 12 {
    .col-md-#{$i} {
      flex: 0 0 calc(#{$i} / 12 * 100%);
      max-width: calc(#{$i} / 12 * 100%);
    }
  }
}

@include respond-to('lg') {
  @for $i from 1 through 12 {
    .col-lg-#{$i} {
      flex: 0 0 calc(#{$i} / 12 * 100%);
      max-width: calc(#{$i} / 12 * 100%);
    }
  }
}

// Gap utilities
.gap-1 { gap: $space-1; }
.gap-2 { gap: $space-2; }
.gap-3 { gap: $space-3; }
.gap-4 { gap: $space-4; }
.gap-6 { gap: $space-6; }
.gap-8 { gap: $space-8; }
```

### Header/Footer (_header.scss, _footer.scss)

```scss
// _header.scss
.header {
  position: sticky;
  top: 0;
  z-index: $z-index-fixed;
  background-color: $color-bg-primary;
  border-bottom: 1px solid $color-border-light;
  padding: $space-4 0;
}

.header-content {
  @include container;
  @include flex-between;
}

.header-logo {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.header-nav {
  display: flex;
  gap: $space-6;
  
  @include respond-to-down('md') {
    display: none; // Mobile menu
  }
}

.header-link {
  color: $color-text-secondary;
  font-weight: $font-weight-medium;
  
  &:hover {
    color: $color-primary;
  }
}

// _footer.scss
.footer {
  background-color: $color-gray-900;
  color: $color-gray-300;
  padding: $space-12 0;
  margin-top: auto;
}

.footer-content {
  @include container;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-8;
  
  @include respond-to-down('md') {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include respond-to-down('sm') {
    grid-template-columns: 1fr;
  }
}

.footer-section {
  h4 {
    color: $color-white;
    margin-bottom: $space-4;
  }
  
  ul {
    li {
      margin-bottom: $space-2;
      
      a {
        color: $color-gray-400;
        
        &:hover {
          color: $color-white;
        }
      }
    }
  }
}

.footer-bottom {
  @include container;
  margin-top: $space-8;
  padding-top: $space-6;
  border-top: 1px solid $color-gray-800;
  text-align: center;
  font-size: $font-size-sm;
}
```

---

## Responsive Design Patterns

### Mobile-First Approach

```scss
// SEMPRE comece com mobile, adicione complexidade para desktop

.component {
  // Mobile styles (base)
  padding: $space-4;
  font-size: $font-size-base;
  
  // Tablet
  @include respond-to('md') {
    padding: $space-6;
    font-size: $font-size-lg;
  }
  
  // Desktop
  @include respond-to('lg') {
    padding: $space-8;
  }
}

// Grid responsivo
.grid {
  display: grid;
  gap: $space-4;
  
  // Mobile: 1 coluna
  grid-template-columns: 1fr;
  
  // Tablet: 2 colunas
  @include respond-to('md') {
    grid-template-columns: repeat(2, 1fr);
  }
  
  // Desktop: 3-4 colunas
  @include respond-to('lg') {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @include respond-to('xl') {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Container Queries (Modern CSS)

```scss
// Para componentes que respondem ao container, não viewport
.card-grid {
  display: grid;
  gap: $space-4;
  
  // Fallback para browsers sem container queries
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  
  // Container query (browsers modernos)
  container-type: inline-size;
  
  @container (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @container (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Fluid Typography

```scss
// Fluid font size (escala entre viewport widths)
@function fluid-type($min-vw, $max-vw, $min-font-size, $max-font-size) {
  $slope: ($max-font-size - $min-font-size) / ($max-vw - $min-vw);
  $y-intercept: $min-font-size - $slope * $min-vw;
  
  @return clamp(
    #{$min-font-size},
    #{$slope * 100vw} + #{$y-intercept},
    #{$max-font-size}
  );
}

h1 {
  font-size: fluid-type(320px, 1920px, 1.75rem, 3rem);
}

h2 {
  font-size: fluid-type(320px, 1920px, 1.5rem, 2.25rem);
}

body {
  font-size: fluid-type(320px, 1920px, 1rem, 1.125rem);
}
```

---

## Component-Scoped Styles (Angular)

```scss
// user-card.component.scss
@use '../../styles/abstracts/variables' as *;
@use '../../styles/abstracts/mixins' as *;

.user-card {
  @include card;
  @include card-hover;
  
  &__header {
    @include flex-between;
    padding: $space-4 $space-5;
    border-bottom: 1px solid $color-border-light;
  }
  
  &__title {
    @include h4;
    margin: 0;
  }
  
  &__body {
    padding: $space-5;
  }
  
  &__content {
    @include body-text;
    color: $color-text-secondary;
    margin-bottom: $space-4;
  }
  
  &__footer {
    @include flex-end;
    gap: $space-3;
    padding: $space-4 $space-5;
    border-top: 1px solid $color-border-light;
  }
  
  // Responsivo
  @include respond-to('sm') {
    &__body {
      padding: $space-6;
    }
  }
  
  // Estado de loading
  &--loading {
    pointer-events: none;
    opacity: 0.6;
  }
  
  // Estado selecionado
  &--selected {
    border-color: $color-primary;
    box-shadow: 0 0 0 2px rgba($color-primary, 0.2);
  }
}
```

---

## Checklist de Qualidade SCSS

- [ ] Seguir padrão 7-1 de organização
- [ ] Usar variáveis para cores, espaçamento, tipografia
- [ ] Mixins reutilizáveis para padrões comuns
- [ ] Mobile-first em todas as media queries
- [ ] Breakpoints consistentes (sm, md, lg, xl, 2xl)
- [ ] Component styles scoped (não vazar para global)
- [ ] Global styles apenas em styles/
- [ ] Sem !important (usar especificidade correta)
- [ ] Máximo 3 níveis de aninhamento
- [ ] Nomes de classes BEM-like (component__element--modifier)
- [ ] CSS custom properties para temas (opcional)
- [ ] Dark mode considerado (themes/)
