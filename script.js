/* ==========================================================
   SkillForge - script.js (vanilla JS, no dependencies besides Lucide icons)
   ========================================================== */
(() => {
  "use strict";

  /* ---------- Helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const refreshIcons = () => { if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons(); };
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================
     DATA
     ========================================================== */
  const CATEGORIES = [
    {
      id: "ai", icon: "bot", title: "AI and Automation",
      desc: "Writing prompts alone is not a durable career strategy. Combining AI tools with domain expertise and real-world execution creates far more value.",
      tags: ["AI literacy", "Generative AI", "Automation", "AI agents"],
      items: ["AI literacy and responsible AI use", "Generative AI tools and workflows", "AI automation and workflow design", "AI agents and tool integration", "Prompting and evaluating AI outputs"],
      filter: "ai"
    },
    {
      id: "software", icon: "code-2", title: "Software Engineering",
      desc: "AI can generate code, but understanding requirements, validating solutions, securing applications, and maintaining reliable systems remain essential.",
      tags: ["Programming", "APIs", "Databases", "Testing"],
      items: ["Programming fundamentals", "Frontend and backend development", "APIs and system integration", "Databases and data modeling", "Software architecture and debugging", "Testing, deployment, and maintenance"],
      filter: "technology"
    },
    {
      id: "security", icon: "shield-check", title: "Cybersecurity and Cloud Computing",
      desc: "Security needs continuous judgment, adaptation to new threats, and responsibility for protecting real systems and real people.",
      tags: ["Security", "Cloud", "IAM", "Incident response"],
      items: ["Network and application security", "Cloud infrastructure", "Identity and access management", "Secure software development", "Monitoring, incident response, and risk management"],
      filter: "technology"
    },
    {
      id: "data", icon: "bar-chart-3", title: "Data and Analytical Thinking",
      desc: "Collecting data is not enough. Understanding what it means and making responsible, evidence-based decisions from it is equally important.",
      tags: ["SQL", "Statistics", "Visualization", "BI"],
      items: ["SQL and database management", "Data visualization", "Statistics and analytical reasoning", "Business intelligence", "Data quality and interpretation", "Decision-making based on evidence"],
      filter: "technology"
    },
    {
      id: "human", icon: "users", title: "Human-Centered Skills",
      desc: "These skills complement AI and matter most when work involves people, ambiguity, trust, and accountability.",
      tags: ["Critical thinking", "Communication", "Leadership", "Design thinking"],
      items: ["Critical thinking", "Communication", "Leadership and teamwork", "Negotiation and conflict resolution", "Creativity and design thinking", "Teaching and mentoring"],
      filter: "human"
    },
    {
      id: "business", icon: "briefcase", title: "Business and Entrepreneurship",
      desc: "Businesses need people who understand customer problems, make decisions, coordinate teams, and turn ideas into measurable outcomes.",
      tags: ["Product", "Marketing", "Finance", "Operations"],
      items: ["Product management", "Business analysis", "Sales and customer relationships", "Digital marketing strategy", "Financial literacy", "Operations and process improvement", "Entrepreneurship and innovation"],
      filter: "business"
    }
  ];

  const FILTER_LABELS = { technology: "Technology", ai: "AI and Automation", business: "Business", creative: "Creative Skills", human: "Human Skills" };

  const SKILLS = [
    { name: "Programming Fundamentals", cat: "technology", level: "Beginner", time: "2-4 months", desc: "Variables, logic, functions, data structures, and debugging in a language like Python or JavaScript.", why: "Every other technical skill builds on it, and it lets you check what AI-generated code actually does.", project: "A command-line or browser to-do app with saved data.", prereq: "Basic computer skills.", evolve: "Pair it with a domain (finance, health, education) and with AI-assisted development to move faster while still reviewing every change." },
    { name: "Frontend Development", cat: "technology", level: "Beginner", time: "3-5 months", desc: "Building usable, accessible, responsive interfaces with HTML, CSS, and JavaScript.", why: "Products live or die by their interface, and accessibility and performance need human judgment.", project: "A responsive personal portfolio with an accessible navigation menu.", prereq: "Programming basics helpful but not required.", evolve: "AI can scaffold layouts; your edge is UX judgment, accessibility, performance, and fitting the design to real users." },
    { name: "Backend Development and APIs", cat: "technology", level: "Intermediate", time: "4-6 months", desc: "Designing servers, REST APIs, authentication, and business logic.", why: "Reliable data handling, security, and integration decisions affect real users and money.", project: "A REST API for a task manager with user accounts.", prereq: "Programming fundamentals, basic HTTP knowledge.", evolve: "Combine with databases, security, and cloud skills so you can own a feature from design to production." },
    { name: "Databases and SQL", cat: "technology", level: "Beginner", time: "1-3 months", desc: "Modeling data, writing queries, and designing tables that stay correct as systems grow.", why: "Almost every product stores data, and bad data models are costly to fix later.", project: "Design a small store database and write reports with joins and aggregates.", prereq: "Spreadsheet comfort.", evolve: "Use AI to draft queries, but verify results, performance, and edge cases yourself." },
    { name: "Cybersecurity Fundamentals", cat: "technology", level: "Intermediate", time: "6-12 months", desc: "Networking, Linux, web application security, and defensive monitoring.", why: "Attackers adapt constantly, and organizations need people accountable for protecting real systems.", project: "Harden a sample web app and document each fix (in an authorized lab only).", prereq: "Networking and Linux basics, scripting.", evolve: "AI helps both attackers and defenders, so combine security with cloud, automation, and clear risk communication." },
    { name: "Cloud Computing", cat: "technology", level: "Intermediate", time: "3-6 months", desc: "Deploying and operating applications on cloud platforms with sensible cost and security controls.", why: "Most modern software runs in the cloud, and misconfiguration is a common source of failures.", project: "Deploy a small app with a database, monitoring, and a budget alert.", prereq: "Linux basics, networking basics.", evolve: "Add infrastructure-as-code, security, and cost management so your value goes beyond clicking through consoles." },
    { name: "Data Analysis and Visualization", cat: "technology", level: "Beginner", time: "3-5 months", desc: "Cleaning data, finding patterns, and presenting findings clearly with charts and dashboards.", why: "Organizations need people who can explain what numbers mean and what to do next.", project: "Analyze a public dataset and publish a short findings report with charts.", prereq: "Spreadsheets, basic statistics.", evolve: "AI can summarize tables fast; you add context, skepticism about data quality, and decision support." },

    { name: "AI Literacy and Responsible Use", cat: "ai", level: "Beginner", time: "3-6 weeks", desc: "Understanding what AI models can and cannot do, including bias, privacy, and hallucinations.", why: "People who use AI well and safely are more effective than people who avoid it or trust it blindly.", project: "Write a personal AI-use policy and test it on five real tasks.", prereq: "None.", evolve: "Keep learning as tools change, and combine it with a field you know deeply." },
    { name: "AI Workflow Automation", cat: "ai", level: "Intermediate", time: "2-4 months", desc: "Designing multi-step workflows that connect apps, APIs, and AI models with error handling.", why: "Teams value reliable automation, not one-off demos.", project: "Automate lead intake: capture, classify with AI, notify a human, log results.", prereq: "APIs and webhooks basics, some scripting.", evolve: "Domain knowledge and exception handling are what make automations trustworthy." },
    { name: "AI Agents and Tool Integration", cat: "ai", level: "Advanced", time: "3-6 months", desc: "Building systems where AI models call tools, follow constraints, and request human approval for risky steps.", why: "Agents can act in the real world, so permissions, logging, and safety design matter a lot.", project: "An agent that drafts replies from a knowledge base and asks approval before sending.", prereq: "Programming, APIs, AI literacy.", evolve: "The field moves quickly, so keep fundamentals strong: testing, security, and evaluation." },
    { name: "Evaluating AI Outputs", cat: "ai", level: "Intermediate", time: "1-3 months", desc: "Checking AI results for accuracy, bias, and fit using test cases, sources, and review checklists.", why: "Unchecked AI output creates real risk, and reviewers who catch problems are valuable.", project: "Build a 30-case evaluation set for a summarization task and score results.", prereq: "AI literacy, basic statistics helpful.", evolve: "Combine with subject expertise so your review is grounded in real standards." },

    { name: "Product Management", cat: "business", level: "Intermediate", time: "4-8 months", desc: "Finding real user problems, prioritizing work, and aligning teams around measurable outcomes.", why: "Building the right thing matters more as building anything gets cheaper.", project: "Write a product brief, define success metrics, and test it with 5 user interviews.", prereq: "Communication skills, basic analytics.", evolve: "Pair with technical literacy and data skills, and use AI to speed up research while owning decisions." },
    { name: "Business Analysis", cat: "business", level: "Intermediate", time: "3-6 months", desc: "Turning vague business needs into clear requirements, processes, and measurable improvements.", why: "Good requirements prevent expensive mistakes, with or without AI-generated solutions.", project: "Map a real process, find bottlenecks, and propose three improvements with expected impact.", prereq: "Communication, spreadsheets.", evolve: "Add SQL and automation skills so you can both diagnose and implement." },
    { name: "Digital Marketing Strategy", cat: "business", level: "Beginner", time: "2-4 months", desc: "Understanding audiences, positioning, channels, and measuring what actually drives results.", why: "AI can produce content in volume, but strategy and audience insight decide what is worth publishing.", project: "Plan and run a small two-week campaign for a real or sample product, then report results.", prereq: "Writing basics.", evolve: "Combine analytics, storytelling, and experimentation, and use AI as a drafting assistant, not the strategist." },
    { name: "Financial Literacy", cat: "business", level: "Beginner", time: "1-3 months", desc: "Budgeting, pricing, cash flow, and reading basic financial statements.", why: "It improves personal decisions and is essential for freelancing and running a business.", project: "Build a 12-month budget and pricing model for a freelance service.", prereq: "Basic arithmetic.", evolve: "Pair it with analytics or operations to support better business decisions." },

    { name: "UX and Design Thinking", cat: "creative", level: "Intermediate", time: "3-6 months", desc: "Researching users, prototyping solutions, and testing usability before building.", why: "AI can generate screens, but understanding people and context still requires human judgment.", project: "Redesign one app flow, test it with 5 people, and document what changed.", prereq: "Basic design awareness, empathy and curiosity.", evolve: "Add front-end and research skills so you can validate and ship, not just sketch." },
    { name: "Content Strategy and Storytelling", cat: "creative", level: "Beginner", time: "2-4 months", desc: "Planning and creating content that serves a defined audience and business goal.", why: "Audience understanding and a distinct voice are harder to automate than raw text output.", project: "Create a 4-week content plan with one long piece and measured outcomes.", prereq: "Writing practice.", evolve: "Use AI for drafts and research, then add original insight, editing, and credibility." },
    { name: "Visual and Brand Design", cat: "creative", level: "Beginner", time: "3-5 months", desc: "Layout, typography, color, and consistent visual identity across products.", why: "Brand trust comes from consistent, intentional decisions that AI tools do not make for you.", project: "Create a small brand kit and apply it to a landing page and social posts.", prereq: "None.", evolve: "Combine with UX and front-end skills, and use AI for exploration while you curate and refine." },

    { name: "Critical Thinking", cat: "human", level: "Beginner", time: "Ongoing", desc: "Questioning assumptions, weighing evidence, and spotting weak arguments or biased data.", why: "It is the base skill for checking AI output and making sound decisions.", project: "Write a one-page evaluation of a claim, listing evidence for and against.", prereq: "None.", evolve: "Practice it inside a specific field, where good judgment is most visible." },
    { name: "Communication and Presentation", cat: "human", level: "Beginner", time: "2-4 months", desc: "Explaining complex ideas clearly in writing, in meetings, and in presentations.", why: "Ideas only create value when others understand and trust them.", project: "Present a technical or business topic in 10 minutes and collect feedback.", prereq: "None.", evolve: "Pair with a technical or domain skill, and use AI for feedback while keeping your own voice." },
    { name: "Leadership and Teamwork", cat: "human", level: "Intermediate", time: "6-12 months", desc: "Setting direction, giving feedback, coordinating people, and building trust.", why: "Accountability and trust between people are hard to hand off to software.", project: "Lead a small team project with clear roles, check-ins, and a retrospective.", prereq: "Communication basics.", evolve: "Learn how AI changes team workflows so you can lead mixed human and AI processes responsibly." },
    { name: "Negotiation and Conflict Resolution", cat: "human", level: "Intermediate", time: "2-5 months", desc: "Finding agreements, handling disagreement, and protecting relationships under pressure.", why: "It matters in freelancing, sales, management, and any work with competing interests.", project: "Role-play three negotiation scenarios and write what you would change.", prereq: "Communication basics.", evolve: "Combine with domain knowledge, since credibility and context drive good deals." }
  ];

  const PATHS = [
    { id: "a", icon: "code-2", title: "AI-Powered Software Developer", duration: "9-14 months", level: "Beginner to Intermediate", summary: "Go from web fundamentals to publishing full-stack projects, using AI as an assistant while you stay in charge of quality.", steps: ["HTML and CSS", "JavaScript and programming fundamentals", "Git and GitHub", "Frontend development", "Backend development and APIs", "Databases and SQL", "AI-assisted development", "Testing, deployment, and security", "Build and publish real projects"] },
    { id: "b", icon: "workflow", title: "AI Automation Specialist", duration: "3-5 months", level: "Beginner to Intermediate", summary: "Learn to design dependable AI-powered workflows with proper safety, error handling, and human review.", steps: ["Understand AI fundamentals", "Learn workflow design", "Use automation platforms", "Understand APIs and webhooks", "Learn basic JavaScript or Python", "Build AI-powered workflows", "Learn AI agent fundamentals and safety", "Deploy practical automation projects"] },
    { id: "c", icon: "line-chart", title: "Data Analyst", duration: "4-7 months", level: "Beginner", summary: "Build the full analyst toolkit, from spreadsheets and SQL to dashboards and a portfolio of real analyses.", steps: ["Spreadsheets", "SQL", "Statistics fundamentals", "Data cleaning", "Data visualization", "Business intelligence tools", "AI-assisted analysis", "Build a portfolio of real analyses"] },
    { id: "d", icon: "shield-check", title: "Cybersecurity Professional", duration: "9-15 months", level: "Intermediate", summary: "Develop defensive security skills step by step and practice only in authorized, legal lab environments.", steps: ["Computer and networking fundamentals", "Linux basics", "Operating systems and security concepts", "Scripting fundamentals", "Web application security", "Cloud security fundamentals", "Defensive monitoring and incident response", "Practice in authorized labs"] },
    { id: "e", icon: "rocket", title: "Digital Product and Business Builder", duration: "4-7 months", level: "Beginner to Intermediate", summary: "Learn to find real problems, design solutions, reach customers, and validate a real project.", steps: ["Problem identification", "Market and customer research", "Product design fundamentals", "Communication and presentation", "Digital marketing", "AI-assisted productivity", "Business analytics", "Launch and validate a real project"] }
  ];

  const VS = [
    { ai: "AI generates code", aiIcon: "code-2", human: "Engineers validate, integrate, and maintain systems", humanIcon: "wrench", detail: "Requirements, security, and long-term reliability still need accountable people." },
    { ai: "AI summarizes data", aiIcon: "table-2", human: "Analysts investigate context and support decisions", humanIcon: "search", detail: "Knowing what the numbers mean for a real situation takes domain knowledge." },
    { ai: "AI generates designs", aiIcon: "image", human: "Designers understand users and evaluate usability", humanIcon: "pen-tool", detail: "Testing with real people reveals what a generated layout cannot." },
    { ai: "AI drafts content", aiIcon: "file-text", human: "Strategists understand audiences, positioning, and goals", humanIcon: "megaphone", detail: "Knowing what to say, to whom, and why is a strategic judgment." },
    { ai: "AI automates workflows", aiIcon: "workflow", human: "Professionals define requirements, handle exceptions, and ensure accountability", humanIcon: "user-check", detail: "Someone must decide what is acceptable and own the outcome." }
  ];

  const PROJECTS = [
    { icon: "layout-template", title: "Responsive Personal Portfolio", level: "Beginner", time: "1-2 weeks", skills: ["HTML", "CSS", "Responsive design", "Accessibility"], desc: "Create a fast, accessible portfolio that presents who you are and what you can do.", outcomes: ["Semantic HTML and responsive layouts", "Basic accessibility and performance habits", "Publishing a site on free static hosting"], steps: ["Plan sections and content", "Build the layout mobile-first", "Add navigation and a contact area", "Test on several screen sizes", "Publish and share the link"] },
    { icon: "list-checks", title: "Full-Stack Task Management App", level: "Intermediate", time: "3-5 weeks", skills: ["JavaScript", "Backend and APIs", "Databases", "Authentication"], desc: "Build an app where users sign up, create tasks, and manage them with a real database.", outcomes: ["Designing REST APIs", "Modeling and querying data", "Handling users and sessions securely"], steps: ["Define features and data model", "Build the API and database", "Create the frontend", "Add authentication and validation", "Write tests and deploy"] },
    { icon: "headset", title: "AI-Assisted Customer Support Workflow", level: "Intermediate", time: "2-3 weeks", skills: ["Automation", "APIs", "Prompt design", "Evaluation"], desc: "Design a workflow that classifies support requests, drafts replies from a knowledge base, and routes sensitive cases to a human.", outcomes: ["Designing human-in-the-loop systems", "Evaluating AI answer quality", "Handling errors and edge cases"], steps: ["Collect sample tickets", "Define categories and rules", "Build the workflow", "Create an evaluation set", "Add human approval for risky replies"] },
    { icon: "bar-chart-3", title: "Interactive Business Analytics Dashboard", level: "Intermediate", time: "2-4 weeks", skills: ["SQL", "Data visualization", "Statistics", "Storytelling"], desc: "Turn a public or sample business dataset into a dashboard that answers specific questions.", outcomes: ["Cleaning and validating data", "Choosing effective charts", "Communicating insights to non-experts"], steps: ["Pick a dataset and key questions", "Clean and model the data", "Build core charts", "Add filters and context", "Write a short insights summary"] },
    { icon: "lock-keyhole", title: "Secure Authentication Demo", level: "Advanced", time: "2-4 weeks", skills: ["Web security", "Backend", "Cryptography basics", "Testing"], desc: "Implement sign-up and login with proper password handling, sessions, and basic protection against common web attacks, tested only on your own app.", outcomes: ["Secure password storage practices", "Session and token handling", "Reading security guidance such as OWASP"], steps: ["Review OWASP authentication guidance", "Implement registration and login", "Add rate limiting and validation", "Test against common mistakes in your own lab", "Document your threat model"] },
    { icon: "file-bar-chart", title: "Automated Business Reporting Tool", level: "Intermediate", time: "2-3 weeks", skills: ["Python or JavaScript", "Data handling", "Automation", "Scheduling"], desc: "Build a tool that collects data, creates a weekly report, and delivers it on a schedule.", outcomes: ["Automating repeatable work", "Validating data before reporting", "Logging and handling failures"], steps: ["Define the report and audience", "Collect and clean the data", "Generate charts and summaries", "Schedule the run", "Add checks and failure alerts"] }
  ];

  const RESOURCES = [
    { icon: "code-2", title: "Programming Fundamentals", links: [
      { n: "MDN Web Docs", u: "https://developer.mozilla.org/", t: "Free" },
      { n: "freeCodeCamp", u: "https://www.freecodecamp.org/", t: "Free" },
      { n: "CS50 (Harvard)", u: "https://cs50.harvard.edu/x/", t: "Free" },
      { n: "GitHub Skills", u: "https://skills.github.com/", t: "Free" } ] },
    { icon: "bot", title: "AI Literacy", links: [
      { n: "Elements of AI", u: "https://www.elementsofai.com/", t: "Free" },
      { n: "Google Machine Learning Crash Course", u: "https://developers.google.com/machine-learning/crash-course", t: "Free" },
      { n: "Microsoft Learn", u: "https://learn.microsoft.com/en-us/training/", t: "Free" } ] },
    { icon: "cloud", title: "Cloud and Cybersecurity", links: [
      { n: "Google Cloud Skills Boost", u: "https://www.cloudskillsboost.google/", t: "Freemium" },
      { n: "Microsoft Learn", u: "https://learn.microsoft.com/en-us/training/", t: "Free" },
      { n: "OWASP Top Ten", u: "https://owasp.org/www-project-top-ten/", t: "Free" },
      { n: "TryHackMe", u: "https://tryhackme.com/", t: "Freemium" } ] },
    { icon: "bar-chart-3", title: "Data Analysis", links: [
      { n: "Kaggle Learn", u: "https://www.kaggle.com/learn", t: "Free" },
      { n: "SQLBolt", u: "https://sqlbolt.com/", t: "Free" },
      { n: "Khan Academy Statistics", u: "https://www.khanacademy.org/math/statistics-probability", t: "Free" } ] },
    { icon: "users", title: "Communication and Leadership", links: [
      { n: "MIT OpenCourseWare", u: "https://ocw.mit.edu/", t: "Free" },
      { n: "Coursera", u: "https://www.coursera.org/", t: "Freemium" },
      { n: "Toastmasters International", u: "https://www.toastmasters.org/", t: "Paid" } ] },
    { icon: "briefcase", title: "Business and Product Management", links: [
      { n: "Startup School", u: "https://www.startupschool.org/", t: "Free" },
      { n: "HubSpot Academy", u: "https://academy.hubspot.com/", t: "Free" },
      { n: "Coursera", u: "https://www.coursera.org/", t: "Freemium" } ] }
  ];

  const FAQS = [
    { q: "Which skills are worth learning in the AI era?", a: ["Skills that combine technical ability, human judgment, and real-world results tend to hold value best: programming, data analysis, security, communication, product thinking, and responsible AI use.", "No one can guarantee which skills stay stable. Choose based on your interests, local and online market demand, and your willingness to practice consistently."] },
    { q: "Is coding still worth learning when AI can generate code?", a: ["Yes for most people, but the way you use it changes. AI can write code quickly, yet someone still needs to define requirements, review results, find bugs, secure systems, and maintain them.", "Learning to code helps you judge and direct AI output instead of trusting it blindly."] },
    { q: "Should beginners learn programming or AI tools first?", a: ["Start with the basics of both in small doses. Spend a few weeks on AI literacy, then learn programming or another core skill with AI as a tutor, not a shortcut.", "If AI writes everything for you, you may finish projects without understanding them. Make sure you can explain every part of what you build."] },
    { q: "How long does it take to learn a new skill?", a: ["It varies a lot. A focused beginner may reach job-ready basics in several months, while advanced areas like security or software architecture can take a year or more.", "Your previous knowledge, weekly study time, and quality of practice matter more than any published timeline."] },
    { q: "Can I learn these skills for free?", a: ["Many of them, yes. Resources like MDN, freeCodeCamp, CS50, GitHub Skills, and Microsoft Learn offer free material.", "Some platforms have paid tiers, certificates, or labs. Free resources work well if you stay consistent and build projects."] },
    { q: "Which skills are useful for freelancing?", a: ["Skills with clear, sellable outcomes work well: web development, automation, data analysis and reporting, design, content, and marketing strategy.", "Communication, pricing, and reliability matter just as much as technical skill. Start with a narrow service and a few real client results."] },
    { q: "How can I prove my skills without a degree?", a: ["Show real work: published projects, case studies explaining your decisions, contributions to open source, and results for real users or clients.", "Some people also add certifications. They can help, but a strong portfolio and clear communication usually say more about what you can actually do."] },
    { q: "Are any skills completely safe from AI automation?", a: ["No. It is risky to assume any skill is permanently safe. AI changes tasks inside almost every field.", "A better strategy is to build adaptable expertise: deep fundamentals, domain knowledge, good judgment, and the ability to use AI tools effectively and responsibly."] }
  ];

  /* ---------- Recommender data ---------- */
  const LEVEL_LABELS = { beginner: "complete beginner", some: "learner with some experience", pro: "experienced professional" };
  const GOAL_PHRASES = { job: "get a job", freelance: "start freelancing", business: "build a business", career: "improve your current career" };
  const GOAL_TIPS = {
    job: "Aim for three polished projects, a clear portfolio, and regular interview practice.",
    freelance: "Package your skill into one clear service, price it sensibly, and collect feedback and testimonials from real clients.",
    business: "Validate demand with real customers before building anything big, and keep early costs low.",
    career: "Apply each new skill to a real problem at your current workplace and document the results."
  };
  const INTERESTS = {
    tech: { category: "Software Engineering", label: "Technology and Coding", path: "a", filter: "technology",
      steps: {
        beginner: ["Learn HTML, CSS, and basic JavaScript with small daily exercises", "Learn Git and GitHub and publish every mini project", "Build and deploy your first responsive website"],
        some: ["Learn backend basics and REST APIs with Node.js or Python", "Add a database and SQL to a real project", "Write tests and deploy with a simple automated pipeline"],
        pro: ["Study system design and architecture trade-offs", "Learn secure coding practices and threat modeling (start with OWASP)", "Adopt AI-assisted development with strict code review habits"] },
      project: { beginner: "A responsive personal portfolio with three real sections.", some: "A full-stack task manager with login and a database.", pro: "A production-style service with tests, monitoring, and a written design document." } },
    ai: { category: "AI and Automation", label: "AI and Automation", path: "b", filter: "ai",
      steps: {
        beginner: ["Learn AI literacy: capabilities, limits, bias, and privacy", "Practice checking AI answers against trusted sources", "Automate one small repeated task with a no-code tool"],
        some: ["Learn APIs and webhooks to connect tools", "Build a multi-step workflow with error handling and human review", "Learn basic Python or JavaScript for custom steps"],
        pro: ["Design agent workflows with tool permissions and guardrails", "Build evaluation sets to measure output quality", "Add logging, cost tracking, and failure handling"] },
      project: { beginner: "A personal research-and-summary workflow with a verification checklist.", some: "An AI-assisted customer support triage workflow.", pro: "An evaluated AI agent that asks for human approval before risky actions." } },
    data: { category: "Data and Analytical Thinking", label: "Data and Analytics", path: "c", filter: "technology",
      steps: {
        beginner: ["Master spreadsheets: formulas, pivot tables, and charts", "Learn SQL basics: SELECT, WHERE, JOIN, GROUP BY", "Learn core statistics: mean, median, variance, distributions"],
        some: ["Practice data cleaning in SQL or Python", "Learn visualization and dashboard design", "Learn hypothesis testing and the difference between correlation and causation"],
        pro: ["Build repeatable data pipelines with quality checks", "Learn experiment design and causal thinking", "Use AI to speed up analysis while validating every result"] },
      project: { beginner: "Analyze a public dataset and write a one-page findings summary.", some: "An interactive business analytics dashboard.", pro: "An automated reporting tool with built-in data validation." } },
    biz: { category: "Business and Entrepreneurship", label: "Business and Entrepreneurship", path: "e", filter: "business",
      steps: {
        beginner: ["Learn to identify and describe real customer problems", "Interview five potential customers and record what you learn", "Learn the basics of value propositions and pricing"],
        some: ["Learn product discovery and prioritization methods", "Learn digital marketing fundamentals and basic analytics", "Run a small landing page test with a clear metric"],
        pro: ["Learn unit economics and simple financial modeling", "Learn experimentation and growth strategy", "Use AI to speed up research and drafting while you own the decisions"] },
      project: { beginner: "A one-page business case for a small idea, backed by five conversations.", some: "A landing page and validation experiment with measured results.", pro: "A launch plan with metrics, budget, and a 90-day roadmap." } },
    creative: { category: "Human-Centered and Creative Skills", label: "Creative and Human-Centered Skills", path: "e", filter: "creative",
      steps: {
        beginner: ["Learn design basics: layout, color, typography, hierarchy", "Practice clear writing and simple presentations", "Learn user empathy by interviewing and observing real people"],
        some: ["Learn UX research and usability testing", "Learn storytelling and content strategy", "Learn a prototyping tool and build a clickable prototype"],
        pro: ["Learn design systems and accessibility at scale", "Develop facilitation, mentoring, and team leadership skills", "Use AI for exploration while keeping human review for quality and ethics"] },
      project: { beginner: "Redesign one app screen and explain each decision.", some: "A clickable prototype tested with five users.", pro: "A documented design system with accessibility checks." } }
  };

  /* ---------- Progress data ---------- */
  const CHECKLIST = [
    { group: "Foundation", items: [
      { id: "f1", t: "Pick one skill track and write down why" },
      { id: "f2", t: "Set a weekly study schedule" },
      { id: "f3", t: "Finish one beginner course or tutorial series" },
      { id: "f4", t: "Learn to verify AI-generated answers" } ] },
    { group: "Practice", items: [
      { id: "p1", t: "Build a small practice project" },
      { id: "p2", t: "Write notes explaining what you learned in your own words" },
      { id: "p3", t: "Get feedback from a peer or mentor" },
      { id: "p4", t: "Fix and improve one project after feedback" } ] },
    { group: "Showcase", items: [
      { id: "s1", t: "Publish a project online" },
      { id: "s2", t: "Write a short case study of your project" },
      { id: "s3", t: "Update your resume or profile with real work" },
      { id: "s4", t: "Apply to a job, client, or contest" } ] }
  ];
  const DAYS = [
    { id: "mon", label: "Mon", def: "Learn: one core concept" },
    { id: "tue", label: "Tue", def: "Practice exercises" },
    { id: "wed", label: "Wed", def: "Build: next project step" },
    { id: "thu", label: "Thu", def: "Learn: one new concept" },
    { id: "fri", label: "Fri", def: "Build and debug" },
    { id: "sat", label: "Sat", def: "Review and publish" },
    { id: "sun", label: "Sun", def: "Rest or light reading" }
  ];
  const ROUTINE = [
    "<strong>5 min:</strong> Pick today's single goal.",
    "<strong>30 min:</strong> Focused learning, no distractions.",
    "<strong>35 min:</strong> Hands-on practice or project work.",
    "<strong>10 min:</strong> Write notes in your own words.",
    "<strong>10 min:</strong> Quiz yourself, or ask AI to quiz you and check the answers against a trusted source."
  ];
  const ROADMAP = [
    "<strong>Month 1:</strong> Complete a small foundation project and publish it.",
    "<strong>Month 2:</strong> Build a core project that uses your main skill in depth.",
    "<strong>Month 3:</strong> Solve a real problem for a real person, such as a friend, a club, or a small business.",
    "<strong>Month 4:</strong> Write case studies, polish your portfolio, and share your work with the people who might hire you."
  ];
  const STORAGE_KEY = "skillforge-progress-v1";

  /* ==========================================================
     UI: Modal
     ========================================================== */
  const modal = (() => {
    const root = $("#modal");
    const panel = $(".modal-panel", root);
    const body = $("#modal-body");
    let lastFocus = null;

    const focusables = () => $$('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])', panel).filter((el) => el.offsetParent !== null);

    function open(html) {
      lastFocus = document.activeElement;
      body.innerHTML = html;
      refreshIcons();
      root.hidden = false;
      document.body.classList.add("modal-open");
      panel.scrollTop = 0;
      panel.focus();
    }
    function close() {
      if (root.hidden) return;
      root.hidden = true;
      body.innerHTML = "";
      document.body.classList.remove("modal-open");
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }
    root.addEventListener("click", (e) => { if (e.target === root || e.target.closest("[data-close]")) close(); });
    document.addEventListener("keydown", (e) => {
      if (root.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) { e.preventDefault(); panel.focus(); return; }
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    return { open, close };
  })();

  /* ==========================================================
     Reveal on scroll
     ========================================================== */
  let revealObserver = null;
  function observeReveals() {
    const els = $$(".reveal:not([data-observed])");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      els.forEach((el) => { el.classList.add("in-view"); el.dataset.observed = "1"; });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in-view"); revealObserver.unobserve(en.target); } });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    }
    els.forEach((el) => { el.dataset.observed = "1"; revealObserver.observe(el); });
  }

  /* ==========================================================
     Render: categories
     ========================================================== */
  function renderCategories() {
    $("#category-grid").innerHTML = CATEGORIES.map((c, i) => `
      <article class="card cat-card reveal" style="--i:${i}">
        <div class="icon-wrap">${icon(c.icon)}</div>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.desc)}</p>
        <ul class="tags" aria-label="Skill tags">${c.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        <button type="button" class="btn btn-ghost btn-sm" data-cat="${c.id}" aria-label="Learn more about ${esc(c.title)}">Learn More ${icon("arrow-right")}</button>
      </article>`).join("");
  }
  function openCategory(id) {
    const c = CATEGORIES.find((x) => x.id === id);
    if (!c) return;
    modal.open(`
      <div class="icon-wrap">${icon(c.icon)}</div>
      <h3 id="modal-title">${esc(c.title)}</h3>
      <p>${esc(c.desc)}</p>
      <h4>What you can learn</h4>
      <ul>${c.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" data-filter-link="${c.filter}">Browse related skills</button>
        <button type="button" class="btn btn-ghost" data-close>Close</button>
      </div>`);
  }

  /* ==========================================================
     Render: explorer (filter + search + load more)
     ========================================================== */
  const explorer = { filter: "all", query: "", shown: 9, step: 9 };
  function matches(s) {
    if (explorer.filter !== "all" && s.cat !== explorer.filter) return false;
    const q = explorer.query.trim().toLowerCase();
    if (!q) return true;
    const hay = [s.name, s.desc, s.why, s.project, s.prereq, s.evolve, FILTER_LABELS[s.cat], s.level].join(" ").toLowerCase();
    return q.split(/\s+/).every((w) => hay.includes(w));
  }
  function renderSkills() {
    const list = SKILLS.filter(matches);
    const visible = list.slice(0, explorer.shown);
    $("#skill-grid").innerHTML = visible.map((s, i) => `
      <article class="card skill-card reveal" style="--i:${i % 6}">
        <div class="skill-top">
          <span class="skill-cat">${esc(FILTER_LABELS[s.cat])}</span>
          <span class="level ${s.level.toLowerCase()}">${esc(s.level)}</span>
        </div>
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.desc)}</p>
        <div class="meta-row">${icon("clock")} Suggested learning time: ${esc(s.time)}</div>
        <dl>
          <div><dt>Why it matters</dt><dd>${esc(s.why)}</dd></div>
          <div><dt>Practical project</dt><dd>${esc(s.project)}</dd></div>
          <div><dt>Prerequisites</dt><dd>${esc(s.prereq)}</dd></div>
          <div><dt>How it evolves with AI</dt><dd>${esc(s.evolve)}</dd></div>
        </dl>
      </article>`).join("");
    $("#skill-count").textContent = list.length
      ? `Showing ${visible.length} of ${list.length} skill${list.length === 1 ? "" : "s"}`
      : "No skills found";
    $("#skill-empty").hidden = list.length > 0;
    $("#skill-more").hidden = list.length <= visible.length;
    refreshIcons();
    observeReveals();
  }
  function setFilter(f) {
    explorer.filter = f;
    explorer.shown = explorer.step;
    $$("#skill-filters .chip").forEach((b) => {
      const on = b.dataset.filter === f;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    renderSkills();
  }
  function initExplorer() {
    $("#skill-filters").addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (b) setFilter(b.dataset.filter);
    });
    $("#skill-search").addEventListener("input", (e) => { explorer.query = e.target.value; explorer.shown = explorer.step; renderSkills(); });
    $("#skill-more").addEventListener("click", () => { explorer.shown += explorer.step; renderSkills(); });
    $("#skill-clear").addEventListener("click", () => { $("#skill-search").value = ""; explorer.query = ""; setFilter("all"); });
    renderSkills();
  }
  function goToExplorer(filter) {
    modal.close();
    $("#skill-search").value = "";
    explorer.query = "";
    setFilter(filter || "all");
    $("#explore").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  /* ==========================================================
     Render: paths
     ========================================================== */
  function renderPaths() {
    $("#path-grid").innerHTML = PATHS.map((p, i) => `
      <article class="card path-card reveal" style="--i:${i}">
        <div class="icon-wrap">${icon(p.icon)}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.summary)}</p>
        <div class="path-meta">
          <div><strong>${esc(p.duration)}</strong><span>Estimated duration</span></div>
          <div><strong>${esc(p.level)}</strong><span>Difficulty</span></div>
          <div><strong>${p.steps.length}</strong><span>Steps</span></div>
        </div>
        <ul class="mini-steps">${p.steps.slice(0, 3).map((s) => `<li>${esc(s)}</li>`).join("")}<li class="muted">and ${p.steps.length - 3} more steps</li></ul>
        <button type="button" class="btn btn-primary btn-sm" data-path="${p.id}">View Learning Path</button>
      </article>`).join("");
  }
  function openPath(id) {
    const p = PATHS.find((x) => x.id === id);
    if (!p) return;
    modal.open(`
      <div class="icon-wrap">${icon(p.icon)}</div>
      <h3 id="modal-title">${esc(p.title)}</h3>
      <div class="modal-meta"><span class="pill">${esc(p.duration)}</span><span class="pill">${esc(p.level)}</span><span class="pill">${p.steps.length} steps</span></div>
      <p>${esc(p.summary)}</p>
      <h4>Learning sequence</h4>
      <ol>${p.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
      <p class="tiny" style="margin-top:1rem">Timelines are estimates. They depend on your previous knowledge, available study time, and practice.</p>
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" data-scroll="#progress">Track my progress</button>
        <button type="button" class="btn btn-ghost" data-close>Close</button>
      </div>`);
  }

  /* ==========================================================
     Render: human advantage, projects, resources, faq
     ========================================================== */
  function renderVS() {
    $("#vs-list").innerHTML = VS.map((r, i) => `
      <div class="vs-row reveal" style="--i:${i}">
        <div class="vs-box ai"><div class="icon-wrap">${icon(r.aiIcon)}</div><p><strong>${esc(r.ai)}</strong></p></div>
        <div class="vs-link" aria-hidden="true"></div>
        <div class="vs-box human"><div class="icon-wrap">${icon(r.humanIcon)}</div><p><strong>${esc(r.human)}</strong>${esc(r.detail)}</p></div>
      </div>`).join("");
  }
  function renderProjects() {
    $("#project-grid").innerHTML = PROJECTS.map((p, i) => `
      <article class="card reveal" style="--i:${i}">
        <div class="icon-wrap">${icon(p.icon)}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.desc)}</p>
        <div class="modal-meta"><span class="level ${p.level.toLowerCase()}">${esc(p.level)}</span><span class="pill">${icon("clock")} ${esc(p.time)}</span></div>
        <ul class="tags" aria-label="Skills required">${p.skills.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        <button type="button" class="btn btn-ghost btn-sm" data-project="${i}">Explore Project</button>
      </article>`).join("");
  }
  function openProject(i) {
    const p = PROJECTS[i];
    if (!p) return;
    modal.open(`
      <div class="icon-wrap">${icon(p.icon)}</div>
      <h3 id="modal-title">${esc(p.title)}</h3>
      <div class="modal-meta"><span class="level ${p.level.toLowerCase()}">${esc(p.level)}</span><span class="pill">${esc(p.time)}</span></div>
      <p>${esc(p.desc)}</p>
      <h4>Skills required</h4>
      <ul class="tags" style="list-style:none;padding:0;display:flex;flex-wrap:wrap">${p.skills.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      <h4>Suggested build steps</h4>
      <ol>${p.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
      <h4>Expected learning outcomes</h4>
      <ul>${p.outcomes.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" data-scroll="#progress">Add to my plan</button>
        <button type="button" class="btn btn-ghost" data-close>Close</button>
      </div>`);
  }
  function renderResources() {
    $("#resource-grid").innerHTML = RESOURCES.map((r, i) => `
      <article class="card reveal" style="--i:${i}">
        <div class="icon-wrap">${icon(r.icon)}</div>
        <h3>${esc(r.title)}</h3>
        <ul class="res-list">${r.links.map((l) => `
          <li><a href="${esc(l.u)}" target="_blank" rel="noopener noreferrer">
            <span class="name">${esc(l.n)} ${icon("external-link")}</span>
            <span class="pill ${l.t.toLowerCase()}">${esc(l.t)}</span></a></li>`).join("")}
        </ul>
      </article>`).join("");
  }
  function renderFAQ() {
    $("#faq-list").innerHTML = FAQS.map((f, i) => `
      <div class="faq-item reveal" style="--i:${Math.min(i, 4)}">
        <h3 style="margin:0">
          <button type="button" class="faq-q" id="faq-q-${i}" aria-expanded="false" aria-controls="faq-a-${i}">
            <span>${esc(f.q)}</span>${icon("chevron-down")}
          </button>
        </h3>
        <div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}" hidden>
          <div>${f.a.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
        </div>
      </div>`).join("");

    $("#faq-list").addEventListener("click", (e) => {
      const btn = e.target.closest(".faq-q");
      if (!btn) return;
      const wasOpen = btn.getAttribute("aria-expanded") === "true";
      $$(".faq-q").forEach(closeFaq);
      if (!wasOpen) openFaq(btn);
    });
  }
  function openFaq(btn) {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", "true");
    btn.closest(".faq-item").classList.add("open");
    panel.hidden = false;
    panel.style.height = "0px";
    requestAnimationFrame(() => { panel.style.height = panel.firstElementChild.scrollHeight + "px"; });
    panel.addEventListener("transitionend", function te() { if (btn.getAttribute("aria-expanded") === "true") panel.style.height = "auto"; panel.removeEventListener("transitionend", te); });
    if (reduceMotion) panel.style.height = "auto";
  }
  function closeFaq(btn) {
    if (btn.getAttribute("aria-expanded") !== "true") return;
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", "false");
    btn.closest(".faq-item").classList.remove("open");
    panel.style.height = panel.firstElementChild.scrollHeight + "px";
    requestAnimationFrame(() => { panel.style.height = "0px"; });
    const done = () => { if (btn.getAttribute("aria-expanded") === "false") panel.hidden = true; panel.removeEventListener("transitionend", done); };
    panel.addEventListener("transitionend", done);
    if (reduceMotion) { panel.style.height = "0px"; panel.hidden = true; }
  }

  /* ==========================================================
     Recommender
     ========================================================== */
  function initRecommender() {
    const form = $("#recommend-form");
    const err = $("#recommend-error");
    const out = $("#recommend-result");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const level = data.get("level"), interest = data.get("interest"), goal = data.get("goal");
      const missing = [];
      if (!level) missing.push("your level");
      if (!interest) missing.push("your interest");
      if (!goal) missing.push("your goal");
      if (missing.length) {
        err.textContent = "Please choose " + missing.join(", ") + " to get a recommendation.";
        err.hidden = false;
        out.innerHTML = "";
        return;
      }
      err.hidden = true;
      const r = INTERESTS[interest];
      const path = PATHS.find((p) => p.id === r.path);
      out.innerHTML = `
        <div class="result-card">
          <span class="eyebrow">Recommended skill category</span>
          <h3>${esc(r.category)}</h3>
          <p>As a ${esc(LEVEL_LABELS[level])} interested in ${esc(r.label.toLowerCase())} who wants to ${esc(GOAL_PHRASES[goal])}, this direction gives you a clear place to start and visible results to show. ${esc(GOAL_TIPS[goal])}</p>
          <h4>Your first three learning steps</h4>
          <ol>${r.steps[level].map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
          <h4>Starter project</h4>
          <p>${esc(r.project[level])}</p>
          <p class="tiny">This is a general starting point generated in your browser, not a guarantee of any outcome. Adjust it as you learn what you enjoy.</p>
          <div class="result-actions">
            <button type="button" class="btn btn-primary btn-sm" data-path="${esc(path.id)}">View "${esc(path.title)}" path</button>
            <button type="button" class="btn btn-ghost btn-sm" data-filter-link="${esc(r.filter)}">Browse related skills</button>
          </div>
        </div>`;
      refreshIcons();
      out.firstElementChild.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    });
    form.addEventListener("reset", () => { err.hidden = true; out.innerHTML = ""; });
  }

  /* ==========================================================
     Progress tracking (localStorage)
     ========================================================== */
  const store = {
    state: { checks: {}, planner: {} },
    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const p = JSON.parse(raw);
          if (p && typeof p === "object") this.state = { checks: p.checks || {}, planner: p.planner || {} };
        }
      } catch (e) { /* storage unavailable: keep in-memory state */ }
    },
    save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); } catch (e) { /* ignore */ } },
    clear() { this.state = { checks: {}, planner: {} }; try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ } }
  };

  function renderProgressUI() {
    $("#checklist").innerHTML = CHECKLIST.map((g) => `
      <div class="check-group">
        <h4>${esc(g.group)}</h4>
        ${g.items.map((it) => `
          <div class="check-item"><label>
            <input type="checkbox" data-check="${it.id}" ${store.state.checks[it.id] ? "checked" : ""}>
            <span>${esc(it.t)}</span></label></div>`).join("")}
      </div>`).join("");

    $("#planner").innerHTML = DAYS.map((d) => {
      const s = store.state.planner[d.id] || {};
      const text = typeof s.task === "string" ? s.task : d.def;
      return `<div class="plan-row ${s.done ? "done" : ""}" data-day="${d.id}">
        <input type="checkbox" data-plan-done="${d.id}" ${s.done ? "checked" : ""} aria-label="Mark ${d.label} as done">
        <span class="plan-day">${d.label}</span>
        <input type="text" data-plan-task="${d.id}" value="${esc(text)}" maxlength="80" aria-label="${d.label} learning focus">
      </div>`;
    }).join("");

    $("#routine").innerHTML = ROUTINE.map((r) => `<li>${r}</li>`).join("");
    $("#roadmap").innerHTML = ROADMAP.map((r) => `<li>${r}</li>`).join("");
    updateProgress();
  }

  function updateProgress() {
    const ids = CHECKLIST.flatMap((g) => g.items.map((i) => i.id));
    const done = ids.filter((id) => store.state.checks[id]).length;
    const pct = Math.round((done / ids.length) * 100);
    const days = DAYS.filter((d) => store.state.planner[d.id] && store.state.planner[d.id].done).length;
    $("#progress-pct").textContent = pct + "%";
    $("#progress-fill").style.width = pct + "%";
    const bar = $("#progress-bar");
    bar.setAttribute("aria-valuenow", String(pct));
    $("#progress-sub").textContent = `${done} of ${ids.length} milestones complete. ${days} of 7 planner days done this week.`;
    let msg = "Start with one small milestone today.";
    if (pct >= 100) msg = "All milestones complete. Pick a new goal and keep building.";
    else if (pct >= 75) msg = "Almost there. Finish strong and share your work.";
    else if (pct >= 50) msg = "Halfway done. Keep the momentum going.";
    else if (pct >= 25) msg = "Good start. Consistency beats intensity.";
    else if (pct > 0) msg = "You have begun. Keep going one step at a time.";
    $("#progress-msg").textContent = msg;
  }

  function initProgress() {
    store.load();
    renderProgressUI();

    $("#checklist").addEventListener("change", (e) => {
      const id = e.target.dataset.check;
      if (!id) return;
      if (e.target.checked) store.state.checks[id] = true; else delete store.state.checks[id];
      store.save(); updateProgress();
    });
    $("#planner").addEventListener("change", (e) => {
      const id = e.target.dataset.planDone;
      if (!id) return;
      const cur = store.state.planner[id] || {};
      cur.done = e.target.checked;
      store.state.planner[id] = cur;
      e.target.closest(".plan-row").classList.toggle("done", cur.done);
      store.save(); updateProgress();
    });
    $("#planner").addEventListener("input", (e) => {
      const id = e.target.dataset.planTask;
      if (!id) return;
      const cur = store.state.planner[id] || {};
      cur.task = e.target.value;
      store.state.planner[id] = cur;
      store.save();
    });

    $("#progress-reset").addEventListener("click", () => {
      modal.open(`
        <h3 id="modal-title">Reset all progress?</h3>
        <p>This clears your checklist and weekly planner saved in this browser. It cannot be undone.</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-primary" id="confirm-reset">Yes, reset progress</button>
          <button type="button" class="btn btn-ghost" data-close>Cancel</button>
        </div>`);
    });
    document.addEventListener("click", (e) => {
      if (e.target.closest("#confirm-reset")) {
        store.clear();
        renderProgressUI();
        modal.close();
      }
    });
  }

  /* ==========================================================
     Navigation, scroll effects, counters
     ========================================================== */
  function initNav() {
    const header = $("#site-header");
    const toggle = $("#nav-toggle");
    const menu = $("#nav-menu");
    const backTop = $("#back-top");
    const links = $$(".nav-links a").map((a) => ({ a, ids: (a.dataset.spy || a.getAttribute("href").slice(1)).split(" ") }));
    const sections = $$("main > section[id]");

    const setMenu = (open) => {
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); toggle.focus(); } });
    window.addEventListener("resize", () => { if (window.innerWidth > 960) setMenu(false); });
    document.addEventListener("click", (e) => { if (menu.classList.contains("open") && !e.target.closest(".nav")) setMenu(false); });

    let ticking = false;
    const onScroll = () => {
      ticking = false;
      const y = window.scrollY;
      header.classList.toggle("scrolled", y > 10);
      backTop.classList.toggle("show", y > 600);
      let current = "home";
      sections.forEach((s) => { if (s.getBoundingClientRect().top <= 140) current = s.id; });
      links.forEach(({ a, ids }) => {
        const on = ids.includes(current);
        a.classList.toggle("active", on);
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();

    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  }

  function initCounters() {
    const counters = $$(".count[data-count]");
    const run = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (reduceMotion) { el.textContent = target; return; }
      const dur = 1200, t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) { counters.forEach((c) => { c.textContent = c.dataset.count; }); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => io.observe(c));
  }

  /* ==========================================================
     Forms (demo only) + footer
     ========================================================== */
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  function showStatus(el, msg, ok) {
    el.textContent = msg; el.hidden = false; el.classList.toggle("ok", !!ok);
  }
  function initForms() {
    $("#contact-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      const name = f.name.value.trim(), email = f.email.value.trim(), msg = f.message.value.trim();
      const status = $("#contact-status");
      if (!name || !msg) return showStatus(status, "Please fill in your name and message.", false);
      if (!validEmail(email)) return showStatus(status, "Please enter a valid email address.", false);
      showStatus(status, "Thanks! This is a frontend demo, so your message was not sent or stored. Connect a form service to make it live.", true);
      f.reset();
    });
    $("#news-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#news-email").value.trim();
      const status = $("#news-status");
      if (!validEmail(email)) return showStatus(status, "Please enter a valid email address.", false);
      showStatus(status, "Demo only: nothing was subscribed or stored.", true);
      e.target.reset();
    });
  }

  /* ==========================================================
     Global delegated clicks
     ========================================================== */
  function initDelegates() {
    document.addEventListener("click", (e) => {
      const cat = e.target.closest("[data-cat]");
      if (cat) return openCategory(cat.dataset.cat);
      const path = e.target.closest("[data-path]");
      if (path) return openPath(path.dataset.path);
      const proj = e.target.closest("[data-project]");
      if (proj) return openProject(Number(proj.dataset.project));
      const fl = e.target.closest("[data-filter-link]");
      if (fl) { e.preventDefault(); return goToExplorer(fl.dataset.filterLink); }
      const sc = e.target.closest("[data-scroll]");
      if (sc) { modal.close(); const t = $(sc.dataset.scroll); if (t) t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }
    });
  }

  /* ==========================================================
     Init
     ========================================================== */
  function init() {
    // Keep stats in sync with data
    $("#stat-categories").dataset.count = CATEGORIES.length;
    $("#stat-skills").dataset.count = SKILLS.length;
    $("#stat-paths").dataset.count = PATHS.length;
    $("#stat-projects").dataset.count = PROJECTS.length;
    $$(".count").forEach((c) => { c.textContent = reduceMotion ? c.dataset.count : "0"; });

    renderCategories();
    renderPaths();
    renderVS();
    renderProjects();
    renderResources();
    renderFAQ();
    initExplorer();
    initRecommender();
    initProgress();
    initNav();
    initForms();
    initDelegates();
    initCounters();
    $("#year").textContent = new Date().getFullYear();
    refreshIcons();
    observeReveals();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
