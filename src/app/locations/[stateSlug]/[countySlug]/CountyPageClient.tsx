'use client';

import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';

interface FileItem {
  id: number;
  display_name: string;
  file_url: string;
  file_type: string;
  level: string;
}

interface City {
  id: number;
  name: string;
  slug: string;
}

interface CountyData {
  id: number;
  name: string;
  slug: string;
  summary: string;
  state: { id: number; name: string; slug: string; abbreviation: string };
  cities: City[];
  files: FileItem[];
}

interface Props {
  county: CountyData;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function FileBadge({ type }: { type: string }) {
  const upper = (type ?? '').toUpperCase();
  const isDoc = upper === 'DOC' || upper === 'DOCX';
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: '0.7rem',
        fontWeight: 700,
        fontFamily: "'Roboto', Arial, sans-serif",
        background: isDoc ? 'rgba(107,158,209,0.2)' : 'rgba(220,60,60,0.2)',
        color: isDoc ? '#6B9ED1' : '#e05555',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {upper || 'FILE'}
    </span>
  );
}

function LevelBadge({ level }: { level: string }) {
  const labels: Record<string, string> = {
    county: 'County Resource',
    state: 'State Resource',
    city: 'City Resource',
  };
  const colors: Record<string, { bg: string; color: string }> = {
    county: { bg: 'rgba(107,158,209,0.15)', color: '#6B9ED1' },
    state:  { bg: 'rgba(45,125,70,0.15)',   color: '#2D9E5B' },
    city:   { bg: 'rgba(239,124,59,0.15)',  color: '#EF7C3B' },
  };
  const style = colors[level] ?? colors.state;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: '0.7rem',
        fontWeight: 700,
        fontFamily: "'Roboto', Arial, sans-serif",
        background: style.bg,
        color: style.color,
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      {labels[level] ?? level}
    </span>
  );
}

export default function CountyPageClient({ county }: Props) {
  const { state } = county;

  return (
    <>
      {/* Breadcrumb */}
      <nav
        className="container"
        style={{ paddingTop: '1.5rem', paddingBottom: '0.5rem' }}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center gap-2 flex-wrap" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: '0.8rem' }}>
          <li><a href="/locations" style={{ color: 'rgba(255,255,255,0.5)' }} className="hover:text-white transition-colors">Locations</a></li>
          <li style={{ color: 'rgba(255,255,255,0.3)' }}>/</li>
          <li><a href={`/locations/${state.slug}`} style={{ color: 'rgba(255,255,255,0.5)' }} className="hover:text-white transition-colors">{state.name}</a></li>
          <li style={{ color: 'rgba(255,255,255,0.3)' }}>/</li>
          <li style={{ color: '#EF7C3B' }}>{county.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="py-20" style={{ background: '#000000' }}>
        <div className="container">
          <motion.div
            className="max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <p
              className="section-label mb-4"
              style={{
                fontFamily: "'Roboto', Arial, sans-serif",
                fontWeight: 900,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#EF7C3B',
              }}
            >
              SWPPP Services
            </p>
            <h1
              className="text-white uppercase leading-none mb-6"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: '-0.03em',
              }}
            >
              {county.name}, {state.abbreviation}{' '}
              <span style={{ color: '#EF7C3B' }}>SWPPP Services</span>
            </h1>
            <p
              style={{
                fontFamily: "'Roboto', Arial, sans-serif",
                color: 'rgba(255,255,255,0.7)',
                fontSize: '1.125rem',
                lineHeight: 1.7,
                marginBottom: '2rem',
              }}
            >
              Fully compliant stormwater plans delivered in 72 hours for{' '}
              {county.name} County, {state.name} construction projects.
            </p>

            {county.summary && (
              <div
                className="wp-content"
                style={{ color: 'rgba(255,255,255,0.7)' }}
                dangerouslySetInnerHTML={{ __html: county.summary }}
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* Cities */}
      {county.cities.length > 0 && (
        <section className="py-16" style={{ background: '#000000' }}>
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
            >
              <h2
                className="text-white uppercase mb-10"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                }}
              >
                Cities We Serve
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {county.cities.map((city) => (
                  <a
                    key={city.id}
                    href={`/locations/${state.slug}/${county.slug}/${city.slug}`}
                    className="group block rounded-xl p-4 transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(239,124,59,0.5)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: '#ffffff',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {city.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Roboto', Arial, sans-serif",
                        fontSize: '0.75rem',
                        color: '#EF7C3B',
                      }}
                    >
                      View Details →
                    </p>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Documents */}
      {county.files.length > 0 && (
        <section className="py-16" style={{ background: '#000000' }}>
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
            >
              <h2
                className="text-white uppercase mb-8"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                }}
              >
                Resources &amp; Documents
              </h2>
              <div className="flex flex-col gap-3">
                {county.files.map((file) => (
                  <a
                    key={file.id}
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl p-4 transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(239,124,59,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
                    }}
                  >
                    <FileText size={20} style={{ color: '#EF7C3B', flexShrink: 0 }} />
                    <span
                      style={{
                        fontFamily: "'Roboto', Arial, sans-serif",
                        color: 'rgba(255,255,255,0.9)',
                        flex: 1,
                        fontSize: '0.9rem',
                      }}
                    >
                      {file.display_name}
                    </span>
                    <LevelBadge level={file.level} />
                    <FileBadge type={file.file_type} />
                    <Download size={16} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16" style={{ background: '#000000' }}>
        <div className="container">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <h2
              className="text-white uppercase mb-6"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: '-0.02em',
              }}
            >
              Get My{' '}
              <span style={{ color: '#EF7C3B' }}>SWPPP</span>
            </h2>
            <a href="/get-your-swppp" className="btn-orange" style={{ display: 'inline-block' }}>
              Get My SWPPP
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
