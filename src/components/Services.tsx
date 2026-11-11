import { useId, useState } from "react";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight, Minus, Pause, Play, Plus } from "lucide-react";
import { services, type Service } from "../data/content";
import { ease, Reveal } from "./Motion";

export function ServiceVisual({ id }: { id: Service["id"] }) {
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const gradientId = useId();

  if (id === "performance")
    return (
      <div
        className="service-art performance-art"
        aria-label="Illustrated journey from attention to conversion"
      >
        <div className="art-topline">
          <span>THE BIGGER PICTURE</span>
          <span>01 / 05</span>
        </div>
        <div className="art-heading">
          Less noise.
          <br />
          <span>More impact.</span>
        </div>
        <svg
          className="growth-chart"
          viewBox="0 0 500 250"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#38BDF8" stopOpacity=".17" />
              <stop offset="1" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[40, 85, 130, 175, 220].map((y) => (
            <path
              key={y}
              d={`M0 ${y}H500`}
              stroke="#A6B3C5"
              strokeOpacity=".12"
            />
          ))}
          {[40, 120, 200, 280, 360, 440].map((x) => (
            <path
              key={x}
              d={`M${x} 20V220`}
              stroke="#A6B3C5"
              strokeOpacity=".06"
            />
          ))}
          <path
            d="M0 207 65 195 116 200 178 150 230 160 294 104 344 116 407 55 455 60 498 12V250H0Z"
            fill={`url(#${gradientId})`}
          />
          <motion.path
            d="M0 207 65 195 116 200 178 150 230 160 294 104 344 116 407 55 455 60 498 12"
            stroke="#38BDF8"
            strokeWidth="2.5"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduced ? 0 : 2.2, ease }}
          />
          <motion.circle
            cx="407"
            cy="55"
            r="5"
            fill="#38BDF8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 1.4 }}
          />
          <circle
            className="chart-pulse"
            cx="407"
            cy="55"
            r="12"
            stroke="#38BDF8"
            strokeOpacity=".5"
          />
        </svg>
        <div className="chart-labels">
          <span>ATTENTION</span>
          <span>ENGAGEMENT</span>
          <span>ACTION</span>
        </div>
        <span className="art-footnote">
          A strategic illustration. Not campaign results.
        </span>
      </div>
    );

  if (id === "web")
    return (
      <div
        className="service-art web-art"
        aria-label="Animated custom website wireframe"
      >
        <div className="art-topline">
          <span>FUNCTION MEETS FEELING</span>
          <span>02 / 05</span>
        </div>
        <div className="browser-art">
          <div className="browser-top">
            <i />
            <i />
            <i />
            <span>your-next-chapter.com</span>
            <span>
              <ArrowUpRight size={10} />
            </span>
          </div>
          <motion.div
            className="browser-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="browser-nav">
              <b>YOUR BRAND.</b>
              <span>Ideas &nbsp; About &nbsp; Let's talk</span>
            </div>
            <motion.div
              initial={{ y: reduced ? 0 : 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="browser-title"
            >
              Good design.
              <br />
              <em>Great possibilities.</em>
            </motion.div>
            <motion.div
              className="browser-cta"
              initial={{ scaleX: reduced ? 1 : 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3 }}
            >
              EXPLORE WHAT'S NEXT <ArrowUpRight size={13} />
            </motion.div>
            <div className="browser-layout">
              <div />
              <div />
              <div />
            </div>
            <svg
              className="browser-pointer"
              width="26"
              height="31"
              viewBox="0 0 26 31"
              aria-hidden="true"
            >
              <path d="m2 2 20 16-10 1-5 9L2 2Z" fill="#38BDF8" stroke="#fff" />
            </svg>
          </motion.div>
        </div>
        <span className="art-footnote">Every pixel has a purpose.</span>
      </div>
    );

  if (id === "video")
    return (
      <div
        className={`service-art video-art ${playing ? "" : "is-paused"}`}
        aria-label="An animated editing timeline demonstration"
      >
        <div className="art-topline">
          <span>FIND THE STORY. FEEL THE RHYTHM.</span>
          <span>03 / 05</span>
        </div>
        <div className="video-frame">
          <img
            src="/images/project-velocity.jpg"
            alt="A running shoe in the Velocity concept edit"
            loading="lazy"
          />
          <span>
            MAKE EVERY
            <br />
            <i>FRAME MATTER.</i>
          </span>
          <span className="frame-corner">CONCEPT EDIT / 001</span>
        </div>
        <div className="timeline-controls">
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            aria-label={
              playing ? "Pause timeline animation" : "Play timeline animation"
            }
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <span>EDITING IN MOTION</span>
          <span>00:00 / 00:08</span>
        </div>
        <div className="editing-timeline">
          <div className="timeline-ruler" />
          <div className="timeline-track clips">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="timeline-track audio">
            <i />
            <i />
            <i />
          </div>
          <div className="playhead" />
        </div>
      </div>
    );

  if (id === "motion")
    return (
      <div
        className="service-art motion-art"
        aria-label="Kinetic typography and a rotating geometric form"
      >
        <div className="art-topline">
          <span>STATIC IS NOT OUR THING</span>
          <span>04 / 05</span>
        </div>
        <div className="kinetic-type">
          MAKE
          <br />
          <span>YOUR</span>
          <br />
          MOVE.
        </div>
        <svg className="kinetic-shape" viewBox="0 0 200 200" aria-hidden="true">
          <path
            d="m100 0 17 60 54-31-31 54 60 17-60 17 31 54-54-31-17 60-17-60-54 31 31-54L0 100l60-17-31-54 54 31Z"
            fill="#38BDF8"
          />
        </svg>
        <span className="art-footnote">Expression, in every dimension.</span>
      </div>
    );

  return (
    <div
      className="service-art social-art"
      aria-label="Editorial social content direction"
    >
      <div className="art-topline">
        <span>SHOW UP. STAND FOR SOMETHING.</span>
        <span>05 / 05</span>
      </div>
      <div className="social-post post-one">
        <img
          src="/images/project-aether.jpg"
          alt="Aether concept social art direction"
          loading="lazy"
        />
        <div>
          <b>AETHER</b>
          <span>
            A moment,
            <br />
            just for you.
          </span>
        </div>
      </div>
      <div className="social-post post-two">
        <span>
          LESS
          <br />
          <i>SCROLL.</i>
          <br />
          MORE
          <br />
          <i>SOUL.</i>
        </span>
        <small>CONTENT THAT CONNECTS.</small>
      </div>
      <span className="art-footnote">
        A consistent voice. A lasting connection.
      </span>
    </div>
  );
}

function ServiceDescription({
  service,
  onExplore,
}: {
  service: Service;
  onExplore: (service: Service) => void;
}) {
  const isPresent = useIsPresent();
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="service-description"
      inert={!isPresent}
      aria-hidden={!isPresent}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.35, ease }}
    >
      <div>
        <p>{service.description}</p>
        <button
          className="text-link"
          type="button"
          onClick={() => onExplore(service)}
        >
          EXPLORE THE POSSIBILITIES <ArrowUpRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}

export function Services({
  onExplore,
}: {
  onExplore: (service: Service) => void;
}) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  return (
    <section
      className="services-section section-pad"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="container">
        <Reveal>
          <div className="section-label">
            <span className="label-dot" />
            02 / WHAT WE DO
          </div>
        </Reveal>
        <div className="section-heading-row">
          <Reveal>
            <h2 id="services-title">
              Everything your brand
              <br />
              needs to <span className="text-blue">move forward.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="section-aside">
              One creative partner.
              <br />
              Every part of your digital world.
            </p>
          </Reveal>
        </div>
        <div className="services-composition">
          <Reveal className="service-list">
            {services.map((service, index) => (
              <div
                className={`service-item ${active === index ? "is-active" : ""}`}
                key={service.id}
              >
                <h3>
                  <button
                    type="button"
                    id={`service-trigger-${service.id}`}
                    aria-expanded={active === index}
                    aria-controls={`service-panel-${service.id}`}
                    onClick={() => setActive(index)}
                  >
                    <span className="service-number">0{index + 1}</span>
                    <span>{service.shortTitle}</span>
                    {active === index ? (
                      <Minus size={18} />
                    ) : (
                      <Plus size={18} />
                    )}
                  </button>
                </h3>
                <div
                  id={`service-panel-${service.id}`}
                  role="region"
                  aria-labelledby={`service-trigger-${service.id}`}
                >
                  <AnimatePresence initial={false}>
                    {active === index && (
                      <ServiceDescription
                        service={service}
                        onExplore={onExplore}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal className="service-visual-wrap" delay={0.15}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={services[active].id}
                className="service-visual-inner"
                initial={{ opacity: 0, y: reduced ? 0 : 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -10 }}
                transition={{ duration: 0.25 }}
              >
                <ServiceVisual id={services[active].id} />
              </motion.div>
            </AnimatePresence>
            <div className="service-visual-caption">
              <span className="label-dot" />
              {services[active].visualLabel}
              <span className="caption-cross">+</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
