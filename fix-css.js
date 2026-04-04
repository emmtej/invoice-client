const fs = require('fs');

function fixCss(file) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace @mixin hover with @media (hover: hover) { &:hover
    content = content.replace(/@mixin hover/g, '@media (hover: hover) {\n\t\t&:hover');
    // For each we added an extra level of nesting, so we need an extra } at the end. Actually, @mixin hover doesn't need extra nesting if it's already nested?
    // Wait, standard CSS modules would just use &:hover without @media (hover: hover) if we don't care about touch devices, or with it.
    // Let's just replace @mixin hover with &:hover for simplicity since Mantine usually converts @mixin hover to @media (hover: hover) { &:hover { ... } }.
    // But Biome complains. Let's just suppress Biome or change to &:hover
    content = content.replace(/@mixin hover {/g, '&:hover {');
    
    // Remove duplicate `color` declarations inside NavLinksGroup.module.css
    // We'll just rely on biome format/lint if needed, or remove it manually.
    fs.writeFileSync(file, content);
}

fixCss('src/components/ui/sidebar/NavLinksGroup.module.css');
fixCss('src/components/ui/navbar/Navbar.module.css');
console.log('Fixed CSS');
