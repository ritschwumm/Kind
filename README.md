Formality in Formality
======================

Formality is now fully implemented in itself! Relevant files:

- **main.fm**: the complete implementation of Formality in itself. 

- **main.js**: the `main.fm` file compiled to JavaScript.

You can type-check Formality files using either `FormaltiyJS` (the current
implementation, written in JavaScript) or `main.js` (the new implementation,
written in Formality, compiled to JavaScript). Examples:

### Checking files using FormalityJS

```bash
# Install Formality-Lang
npm i -g formality-lang

# Type-check a demo file
fm demo.fm

# Type-check Formality's implementation
fm main.fm
```

### Checking files using FormalityFM

```bash
# Grant permission
chmod 500 main.js

# Type-check a demo file
./main.js demo.fm

# Type-check Formality's implementation
./main.js main.fm
```

### Building main.js from main.fm

You still need FormalityJS for that.

```bash
# Install Formality-Lang and JS-Beautify
npm i -g formality-lang
npm i -g js-beautify

# Builds main.js
fmjs main | js-beautify >> main.js
chmod 777 main.js
```

Next steps
==========

1. Create compilers to multiple langs: Haskell, Scheme, JavaScript and more.

2. Generate packages for each target lang.

3. Replace the FormalityJS by the package compiled from FormalityFM.

4. Landing page, documentation and publish Formality 1.0!

A new hidden feature
====================

There is a new much wanted feature in FormalityFM: you can now print reduced
holes. To do that, add `-` after the hole name: `?hole-`. This will print the
hole's goals with a bunch of numbers on each redex. You can then reduce one of
these redexes by appending its number to the hole name, as in `?hole-7`. You can
repeat that process as many times as you want. This is extremely useful for
theorem proving.
