import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import { Brand, BrandSymbol } from "./components/Brand";
import {
  ContactDialog,
  ProjectDialog,
  ServiceDialog,
  type ContactOptions,
} from "./components/Dialogs";
import {
  CustomCursor,
  ease,
  LineReveal,
  Magnetic,
  Reveal,
} from "./components/Motion";
import { Services } from "./components/Services";
import {
  principles,
  process,
  projects,
  services,
  siteConfig,
  type Project,
  type Service,
} from "./data/content";

type DialogState =
  | { kind: "contact"; options: ContactOptions }
  | { kind: "project"; project: Project }
  | { kind: "service"; service: Service }
  | null;
const links = [
  ["Services", "#services"],
  ["Work", "#work"],
  ["About", "#about"],
  ["Contact", "#contact"],
] as const;

function Navigation({
  menuOpen,
  setMenuOpen,
  onContact,
  modalOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  onContact: () => void;
  modalOpen: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 30 });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (window.scrollY < window.innerHeight * 0.5) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }),
      { rootMargin: "-15% 0px -60% 0px" },
    );
    links.forEach(([, href]) => {
      const section = document.querySelector(href);
      if (section) observer.observe(section);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const frame = requestAnimationFrame(() =>
      header.current?.querySelector<HTMLElement>(".mobile-nav a")?.focus(),
    );
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === "Tab") {
        const controls = Array.from(
          header.current?.querySelectorAll<HTMLElement>(
            ".menu-toggle, .mobile-nav a, .mobile-nav button",
          ) || [],
        );
        if (event.shiftKey && document.activeElement === controls[0]) {
          event.preventDefault();
          controls[controls.length - 1]?.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === controls[controls.length - 1]
        ) {
          event.preventDefault();
          controls[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", keyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", keyDown);
    };
  }, [menuOpen, setMenuOpen]);

  function navigate() {
    setMenuOpen(false);
  }

  return (
    <header
      ref={header}
      className={`site-header ${scrolled ? "is-scrolled" : ""} ${menuOpen ? "menu-is-open" : ""}`}
      inert={modalOpen}
    >
      <div className="nav-container">
        <a
          className="nav-brand"
          href="#home"
          aria-label="Struvoo home"
          onClick={navigate}
        >
          <Brand />
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <a
              className={active === href ? "is-active" : ""}
              key={href}
              href={href}
            >
              {label}
              <span />
            </a>
          ))}
        </nav>
        <Magnetic className="nav-contact">
          <button type="button" className="nav-cta" onClick={onContact}>
            LET'S TALK <ArrowUpRight size={16} />
          </button>
        </Magnetic>
        <button
          ref={menuButton}
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={25} />}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100svh - 80px)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease }}
          >
            {links.map(([label, href], index) => (
              <motion.a
                key={href}
                href={href}
                onClick={navigate}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <span>0{index + 1}</span>
                {label}
                <ArrowUpRight size={25} />
              </motion.a>
            ))}
            <button className="button button-blue" onClick={onContact}>
              LET'S BUILD SOMETHING GREAT <ArrowUpRight size={17} />
            </button>
            <p>CREATIVITY IN MOTION. GROWTH BY DESIGN.</p>
          </motion.nav>
        )}
      </AnimatePresence>
      <motion.div
        className="scroll-progress"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
    </header>
  );
}

function Hero({ onContact }: { onContact: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const x = useSpring(cursorX, { stiffness: 45, damping: 22 });
  const y = useSpring(cursorY, { stiffness: 45, damping: 22 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", reduced ? "0%" : "20%"],
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8],
    [1, 1, reduced ? 1 : 0],
  );

  return (
    <section
      ref={ref}
      id="home"
      className="hero"
      aria-labelledby="hero-statement"
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        cursorX.set((event.clientX / rect.width - 0.5) * 20);
        cursorY.set((event.clientY / rect.height - 0.5) * 15);
      }}
      onPointerLeave={() => {
        cursorX.set(0);
        cursorY.set(0);
      }}
    >
      <motion.div className="hero-background" style={{ y: backgroundY }}>
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/images/hero-velocity-mobile.jpg"
          />
          <motion.img
            src="/images/hero-velocity.jpg"
            alt=""
            fetchPriority="high"
            width="1280"
            height="720"
            style={{ x, y }}
          />
        </picture>
        <div className="hero-vignette" />
      </motion.div>
      <div className="hero-speed-lines" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="hero-particles" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <i key={index} style={{ "--i": index } as CSSProperties} />
        ))}
      </div>
      <motion.div className="hero-content" style={{ opacity: contentOpacity }}>
        <motion.div
          className="hero-brand-wrap"
          initial={{
            opacity: 0,
            y: reduced ? 0 : 24,
            filter: reduced ? "blur(0px)" : "blur(10px)",
          }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease, delay: 0.1 }}
        >
          <Brand className="hero-brand" />
        </motion.div>
        <motion.h1
          id="hero-statement"
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.4 }}
        >
          We turn digital presence
          <br />
          into <span>digital performance.</span>
        </motion.h1>
        <motion.p
          className="hero-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Powerful digital experiences. Performance-driven marketing.
          <br className="desktop-break" /> We help ambitious brands move
          forward.
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.75 }}
        >
          <Magnetic>
            <button className="button button-blue" onClick={onContact}>
              LET'S BUILD SOMETHING GREAT <ArrowUpRight size={17} />
            </button>
          </Magnetic>
          <a href="#work" className="hero-secondary">
            EXPLORE OUR WORK <ArrowUpRight size={16} />
          </a>
        </motion.div>
      </motion.div>
      <a
        className="scroll-cue"
        href="#about"
        aria-label="Scroll to explore Struvoo"
      >
        <span>SCROLL TO EXPLORE</span>
        <ArrowDown size={16} />
      </a>
    </section>
  );
}

function Introduction() {
  return (
    <section
      id="about"
      className="intro-section section-pad"
      aria-labelledby="intro-title"
    >
      <div className="container">
        <Reveal>
          <div className="section-label">
            <span className="label-dot" />
            01 / MEET STRUVOO
          </div>
        </Reveal>
        <h2 id="intro-title" className="intro-heading">
          <LineReveal>Creativity with</LineReveal>
          <LineReveal delay={0.08}>
            a <span className="text-blue">purpose.</span>
          </LineReveal>
          <LineReveal className="intro-heading-shift" delay={0.16}>
            Growth with a <span className="text-blue">strategy.</span>
          </LineReveal>
        </h2>
        <div className="intro-bottom">
          <Reveal>
            <div className="intro-signature">
              <BrandSymbol />
              <span>
                THE INTERSECTION OF
                <br />
                CREATIVITY & PERFORMANCE.
              </span>
            </div>
          </Reveal>
          <Reveal className="intro-copy" delay={0.1}>
            <p>
              Good ideas deserve more than attention.
              <br />
              They deserve to make an impact.
            </p>
            <p>
              We're Struvoo. A digital growth and creative agency bringing
              strategy, design, and technology into one connected vision. We
              build the experiences, content, and campaigns that move your
              business forward.
            </p>
            <a className="text-link" href="#approach">
              THIS IS HOW WE THINK <ArrowUpRight size={16} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Work({
  onProject,
  onContact,
}: {
  onProject: (project: Project) => void;
  onContact: () => void;
}) {
  return (
    <section
      id="work"
      className="work-section section-pad"
      aria-labelledby="work-title"
    >
      <div className="container">
        <Reveal>
          <div className="section-label">
            <span className="label-dot" />
            03 / SELECTED EXPLORATIONS
          </div>
        </Reveal>
        <div className="section-heading-row">
          <Reveal>
            <h2 id="work-title">
              Built to <span className="text-blue">stand out.</span>
              <br />
              Designed to perform.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="section-aside">
              Independent concepts.
              <br />A glimpse of what's possible.
            </p>
          </Reveal>
        </div>
        <div className="projects-composition">
          {projects.map((project, index) => (
            <Reveal
              key={project.id}
              className={`project-entry project-${project.id}`}
              delay={index * 0.1}
            >
              <button
                className="project-image-button"
                onClick={() => onProject(project)}
                data-cursor="VIEW"
                aria-label={`View ${project.title} concept project`}
              >
                <div className="project-image">
                  <img
                    src={project.image}
                    alt={project.alt}
                    loading="lazy"
                    width="1248"
                    height="832"
                  />
                  <div className="project-image-shade" />
                  {project.id === "aether" ? (
                    <div className="aether-image-type">
                      <small>A MORE CONSIDERED EVERYDAY.</small>
                      <span>Aether</span>
                    </div>
                  ) : (
                    <div className="velocity-image-type">
                      <small>NOT MADE TO STAND STILL.</small>
                      <span>
                        MOVE
                        <br />
                        DIFFERENT.
                      </span>
                    </div>
                  )}
                  <span className="image-project-label">
                    INDEPENDENT CONCEPT / 0{index + 1}
                  </span>
                  <span className="project-open">
                    <ArrowUpRight size={23} />
                  </span>
                </div>
              </button>
              <div className="project-meta">
                <div>
                  <span className="project-industry">{project.industry}</span>
                  <h3>
                    <button onClick={() => onProject(project)}>
                      {project.title}
                      <span> / {project.subtitle}</span>
                    </button>
                  </h3>
                  <p>{project.services.join(" / ")}</p>
                </div>
                <button
                  className="project-meta-arrow"
                  onClick={() => onProject(project)}
                  aria-label={`Explore ${project.title}`}
                >
                  <ArrowUpRight size={25} />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="work-bottom">
            <p>
              These are ideas in motion. <span>Your brand could be next.</span>
            </p>
            <button className="text-link" onClick={onContact}>
              LET'S MAKE IT HAPPEN <ArrowUpRight size={16} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section
      id="approach"
      className="approach-section section-pad"
      aria-labelledby="approach-title"
    >
      <div className="container">
        <Reveal>
          <div className="section-label">
            <span className="label-dot" />
            04 / THE STRUVOO DIFFERENCE
          </div>
        </Reveal>
        <h2 id="approach-title">
          <LineReveal>We don't just make</LineReveal>
          <LineReveal delay={0.08}>
            things <span className="outline-type">look good.</span>
          </LineReveal>
          <LineReveal delay={0.16}>
            We make them <span className="text-blue">work.</span>
          </LineReveal>
        </h2>
        <div className="approach-composition">
          <Reveal className="approach-visual">
            <div className="orbit-system" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="orbit orbit-three" />
              <div className="orbit-center">
                <BrandSymbol />
              </div>
              <span className="orbit-label orbit-label-one">STRATEGY</span>
              <span className="orbit-label orbit-label-two">CREATIVITY</span>
              <span className="orbit-label orbit-label-three">PERFORMANCE</span>
              <i className="orbit-satellite" />
            </div>
            <p>
              Different disciplines.
              <br />
              <span>One shared direction.</span>
            </p>
          </Reveal>
          <div className="principles-list">
            {principles.map(([title, description], index) => (
              <Reveal className="principle" key={title} delay={index * 0.06}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const [active, setActive] = useState(0);
  return (
    <section
      className="process-section section-pad"
      aria-labelledby="process-title"
    >
      <div className="container">
        <Reveal>
          <div className="section-label">
            <span className="label-dot" />
            05 / HOW WE GET THERE
          </div>
        </Reveal>
        <div className="section-heading-row">
          <Reveal>
            <h2 id="process-title">
              From first idea
              <br />
              to <span className="text-blue">final impact.</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="section-aside">
              A clear path. A collaborative process.
              <br />
              Room for the extraordinary.
            </p>
          </Reveal>
        </div>
        <div
          className="process-timeline"
          role="tablist"
          aria-label="Explore our four-stage process"
        >
          {process.map(([title, subtitle], index) => (
            <Reveal
              key={title}
              className={`process-step ${active === index ? "is-active" : ""}`}
              delay={index * 0.1}
            >
              <button
                type="button"
                id={`process-tab-${index}`}
                role="tab"
                aria-selected={active === index}
                aria-controls="process-detail"
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  let next = index;
                  if (event.key === "ArrowRight") next = (index + 1) % 4;
                  else if (event.key === "ArrowLeft") next = (index + 3) % 4;
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End") next = 3;
                  else return;
                  event.preventDefault();
                  setActive(next);
                  document.getElementById(`process-tab-${next}`)?.focus();
                }}
              >
                <div className="process-track">
                  {active === index && (
                    <motion.span
                      className="process-active-line"
                      layoutId="process-active-line"
                      transition={{ duration: 0.45, ease }}
                    />
                  )}
                  <span className="process-dot" />
                  <span className="process-number">0{index + 1}</span>
                </div>
                <h3>
                  {title}
                  <ArrowUpRight size={20} />
                </h3>
                <p>{subtitle}</p>
              </button>
            </Reveal>
          ))}
        </div>
        <div
          className="process-detail"
          id="process-detail"
          role="tabpanel"
          aria-labelledby={`process-tab-${active}`}
          tabIndex={0}
        >
          <span className="detail-marker">0{active + 1} /</span>
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {process[active][2]}
            </motion.p>
          </AnimatePresence>
          <span className="process-detail-note">
            SELECT A STAGE TO EXPLORE <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </section>
  );
}

function Closing({ onContact }: { onContact: () => void }) {
  return (
    <section
      id="contact"
      className="closing-section"
      aria-labelledby="closing-title"
    >
      <div className="closing-background" aria-hidden="true">
        <BrandSymbol monochrome />
        <div className="closing-line" />
        <div className="closing-line second" />
      </div>
      <div className="container closing-content">
        <Reveal>
          <div className="section-label">
            <span className="label-dot" />
            GREAT THINGS START WITH A FIRST MOVE.
          </div>
          <h2 id="closing-title">
            Your next
            <br />
            growth story
            <br />
            starts <span>here.</span>
          </h2>
          <p>
            Have an ambitious idea?
            <br />
            Let's turn it into something people remember.
          </p>
          <Magnetic>
            <button className="button button-navy" onClick={onContact}>
              START YOUR PROJECT <ArrowUpRight size={19} />
            </button>
          </Magnetic>
        </Reveal>
        <ArrowUpRight
          className="closing-arrow"
          strokeWidth={0.9}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

function Footer({
  onContact,
  onService,
}: {
  onContact: (options?: ContactOptions) => void;
  onService: (service: Service) => void;
}) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#home" aria-label="Struvoo home">
              <Brand />
            </a>
            <p>Digital Growth & Creative Agency.</p>
            <span>
              Creativity in motion.
              <br />
              Growth by design.
            </span>
          </div>
          <div className="footer-column">
            <h3>EXPLORE</h3>
            {links.map(([label, href]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </div>
          <div className="footer-column footer-services">
            <h3>OUR EXPERTISE</h3>
            {services.map((service) => (
              <button key={service.id} onClick={() => onService(service)}>
                {service.title}
              </button>
            ))}
          </div>
          <div className="footer-column footer-connect">
            <h3>MAKE A CONNECTION</h3>
            {siteConfig.contactEmail ? (
              <a href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
                <ArrowUpRight size={14} />
              </a>
            ) : (
              <>
                <button
                  className="footer-contact-link"
                  onClick={() => onContact()}
                >
                  Start a conversation <ArrowUpRight size={15} />
                </button>
                <span className="contact-placeholder">
                  Email address to be confirmed.
                </span>
              </>
            )}
            <div className="social-links">
              {Object.entries(siteConfig.socialLinks).map(([name, url]) =>
                url ? (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {name}
                    <ArrowUpRight size={12} />
                  </a>
                ) : (
                  <button
                    key={name}
                    onClick={() =>
                      onContact({
                        context: `${name} details are being prepared. In the meantime, let's get your next project started.`,
                      })
                    }
                  >
                    {name}
                    <ArrowUpRight size={12} />
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} STRUVOO. ALL RIGHTS RESERVED.</p>
          <span>STRATEGY. CREATIVITY. MOMENTUM.</span>
          <a href="#home">
            BACK TO TOP <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [dialog, setDialog] = useState<DialogState>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const rememberTrigger = useCallback(() => {
    if (!document.querySelector('[role="dialog"]'))
      returnFocus.current = document.activeElement as HTMLElement;
  }, []);
  const closeDialog = useCallback(() => setDialog(null), []);
  const openContact = useCallback(
    (options: ContactOptions = {}) => {
      rememberTrigger();
      setMenuOpen(false);
      setDialog({ kind: "contact", options });
    },
    [rememberTrigger],
  );
  const openProject = useCallback(
    (project: Project) => {
      rememberTrigger();
      setDialog({ kind: "project", project });
    },
    [rememberTrigger],
  );
  const openService = useCallback(
    (service: Service) => {
      rememberTrigger();
      setDialog({ kind: "service", service });
    },
    [rememberTrigger],
  );
  const restoreFocus = useCallback(() => {
    if (
      returnFocus.current?.isConnected &&
      returnFocus.current !== document.body
    ) {
      returnFocus.current.focus();
      return;
    }
    const mobileToggle = document.querySelector<HTMLElement>(".menu-toggle");
    if (mobileToggle?.getClientRects().length) mobileToggle.focus();
    else document.querySelector<HTMLElement>(".nav-cta")?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen && !dialog) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen, dialog]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 769px)");
    const change = () => {
      if (query.matches) setMenuOpen(false);
    };
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">
        SKIP TO CONTENT
      </a>
      <Navigation
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onContact={() => openContact()}
        modalOpen={Boolean(dialog)}
      />
      <main id="main-content" tabIndex={-1} inert={menuOpen || Boolean(dialog)}>
        <Hero onContact={() => openContact()} />
        <Introduction />
        <Services onExplore={openService} />
        <Work onProject={openProject} onContact={() => openContact()} />
        <Approach />
        <Process />
        <Closing onContact={() => openContact()} />
      </main>
      <div inert={menuOpen || Boolean(dialog)}>
        <Footer onContact={openContact} onService={openService} />
      </div>
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          if (!dialog) restoreFocus();
        }}
      >
        {dialog?.kind === "contact" && (
          <ContactDialog
            key="contact"
            options={dialog.options}
            onClose={closeDialog}
          />
        )}
        {dialog?.kind === "project" && (
          <ProjectDialog
            key="project"
            project={dialog.project}
            onClose={closeDialog}
            onContact={openContact}
            onNext={() =>
              setDialog({
                kind: "project",
                project:
                  projects[
                    (projects.findIndex(
                      (project) => project.id === dialog.project.id,
                    ) +
                      1) %
                      projects.length
                  ],
              })
            }
          />
        )}
        {dialog?.kind === "service" && (
          <ServiceDialog
            key="service"
            service={dialog.service}
            onClose={closeDialog}
            onContact={openContact}
          />
        )}
      </AnimatePresence>
      <CustomCursor />
    </MotionConfig>
  );
}
