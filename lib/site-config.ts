export const siteConfig = {
// Branding
gymName: "Titan Gym",
gymShortName: "Titan",

// Marketing
tagline: "Elite coaching, world-class equipment and programs that deliver.",
ctaText: "Book your free trial session",

// Contact
phone: "+91 9876543210",
whatsapp: "919876543210",
email: "titangym@gmail.com",
address: "Varanasi, Uttar Pradesh",
} as const;

export const whatsappUrl = (message?: string) =>
`https://wa.me/${siteConfig.whatsapp}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;
