# Home Physio India Elevated

You are a Principal Product Designer, Senior React Architect, UI/UX Expert and Frontend Engineer with 15+ years of experience building premium SaaS products and luxury healthcare websites.

Your task is to build the COMPLETE PUBLIC WEBSITE for

Home Physio India

IMPORTANT

DO NOT create any backend.

DO NOT use Supabase.

DO NOT generate database.

DO NOT create any authentication system.

DO NOT create any APIs.

A production-ready FastAPI backend already exists.

You MUST connect everything to the existing backend.

Existing Swagger

https://home-physio-india-health-backend.onrender.com/docs

OpenAPI

https://home-physio-india-health-backend.onrender.com/openapi.json

Everything must consume the existing REST APIs.

Never replace the backend.

Never create mock APIs.

Never use fake JSON.

Everything should work directly with the existing backend.

===================================================

TECH STACK

React 19

TypeScript

Vite

Tailwind CSS

Framer Motion

GSAP

Lenis Smooth Scroll

Three.js

React Three Fiber

Drei

Spline (if needed)

shadcn/ui

React Hook Form

Zod

Axios

TanStack Query

React Helmet

Lucide Icons

Swiper

Embla Carousel

===================================================

DESIGN GOAL

Create one of the most beautiful healthcare websites.

Quality should feel like

Apple

Stripe

Airbnb

Linear

Framer

Vercel

Notion

Aceternity UI

Tailwind UI

Do NOT create a template looking website.

The website should feel luxurious.

Very modern.

Minimal.

Medical.

Professional.

Elegant.

===================================================

COLOR PALETTE

Primary

#33C4C7

Secondary

#EAF6F6

Accent

#1F8E94

Dark

#0F172A

Background

#F8FCFC

Surface

#FFFFFF

Border

#DDEEEE

Text

#111827

Use soft gradients.

Beautiful white space.

Luxury typography.

Rounded corners.

Premium shadows.

===================================================

ANIMATION

The website should feel alive.

Implement

Smooth scrolling

Lenis

Page transitions

Framer Motion

GSAP animations

Cursor movement animation

Cursor glow

Mouse follower

Magnetic buttons

Text reveal animation

Scroll reveal animation

Fade animation

Scale animation

Parallax

Image reveal

Hero entrance

Cards animation

Counter animation

3D floating objects

3D medical illustrations

Glassmorphism

Liquid Glass

Background blur

Hover glow

Floating particles

Gradient animations

SVG morphing

Premium loaders

Skeleton loading

===================================================

3D

Create premium Three.js experiences.

Hero section should have elegant floating 3D medical objects.

Do NOT overuse.

Subtle.

Professional.

===================================================

CLIENT REQUIREMENTS

Create

Home

About

Services

Individual Service Pages

Medical Equipment Rental

Careers

Testimonials

Blog

Videos

FAQ

Privacy Policy

Terms & Conditions

Refund Policy

Contact

Booking

===================================================

HOME PAGE

Luxury Hero

Video or animated background

Premium CTA

Statistics

Service Categories

Featured Services

Why Choose Us

Equipment Rental

Doctor/Nurse Section

Testimonials

Latest Blogs

Latest Videos

FAQ Preview

Google Reviews

Contact CTA

===================================================

SERVICES

Load dynamically using

/api/v1/services

Service Details

/api/v1/services/slug/{slug}

===================================================

BOOKING

Booking Form

Connect directly to

POST

/api/v1/bookings

Show loading

Validation

Success state

===================================================

MEDICAL EQUIPMENT

/api/v1/equipment

Equipment Details

/api/v1/equipment/slug/{slug}

Rental Form

POST

/api/v1/equipment/rentals

===================================================

CAREERS

/api/v1/careers

Career Details

Apply

/api/v1/careers/applications

Multipart upload

Resume upload

===================================================

BLOG

/api/v1/blogs

Blog Details

/api/v1/blogs/slug/{slug}

===================================================

VIDEOS

/api/v1/videos

===================================================

FAQ

/api/v1/faqs

===================================================

TESTIMONIALS

/api/v1/testimonials

===================================================

CONTACT

POST

/api/v1/contact

===================================================

SETTINGS

Load

/api/v1/settings

Social

/api/v1/settings/social

SEO

/api/v1/settings/seo

===================================================

GOOGLE REVIEWS

Load

/api/v1/reviews/summary

===================================================

SEO

Dynamic SEO

Meta

Open Graph

Twitter Cards

Canonical

Schema

Breadcrumb Schema

Medical Organization Schema

FAQ Schema

Blog Schema

===================================================

PERFORMANCE

95+ Lighthouse

Lazy Loading

Image Optimization

Code Splitting

Suspense

Prefetch

Responsive Images

===================================================

RESPONSIVE

Desktop

Laptop

Tablet

Mobile

Perfect on every device.

===================================================

ACCESSIBILITY

ARIA

Keyboard Navigation

Screen Readers

Proper Contrast

===================================================

API

Create a centralized API client.

Axios

JWT support if required

Global Error Handler

Retry

Loading

Caching

===================================================

IMPORTANT

Analyze the Swagger documentation completely before generating any code.

Automatically understand every endpoint.

Generate pages according to the available backend APIs.

Never create extra backend functionality.

Never create fake APIs.

Reuse every endpoint already available.

===================================================

EXISTING ADMIN PANEL

There is already an existing Admin Panel connected to this backend.

The public website must be fully compatible with the existing Admin Panel.

Whenever an admin updates

Services

Blogs

Equipment

Videos

Testimonials

FAQ

Website Settings

SEO

Social Links

Google Reviews

the public website must automatically reflect those changes through the existing APIs.

No hardcoded data.

===================================================

OUTPUT

Generate a complete production-ready React application.

If the response becomes too large,

continue automatically page by page without changing architecture until the entire project is completed.

Do not stop midway.

Never simplify the UI.

Always generate premium production-quality code.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://home-physio-india-care-nexus.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/12982650-520a-4fea-9c6d-3af15d57441c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
