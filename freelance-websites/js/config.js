/* =====================================================================
   SITE CONFIGURATION — edit this file before you deploy.
   ---------------------------------------------------------------------
   Every contact link, the WhatsApp button and the contact form on the
   main website read their details from here. Leave a value as an empty
   string ("") to hide that option automatically.

   Nothing here is sent anywhere until a visitor clicks a link or
   submits the form.
   ===================================================================== */
window.SITE_CONFIG = {
  /* Your public business email, e.g. "hello@yourdomain.com".
     Used for the email link and as the fallback for the contact form
     (the form opens the visitor's email app with their message ready). */
  email: "usman.me1703@gmail.com",

  /* WhatsApp number in international format, digits only, no "+" or spaces.
     Example for a Nigerian number 0801 234 5678 -> "2348012345678". */
  whatsapp: "0704 358 4812",

  /* Full profile URLs, e.g. "https://www.linkedin.com/in/your-handle/" */
  linkedin: "https://www.linkedin.com/in/rayneops/",
  github: "https://github.com/RayneOps/",

  /* OPTIONAL: a form-handling endpoint that accepts POST requests and
     returns a 2xx status (e.g. Formspree: "https://formspree.io/f/abcd1234").
     When set, the contact form submits here instead of opening email.
     Leave empty to use the email fallback above. */
  formEndpoint: "",

  /* Subject line used for email enquiries. */
  emailSubject: "Website enquiry"
};
