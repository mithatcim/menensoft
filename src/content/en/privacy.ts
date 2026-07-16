import { type PrivacySection } from "@/content/privacy";

/**
 * English privacy page (Phase 33F). Mirror of the Turkish one, and held to the
 * same rule: every line describes what the code actually does. Nothing here is
 * borrowed boilerplate, and it deliberately does NOT claim full KVKK/GDPR
 * compliance — that is a legal assessment, and only a lawyer can make one.
 */
export const privacyPageEn = {
  eyebrow: "Privacy",
  title: "What this site collects, and why",
  description:
    "Short and specific: what is collected, why, and what is deliberately not collected. Not a template — every line here describes what the site actually does.",
  updated: "Last updated: July 2026",

  sections: [
    {
      title: "Who runs this site",
      body: [
        "Menensoft is run by Mithat Yılmaz. Every question, request and deletion request about data goes straight to the address below — there is no support team and no queue in between.",
      ],
      items: ["Email: mithat.menen@gmail.com"],
    },

    {
      title: "What the forms collect",
      body: [
        "Browsing the site requires giving nothing. Only if you submit a form — /en/start-project, /en/contact or their Turkish equivalents — is anything recorded:",
      ],
      items: [
        "Your name",
        "Your email address",
        "Your phone / WhatsApp number, if you wrote one (it is optional)",
        "Your message, exactly as you sent it — whatever you edited it to say",
        "The system type and current situation you picked, if you used the wizard",
        "The project you came from, if you arrived from a project page",
        "The page you submitted from, and its language",
        "Device type (mobile / tablet / desktop), derived from what your browser sends",
        "Country code — only if the hosting provider passes it along; otherwise blank",
        "The time you sent it",
      ],
      note: "Your raw IP address is not stored. There is no such column in the database.",
    },

    {
      title: "Why the forms collect it",
      body: [
        "Only so we can reply to you and assess what you are asking for. Your message goes straight to the founder.",
        "It is not sold, not shared with ad networks, and not added to a marketing list. You will only be contacted about what you wrote.",
      ],
    },

    {
      title: "Analytics",
      body: [
        "There is no Google Analytics on this site. There is no third-party tracking script of any kind. Visitor data lives only on this site's own server, in its own database.",
        "The visitor identifier is computed on the SERVER, not in your browser: a secret value that changes every day is combined with your IP address and browser details and turned into a one-way digest. The IP address exists only in memory during that calculation and is written nowhere.",
        "Because the secret rotates daily, yesterday's identifier does not match today's. Following you across days is not merely disallowed — it is technically impossible. That is a consequence of the design, not a promise.",
      ],
      items: [
        "No cookies are used for analytics.",
        "No visitor identifier is written to localStorage.",
        "No fingerprinting.",
        "No raw IP address is stored.",
        "Only the HOSTNAME of a referring site is kept, never the full URL — a full URL can carry your search query or a private page.",
        "If your browser sends Do Not Track or Global Privacy Control, nothing at all is recorded.",
        "Bots and crawlers are not recorded.",
      ],
      note: "Time-on-site figures are approximate: how long you spent on the last page you looked at cannot be measured. The numbers in the admin panel are a subset of real traffic.",
    },

    {
      title: "Connecting a form to a site session",
      body: [
        "When you submit a form, that submission may be matched to your anonymous site session from the same day. In other words, the admin panel can see which pages you looked at before you wrote in, alongside the message you sent.",
        "The matching happens entirely on the server. Your browser is given no identifier; it does not carry one, and it could not send one even if it tried. The match is made by recomputing the same daily digest described above.",
        "To be direct: this is a step further than before. We used to say these two records were never joined. Now they are. We would rather write that here than change it quietly later.",
      ],
      items: [
        "Your raw IP address is still not stored.",
        "There are still no cookies.",
        "No analytics identifier is still written to localStorage.",
        "There is still no cross-day tracking — a match is only possible within the same day, because the secret rotates daily.",
        "Your browser still receives no analytics identifier of any kind.",
        "If no match is found (analytics off, DNT/GPC enabled, or the session window closed), the message is still saved — the session link is simply left empty.",
      ],
      note: "Why we do it: to see which pages actually bring in work. Not how many visitors there are — which content is worth writing.",
    },

    {
      title: "Who can see this data",
      body: [
        "Submitted messages and analytics summaries are visible only in the owner's password-protected admin panel. The panel is closed to search engines and is not linked from anywhere on the site.",
        "The data is not shared with third parties. Nobody has access to it besides the server and database hosting providers.",
      ],
    },

    {
      title: "How long it is kept",
      body: [
        "Form messages are a record of business correspondence and are kept until you ask for them to be deleted, or until they are no longer needed.",
        "The target retention for analytics records is 12 months.",
      ],
      note: "To be honest about it: automated deletion is not set up yet. Deletion is done by hand on request. We would rather say that than imply an automation that does not exist.",
    },

    {
      title: "Your options",
      body: [
        "You do not have to use a form: email or WhatsApp reach the same place.",
        "If you want a message you sent deleted or corrected, just write from the same address. There is no verification process and no form to fill in.",
        "If you turn on Do Not Track or Global Privacy Control in your browser, none of your analytics events are recorded at all.",
      ],
    },

    {
      title: "Cookies and browser storage",
      body: [
        "This site sets no marketing cookies and no analytics cookies. That is why there is no cookie consent popup — there is nothing to consent to.",
      ],
      items: [
        "Analytics: no cookie, no localStorage identifier.",
        "Language suggestion: if you dismiss the language hint or pick a language, that choice is stored in your browser — solely so you are not shown the same suggestion again. It is not an identifier and it is never sent to the server.",
        "Wizard draft: the message you type on /en/start-project is kept in your browser until you close the tab, so a stray back-navigation does not destroy it. It is not sent to the server.",
        "Campaign panel: if you close the panel, a small marker is kept in your browser so it is not shown again during the same session. It is not an identity and is not sent to the server.",
        "Admin login: a secure session cookie is used only for the owner to sign in to the panel. Visitors never receive it.",
      ],
    },

    {
      title: "The limits of this page",
      body: [
        "This describes how the site handles data today. It is not legal advice and it does not certify full KVKK/GDPR compliance — only a lawyer can assess that.",
        "If the implementation changes, this page changes with it. If you have a question, just write; you do not need to fill in a form to get an answer.",
      ],
    },
  ] satisfies PrivacySection[],
};
