'use client';
/**
 * QuizClient — Interactive SWPPP Risk Assessment
 * Design: Multi-step card UI, animated semi-circle risk gauge, lead capture gate
 *
 * Scoring weights:
 *   Acreage 1-5 acres:         +30 pts
 *   Acreage 5+ acres:          +50 pts
 *   Near waterway/drain:       +50 pts
 *   Near waterway unsure:      +25 pts
 *   Phase: Groundbreak/Active: +20 pts
 *   Timeline: ASAP:            +15 pts
 *   State (high-risk):         +10 pts (CA, TX, FL, NY, WA, CO)
 *
 * Score >= 70 = High Risk | >= 40 = Medium Risk | < 40 = Low Risk
 *
 * Lead gate: Final step collects name/email/company before showing report.
 * Fluent Forms: POST to NEXT_PUBLIC_FLUENT_FORMS_URL when configured.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Droplets, HardHat, Clock, AlertTriangle,
  CheckCircle2, ChevronRight, ChevronLeft, Shield, Zap
} from 'lucide-react';

interface QuizAnswer {
  questionId: string;
  value: string;
  points: number;
}

interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];

const HIGH_RISK_STATES = ['california','texas','florida','new york','washington','colorado'];

const questions = [
  {
    id: 'state',
    step: 1,
    icon: MapPin,
    color: '#6B9ED1',
    title: 'What state is your project in?',
    subtitle: 'Regulations vary significantly by state.',
    type: 'dropdown' as const,
    options: US_STATES.map((s) => ({
      label: s,
      value: s.toLowerCase(),
      points: HIGH_RISK_STATES.includes(s.toLowerCase()) ? 10 : 0,
    })),
  },
  {
    id: 'acreage',
    step: 2,
    icon: HardHat,
    color: '#EF7C3B',
    title: 'Total land disturbance area?',
    subtitle: 'Federal law requires a SWPPP for sites disturbing 1+ acres.',
    type: 'tiles' as const,
    options: [
      { label: 'Under 1 Acre', value: 'under_1', points: 0, icon: '🏠', desc: 'Small residential or minor grading' },
      { label: '1 to 5 Acres', value: '1_to_5', points: 30, icon: '🏗️', desc: 'Mid-size commercial or subdivision' },
      { label: '5+ Acres', value: 'over_5', points: 50, icon: '🏭', desc: 'Large commercial, industrial, or infrastructure' },
    ],
  },
  {
    id: 'waterway',
    step: 3,
    icon: Droplets,
    color: '#154FC1',
    title: 'Storm drain or waterway within 50 ft?',
    subtitle: 'Proximity to water dramatically increases regulatory scrutiny.',
    type: 'tiles' as const,
    options: [
      { label: 'Yes', value: 'yes', points: 50, icon: '💧', desc: 'Drain, creek, pond, or wetland nearby' },
      { label: 'No', value: 'no', points: 0, icon: '🏜️', desc: 'No water features within 50 feet' },
      { label: "Not Sure", value: 'unsure', points: 25, icon: '❓', desc: 'Site survey not yet completed' },
    ],
  },
  {
    id: 'phase',
    step: 4,
    icon: HardHat,
    color: '#EF7C3B',
    title: 'Current site stage?',
    subtitle: 'Active construction phases carry the highest compliance risk.',
    type: 'tiles' as const,
    options: [
      { label: 'Planning', value: 'planning', points: 5, icon: '📋', desc: 'Pre-construction, permits pending' },
      { label: 'Groundbreaking', value: 'groundbreak', points: 20, icon: '⛏️', desc: 'Clearing, grading, or excavation starting' },
      { label: 'Mid-Construction', value: 'mid', points: 20, icon: '🏗️', desc: 'Active building, site already disturbed' },
      { label: 'Near Completion', value: 'near_complete', points: 10, icon: '🏁', desc: 'Stabilization and permit close-out phase' },
    ],
  },
  {
    id: 'timeline',
    step: 5,
    icon: Clock,
    color: '#4CAF50',
    title: 'How soon do you need your permit?',
    subtitle: 'Timing affects which compliance pathway is right for you.',
    type: 'tiles' as const,
    options: [
      { label: 'ASAP', value: 'asap', points: 15, icon: '🚨', desc: 'Site is active or inspector is coming' },
      { label: 'Within 1 Week', value: '1_week', points: 10, icon: '📅', desc: 'Construction starting soon' },
      { label: 'Within 1 Month', value: '1_month', points: 5, icon: '🗓️', desc: 'Planning ahead — good thinking' },
    ],
  },
];

function RiskGauge({ score }: { score: number }) {
  const clamped = Math.min(100, Math.max(0, score));
  // -90° = left (LOW), 0° = up (MED), +90° = right (HIGH)
  // Compute endpoint directly to avoid CSS/SVG transform conflicts
  const angleDeg = -90 + (clamped / 100) * 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  const nx2 = parseFloat((Math.sin(angleRad) * 72).toFixed(2));
  const ny2 = parseFloat((-Math.cos(angleRad) * 72).toFixed(2));

  const riskLevel = clamped >= 70 ? 'HIGH' : clamped >= 40 ? 'MEDIUM' : 'LOW';
  const riskColor = clamped >= 70 ? '#EF4444' : clamped >= 40 ? '#F59E0B' : '#22C55E';
  const riskLabel = clamped >= 70 ? 'High Risk' : clamped >= 40 ? 'Medium Risk' : 'Low Risk';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[280px]">
        <svg viewBox="0 -10 200 132" className="w-full">
          {/* Background arc */}
          <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="#000000" strokeWidth="18" strokeLinecap="round" />
          {/* Colored segments */}
          <path d="M 15 100 A 85 85 0 0 1 70 22" fill="none" stroke="#22C55E" strokeWidth="18" strokeLinecap="round" opacity="0.8" />
          <path d="M 70 22 A 85 85 0 0 1 130 22" fill="none" stroke="#F59E0B" strokeWidth="18" strokeLinecap="round" opacity="0.8" />
          <path d="M 130 22 A 85 85 0 0 1 185 100" fill="none" stroke="#EF4444" strokeWidth="18" strokeLinecap="round" opacity="0.8" />
          {/* Labels outside the arc */}
          <text x="10" y="118" fill="#22C55E" fontSize="8" fontWeight="700" fontFamily="Roboto, sans-serif" textAnchor="middle">LOW</text>
          <text x="100" y="2" fill="#F59E0B" fontSize="8" fontWeight="700" fontFamily="Roboto, sans-serif" textAnchor="middle">MED</text>
          <text x="190" y="118" fill="#EF4444" fontSize="8" fontWeight="700" fontFamily="Roboto, sans-serif" textAnchor="middle">HIGH</text>
          {/* Needle: pivot at (100,100), endpoint computed from angle — no CSS transforms needed */}
          <g transform="translate(100, 100)">
            <motion.line
              x1={0} y1={0}
              animate={{ x2: nx2, y2: ny2 }}
              stroke={riskColor} strokeWidth="3" strokeLinecap="round"
              transition={{ type: 'spring', stiffness: 60, damping: 14 }}
            />
            <circle cx="0" cy="0" r="6" fill={riskColor} />
            <circle cx="0" cy="0" r="3" fill="#000000" />
          </g>
        </svg>
      </div>
      <motion.div
        key={riskLevel}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center mt-1"
      >
        <div className="text-4xl font-black" style={{ color: riskColor, fontFamily: 'Inter, sans-serif' }}>{clamped}</div>
        <div className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: riskColor }}>{riskLabel}</div>
      </motion.div>
      {clamped >= 70 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-start gap-2 bg-red-950/60 border border-red-500/40 rounded-xl px-4 py-3 max-w-[260px]"
        >
          <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-300 text-xs leading-relaxed">
            <strong>High Risk Detected:</strong> Immediate SWPPP recommended. Fines can reach $50,000/day.
          </p>
        </motion.div>
      )}
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current - 1) / total) * 100;
  return (
    <div className="w-full bg-white/10 rounded-full h-1.5 mb-6">
      <motion.div
        className="h-1.5 rounded-full"
        style={{ background: 'linear-gradient(90deg, #EF7C3B, #6B9ED1)' }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}

export default function QuizClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showLead, setShowLead] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({ firstName: '', lastName: '', email: '', company: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = questions.length;
  const riskScore = Math.min(100, answers.reduce((sum, a) => sum + a.points, 0));
  const currentQuestion = questions.find((q) => q.step === currentStep);
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id);

  const handleTileSelect = useCallback((questionId: string, value: string, points: number) => {
    setAnswers((prev) => [...prev.filter((a) => a.questionId !== questionId), { questionId, value, points }]);
  }, []);

  const handleDropdownChange = useCallback((questionId: string, value: string, points: number) => {
    setAnswers((prev) => [...prev.filter((a) => a.questionId !== questionId), { questionId, value, points }]);
  }, []);

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep((s) => s + 1);
    else setShowLead(true);
  };

  const handleBack = () => {
    if (showLead) setShowLead(false);
    else if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleLeadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeadData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...leadData,
      riskScore,
      riskLevel: riskScore >= 70 ? 'HIGH' : riskScore >= 40 ? 'MEDIUM' : 'LOW',
      answers: answers.map((a) => ({ question: a.questionId, answer: a.value })),
    };
    // TODO: Wire to Fluent Forms when configured:
    // const url = process.env.NEXT_PUBLIC_FLUENT_FORMS_URL;
    // const formId = process.env.NEXT_PUBLIC_QUIZ_FORM_ID;
    // if (url && formId) {
    //   const fd = new FormData();
    //   fd.append('form_id', formId);
    //   Object.entries(payload).forEach(([k, v]) => fd.append(k, String(v)));
    //   await fetch(url, { method: 'POST', body: fd });
    // }
    await new Promise((res) => setTimeout(res, 1200));
    console.log('[Quiz] Submitted:', payload);
    setSubmitted(true);
    setSubmitting(false);
  };

  const riskColor = riskScore >= 70 ? '#EF4444' : riskScore >= 40 ? '#F59E0B' : '#22C55E';
  const riskLevel = riskScore >= 70 ? 'HIGH' : riskScore >= 40 ? 'MEDIUM' : 'LOW';

  return (
    <>
    <section
      className="min-h-screen py-16 lg:py-24"
      style={{ background: '#000000' }}
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#EF7C3B]/15 border border-[#EF7C3B]/30 rounded-full px-4 py-1.5 mb-4">
            <Shield size={14} className="text-[#EF7C3B]" />
            <span className="text-[#EF7C3B] text-xs font-bold uppercase tracking-widest">Free Risk Assessment</span>
          </div>
          <h1 className="text-white uppercase leading-none mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontFamily: 'Inter, sans-serif', fontWeight: 900, letterSpacing: '-0.02em' }}>
            SWPPP Compliance<br />
            <span style={{ color: '#EF7C3B' }}>Risk Diagnostic</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            Answer 5 quick questions. We will calculate your site compliance risk score and send you a personalized 72-Hour Compliance Roadmap — free.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {!showLead && !submitted && (
              <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* Question Card */}
                <div className="lg:col-span-3">
                  <div className="rounded-2xl p-6 lg:p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500 text-xs font-medium uppercase tracking-widest">Question {currentStep} of {totalSteps}</span>
                      <span className="text-gray-500 text-xs">{Math.round(((currentStep - 1) / totalSteps) * 100)}% complete</span>
                    </div>
                    <ProgressBar current={currentStep} total={totalSteps} />

                    {currentQuestion && (
                      <AnimatePresence mode="wait">
                        <motion.div key={currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                          <div className="flex items-start gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${currentQuestion.color}20` }}>
                              <currentQuestion.icon size={20} style={{ color: currentQuestion.color }} />
                            </div>
                            <div>
                              <h2 className="text-white font-black text-lg leading-tight mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>{currentQuestion.title}</h2>
                              <p className="text-gray-400 text-sm">{currentQuestion.subtitle}</p>
                            </div>
                          </div>

                          {currentQuestion.type === 'dropdown' && (
                            <select
                              className="w-full rounded-xl px-4 py-3 text-white text-sm font-medium outline-none transition-all"
                              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'Roboto, sans-serif' }}
                              value={currentAnswer?.value || ''}
                              onChange={(e) => {
                                const opt = currentQuestion.options.find((o) => o.value === e.target.value);
                                handleDropdownChange(currentQuestion.id, e.target.value, opt?.points || 0);
                              }}
                            >
                              <option value="" disabled style={{ color: '#000' }}>Select your state...</option>
                              {currentQuestion.options.map((opt) => (
                                <option key={opt.value} value={opt.value} style={{ color: '#000' }}>
                                  {opt.label}{opt.points > 0 ? ' ⚠️' : ''}
                                </option>
                              ))}
                            </select>
                          )}

                          {currentQuestion.type === 'tiles' && (
                            <div className={`grid gap-3 ${currentQuestion.options.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
                              {currentQuestion.options.map((opt) => {
                                const isSelected = currentAnswer?.value === opt.value;
                                const tileOpt = opt as { label: string; value: string; points: number; icon: string; desc: string };
                                return (
                                  <button
                                    key={opt.value}
                                    onClick={() => handleTileSelect(currentQuestion.id, opt.value, opt.points)}
                                    className="text-left rounded-xl p-4 transition-all duration-200"
                                    style={{
                                      background: isSelected ? `${currentQuestion.color}20` : 'rgba(255,255,255,0.04)',
                                      border: isSelected ? `2px solid ${currentQuestion.color}` : '2px solid rgba(255,255,255,0.08)',
                                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                    }}
                                  >
                                    <div className="text-2xl mb-2">{tileOpt.icon}</div>
                                    <div className="font-bold text-sm mb-1" style={{ color: isSelected ? currentQuestion.color : 'white', fontFamily: 'Inter, sans-serif' }}>{tileOpt.label}</div>
                                    <div className="text-gray-400 text-xs leading-relaxed">{tileOpt.desc}</div>
                                    {tileOpt.points >= 30 && (
                                      <div className="mt-2 flex items-center gap-1">
                                        <AlertTriangle size={10} className="text-amber-400" />
                                        <span className="text-amber-400 text-xs font-medium">High risk factor</span>
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    )}

                    <div className="flex items-center justify-between mt-8">
                      <button onClick={handleBack} disabled={currentStep === 1} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed">
                        <ChevronLeft size={16} />Back
                      </button>
                      <button onClick={handleNext} disabled={!currentAnswer} className="flex items-center gap-2 btn-orange text-sm px-6 py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                        {currentStep === totalSteps ? 'See My Results' : 'Next'}
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Risk Gauge */}
                <div className="lg:col-span-2">
                  <div className="rounded-2xl p-6 sticky top-24" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Zap size={16} className="text-[#EF7C3B]" />
                      <span className="text-white text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>Live Risk Score</span>
                    </div>
                    <RiskGauge score={riskScore} />
                    {answers.length > 0 && (
                      <div className="mt-5 space-y-2">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Your Answers</p>
                        {answers.map((a) => {
                          const q = questions.find((q) => q.id === a.questionId);
                          return (
                            <div key={a.questionId} className="flex items-center justify-between text-xs">
                              <span className="text-gray-400 capitalize">{q?.title.split('?')[0]}</span>
                              <span className="font-semibold capitalize" style={{ color: a.points >= 30 ? '#F59E0B' : '#6B9ED1' }}>{a.value.replace(/_/g, ' ')}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="mt-5 pt-4 border-t border-white/10">
                      <p className="text-gray-500 text-xs leading-relaxed">Score updates in real-time as you answer each question.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Lead Capture Gate */}
            {showLead && !submitted && (
              <motion.div key="lead" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
                <div className="rounded-2xl p-8 lg:p-10" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)' }}>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ background: `${riskColor}20`, border: `2px solid ${riskColor}` }}>
                      <span className="text-2xl font-black" style={{ color: riskColor, fontFamily: 'Inter, sans-serif' }}>{riskScore}</span>
                    </div>
                    <h2 className="text-white text-2xl font-black uppercase mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Your Risk Score: <span style={{ color: riskColor }}>{riskLevel}</span>
                    </h2>
                    <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                      Your personalized <strong className="text-white">72-Hour Compliance Roadmap</strong> is ready. Enter your details below to receive it along with a free consultation with our SWPPP experts.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Hidden fields — quiz answers passed to form processor */}
                    {answers.map((a) => (
                      <input key={a.questionId} type="hidden" name={`quiz_${a.questionId}`} value={a.value} />
                    ))}
                    <input type="hidden" name="quiz_risk_score" value={String(riskScore)} />
                    <input type="hidden" name="quiz_risk_level" value={riskLevel} />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-xs mb-1.5 uppercase tracking-wide">First Name *</label>
                        <input type="text" name="firstName" value={leadData.firstName} onChange={handleLeadChange} required placeholder="John" className="hero-input" />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs mb-1.5 uppercase tracking-wide">Last Name *</label>
                        <input type="text" name="lastName" value={leadData.lastName} onChange={handleLeadChange} required placeholder="Smith" className="hero-input" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1.5 uppercase tracking-wide">Email Address *</label>
                      <input type="email" name="email" value={leadData.email} onChange={handleLeadChange} required placeholder="john@company.com" className="hero-input" />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1.5 uppercase tracking-wide">Company Name</label>
                      <input type="text" name="company" value={leadData.company} onChange={handleLeadChange} placeholder="ABC Construction LLC" className="hero-input" />
                    </div>
                    <button type="submit" disabled={submitting} className="w-full btn-orange text-base py-4 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
                      {submitting ? 'Sending...' : 'Get My 72-Hour Compliance Roadmap'}
                    </button>
                    <p className="text-gray-500 text-xs text-center">🔒 Your information is secure. No spam, ever.</p>
                  </form>
                  <button onClick={handleBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-xs mt-4 transition-colors">
                    <ChevronLeft size={12} />Back to questions
                  </button>
                </div>
              </motion.div>
            )}

            {/* Thank You Screen */}
            {submitted && (
              <motion.div key="thankyou" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto text-center">
                <div className="rounded-2xl p-10 lg:p-14" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
                  <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={36} className="text-green-400" />
                  </div>
                  <h2 className="text-white text-3xl font-black uppercase mb-3" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
                    You are All Set, <span style={{ color: '#EF7C3B' }}>{leadData.firstName}!</span>
                  </h2>
                  <p className="text-gray-400 text-base leading-relaxed mb-2 max-w-md mx-auto">
                    Your <strong className="text-white">72-Hour Compliance Roadmap</strong> is on its way to <strong className="text-white">{leadData.email}</strong>.
                  </p>
                  <p className="text-gray-500 text-sm mb-8">One of our SWPPP experts will reach out within 1 business hour.</p>
                  <div className="inline-flex items-center gap-3 rounded-xl px-6 py-4 mb-8" style={{ background: `${riskColor}15`, border: `1px solid ${riskColor}40` }}>
                    <div>
                      <div className="text-3xl font-black" style={{ color: riskColor, fontFamily: 'Inter, sans-serif' }}>{riskScore}</div>
                      <div className="text-xs font-bold uppercase tracking-widest" style={{ color: riskColor }}>{riskLevel} RISK</div>
                    </div>
                    <div className="text-left">
                      <p className="text-white text-sm font-semibold">Your Risk Score</p>
                      <p className="text-gray-400 text-xs">{riskLevel === 'HIGH' ? 'Immediate action recommended' : riskLevel === 'MEDIUM' ? 'SWPPP likely required' : 'Low risk — plan ahead'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 mb-8 p-4 rounded-xl bg-[#EF7C3B]/10 border border-[#EF7C3B]/25">
                    <Shield size={24} className="text-[#EF7C3B]" />
                    <div className="text-left">
                      <p className="text-white font-black text-sm uppercase tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>72-Hour Delivery Guarantee</p>
                      <p className="text-gray-400 text-xs">Your SWPPP delivered in 72 hours or it is FREE.</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="https://proswppp.com/get-your-swppp/" className="btn-orange text-sm px-8 py-3.5">Order My SWPPP Now</a>
                    <a href="tel:8334387977" className="btn-blue text-sm px-8 py-3.5">📞 Call 833-GET-SWPP</a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>

      {/* ── Quiz Page FAQs ── */}
      <QuizFAQSection />
    </>
  );
}

function QuizFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What triggers the requirement for a SWPPP?",
      a: "Any construction activity that disturbs 1 or more acres of land — or is part of a larger common plan of development — requires a SWPPP under the EPA's Construction General Permit (CGP). Some states have lower thresholds (as little as 0.5 acres in California), so always check your local state permit requirements.",
    },
    {
      q: "Who is legally responsible for the SWPPP on a job site?",
      a: "The permit holder — typically the land developer or general contractor — is legally responsible. However, responsibility can be shared or transferred through the permit process. The Stormwater Pollution Prevention Team listed in the SWPPP are accountable for implementation and inspections throughout the project.",
    },
    {
      q: "How often do SWPPP inspections need to occur?",
      a: "Under the EPA CGP, qualified personnel must inspect the entire site at least every 7 calendar days, OR once every 14 days AND within 24 hours of a 0.25-inch or greater rainfall event. States may impose more frequent requirements. Pro SWPPP provides inspection services to keep you fully in compliance.",
    },
    {
      q: "What is a Notice of Intent (NOI) and how does it relate to my SWPPP?",
      a: "The NOI is your formal notification to the regulatory agency that you intend to obtain coverage under the Construction General Permit. Your SWPPP must be developed BEFORE you submit your NOI. You cannot legally begin earth-disturbing activities until your NOI is accepted and permit coverage is granted.",
    },
    {
      q: "Can I use the same SWPPP for multiple projects?",
      a: "No. SWPPPs are site-specific documents. Each project requires its own plan tailored to that site's topography, soil conditions, drainage patterns, BMPs, and local permit requirements. A generic SWPPP that isn't site-specific will fail inspection and expose you to significant fines.",
    },
    {
      q: "Do SWPPP requirements differ by state?",
      a: "Yes, significantly. While the EPA's Construction General Permit sets minimum federal standards, states with NPDES authorization administer their own programs and may require additional BMPs, more frequent inspections, lower acreage thresholds, or different reporting formats. Pro SWPPP is experienced across all 50 states and ensures your plan meets every applicable requirement.",
    },
    {
      q: "What happens to the SWPPP when I sell or transfer the property?",
      a: "Permit coverage — and SWPPP responsibility — must be formally transferred to the new owner before the sale closes. Both parties must sign a transfer agreement and notify the permitting authority. Failing to transfer coverage properly leaves the original permit holder liable for any violations that occur after the sale.",
    },
  ];

  return (
    <section style={{ background: '#000000' }} className="py-20 lg:py-24">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.2em] mb-3 font-semibold" style={{ color: "#EF7C3B" }}>
            SWPPP Compliance
          </p>
          <h2 className="text-4xl lg:text-5xl font-black leading-tight text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            Frequently Asked Questions
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-[#EF7C3B]/40" />
            <span className="text-[#EF7C3B] text-xl">✦</span>
            <span className="h-px w-16 bg-[#EF7C3B]/40" />
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-[11px]"
                style={{
                  border: isOpen ? "1px solid #EF7C3B" : "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: isOpen ? "rgba(239,124,59,0.06)" : "rgba(255,255,255,0.03)",
                  transition: "border-color 0.25s, background-color 0.25s",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                >
                  <span className="text-base lg:text-lg font-bold text-white leading-snug group-hover:text-[#EF7C3B] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {faq.q}
                  </span>
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors text-lg leading-none"
                    style={{ backgroundColor: isOpen ? "#EF7C3B" : "rgba(239,124,59,0.15)", color: isOpen ? "white" : "#EF7C3B" }}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="h-px w-full mb-4" style={{ backgroundColor: "rgba(239,124,59,0.2)" }} />
                    <p className="text-gray-300 leading-relaxed" style={{ fontFamily: "'Roboto', sans-serif", fontSize: "0.9375rem" }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-5 text-sm">Still have questions? Our team is ready to help.</p>
          <a
            href="tel:8334387977"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-[11px] font-bold text-white uppercase tracking-wide transition-all hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: "#EF7C3B", fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "0.9375rem" }}
          >
            Call Derek at 833-GET-SWPP
          </a>
        </div>
      </div>
    </section>
  );
}
