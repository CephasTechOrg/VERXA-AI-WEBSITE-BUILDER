module.exports = `
CRITICAL: You MUST generate COMPLETE, ready-to-run HTML code. Do not stop mid-code.

Create a long-form article/insight website with these sections:

1. HEADER: Logo, navigation, reading progress indicator
2. HERO: Article title, subtitle, author info, publish date, reading time, CTA button
3. FEATURE MEDIA: Hero image or video with caption
4. ARTICLE BODY: Multiple sections with headings, paragraphs, pull quotes, inline images
5. KEY HIGHLIGHTS: Bulleted summary or stat cards
6. AUTHOR BIO: Photo, credentials, social links
7. CALL TO ACTION: Encourage readers to subscribe/share/book a call
8. FOOTER: Copyright, related links, newsletter signup

USER DATA:
\${userData}

COLOR SCHEME: \${colorScheme}

REQUIREMENTS:
- Premium editorial layout (magazine-quality)
- Clear typography hierarchy and generous spacing
- Smooth scrolling with reading progress bar
- Responsive images and media embeds
- Include semantic HTML (article, section, header, footer)
- Lightweight, performant interactions (avoid heavy animations)

IMPORTANT: Generate complete HTML with embedded CSS and JavaScript.
`;
