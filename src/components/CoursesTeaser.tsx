import { ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react';
import { COURSES_SLUG, coursesCopy } from '../courses';
import { useLang } from '../i18n';
import { servicePath } from '../paths';
import Reveal from './Reveal';

const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

/** Home page teaser for the Medical Assistant and Phlebotomy courses, linking to the courses page. */
export default function CoursesTeaser() {
  const lang = useLang();
  const copy = coursesCopy(lang);
  const coursesHref = servicePath(COURSES_SLUG, lang);

  return (
    <section id="courses" className="courses-teaser section-space" aria-labelledby="courses-teaser-title">
      <div className="page-width courses-teaser-grid">
        <Reveal className="courses-teaser-copy">
          <p className="eyebrow">{copy.home.eyebrow}</p>
          <h2 id="courses-teaser-title" className="section-title">{copy.home.title[0]} <em>{copy.home.title[1]}</em></h2>
          <p className="courses-teaser-text">{copy.home.text}</p>
          <p className="courses-teaser-language"><MessageCircle size={14} strokeWidth={1.7} aria-hidden="true" />{copy.languageTag}</p>
          <div className="courses-teaser-actions">
            <a className="button button-light" href={coursesHref}>{copy.home.button}<ArrowRight size={16} strokeWidth={1.5} /></a>
          </div>
        </Reveal>
        <ul className="courses-teaser-cards">
          {copy.courses.map((course, index) => (
            <li key={course.id}>
              <Reveal delay={0.08 + index * 0.07}>
                <a className="courses-teaser-card" href={`${coursesHref}#${course.id}`}>
                  <img src={course.image.src} alt={course.image.alt} width={course.image.width} height={course.image.height} loading="lazy" />
                  <span className="courses-teaser-card-body">
                    <span className="courses-teaser-card-name">{course.name}</span>
                    <span className="courses-teaser-card-meta">{copy.totalClasses(course.virtual.count + course.inPerson.count)} · {money(course.price)}</span>
                    <span className="courses-teaser-card-cta">{copy.viewCourse}<ArrowUpRight size={14} strokeWidth={1.5} /></span>
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
