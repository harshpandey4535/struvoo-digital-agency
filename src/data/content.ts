// Replace these with approved contact details and social profiles before launch.
export const siteConfig = {
  contactEmail: "",
  socialLinks: { Instagram: "", LinkedIn: "", Behance: "" },
};

export const services = [
  {
    id: "performance",
    title: "Performance Marketing",
    shortTitle: "Performance marketing",
    description:
      "The right message. The right people. Real momentum. We turn attention into action with campaigns built around your goals.",
    detail:
      "A connected approach to reaching your audience, earning their attention, and turning meaningful interactions into business opportunities.",
    capabilities: [
      "Campaign strategy",
      "Paid social & search",
      "Audience targeting",
      "Conversion optimization",
      "Performance analysis",
    ],
    visualLabel: "FROM ATTENTION TO ACTION",
  },
  {
    id: "web",
    title: "Web Design & Development",
    shortTitle: "Web design & development",
    description:
      "Digital experiences that look exceptional and work even harder. Designed for people. Developed for possibility.",
    detail:
      "From the first wireframe to the last interaction, we create distinctive, responsive websites that connect a clear brand story with an intuitive user experience.",
    capabilities: [
      "Digital strategy & UX",
      "Art direction & UI",
      "Responsive development",
      "Conversion-focused design",
      "Performance & accessibility",
    ],
    visualLabel: "DESIGNED TO CONNECT",
  },
  {
    id: "video",
    title: "Video Editing",
    shortTitle: "Video editing",
    description:
      "Find the story. Set the pace. Make every frame matter. Compelling edits that stop the scroll and stay with people.",
    detail:
      "We bring footage into focus with intentional pacing, thoughtful sound, and visual storytelling, tailored to the platforms where your audience spends time.",
    capabilities: [
      "Brand films",
      "Social-first edits",
      "Story & narrative",
      "Color & sound",
      "Platform-ready deliverables",
    ],
    visualLabel: "EVERY FRAME, A PURPOSE",
  },
  {
    id: "motion",
    title: "Motion Graphics",
    shortTitle: "Motion graphics",
    description:
      "Ideas with a life of their own. Expressive motion, kinetic type, and visuals that make your brand impossible to ignore.",
    detail:
      "We translate your identity into a moving visual language. From a small interaction to a complete brand film, every movement has a reason.",
    capabilities: [
      "Kinetic typography",
      "Brand animation",
      "Explainer visuals",
      "Digital motion systems",
      "Social motion content",
    ],
    visualLabel: "IDEAS, SET IN MOTION",
  },
  {
    id: "social",
    title: "Social Media Management",
    shortTitle: "Social media management",
    description:
      "Not just a presence. A point of view. Consistent, relevant content that builds a brand people want to be part of.",
    detail:
      "A strategic, creative approach to your everyday presence. We build an editorial direction, shape the content, and keep the conversation moving.",
    capabilities: [
      "Content strategy",
      "Creative planning",
      "Account management",
      "Publishing & scheduling",
      "Brand consistency",
    ],
    visualLabel: "PRESENCE WITH A POINT OF VIEW",
  },
] as const;

export type Service = (typeof services)[number];

export const projects = [
  {
    id: "aether",
    title: "Aether",
    subtitle: "A quieter kind of bold.",
    industry: "Beauty & wellness",
    services: ["Brand direction", "Web experience", "Content design"],
    description:
      "An independent exploration of a more considered skincare experience. A tactile visual world, a quietly confident identity, and an editorial approach to digital commerce.",
    image: "/images/project-aether.jpg",
    alt: "Aether concept skincare in dark green glass on a sunlit sage pedestal",
    intention:
      "Bring the care of a daily ritual into every digital touchpoint. Calm compositions, thoughtful typography, and natural textures create a more human product experience.",
    deliverables: [
      "Visual direction & digital identity",
      "Responsive commerce concept",
      "Social content art direction",
    ],
    color: "#a7b09a",
  },
  {
    id: "velocity",
    title: "Velocity",
    subtitle: "Made to move.",
    industry: "Sport & lifestyle",
    services: ["Creative campaign", "Motion direction", "Digital experience"],
    description:
      "An independent campaign concept for a new generation of movement. Bold product storytelling meets a fast, expressive visual language built for digital-first audiences.",
    image: "/images/project-velocity.jpg",
    alt: "Velocity concept running shoe floating against burnt orange directional motion trails",
    intention:
      "Make movement feel tangible, even in a still frame. Directional compositions, striking contrast, and a motion-led content system put the product in a world of its own.",
    deliverables: [
      "Campaign concept & art direction",
      "Motion design exploration",
      "Digital launch experience",
    ],
    color: "#b94321",
  },
] as const;

export type Project = (typeof projects)[number];

export const principles = [
  [
    "Strategy before execution.",
    "A clear purpose behind every creative decision.",
  ],
  [
    "Creativity backed by data.",
    "Instinct opens possibilities. Insight gives them direction.",
  ],
  [
    "Designed around people.",
    "Intuitive experiences, built for the way people really interact.",
  ],
  [
    "Content that connects.",
    "Stories worth stopping for. Ideas worth coming back to.",
  ],
  [
    "Progress you can measure.",
    "Meaningful outcomes, not just another set of deliverables.",
  ],
] as const;

export const process = [
  [
    "Discover",
    "First, we listen.",
    "We get to know your business, your audience, and what moving forward means for you.",
  ],
  [
    "Strategize",
    "Give ambition a direction.",
    "We turn insights into a focused creative and performance roadmap.",
  ],
  [
    "Create",
    "Bring the vision to life.",
    "We design, develop, edit, and execute. Every detail, working together.",
  ],
  [
    "Optimize",
    "Keep moving forward.",
    "We measure, learn, and refine, turning each launch into the next opportunity.",
  ],
] as const;
