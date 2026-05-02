---
name: Cognitive Tactility
colors:
  surface: '#f9f9fc'
  surface-dim: '#d9dadc'
  surface-bright: '#f9f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f6'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#44474a'
  inverse-surface: '#2f3133'
  inverse-on-surface: '#f0f0f3'
  outline: '#74777a'
  outline-variant: '#c4c7c9'
  surface-tint: '#595f63'
  primary: '#595f63'
  on-primary: '#ffffff'
  primary-container: '#f0f5f9'
  on-primary-container: '#6a7074'
  inverse-primary: '#c2c7cb'
  secondary: '#546068'
  on-secondary: '#ffffff'
  secondary-container: '#d4e2eb'
  on-secondary-container: '#58646c'
  tertiary: '#51606a'
  on-tertiary: '#ffffff'
  tertiary-container: '#ebf6ff'
  on-tertiary-container: '#62717c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee3e7'
  primary-fixed-dim: '#c2c7cb'
  on-primary-fixed: '#171c1f'
  on-primary-fixed-variant: '#42484b'
  secondary-fixed: '#d7e4ed'
  secondary-fixed-dim: '#bbc8d1'
  on-secondary-fixed: '#111d24'
  on-secondary-fixed-variant: '#3c4850'
  tertiary-fixed: '#d5e5f1'
  tertiary-fixed-dim: '#b9c9d4'
  on-tertiary-fixed: '#0e1d26'
  on-tertiary-fixed-variant: '#3a4952'
  background: '#f9f9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
typography:
  h1:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  h3:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  button:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The design system is centered around the concept of "Cognitive Tactility." As an AI second brain, the interface must feel less like a flat digital screen and more like a physical, responsive environment that adapts to human thought. The personality is calm, organized, and intellectual, avoiding the aggressive "tech-heavy" aesthetics in favor of a soft, approachable workspace.

The style leverages **Modern Neumorphism**. By using subtle light and shadow play on a refined palette of cool greys and deep slates, the UI creates a sense of organic depth where elements appear extruded from the background or recessed into it. This approach reduces visual noise and cognitive load, allowing the user to focus on their knowledge and the AI’s insights within a unified, harmonious space.

## Colors

The color palette for this design system is intentionally monochromatic and cool-toned to promote focus and clarity. 

- **Background:** A crisp, airy cool-grey (#F0F5F9) serves as the canvas, providing the necessary high-key foundation for Neumorphic shadows to remain visible.
- **Surface:** A mid-tone steel-blue (#C9D6DF) used for secondary UI containers and cards. This color provides a subtle layer of depth against the background.
- **Primary Accent:** Aligned with the light base (#F0F5F9) to maintain a clean aesthetic, utilizing elevation rather than bold color for hierarchy.
- **Tertiary Tint:** A deep slate-blue (#52616B) used for high-importance actions, AI insights, and grounding anchors.
- **Text:** High-contrast charcoal (#1E2022) ensures legibility across all depth levels.

All interactive elements derive their 3D appearance from the interaction between the background and surface colors using the specified light and dark shadow tokens.

## Typography

This design system utilizes **Manrope** for its balance of geometric modernism and high readability. The typeface’s open apertures and clean lines complement the soft UI elements without competing for attention.

Headlines use a tighter letter-spacing and heavier weights to provide a sense of authority and structure. Body text is prioritized for legibility with generous line heights, ensuring that long-form notes and AI responses are easy to digest. Labels and utility text utilize uppercase styling and increased tracking to differentiate functional elements from content.

## Layout & Spacing

The layout philosophy follows a **fluid grid** model that emphasizes breathing room. Because Neumorphic elements require shadow "runway" to be effective, spacing is more generous than in traditional flat design.

The system uses an 8px base rhythm. Content is organized into a 12-column grid for desktop, with containers often spanning the center 8 columns to maintain focus. Padding within cards and surfaces should be consistent—typically 24px (md)—to ensure the "inner" and "outer" depth effects do not feel cramped or visually cluttered.

## Elevation & Depth

Depth is the primary communicator of hierarchy in this design system. It is achieved through a dual-shadow technique: a light highlight on the top-left and a dark shadow on the bottom-right.

1.  **Raised (Default):** Elements like cards and buttons appear to lift off the surface. Use a white highlight at (-6px, -6px, 12px) and a soft blue-grey shadow at (6px, 6px, 12px).
2.  **Inset (Active/Input):** Elements like pressed buttons or active input fields appear recessed into the surface. This is achieved using `box-shadow: inset`.
3.  **Soft Transitions:** All depth changes must be animated with a 200ms ease-in-out transition to reinforce the "tactile" feel of the UI.

## Shapes

The design system adopts a "Smooth Rounded" language. A 16px radius is the standard for cards, buttons, and larger containers, creating a friendly and organic feel. 

Borders are used sparingly, if at all. When necessary for accessibility, use a 1px solid stroke in a color slightly darker than the surface to define boundaries without breaking the soft aesthetic. Sharp corners are strictly prohibited as they contradict the soft UI narrative.

## Components

- **Buttons:** Primary buttons use the `Tertiary` deep slate color (#52616B) with white text. Secondary buttons are the same color as the `Background`, relying entirely on the Neumorphic raised effect for visibility.
- **Cards:** Use the standard `Background` color with the 16px radius and raised shadows. Do not use borders on cards.
- **Input Fields:** These should always be `Inset` by default, signaling to the user that they are "hollow" areas ready to be filled with data.
- **Chips/Tags:** Small pill-shaped elements with a subtle raised shadow. Active tags transition to an `Inset` state.
- **Lists:** List items remain flat until hovered, at which point they transition to a subtle `Raised` state or a light background tint.
- **AI Thought Stream:** A specialized container component for AI reasoning. It utilizes the `Tertiary` slate (#52616B) for high-contrast accents and an `Inset` depth to distinguish AI "thoughts" from user-generated content.