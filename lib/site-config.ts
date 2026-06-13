export const siteConfig = {
// Branding
gymName: "IronForge Fitness",
gymShortName: "IronForge",

// Marketing
tagline: "Elite coaching, world-class equipment and programs that deliver.",
ctaText: "Book your free trial session",

// Contact
phone: "+91 9876543210",
whatsapp: "919876543210",
email: "info@ironforgefitness.com",
address: "Varanasi, Uttar Pradesh",
} as const;

export const whatsappUrl = (message?: string) =>
`https://wa.me/${siteConfig.whatsapp}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;
