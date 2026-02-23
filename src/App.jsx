import { useState, useEffect } from 'react'

/* ─── colour palette ─── */
const GOLD = '#C8A456'
const BG = '#0A0A0A'
const CARD_BG = '#141414'
const CARD_BORDER = '#1E1E1E'
const TEXT = '#E8E0D4'
const TEXT_DIM = '#9A9080'

const SHIFT_COLORS = {
  1: '#C8A456',   // gold
  2: '#B87333',   // copper
  3: '#7A8B6F',   // sage green
  4: '#C4715B',   // terracotta
  5: '#A08942',   // dark gold
}

/* ─── quiz data ─── */
const QUIZ = [
  {
    q: 'When you make a mistake on your nutrition plan, you usually…',
    a: [
      { text: 'Beat yourself up and want to quit', score: 1 },
      { text: 'Feel frustrated but try to move on', score: 2 },
      { text: 'See it as data and adjust without drama', score: 3 },
    ],
  },
  {
    q: 'How do you feel about the word "diet"?',
    a: [
      { text: 'It feels restrictive and triggering', score: 1 },
      { text: 'Neutral — it depends on the context', score: 2 },
      { text: 'I see nutrition as a lifestyle, not a diet', score: 3 },
    ],
  },
  {
    q: 'When progress feels slow, you tend to…',
    a: [
      { text: 'Try a completely different plan', score: 1 },
      { text: 'Get discouraged but stick it out', score: 2 },
      { text: 'Trust the process and stay consistent', score: 3 },
    ],
  },
  {
    q: 'Your relationship with the scale is…',
    a: [
      { text: 'It controls my mood for the whole day', score: 1 },
      { text: 'I check it but try not to obsess', score: 2 },
      { text: 'It\'s one data point among many', score: 3 },
    ],
  },
  {
    q: 'When it comes to meal prep, you…',
    a: [
      { text: 'Go all-in for a week then fall off', score: 1 },
      { text: 'Do it sometimes when motivated', score: 2 },
      { text: 'Keep it simple and sustainable', score: 3 },
    ],
  },
  {
    q: 'How do you handle social events with food?',
    a: [
      { text: 'Avoid them or feel anxious the whole time', score: 1 },
      { text: 'Try to be "good" but usually overdo it', score: 2 },
      { text: 'Enjoy myself and get back on track the next meal', score: 3 },
    ],
  },
  {
    q: 'When you think about your health journey, you feel…',
    a: [
      { text: 'Like I\'m always starting over', score: 1 },
      { text: 'Hopeful but unsure', score: 2 },
      { text: 'Confident in my ability to figure it out', score: 3 },
    ],
  },
  {
    q: 'Your inner voice when it comes to food is usually…',
    a: [
      { text: 'Critical and judgmental', score: 1 },
      { text: 'A mix of supportive and harsh', score: 2 },
      { text: 'Compassionate and encouraging', score: 3 },
    ],
  },
  {
    q: 'How do you define success with nutrition?',
    a: [
      { text: 'A specific number on the scale', score: 1 },
      { text: 'Looking a certain way', score: 2 },
      { text: 'Feeling strong, energized, and at peace with food', score: 3 },
    ],
  },
  {
    q: 'When life gets stressful, your eating habits…',
    a: [
      { text: 'Go completely off the rails', score: 1 },
      { text: 'Slip a bit but I manage', score: 2 },
      { text: 'Stay mostly steady — I have coping tools', score: 3 },
    ],
  },
]

const QUIZ_CATEGORIES = [
  { range: [0, 1], shift: 'Progress Over Perfection' },
  { range: [2, 3], shift: 'Identity Before Habits' },
  { range: [4, 5], shift: 'The 90% Rule' },
  { range: [6, 7], shift: 'Boredom Is the Real Enemy' },
  { range: [8, 9], shift: "You're Not Starting Over" },
]

/* ─── shift content ─── */
const SHIFTS = [
  {
    id: 1,
    title: 'Progress Over Perfection',
    subtitle: 'Shift #1',
    description:
      'The all-or-nothing mindset is the #1 killer of lasting change. You don\'t need a perfect week — you need a consistent pattern of good-enough choices.',
    oldStory:
      'I messed up today so the whole week is ruined. I\'ll start fresh on Monday.',
    newStory:
      'One off meal doesn\'t erase my progress. I\'ll make my next choice a nourishing one.',
    prompts: [
      'Think of a time you quit a plan because of one "bad" day. What would you tell your past self now?',
      'What does "good enough" look like for you on a busy weekday? Describe a realistic day of eating.',
      'Write your own permission slip: "I give myself permission to…"',
    ],
  },
  {
    id: 2,
    title: 'Identity Before Habits',
    subtitle: 'Shift #2',
    description:
      'You don\'t stick with habits because of willpower. You stick with them because they match who you believe you are. Change the identity first, and the habits follow.',
    oldStory:
      'I\'m just not a healthy person. I\'ve always struggled with food.',
    newStory:
      'I am someone who nourishes her body. Every choice is a vote for the woman I\'m becoming.',
    prompts: [
      'Describe the healthiest version of yourself in detail. How does she eat? Move? Talk to herself?',
      'What 3 "identity statements" can you start telling yourself daily? (e.g., "I am someone who…")',
    ],
  },
  {
    id: 3,
    title: 'The 90% Rule',
    subtitle: 'Shift #3',
    description:
      'You don\'t need to eat perfectly 100% of the time. If you nail it 90% of the time, the other 10% won\'t matter. Sustainability beats perfection every single time.',
    oldStory:
      'I can\'t have any treats or I\'ll spiral. It has to be all clean eating.',
    newStory:
      'I eat well 90% of the time and enjoy life the other 10%. That\'s not cheating — that\'s balance.',
    prompts: [
      'What does your 90% look like? List the meals and habits that make up your "non-negotiable" baseline.',
      'What does your 10% look like? What treats or indulgences actually bring you joy (not guilt)?',
      'How can you enjoy your 10% without it turning into 50%? What boundaries feel right?',
    ],
  },
  {
    id: 4,
    title: 'Boredom Is the Real Enemy',
    subtitle: 'Shift #4',
    description:
      'Most people don\'t fail because the plan is too hard. They fail because it gets boring. The secret to lasting change is learning to embrace the mundane and find satisfaction in consistency.',
    oldStory:
      'This is boring. I need a new plan, a new challenge, something exciting to keep me going.',
    newStory:
      'Boring means it\'s working. The magic is in the repetition. I don\'t need excitement — I need results.',
    prompts: [
      'What healthy habits have you abandoned just because they got boring — not because they weren\'t working?',
      'How can you make your daily routine feel more intentional without adding complexity?',
      'Write a commitment to yourself: "I will stay consistent with _____ even when it feels boring because _____."',
    ],
  },
  {
    id: 5,
    title: "You're Not Starting Over",
    subtitle: 'Shift #5',
    description:
      'Every time you come back to your health journey, you bring everything you\'ve learned before. You\'re not at square one — you\'re at square two, or five, or twenty. You carry your lessons forward.',
    oldStory:
      'Here I go again, starting from scratch. I always end up back here.',
    newStory:
      'I\'m not starting over. I\'m starting from experience. Every attempt taught me something I\'ll use this time.',
    prompts: [
      'List 3 things you\'ve learned from previous attempts that you\'re carrying into this chapter.',
      'Write a letter to yourself that you can re-read on hard days. Start with "Dear Queen…"',
    ],
  },
]

/* ─── styles ─── */
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; }
  body {
    background: ${BG};
    color: ${TEXT};
    font-family: Georgia, 'Times New Roman', serif;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }
  .fade-enter { opacity: 0; transform: translateY(12px); }
  .fade-active { opacity: 1; transform: translateY(0); transition: opacity .45s ease, transform .45s ease; }
  textarea {
    width: 100%;
    min-height: 110px;
    background: ${BG};
    border: 1px solid #2A2A2A;
    border-radius: 8px;
    color: ${TEXT};
    font-family: Georgia, 'Times New Roman', serif;
    font-size: .95rem;
    padding: 14px;
    resize: vertical;
    line-height: 1.6;
    transition: border-color .3s;
  }
  textarea:focus { outline: none; border-color: ${GOLD}; }
  textarea::placeholder { color: #555; }

  @keyframes gaugeGrow {
    from { stroke-dasharray: 0 999; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

/* ─── component ─── */
export default function App() {
  const [screen, setScreen] = useState('cover') // cover | quiz | quizResult | hub | shift
  const [fade, setFade] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState([])
  const [quizScore, setQuizScore] = useState(0)
  const [weakAreas, setWeakAreas] = useState([])
  const [completed, setCompleted] = useState([false, false, false, false, false])
  const [currentShift, setCurrentShift] = useState(0)
  const [journal, setJournal] = useState({})

  /* fade transition helper */
  const go = (next, extra) => {
    setFade(false)
    if (extra) extra()
    setTimeout(() => {
      setScreen(next)
      window.scrollTo({ top: 0 })
      // trigger fade‐in after a tick
      requestAnimationFrame(() => requestAnimationFrame(() => setFade(true)))
    }, 80)
  }

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setFade(true)))
  }, [])

  /* quiz helpers */
  const answerQuiz = (score) => {
    const next = [...quizAnswers, score]
    setQuizAnswers(next)
    if (quizIndex < QUIZ.length - 1) {
      setQuizIndex(quizIndex + 1)
    } else {
      // calculate
      const total = next.reduce((s, v) => s + v, 0)
      setQuizScore(total)
      // find weak areas
      const weak = []
      QUIZ_CATEGORIES.forEach((cat) => {
        const catScore = next[cat.range[0]] + next[cat.range[1]]
        if (catScore <= 3) weak.push(cat.shift)
      })
      setWeakAreas(weak)
      go('quizResult')
    }
  }

  const getLabel = (s) => {
    if (s >= 25) return { label: 'Mindset Warrior', color: '#7A8B6F' }
    if (s >= 17) return { label: 'Getting There', color: GOLD }
    return { label: 'Room to Grow', color: '#C4715B' }
  }

  const completeShift = (idx) => {
    const c = [...completed]
    c[idx] = true
    setCompleted(c)
    go('hub')
  }

  const doneCount = completed.filter(Boolean).length

  /* ─── render screens ─── */
  const wrapClass = `fade-enter${fade ? ' fade-active' : ''}`

  /* cover */
  const renderCover = () => (
    <div className={wrapClass} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 560, textAlign: 'center' }}>
        {/* decorative line */}
        <div style={{ width: 60, height: 1, background: GOLD, margin: '0 auto 28px' }} />
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '.85rem', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>RIVEN</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
          The Mental Game
        </h1>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontStyle: 'italic', color: TEXT_DIM, marginBottom: 32 }}>
          5 Mindset Shifts for Lasting Change
        </p>

        {/* value badge */}
        <div style={{ display: 'inline-block', border: `1px solid ${GOLD}`, borderRadius: 999, padding: '8px 28px', marginBottom: 40 }}>
          <span style={{ color: GOLD, fontFamily: "'Playfair Display', serif", fontSize: '.9rem', letterSpacing: 1 }}>$97 Value — Yours Free</span>
        </div>

        <p style={{ color: TEXT_DIM, fontSize: '.95rem', maxWidth: 440, margin: '0 auto 40px', lineHeight: 1.8 }}>
          A guided mindset worksheet designed for Black women who are done with diets and ready for real transformation.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <button onClick={() => go('quiz')} style={btnStyle(GOLD, BG)}>Start the Assessment</button>
          <button onClick={() => go('hub')} style={btnStyle('transparent', GOLD, true)}>Skip to the 5 Shifts</button>
        </div>

        <div style={{ width: 60, height: 1, background: GOLD, margin: '40px auto 0', opacity: 0.4 }} />
      </div>
    </div>
  )

  /* quiz */
  const renderQuiz = () => {
    const q = QUIZ[quizIndex]
    const pct = ((quizIndex) / QUIZ.length) * 100
    return (
      <div className={wrapClass} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px' }}>
        <div style={{ maxWidth: 560, width: '100%' }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '.8rem', letterSpacing: 3, textTransform: 'uppercase', color: GOLD, marginBottom: 24 }}>
            RIVEN — Mindset Assessment
          </p>

          {/* progress bar */}
          <div style={{ background: '#1E1E1E', borderRadius: 999, height: 6, marginBottom: 8, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: GOLD, borderRadius: 999, transition: 'width .4s ease' }} />
          </div>
          <p style={{ fontSize: '.8rem', color: TEXT_DIM, marginBottom: 40, textAlign: 'right' }}>
            {quizIndex + 1} of {QUIZ.length}
          </p>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', fontWeight: 600, lineHeight: 1.4, marginBottom: 32 }}>
            {q.q}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {q.a.map((opt, i) => (
              <button
                key={i}
                onClick={() => answerQuiz(opt.score)}
                style={{
                  background: CARD_BG,
                  border: `1px solid ${CARD_BORDER}`,
                  borderRadius: 10,
                  padding: '16px 20px',
                  color: TEXT,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: '.95rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'border-color .25s, background .25s',
                  lineHeight: 1.5,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = '#1A1A1A' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = CARD_BORDER; e.currentTarget.style.background = CARD_BG }}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* quiz result */
  const renderQuizResult = () => {
    const { label, color } = getLabel(quizScore)
    const pct = quizScore / 30
    const circumference = 2 * Math.PI * 54
    const dashLen = circumference * pct
    return (
      <div className={wrapClass} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px' }}>
        <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '.8rem', letterSpacing: 3, textTransform: 'uppercase', color: GOLD, marginBottom: 40 }}>
            Your Results
          </p>

          {/* circular gauge */}
          <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 24px' }}>
            <svg width="160" height="160" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r="54" fill="none" stroke="#1E1E1E" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke={color} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${dashLen} ${circumference}`}
                style={{ animation: 'gaugeGrow 1.2s ease forwards' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700 }}>{quizScore}</span>
              <span style={{ fontSize: '.75rem', color: TEXT_DIM }}>/30</span>
            </div>
          </div>

          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, color, marginBottom: 8, animation: 'fadeUp .6s ease .3s both' }}>{label}</p>
          <p style={{ color: TEXT_DIM, fontSize: '.9rem', marginBottom: 32, animation: 'fadeUp .6s ease .5s both', maxWidth: 400, margin: '0 auto 32px' }}>
            {quizScore >= 25
              ? 'Your mindset is strong! The shifts ahead will sharpen your edge even more.'
              : quizScore >= 17
              ? 'You have a solid foundation — these shifts will take you to the next level.'
              : 'This is your starting line, Queen. The 5 shifts below were made for exactly where you are.'}
          </p>

          {weakAreas.length > 0 && (
            <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '20px 24px', marginBottom: 36, textAlign: 'left', animation: 'fadeUp .6s ease .7s both' }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '.85rem', fontWeight: 600, color: GOLD, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>Focus Areas</p>
              {weakAreas.map((w, i) => (
                <p key={i} style={{ color: TEXT_DIM, fontSize: '.9rem', marginBottom: 4 }}>
                  <span style={{ color: '#C4715B', marginRight: 8 }}>&#9679;</span>{w}
                </p>
              ))}
            </div>
          )}

          <button onClick={() => go('hub')} style={btnStyle(GOLD, BG)}>
            Explore the 5 Mindset Shifts
          </button>
        </div>
      </div>
    )
  }

  /* hub */
  const renderHub = () => {
    const allDone = doneCount === 5
    return (
      <div className={wrapClass} style={{ minHeight: '100vh', padding: '60px 20px', maxWidth: 620, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '.8rem', letterSpacing: 3, textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>RIVEN</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, marginBottom: 8 }}>
          The 5 Mindset Shifts
        </h2>
        <p style={{ color: TEXT_DIM, fontSize: '.9rem', marginBottom: 28 }}>
          Work through each shift at your own pace. Your journal entries are saved as you type.
        </p>

        {/* progress */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '.8rem', color: TEXT_DIM }}>{doneCount} of 5 complete</span>
            <span style={{ fontSize: '.8rem', color: GOLD }}>{Math.round((doneCount / 5) * 100)}%</span>
          </div>
          <div style={{ background: '#1E1E1E', borderRadius: 999, height: 6, overflow: 'hidden' }}>
            <div style={{ width: `${(doneCount / 5) * 100}%`, height: '100%', background: GOLD, borderRadius: 999, transition: 'width .4s' }} />
          </div>
        </div>

        {allDone && (
          <div style={{ background: 'linear-gradient(135deg, #1A1608, #14120A)', border: `1px solid ${GOLD}`, borderRadius: 14, padding: '24px 28px', marginBottom: 32, textAlign: 'center', animation: 'fadeUp .6s ease both' }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: GOLD, marginBottom: 6 }}>
              Congratulations, Queen!
            </p>
            <p style={{ color: TEXT_DIM, fontSize: '.9rem' }}>
              You've completed all 5 mindset shifts. Revisit anytime to deepen your growth.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SHIFTS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setCurrentShift(i); go('shift') }}
              style={{
                background: CARD_BG,
                border: `1px solid ${CARD_BORDER}`,
                borderRadius: 12,
                padding: '20px 24px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'border-color .25s, transform .15s',
                width: '100%',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = SHIFT_COLORS[s.id]; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = CARD_BORDER; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {/* left color bar */}
              <div style={{ width: 4, height: 42, borderRadius: 4, background: SHIFT_COLORS[s.id], flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '.75rem', letterSpacing: 2, textTransform: 'uppercase', color: SHIFT_COLORS[s.id], marginBottom: 2 }}>
                  {s.subtitle}
                </p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 600, color: TEXT }}>
                  {s.title}
                </p>
              </div>
              {/* check */}
              {completed[i] && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: SHIFT_COLORS[s.id], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BG} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  /* shift detail */
  const renderShift = () => {
    const s = SHIFTS[currentShift]
    const col = SHIFT_COLORS[s.id]
    return (
      <div className={wrapClass} style={{ minHeight: '100vh', padding: '60px 20px', maxWidth: 620, margin: '0 auto' }}>
        {/* back */}
        <button onClick={() => go('hub')} style={{ background: 'none', border: 'none', color: TEXT_DIM, cursor: 'pointer', fontSize: '.85rem', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Back to all shifts
        </button>

        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '.75rem', letterSpacing: 3, textTransform: 'uppercase', color: col, marginBottom: 10 }}>{s.subtitle}</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, marginBottom: 12 }}>{s.title}</h2>
        <p style={{ color: TEXT_DIM, fontSize: '.95rem', marginBottom: 40, lineHeight: 1.8 }}>{s.description}</p>

        {/* old vs new */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 44 }}>
          <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '20px' }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '.75rem', letterSpacing: 2, textTransform: 'uppercase', color: '#C4715B', marginBottom: 10 }}>Old Story</p>
            <p style={{ color: TEXT_DIM, fontSize: '.9rem', fontStyle: 'italic', lineHeight: 1.6 }}>"{s.oldStory}"</p>
          </div>
          <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '20px' }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '.75rem', letterSpacing: 2, textTransform: 'uppercase', color: '#7A8B6F', marginBottom: 10 }}>New Story</p>
            <p style={{ color: TEXT, fontSize: '.9rem', fontStyle: 'italic', lineHeight: 1.6 }}>"{s.newStory}"</p>
          </div>
        </div>

        {/* journal prompts */}
        <div style={{ marginBottom: 44 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 600, marginBottom: 20, color: col }}>
            Guided Exercise
          </p>
          {s.prompts.map((p, i) => {
            const key = `${s.id}-${i}`
            return (
              <div key={key} style={{ marginBottom: 24 }}>
                <p style={{ fontSize: '.9rem', color: TEXT, marginBottom: 10, lineHeight: 1.6 }}>{p}</p>
                <textarea
                  placeholder="Write your thoughts here..."
                  value={journal[key] || ''}
                  onChange={(e) => setJournal({ ...journal, [key]: e.target.value })}
                />
              </div>
            )
          })}
        </div>

        {/* complete button */}
        <button
          onClick={() => completeShift(currentShift)}
          style={btnStyle(col, BG)}
        >
          {completed[currentShift] ? 'Completed ✓ — Back to Shifts' : currentShift < 4 ? 'Complete & Next Shift' : 'Complete — View All Shifts'}
        </button>
      </div>
    )
  }

  return (
    <>
      <style>{css}</style>
      {screen === 'cover' && renderCover()}
      {screen === 'quiz' && renderQuiz()}
      {screen === 'quizResult' && renderQuizResult()}
      {screen === 'hub' && renderHub()}
      {screen === 'shift' && renderShift()}
    </>
  )
}

/* ─── button helper ─── */
function btnStyle(bg, fg, outline) {
  return {
    background: bg,
    color: outline ? bg : fg,
    border: outline ? `1px solid ${GOLD}` : 'none',
    fontFamily: "'Playfair Display', serif",
    fontSize: '.9rem',
    fontWeight: 600,
    letterSpacing: 1,
    padding: '14px 36px',
    borderRadius: 999,
    cursor: 'pointer',
    transition: 'opacity .25s, transform .15s',
    width: 'fit-content',
    minWidth: 220,
  }
}
