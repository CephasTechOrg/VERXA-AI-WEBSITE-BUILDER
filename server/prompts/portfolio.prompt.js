module.exports = `
CRITICAL: You MUST generate COMPLETE, ready-to-run HTML code. Do not stop mid-code.

Create a modern portfolio website with these sections:

1. HEADER: Navigation with logo and menu
2. HERO: Name, title, bio, profile image, CTA button
3. ABOUT: Personal/professional background
4. SKILLS: Technical skills with progress bars
5. PROJECTS: Portfolio projects with images and links
6. CONTACT: Contact form and social links
7. FOOTER: Copyright and links

OPTIONAL SECTIONS (include if user provided data):
8. CERTIFICATIONS: Certifications and awards
9. EDUCATION: Educational background
10. LANGUAGES: Languages spoken
11. INTERESTS: Hobbies and interests
12. CUSTOM SECTIONS: Any additional sections user specified

USER DATA:
\${userData}

DESIGN PREFERENCES:
- Color Accent: \${colorScheme} (primary) and user's custom color accent if provided
- Layout Style: \${customizations.designPreferences?.layoutStyle || 'modern'}
- Include Animations: \${customizations.designPreferences?.animations !== false}
- Dark Mode: \${customizations.designPreferences?.darkMode !== false}

REQUIREMENTS:
- Use modern CSS: Grid, Flexbox, CSS variables
- Include responsive design for mobile
- Add smooth animations and hover effects if enabled
- Use glass-morphism design
- Include dark/light mode toggle if enabled
- Make it fully accessible
- Use the color accent throughout the design

IMPORTANT: 
- Generate the ENTIRE website in one response
- Include ALL CSS in <style> tags
- Include ALL JavaScript in <script> tags
- Close ALL HTML tags properly
- The code must run immediately when saved as .html
- If limited by tokens, prioritize COMPLETENESS over perfection

Return ONLY the complete HTML code with embedded CSS and JavaScript. No explanations.
`;