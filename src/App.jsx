import { useState, useEffect } from 'react'

/* ─── colour palette ─── */
const GOLD = '#C8A456'
const BG = '#0A0A0A'
const CARD_BG = '#141414'
const CARD_BORDER = '#1E1E1E'
const TEXT = '#E8E0D4'
const TEXT_DIM = '#9A9080'

const SHIFT_COLORS = {
  1: '#C8A456',
  2: '#B87333',
  3: '#7A8B6F',
  4: '#C4622D',
  5: '#A8883E',
}

/* ─── quiz data ─── */
const QUIZ = [
  {
    q: 'When you make a mistake on your nutrition plan, you usually...',
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
    q: 'When progress feels slow, you tend to...',
    a: [
      { text: 'Try a completely different plan', score: 1 },
      { text: 'Get discouraged but stick it out', score: 2 },
      { text: 'Trust the process and stay consistent', score: 3 },
    ],
  },
  {
    q: 'Your relationship with the scale is...',
    a: [
      { text: 'It controls my mood for the whole day', score: 1 },
      { text: 'I check it but try not to obsess', score: 2 },
      { text: "It's one data point among many", score: 3 },
    ],
  },
  {
    q: 'When it comes to meal prep, you...',
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
      { text: 'Enjoy myself and get back on track next meal', score: 3 },
    ],
  },
  {
    q: 'When you think about your health journey, you feel...',
    a: [
      { text: "Like I'm always starting over", score: 1 },
      { text: 'Hopeful but unsure', score: 2 },
      { text: 'Confident in my ability to figure it out', score: 3 },
    ],
  },
  {
    q: 'Your inner voice when it comes to food is usually...',
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
    q: 'When life gets stressful, your eating habits...',
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

/* ─── shift content — every shift has: scenario FIRST, flip cards SECOND ─── */
const SHIFTS = [
  {
    id: 1,
    title: 'Progress Over Perfection',
    subtitle: 'Shift #1',
    description: "The all-or-nothing mindset is the #1 killer of lasting change. You don't need a perfect week — you need a consistent pattern of good-enough choices.",
    exercises: [
      {
        type: 'scenario',
        title: 'What Would You Do?',
        scenario: "You ate a whole pizza on Tuesday night. Wednesday morning you feel terrible. What do you do?",
        options: [
          { text: "Start over next Monday — this week is already ruined", aligned: false },
          { text: "Skip breakfast to make up for it", aligned: false },
          { text: "Make your next meal a good one and keep moving", aligned: true },
          { text: "Google a 3-day detox cleanse", aligned: false },
        ],
        explanation: "One off-plan meal doesn't erase your progress. The RIVEN mindset says: make your very next choice a nourishing one. No punishment, no drama, no starting over Monday.",
      },
      {
        type: 'flip',
        title: 'Flip Your Story',
        cards: [
          { old: "I messed up so the week is ruined.", new_story: "One meal doesn't define my week." },
          { old: "I need the perfect plan before I start.", new_story: "A good-enough plan I follow beats a perfect plan I don't." },
          { old: "If I can't do it 100%, why bother?", new_story: "80% consistency beats 0% perfection." },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Identity Before Habits',
    subtitle: 'Shift #2',
    description: "You don't stick with habits because of willpower. You stick with them because they match who you believe you are. Change the identity first, and the habits follow.",
    exercises: [
      {
        type: 'scenario',
        title: 'What Would You Do?',
        scenario: "Your coworker brings donuts to the office and puts them right next to your desk. What do you do?",
        options: [
          { text: "Eat two — you can't resist, you've always been like this", aligned: false },
          { text: "Eat one and feel guilty the rest of the day", aligned: false },
          { text: "Say 'no thanks, I'm good' — because that's just who you are now", aligned: true },
          { text: "Take one and hide it in your drawer for later", aligned: false },
        ],
        explanation: "When your identity shifts, decisions become automatic. You're not resisting the donut — you're just being who you are. That's the power of identity-first change.",
      },
      {
        type: 'flip',
        title: 'Flip Your Story',
        cards: [
          { old: "I'll start when I feel motivated.", new_story: "I don't wait for motivation. I just do what I do." },
          { old: "I've always been the girl who can't say no to food.", new_story: "I'm becoming someone who makes choices on purpose." },
          { old: "This is just how I am.", new_story: "I'm not stuck. I'm building a new identity." },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'The 90% Rule',
    subtitle: 'Shift #3',
    description: "You don't need to eat perfectly 100% of the time. Nail it 90% of the time and the other 10% won't matter. Sustainability beats perfection every single time.",
    exercises: [
      {
        type: 'scenario',
        title: 'What Would You Do?',
        scenario: "You're invited to a birthday dinner on Saturday. The restaurant has nothing 'healthy' on the menu. What do you do?",
        options: [
          { text: "Skip the dinner to protect your streak", aligned: false },
          { text: "Go but don't eat anything", aligned: false },
          { text: "Go, enjoy yourself, choose a meal you love, and get back on plan tomorrow", aligned: true },
          { text: "Go but complain about the menu the whole time", aligned: false },
        ],
        explanation: "The 90% Rule means you can fully enjoy that 10% without guilt. Going out with your girls IS part of a healthy life. The key is it's intentional, not reactive.",
      },
      {
        type: 'flip',
        title: 'Flip Your Story',
        cards: [
          { old: "One bad meal ruins everything.", new_story: "One meal out of 21 this week is less than 5%." },
          { old: "I need to be strict 7 days a week.", new_story: "I need to be solid 6 days. The 7th has grace built in." },
          { old: "If I'm not 100%, I'm failing.", new_story: "90% consistency is what actually gets results." },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Boredom Is the Real Enemy',
    subtitle: 'Shift #4',
    description: "Most people don't fail because the plan is too hard. They fail because it gets boring. The secret to lasting change? Learn to find satisfaction in consistency.",
    exercises: [
      {
        type: 'scenario',
        title: 'What Would You Do?',
        scenario: "You've been eating the same 4 meals for 2 weeks. You're bored and thinking about quitting. What do you do?",
        options: [
          { text: "Scrap everything and try a whole new diet", aligned: false },
          { text: "Order takeout — you deserve a break from all this", aligned: false },
          { text: "Keep your framework but try a new recipe or seasoning this week", aligned: true },
          { text: "Push through the boredom by eating even more strictly", aligned: false },
        ],
        explanation: "Boring means it's working. The RIVEN mindset says: add variety within your framework, don't blow up what's working because your brain wants novelty. Small tweaks, not total overhauls.",
      },
      {
        type: 'flip',
        title: 'Flip Your Story',
        cards: [
          { old: "I need a new diet every month.", new_story: "I keep the framework and change the flavors." },
          { old: "Healthy food is boring.", new_story: "I just haven't found my rotation yet." },
          { old: "I quit because it stopped being exciting.", new_story: "I don't need excitement. I need anchor meals I can count on." },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "You're Not Starting Over",
    subtitle: 'Shift #5',
    description: "Every time you come back to your health journey, you bring everything you've learned. You're not at square one — you're at square two, five, or twenty. You carry your lessons forward.",
    exercises: [
      {
        type: 'scenario',
        title: 'What Would You Do?',
        scenario: "You fell off your plan for 3 weeks straight. You feel like you're back at square one. What do you do?",
        options: [
          { text: "Give up — clearly this doesn't work for you", aligned: false },
          { text: "Start a completely different program from scratch", aligned: false },
          { text: "Pick up exactly where you left off — you already know what works", aligned: true },
          { text: "Wait until New Year's to try again", aligned: false },
        ],
        explanation: "You're not starting over. You're starting from experience. Every single attempt taught you something — what works, what doesn't, and who you are. That knowledge is yours forever.",
      },
      {
        type: 'flip',
        title: 'Flip Your Story',
        cards: [
          { old: "I've tried everything and nothing works.", new_story: "I now know exactly what doesn't work. I'm closer than ever." },
          { old: "I'm starting over... again.", new_story: "I'm not starting over. I'm starting from experience." },
          { old: "I always end up back here.", new_story: "Every comeback taught me something the last one didn't." },
        ],
      },
    ],
  },
]

/* ─── global CSS ─── */
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; }
  body {
    background: ${BG};
    color: ${TEXT};
    font-family: Georgia, 'Times New Roman', serif;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  .fade-enter { opacity: 0; transform: translateY(12px); }
  .fade-active { opacity: 1; transform: translateY(0); transition: opacity .45s ease, transform .45s ease; }

  @keyframes gaugeGrow { from { stroke-dasharray: 0 999; } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes popIn { 0% { transform: scale(0.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(200,164,86,0); }
    50% { box-shadow: 0 0 20px 4px rgba(200,164,86,0.25); }
  }
  @keyframes checkPop {
    0% { transform: scale(0); }
    60% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }

  /* ── flip card ── */
  .flip-card { perspective: 800px; cursor: pointer; }
  .flip-card-inner {
    position: relative;
    width: 100%;
    min-height: 160px;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  .flip-card.flipped .flip-card-inner { transform: rotateY(180deg); }
  .flip-card-front, .flip-card-back {
    position: absolute; inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 14px;
    padding: 24px 20px;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    text-align: center;
  }
  .flip-card-front {
    background: ${CARD_BG};
    border: 1px solid #2A2A2A;
  }
  .flip-card-back {
    background: linear-gradient(135deg, #1A1608, #14120A);
    border: 1px solid ${GOLD};
    transform: rotateY(180deg);
  }

  /* ── quiz answer pop ── */
  @keyframes answerPop {
    0% { transform: scale(1); }
    30% { transform: scale(0.95); }
    60% { transform: scale(1.03); }
    100% { transform: scale(1); }
  }
  .quiz-picked { animation: answerPop 0.35s ease; }
`

const PF = "'Playfair Display', serif"

/* ─── main component ─── */
export default function App() {
  const [screen, setScreen] = useState('cover')
  const [fade, setFade] = useState(false)

  /* quiz state */
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState([])
  const [quizScore, setQuizScore] = useState(0)
  const [weakAreas, setWeakAreas] = useState([])
  const [quizPicked, setQuizPicked] = useState(null)

  /* shift / hub state */
  const [completed, setCompleted] = useState([false, false, false, false, false])
  const [currentShift, setCurrentShift] = useState(0)

  /* exercise state */
  const [scenarioPick, setScenarioPick] = useState(null)
  const [scenarioRevealed, setScenarioRevealed] = useState(false)
  const [flippedCards, setFlippedCards] = useState({})
  const [flipCommitted, setFlipCommitted] = useState(false)
  const [exerciseStep, setExerciseStep] = useState(0)

  /* fade transition helper */
  const go = (next, extra) => {
    setFade(false)
    if (extra) extra()
    setTimeout(() => {
      setScreen(next)
      window.scrollTo({ top: 0 })
      requestAnimationFrame(() => requestAnimationFrame(() => setFade(true)))
    }, 80)
  }

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setFade(true)))
  }, [])

  /* reset exercise state when entering a shift */
  const openShift = (idx) => {
    setCurrentShift(idx)
    setExerciseStep(0)
    resetExerciseState()
    go('shift')
  }

  const resetExerciseState = () => {
    setScenarioPick(null)
    setScenarioRevealed(false)
    setFlippedCards({})
    setFlipCommitted(false)
  }

  const advanceExercise = () => {
    const s = SHIFTS[currentShift]
    if (exerciseStep < s.exercises.length - 1) {
      setExerciseStep(exerciseStep + 1)
      resetExerciseState()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      /* complete shift */
      const c = [...completed]
      c[currentShift] = true
      setCompleted(c)
      go('hub')
    }
  }

  /* quiz helpers */
  const answerQuiz = (score, idx) => {
    if (quizPicked !== null) return
    setQuizPicked(idx)
    const next = [...quizAnswers, score]
    setQuizAnswers(next)
    setTimeout(() => {
      setQuizPicked(null)
      if (quizIndex < QUIZ.length - 1) {
        setQuizIndex(quizIndex + 1)
      } else {
        const total = next.reduce((s, v) => s + v, 0)
        setQuizScore(total)
        const weak = []
        QUIZ_CATEGORIES.forEach((cat) => {
          const catScore = next[cat.range[0]] + next[cat.range[1]]
          if (catScore <= 3) weak.push(cat.shift)
        })
        setWeakAreas(weak)
        go('quizResult')
      }
    }, 500)
  }

  const getLabel = (s) => {
    if (s >= 25) return { label: 'Mindset Warrior', color: '#7A8B6F' }
    if (s >= 17) return { label: 'Getting There', color: GOLD }
    return { label: 'Room to Grow', color: '#C4622D' }
  }

  const doneCount = completed.filter(Boolean).length
  const wrapClass = `fade-enter${fade ? ' fade-active' : ''}`

  /* ══════════════════════════════════════════
     COVER SCREEN
     ══════════════════════════════════════════ */
  const renderCover = () => (
    <div className={wrapClass} style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 560, textAlign: 'center' }}>
        <div style={{ width: 60, height: 1, background: GOLD, margin: '0 auto 28px' }} />
        <p style={{ fontFamily: PF, fontSize: '.85rem', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>RIVEN</p>
        <h1 style={{ fontFamily: PF, fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
          The Mental Game
        </h1>
        <p style={{ fontFamily: PF, fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontStyle: 'italic', color: TEXT_DIM, marginBottom: 32 }}>
          5 Mindset Shifts for Lasting Change
        </p>
        <div style={{ display: 'inline-block', border: `1px solid ${GOLD}`, borderRadius: 999, padding: '8px 28px', marginBottom: 40 }}>
          <span style={{ color: GOLD, fontFamily: PF, fontSize: '.9rem', letterSpacing: 1 }}>$97 Value — Yours Free</span>
        </div>
        <p style={{ color: TEXT_DIM, fontSize: '.95rem', maxWidth: 440, margin: '0 auto 40px', lineHeight: 1.8 }}>
          A guided mindset experience designed for Black women who are done with diets and ready for real transformation.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <button onClick={() => go('quiz')} style={btnStyle(GOLD, BG)}>Start the Assessment</button>
          <button
            onClick={() => go('hub')}
            style={{
              background: 'none',
              border: 'none',
              color: GOLD,
              fontFamily: PF,
              fontSize: '.85rem',
              cursor: 'pointer',
              padding: '10px 20px',
              letterSpacing: 1,
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              minHeight: 44,
            }}
          >
            Skip to the 5 Shifts
          </button>
        </div>
        <div style={{ width: 60, height: 1, background: GOLD, margin: '40px auto 0', opacity: 0.4 }} />
      </div>
    </div>
  )

  /* ══════════════════════════════════════════
     QUIZ SCREEN
     ══════════════════════════════════════════ */
  const renderQuiz = () => {
    const q = QUIZ[quizIndex]
    const pct = (quizIndex / QUIZ.length) * 100
    return (
      <div className={wrapClass} style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 20px' }}>
        <div style={{ maxWidth: 560, width: '100%' }}>
          <p style={{ fontFamily: PF, fontSize: '.8rem', letterSpacing: 3, textTransform: 'uppercase', color: GOLD, marginBottom: 24 }}>
            RIVEN — Mindset Assessment
          </p>
          {/* progress bar */}
          <div style={{ background: '#1E1E1E', borderRadius: 999, height: 8, marginBottom: 8, overflow: 'hidden' }}>
            <div style={{
              width: `${pct}%`, height: '100%', borderRadius: 999,
              background: `linear-gradient(90deg, ${GOLD}, #D4B96A)`,
              transition: 'width .5s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 0 12px ${GOLD}55`,
            }} />
          </div>
          <p style={{ fontSize: '.8rem', color: TEXT_DIM, marginBottom: 40, textAlign: 'right' }}>
            {quizIndex + 1} of {QUIZ.length}
          </p>

          <h2 style={{ fontFamily: PF, fontSize: 'clamp(1.15rem, 3.5vw, 1.35rem)', fontWeight: 600, lineHeight: 1.4, marginBottom: 32 }}>
            {q.q}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {q.a.map((opt, i) => {
              const picked = quizPicked === i
              return (
                <button
                  key={`${quizIndex}-${i}`}
                  onClick={() => answerQuiz(opt.score, i)}
                  className={picked ? 'quiz-picked' : ''}
                  style={{
                    background: picked ? '#1C1A14' : CARD_BG,
                    border: `2px solid ${picked ? GOLD : CARD_BORDER}`,
                    borderRadius: 14,
                    padding: '18px 22px',
                    color: TEXT,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: '1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'border-color .25s, background .25s, transform .15s',
                    lineHeight: 1.5,
                    minHeight: 56,
                    boxShadow: picked ? `0 0 16px ${GOLD}33` : 'none',
                  }}
                  onMouseEnter={(e) => { if (quizPicked === null) { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.transform = 'scale(1.02)' } }}
                  onMouseLeave={(e) => { if (!picked) { e.currentTarget.style.borderColor = CARD_BORDER; e.currentTarget.style.transform = 'scale(1)' } }}
                >
                  {opt.text}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  /* ══════════════════════════════════════════
     QUIZ RESULT SCREEN
     ══════════════════════════════════════════ */
  const renderQuizResult = () => {
    const { label, color } = getLabel(quizScore)
    const pct = quizScore / 30
    const circumference = 2 * Math.PI * 54
    const dashLen = circumference * pct
    return (
      <div className={wrapClass} style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px' }}>
        <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
          <p style={{ fontFamily: PF, fontSize: '.8rem', letterSpacing: 3, textTransform: 'uppercase', color: GOLD, marginBottom: 40 }}>Your Results</p>
          <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 24px' }}>
            <svg width="160" height="160" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r="54" fill="none" stroke="#1E1E1E" strokeWidth="8" />
              <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${dashLen} ${circumference}`}
                style={{ animation: 'gaugeGrow 1.2s ease forwards' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: PF, fontSize: '2rem', fontWeight: 700 }}>{quizScore}</span>
              <span style={{ fontSize: '.75rem', color: TEXT_DIM }}>/30</span>
            </div>
          </div>
          <p style={{ fontFamily: PF, fontSize: '1.5rem', fontWeight: 600, color, marginBottom: 8, animation: 'fadeUp .6s ease .3s both' }}>{label}</p>
          <p style={{ color: TEXT_DIM, fontSize: '.9rem', maxWidth: 400, margin: '0 auto 32px', animation: 'fadeUp .6s ease .5s both' }}>
            {quizScore >= 25
              ? 'Your mindset is strong! The shifts ahead will sharpen your edge even more.'
              : quizScore >= 17
              ? 'You have a solid foundation — these shifts will take you to the next level.'
              : 'This is your starting line, Queen. The 5 shifts below were made for exactly where you are.'}
          </p>
          {weakAreas.length > 0 && (
            <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '20px 24px', marginBottom: 36, textAlign: 'left', animation: 'fadeUp .6s ease .7s both' }}>
              <p style={{ fontFamily: PF, fontSize: '.85rem', fontWeight: 600, color: GOLD, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>Focus Areas</p>
              {weakAreas.map((w, i) => (
                <p key={i} style={{ color: TEXT_DIM, fontSize: '.9rem', marginBottom: 4 }}>
                  <span style={{ color: '#C4622D', marginRight: 8 }}>{'\u25CF'}</span>{w}
                </p>
              ))}
            </div>
          )}
          <button onClick={() => go('hub')} style={btnStyle(GOLD, BG)}>Explore the 5 Mindset Shifts</button>
        </div>
      </div>
    )
  }

  /* ══════════════════════════════════════════
     HUB SCREEN
     ══════════════════════════════════════════ */
  const renderHub = () => {
    const allDone = doneCount === 5
    return (
      <div className={wrapClass} style={{ minHeight: '100dvh', padding: '48px 20px', maxWidth: 620, margin: '0 auto' }}>
        <p style={{ fontFamily: PF, fontSize: '.8rem', letterSpacing: 3, textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>RIVEN</p>
        <h2 style={{ fontFamily: PF, fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, marginBottom: 8 }}>The 5 Mindset Shifts</h2>
        <p style={{ color: TEXT_DIM, fontSize: '.9rem', marginBottom: 28 }}>Tap each shift to explore interactive exercises. No typing — just tap, flip, and reflect.</p>

        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '.8rem', color: TEXT_DIM }}>{doneCount} of 5 complete</span>
            <span style={{ fontSize: '.8rem', color: GOLD }}>{Math.round((doneCount / 5) * 100)}%</span>
          </div>
          <div style={{ background: '#1E1E1E', borderRadius: 999, height: 8, overflow: 'hidden' }}>
            <div style={{
              width: `${(doneCount / 5) * 100}%`, height: '100%', borderRadius: 999,
              background: `linear-gradient(90deg, ${GOLD}, #D4B96A)`,
              transition: 'width .5s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
          </div>
        </div>

        {allDone && (
          <div style={{ background: 'linear-gradient(135deg, #1A1608, #14120A)', border: `1px solid ${GOLD}`, borderRadius: 14, padding: '24px 28px', marginBottom: 32, textAlign: 'center', animation: 'fadeUp .6s ease both' }}>
            <p style={{ fontFamily: PF, fontSize: '1.2rem', fontWeight: 700, color: GOLD, marginBottom: 6 }}>Congratulations, Queen!</p>
            <p style={{ color: TEXT_DIM, fontSize: '.9rem' }}>You've completed all 5 mindset shifts. Revisit anytime to deepen your growth.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SHIFTS.map((s, i) => (
            <button key={s.id} onClick={() => openShift(i)}
              style={{
                background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 14,
                padding: '22px 24px', textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'border-color .25s, transform .15s', width: '100%', minHeight: 80,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = SHIFT_COLORS[s.id]; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = CARD_BORDER; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ width: 4, height: 42, borderRadius: 4, background: SHIFT_COLORS[s.id], flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: PF, fontSize: '.75rem', letterSpacing: 2, textTransform: 'uppercase', color: SHIFT_COLORS[s.id], marginBottom: 2 }}>{s.subtitle}</p>
                <p style={{ fontFamily: PF, fontSize: '1.05rem', fontWeight: 600, color: TEXT }}>{s.title}</p>
              </div>
              {completed[i] && (
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: SHIFT_COLORS[s.id], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: 'checkPop .4s ease' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BG} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  /* ══════════════════════════════════════════
     EXERCISE: SCENARIO PICKER
     ══════════════════════════════════════════ */
  const renderScenario = (ex, col) => {
    return (
      <div style={{ animation: 'fadeUp .5s ease both' }}>
        <p style={{ fontFamily: PF, fontSize: '1.1rem', fontWeight: 600, color: col, marginBottom: 20 }}>{ex.title}</p>
        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 14, padding: '22px 24px', marginBottom: 24 }}>
          <p style={{ fontSize: '.95rem', lineHeight: 1.7, color: TEXT }}>{ex.scenario}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {ex.options.map((opt, i) => {
            const picked = scenarioPick === i
            const revealed = scenarioRevealed
            const isAligned = opt.aligned
            let borderCol = CARD_BORDER
            let bg = CARD_BG
            let shadow = 'none'
            if (picked && !revealed) {
              borderCol = col
              bg = '#1C1A14'
              shadow = `0 0 16px ${col}33`
            }
            if (revealed && isAligned) {
              borderCol = '#7A8B6F'
              bg = '#121A12'
              shadow = '0 0 16px rgba(122,139,111,0.25)'
            }
            if (revealed && picked && !isAligned) {
              borderCol = '#C4622D'
              bg = '#1A1210'
            }
            return (
              <button key={i}
                onClick={() => { if (!scenarioRevealed) setScenarioPick(i) }}
                style={{
                  background: bg, border: `2px solid ${borderCol}`, borderRadius: 14,
                  padding: '18px 22px', color: TEXT, fontFamily: "Georgia, serif",
                  fontSize: '.95rem', textAlign: 'left', cursor: scenarioRevealed ? 'default' : 'pointer',
                  transition: 'all .3s ease', minHeight: 56, lineHeight: 1.5,
                  boxShadow: shadow,
                  transform: picked && !revealed ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {opt.text}
                {revealed && isAligned && (
                  <span style={{
                    display: 'inline-block',
                    marginLeft: 10,
                    color: '#7A8B6F',
                    fontFamily: PF,
                    fontSize: '.75rem',
                    fontWeight: 600,
                    letterSpacing: 1,
                    verticalAlign: 'middle',
                  }}>
                    — RIVEN ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {scenarioPick !== null && !scenarioRevealed && (
          <div style={{ textAlign: 'center', animation: 'fadeUp .3s ease both' }}>
            <button onClick={() => setScenarioRevealed(true)} style={btnStyle(col, BG)}>
              Reveal the RIVEN Mindset
            </button>
          </div>
        )}

        {scenarioRevealed && (
          <div style={{ background: 'linear-gradient(135deg, #1A1608, #14120A)', border: `1px solid ${GOLD}44`, borderRadius: 14, padding: '22px 24px', marginBottom: 24, animation: 'fadeUp .4s ease both' }}>
            <p style={{ fontFamily: PF, fontSize: '.8rem', letterSpacing: 2, textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>The RIVEN Mindset</p>
            <p style={{ color: TEXT_DIM, fontSize: '.9rem', lineHeight: 1.7 }}>{ex.explanation}</p>
          </div>
        )}

        {scenarioRevealed && (
          <div style={{ textAlign: 'center', marginTop: 16, animation: 'fadeUp .4s ease .2s both' }}>
            <button onClick={advanceExercise} style={btnStyle(col, BG)}>Continue</button>
          </div>
        )}
      </div>
    )
  }

  /* ══════════════════════════════════════════
     EXERCISE: FLIP CARDS
     ══════════════════════════════════════════ */
  const renderFlipCards = (ex, col) => {
    const allFlipped = ex.cards.every((_, i) => flippedCards[i])
    return (
      <div style={{ animation: 'fadeUp .5s ease both' }}>
        <p style={{ fontFamily: PF, fontSize: '1.1rem', fontWeight: 600, color: col, marginBottom: 8 }}>{ex.title}</p>
        <p style={{ color: TEXT_DIM, fontSize: '.85rem', marginBottom: 24 }}>Tap each card to flip it and reveal your new story.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
          {ex.cards.map((card, i) => {
            const isFlipped = flippedCards[i]
            return (
              <div key={i} className={`flip-card${isFlipped ? ' flipped' : ''}`}
                onClick={() => setFlippedCards({ ...flippedCards, [i]: !flippedCards[i] })}
                style={{ width: '100%', minHeight: 160 }}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front" style={{ borderColor: '#2A2A2A' }}>
                    <p style={{ fontFamily: PF, fontSize: '.7rem', letterSpacing: 2, textTransform: 'uppercase', color: '#C4622D', marginBottom: 10 }}>Old Story</p>
                    <p style={{ color: TEXT_DIM, fontSize: '.95rem', fontStyle: 'italic', lineHeight: 1.6 }}>&ldquo;{card.old}&rdquo;</p>
                    <p style={{ fontSize: '.7rem', color: '#444', marginTop: 12 }}>TAP TO FLIP</p>
                  </div>
                  <div className="flip-card-back" style={{ borderColor: col }}>
                    <p style={{ fontFamily: PF, fontSize: '.7rem', letterSpacing: 2, textTransform: 'uppercase', color: '#7A8B6F', marginBottom: 10 }}>New Story</p>
                    <p style={{ color: TEXT, fontSize: '.95rem', fontStyle: 'italic', lineHeight: 1.6 }}>&ldquo;{card.new_story}&rdquo;</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {allFlipped && !flipCommitted && (
          <div style={{ textAlign: 'center', animation: 'fadeUp .4s ease both' }}>
            <button onClick={() => setFlipCommitted(true)}
              style={{
                ...btnStyle(col, BG),
                animation: 'pulseGlow 2s ease infinite',
              }}
            >
              I'm Choosing the New Story
            </button>
          </div>
        )}

        {flipCommitted && (
          <div style={{ textAlign: 'center', animation: 'popIn .4s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg, #1A1608, #14120A)', border: `1px solid ${GOLD}`, borderRadius: 14, padding: '18px 32px', marginBottom: 20 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              <span style={{ fontFamily: PF, fontSize: '1rem', fontWeight: 600, color: GOLD }}>Committed</span>
            </div>
            <div>
              <button onClick={advanceExercise} style={btnStyle(col, BG)}>
                {exerciseStep === SHIFTS[currentShift].exercises.length - 1 ? 'Complete & Next' : 'Continue'}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  /* ══════════════════════════════════════════
     SHIFT DETAIL SCREEN
     ══════════════════════════════════════════ */
  const renderShift = () => {
    const s = SHIFTS[currentShift]
    const col = SHIFT_COLORS[s.id]
    const ex = s.exercises[exerciseStep]

    return (
      <div className={wrapClass} style={{ minHeight: '100dvh', padding: '48px 20px 80px', maxWidth: 620, margin: '0 auto' }}>
        {/* back */}
        <button onClick={() => go('hub')} style={{ background: 'none', border: 'none', color: TEXT_DIM, cursor: 'pointer', fontSize: '.85rem', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', minHeight: 44 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Back to all shifts
        </button>

        <p style={{ fontFamily: PF, fontSize: '.75rem', letterSpacing: 3, textTransform: 'uppercase', color: col, marginBottom: 10 }}>{s.subtitle}</p>
        <h2 style={{ fontFamily: PF, fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 700, marginBottom: 12 }}>{s.title}</h2>
        <p style={{ color: TEXT_DIM, fontSize: '.95rem', marginBottom: 20, lineHeight: 1.8 }}>{s.description}</p>

        {/* exercise step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {s.exercises.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 999,
              background: i <= exerciseStep ? col : '#1E1E1E',
              transition: 'background .4s ease',
            }} />
          ))}
        </div>

        {/* render current exercise */}
        {ex.type === 'scenario' && renderScenario(ex, col)}
        {ex.type === 'flip' && renderFlipCards(ex, col)}
      </div>
    )
  }

  /* ── RENDER ── */
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
    padding: '16px 36px',
    borderRadius: 999,
    cursor: 'pointer',
    transition: 'opacity .25s, transform .15s',
    width: 'fit-content',
    minWidth: 220,
    minHeight: 52,
  }
}
