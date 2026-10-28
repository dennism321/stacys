import {
  Accessibility, Activity, ArrowUpRight, Award, Biohazard, BookOpen, BriefcaseMedical, Building2, CalendarClock, CircleDollarSign,
  ClipboardCheck, Clock, Droplet, FileText, FolderOpen, GraduationCap, HandHeart, HeartPulse, Laptop, MapPin, Phone,
  PersonStanding, ShieldCheck, Stethoscope, Syringe, TestTube, TestTubes, UserRound, Users, type LucideIcon,
} from 'lucide-react';
import { studio } from '../data';
import { useLang, useT } from '../i18n';
import { asset, homePath } from '../paths';
import { coursesCopy, instagramHref, whatsappHref, type Course, type CourseIcon } from '../courses';
import Reveal from './Reveal';

const learnIcons: Record<CourseIcon, LucideIcon> = {
  stethoscope: Stethoscope, pressure: HeartPulse, anatomy: PersonStanding, transfer: Accessibility, terminology: BookOpen,
  ekg: Activity, syringe: Syringe, professional: BriefcaseMedical, tubes: TestTubes, tube: TestTube, venipuncture: Droplet,
  records: FileText, biohazard: Biohazard, care: HandHeart,
};
const highlightIcons = [GraduationCap, CalendarClock, HeartPulse];
const includedIcons = [Award, FolderOpen, UserRound, ShieldCheck];

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

/** A round badge with a line icon, the same style as the course flyers. */
function IconBadge({ icon: Icon, size = 'md' }: { icon: LucideIcon; size?: 'sm' | 'md' | 'lg' }) {
  return <span className={`course-badge course-badge-${size}`} aria-hidden="true"><Icon strokeWidth={1.6} /></span>;
}

function CourseSection({ course, flip }: { course: Course; flip: boolean }) {
  const copy = coursesCopy(useLang());
  return (
    <section id={course.id} className={`course-section course-${course.id}`} aria-labelledby={`${course.id}-title`}>
      <div className={`page-width course-grid ${flip ? 'course-grid-flip' : ''}`}>
        <Reveal className="course-media">
          <img src={course.image.src} alt={course.image.alt} width={course.image.width} height={course.image.height} loading="lazy" />
        </Reveal>
        <Reveal className="course-info" delay={0.08}>
          <p className="eyebrow">{copy.name.toUpperCase()}</p>
          <h2 id={`${course.id}-title`} className="section-title">{course.name}</h2>
          <p className="course-tagline">{course.tagline}</p>
          <p className="course-intro">{course.intro}</p>

          <div className="course-schedule">
            <div className="course-schedule-item">
              <IconBadge icon={Laptop} />
              <div>
                <h3>{copy.virtualClasses(course.virtual.count)}</h3>
                <p className="course-when"><span className="course-day">{course.virtual.day}</span><span><Clock size={14} strokeWidth={1.6} aria-hidden="true" />{course.virtual.time}</span></p>
                <p>{copy.virtualText}</p>
              </div>
            </div>
            <div className="course-schedule-item">
              <IconBadge icon={Building2} />
              <div>
                <h3>{copy.inPersonClasses(course.inPerson.count)}</h3>
                <p className="course-when"><span className="course-day">{course.inPerson.day}</span><span><Clock size={14} strokeWidth={1.6} aria-hidden="true" />{course.inPerson.time}</span></p>
                <p>{copy.inPersonText}</p>
              </div>
            </div>
            <p className="course-total">{copy.totalClasses(course.virtual.count + course.inPerson.count)}</p>
          </div>

          <div className="course-pricing">
            <div className="course-price">
              <IconBadge icon={CircleDollarSign} />
              <div><p className="course-price-label">{copy.totalInvestment}</p><p className="course-price-value">{money(course.price)}</p></div>
            </div>
            <div className="course-deposit">
              <p className="course-price-label">{copy.depositLabel}</p>
              <p className="course-price-value">{money(course.deposit)}</p>
            </div>
            <div className="course-spots">
              <IconBadge icon={Users} size="sm" />
              <div><p className="course-price-label">{copy.limitedSpots}</p><p className="course-spots-note">{copy.secureSpot}</p></div>
            </div>
          </div>

          <div className="course-actions">
            <a className="button button-primary" href={whatsappHref(course.whatsappText)} target="_blank" rel="noopener noreferrer">{copy.reserve}<ArrowUpRight size={16} strokeWidth={1.5} /></a>
            <a className="sp-call" href={studio.phoneHref}><Phone size={15} strokeWidth={1.5} />{studio.phone}</a>
          </div>
        </Reveal>
      </div>

      <div className="page-width">
        <Reveal className="course-learn">
          <h3 className="course-learn-title">{copy.learnTitle(course.name)}</h3>
          <ul>
            {course.learn.map((item) => (
              <li key={item.title}>
                <IconBadge icon={learnIcons[item.icon]} />
                <div><h4>{item.title}</h4><p>{item.text}</p></div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/** The certification courses page: Medical Assistant and Phlebotomy. */
export default function CoursesPageView() {
  const lang = useLang();
  const t = useT();
  const copy = coursesCopy(lang);

  return (
    <article className="courses-page" aria-labelledby="courses-title">
      <section className="courses-hero">
        <div className="page-width courses-hero-grid">
          <div className="courses-hero-copy">
            <nav className="breadcrumb" aria-label={t.breadcrumb}>
              <ol>
                <li><a href={homePath(lang)}>{t.home}</a></li>
                <li aria-current="page">{copy.name}</li>
              </ol>
            </nav>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1 id="courses-title">{copy.h1[0]} <em>{copy.h1[1]}</em></h1>
            <p className="courses-intro">{copy.intro}</p>
            <ul className="courses-jump">
              {copy.courses.map((course) => (
                <li key={course.id}>
                  <a href={`#${course.id}`}>
                    <span className="courses-jump-name">{course.name}</span>
                    <span className="courses-jump-meta">{copy.totalClasses(course.virtual.count + course.inPerson.count)} · {money(course.price)}</span>
                    <span className="courses-jump-cta">{copy.viewCourse}<ArrowUpRight size={14} strokeWidth={1.5} /></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="courses-hero-aside">
            <img className="courses-seal" src={asset('images/npce-seal.webp')} alt={copy.sealAlt} width="284" height="284" fetchPriority="high" />
            <div className="courses-certificate">
              <IconBadge icon={ClipboardCheck} size="sm" />
              <p className="courses-certificate-lead">{copy.certificateLead}</p>
              <p className="courses-certificate-title">{copy.certificate}</p>
              <p className="courses-certificate-note">{copy.certificateNote}</p>
            </div>
          </div>
        </div>
        <div className="page-width">
          <ul className="courses-highlights">
            {copy.highlights.map((item, index) => (
              <li key={item.title}><IconBadge icon={highlightIcons[index]} size="lg" /><h2>{item.title}</h2><p>{item.text}</p></li>
            ))}
          </ul>
        </div>
      </section>

      {copy.courses.map((course, index) => <CourseSection key={course.id} course={course} flip={index % 2 === 1} />)}

      <section className="courses-included" aria-label={copy.included[0]}>
        <ul className="page-width">
          {copy.included.map((item, index) => <li key={item}><IconBadge icon={includedIcons[index]} size="sm" /><span>{item}</span></li>)}
        </ul>
      </section>

      <section className="courses-enroll" aria-labelledby="courses-enroll-title">
        <Reveal className="page-width courses-enroll-inner">
          <p className="eyebrow">{copy.enrollEyebrow}</p>
          <h2 id="courses-enroll-title" className="section-title">{copy.enrollTitle[0]} <em>{copy.enrollTitle[1]}</em></h2>
          <p className="courses-enroll-text">{copy.enrollText}</p>
          <div className="courses-enroll-actions">
            <a className="button button-primary" href={whatsappHref(copy.whatsappText)} target="_blank" rel="noopener noreferrer">{copy.whatsapp}<ArrowUpRight size={16} strokeWidth={1.5} /></a>
            <a className="button button-secondary" href={studio.phoneHref}><Phone size={15} strokeWidth={1.5} />{copy.callUs} {studio.phone}</a>
          </div>
          <ul className="courses-contact">
            <li><MapPin size={16} strokeWidth={1.5} aria-hidden="true" /><a href={studio.mapsHref} target="_blank" rel="noopener noreferrer">{studio.street} {studio.locality}</a></li>
            <li><span aria-hidden="true" className="courses-contact-at">@</span><a href={instagramHref} target="_blank" rel="noopener noreferrer">{copy.followUs}: @stacysesthetics</a></li>
          </ul>
        </Reveal>
      </section>
    </article>
  );
}
