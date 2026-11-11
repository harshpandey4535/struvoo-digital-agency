import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  X,
} from "lucide-react";
import {
  services,
  siteConfig,
  type Project,
  type Service,
} from "../data/content";
import { BrandSymbol } from "./Brand";
import { ease } from "./Motion";
import { ServiceVisual } from "./Services";

export function Modal({
  children,
  label,
  onClose,
  className = "",
}: {
  children: ReactNode;
  label: string;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() =>
      ref.current
        ?.querySelector<HTMLElement>("[data-autofocus], button, input")
        ?.focus(),
    );
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab") return;
      const elements = Array.from(
        ref.current?.querySelectorAll<HTMLElement>(
          'button, a[href], input, textarea, select, [tabindex="0"]',
        ) || [],
      ).filter(
        (element) =>
          !element.hasAttribute("disabled") &&
          element.getClientRects().length > 0,
      );
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !elements.includes(document.activeElement as HTMLElement))
      ) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, []);

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`modal ${className}`}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 15, opacity: 0 }}
        transition={{ duration: 0.35, ease }}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={21} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

export type ContactOptions = {
  service?: string;
  message?: string;
  context?: string;
};

export function ContactDialog({
  options,
  onClose,
}: {
  options: ContactOptions;
  onClose: () => void;
}) {
  const [prepared, setPrepared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: options.service || "",
    budget: "",
    message: options.message || "",
  });
  const brief = `STRUVOO / NEW PROJECT BRIEF\n\nName: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company || "Not specified"}\nProject focus: ${form.service}\nIndicative budget: ${form.budget || "To be discussed"}\n\nTHE IDEA\n${form.message}\n\nPrepared locally at struvoo. No inquiry has been sent.`;
  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => setForm({ ...form, [key]: event.target.value }),
  });

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPrepared(true);
    requestAnimationFrame(() =>
      document.getElementById("brief-result-heading")?.focus(),
    );
  }

  function download() {
    const url = URL.createObjectURL(
      new Blob([brief], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "struvoo-project-brief.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <Modal
      label="Start your Struvoo project"
      onClose={onClose}
      className="contact-modal"
    >
      <BrandSymbol className="dialog-symbol" />
      <div className="section-label">
        A GOOD IDEA STARTS WITH A CONVERSATION.
      </div>
      {!prepared ? (
        <>
          <h2 data-autofocus tabIndex={-1}>
            Let's make
            <br />
            <span className="text-blue">your next move.</span>
          </h2>
          <p className="dialog-intro">
            Tell us what you have in mind. We'll help you turn it into a focused
            project brief.
          </p>
          {options.context && <p className="context-note">{options.context}</p>}
          <form onSubmit={prepare} className="contact-form">
            <div className="form-row">
              <label>
                Your name <span>*</span>
                <input
                  autoComplete="name"
                  placeholder="Alex Morgan"
                  required
                  maxLength={100}
                  {...field("name")}
                />
              </label>
              <label>
                Email address <span>*</span>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  required
                  maxLength={200}
                  {...field("email")}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Company
                <input
                  autoComplete="organization"
                  placeholder="Your brand or business"
                  maxLength={160}
                  {...field("company")}
                />
              </label>
              <label>
                Project focus <span>*</span>
                <select required {...field("service")}>
                  <option value="" disabled>
                    Select a service
                  </option>
                  {services.map((service) => (
                    <option key={service.id}>{service.title}</option>
                  ))}
                  <option>A little of everything</option>
                  <option>Let's figure it out together</option>
                </select>
              </label>
            </div>
            <label>
              Indicative budget
              <select {...field("budget")}>
                <option value="">Let's discuss it</option>
                <option>Under $2,500</option>
                <option>$2,500 - $5,000</option>
                <option>$5,000 - $10,000</option>
                <option>$10,000+</option>
              </select>
            </label>
            <label>
              A little about your idea <span>*</span>
              <textarea
                placeholder="What are you building, changing, or hoping to achieve?"
                rows={3}
                required
                minLength={20}
                maxLength={5000}
                {...field("message")}
              />
              <small>At least 20 characters. A few sentences is perfect.</small>
            </label>
            <button type="submit" className="button button-blue">
              CREATE YOUR PROJECT BRIEF <ArrowUpRight size={18} />
            </button>
            <p className="form-disclosure">
              This prepares a brief on your device. Nothing is sent or stored by
              Struvoo.
            </p>
          </form>
        </>
      ) : (
        <div className="brief-result">
          <h2 id="brief-result-heading" tabIndex={-1}>
            A little clarity.
            <br />
            <span className="text-blue">A lot of possibility.</span>
          </h2>
          <p className="dialog-intro">
            Your project brief is ready. Keep a copy and use it to start the
            conversation.
          </p>
          <dl>
            <div>
              <dt>PREPARED FOR</dt>
              <dd>
                {form.name}
                {form.company ? ` / ${form.company}` : ""}
              </dd>
            </div>
            <div>
              <dt>PROJECT FOCUS</dt>
              <dd>{form.service}</dd>
            </div>
          </dl>
          <div className="brief-preview">{form.message}</div>
          <div className="brief-actions">
            <button className="button button-blue" onClick={download}>
              DOWNLOAD BRIEF <ArrowDownToLine size={17} />
            </button>
            <button className="button button-outline" onClick={copy}>
              {copied ? "COPIED" : "COPY BRIEF"}
              {copied ? <Check size={17} /> : <Copy size={17} />}
            </button>
          </div>
          <p className="form-disclosure" role="status">
            {copyError
              ? "Clipboard access is unavailable. You can still download your brief."
              : siteConfig.contactEmail
                ? "Your brief has not been sent. Use the email link below to continue in your email app."
                : "Direct email is not configured for this preview. Nothing has been sent. Download your brief to share when contact details are available."}
          </p>
          {siteConfig.contactEmail && (
            <a
              className="text-link"
              href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(`Project inquiry from ${form.name}`)}&body=${encodeURIComponent(brief)}`}
            >
              OPEN IN YOUR EMAIL APP <ArrowUpRight size={16} />
            </a>
          )}
          <button
            className="text-link edit-brief"
            onClick={() => setPrepared(false)}
          >
            <ArrowLeft size={15} /> EDIT YOUR BRIEF
          </button>
        </div>
      )}
    </Modal>
  );
}

export function ProjectDialog({
  project,
  onClose,
  onNext,
  onContact,
}: {
  project: Project;
  onClose: () => void;
  onNext: () => void;
  onContact: (options: ContactOptions) => void;
}) {
  return (
    <Modal
      label={`${project.title} concept project`}
      onClose={onClose}
      className="project-modal"
    >
      <div className="project-dialog-image">
        <img src={project.image} alt={project.alt} />
        <span>INDEPENDENT CONCEPT / NOT CLIENT WORK</span>
      </div>
      <div className="project-dialog-content">
        <div className="section-label">
          {project.industry} / DIGITAL EXPLORATION
        </div>
        <h2 data-autofocus tabIndex={-1}>
          {project.title}
          <span className="text-blue">.</span>
        </h2>
        <p className="project-dialog-subtitle">{project.subtitle}</p>
        <p className="dialog-intro">{project.description}</p>
        <div className="project-detail-grid">
          <div>
            <h3>THE CREATIVE INTENTION</h3>
            <p>{project.intention}</p>
          </div>
          <div>
            <h3>CONCEPT SCOPE</h3>
            <ul>
              {project.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="concept-disclosure">
          This is a self-initiated demonstration project with generated concept
          imagery. It does not represent a real client engagement or verified
          campaign results.
        </p>
        <div className="project-dialog-actions">
          <button
            className="button button-blue"
            onClick={() =>
              onContact({
                service: "A little of everything",
                message: `I'm interested in a project inspired by the ${project.title} concept. Our goal is to `,
              })
            }
          >
            LET'S CREATE YOUR NEXT CHAPTER <ArrowUpRight size={17} />
          </button>
          <button className="text-link" onClick={onNext}>
            NEXT CONCEPT <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function ServiceDialog({
  service,
  onClose,
  onContact,
}: {
  service: Service;
  onClose: () => void;
  onContact: (options: ContactOptions) => void;
}) {
  return (
    <Modal label={service.title} onClose={onClose} className="service-modal">
      <div className="section-label">THE STRUVOO APPROACH</div>
      <h2 data-autofocus tabIndex={-1}>
        {service.title}
        <span className="text-blue">.</span>
      </h2>
      <p className="dialog-intro">{service.detail}</p>
      <div className="service-dialog-grid">
        <div>
          <h3>WHAT WE CAN BRING TO THE TABLE</h3>
          <ul className="capability-list">
            {service.capabilities.map((item) => (
              <li key={item}>
                <span className="label-dot" />
                {item}
              </li>
            ))}
          </ul>
          <button
            className="button button-blue"
            onClick={() => onContact({ service: service.title })}
          >
            MAKE YOUR NEXT MOVE <ArrowUpRight size={18} />
          </button>
        </div>
        <div className="service-dialog-art">
          <ServiceVisual id={service.id} />
        </div>
      </div>
      <p className="form-disclosure">
        Every engagement starts with your goals. The scope is shaped around what
        your brand actually needs.
      </p>
    </Modal>
  );
}
