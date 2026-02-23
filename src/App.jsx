import { useState, useEffect, useRef } from 'react'

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
    q: 'When you make a mistake on your nutrition plan, you usually\u2026',
    a: [
      { text: 'Beat yourself up and want to quit', score: 1 },
      { text: 'Feel frustrated but try to move on', score: 2 },
      { text: 'See it as data and adjust without drama', score: 3 },
    ],
  },
  {
    q: 'How do you feel about the word \u201Cdiet\u201D?',
    a: [
      { text: 'It feels restrictive and triggering', score: 1 },
      { text: 'Neutral \u2014 it depends on the context', score: 2 },
      { text: 'I see nutrition as a lifestyle, not a diet', score: 3 },
    ],
  },
  {
    q: 'When progress feels slow, you tend to\u2026',
    a: [
      { text: 'Try a completely different plan', score: 1 },
      { text: 'Get discouraged but stick it out', score: 2 },
      { text: 'Trust the process and stay consistent', score: 3 },
    ],
  },
  {
    q: 'Your relationship with the scale is\u2026',
    a: [
      { text: 'It controls my mood for the whole day', score: 1 },
      { text: 'I check it but try not to obsess', score: 2 },
      { text: 'It\u2019s one data point among many', score: 3 },
    ],
  },
  {
    q: 'When it comes to meal prep, you\u2026',
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
      { text: 'Try to be \u201Cgood\u201D but usually overdo it', score: 2 },
      { text: 'Enjoy myself and get back on track next meal', score: 3 },
    ],
  },
  {
    q: 'When you think about your health journey, you feel\u2026',
    a: [
      { text: 'Like I\u2019m always starting over', score: 1 },
      { text: 'Hopeful but unsure', score: 2 },
      { text: 'Confident in my ability to figure it out', score: 3 },
    ],
  },
  {
    q: 'Your inner voice when it comes to food is usually\u2026',
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
    q: 'When life gets stressful, your eating habits\u2026',
    a: [
      { text: 'Go completely off the rails', score: 1 },
      { text: 'Slip a bit but I manage', score: 2 },
      { text: 'Stay mostly steady \u2014 I have coping tools', score: 3 },
    ],
  },
]

const QUIZ_CATEGORIES = [
  { range: [0, 1], shift: 'Progress Over Perfection' },
  { range: [2, 3], shift: 'Identity Before Habits' },
  { range: [4, 5], shift: 'The 90% Rule' },
  { range: [6, 7], shift: 'Boredom Is the Real Enemy' },
  { range: [8, 9], shift: "You\u2019re Not Starting Over" },
]

/* ─── shift content with interactive exercises ─── */
const SHIFTS = [
  {
    id: 1,
    title: 'Progress Over Perfection',
    subtitle: 'Shift #1',
    description: 'The all-or-nothing mindset is the #1 killer of lasting change. You don\u2019t need a perfect week \u2014 you need a consistent pattern of good-enough choices.',
    exercises: [
      {
        type: 'scenario',
        title: 'What Would You Do?',
        scenario: 'You ate off-plan at lunch \u2014 pizza and fries with coworkers. It\u2019s now 4pm. What do you do next?',
        options: [
          { text: 'Skip dinner to make up for it', aligned: false },
          { text: 'Say \u201Cforget it\u201D and order takeout tonight too', aligned: false },
          { text: 'Have a nourishing dinner like you planned', aligned: true },
          { text: 'Start a juice cleanse tomorrow', aligned: false },
        ],
        explanation: 'One off-plan meal doesn\u2019t erase your progress. The RIVEN mindset says: make your very next choice a nourishing one. No punishment, no drama, no starting over Monday.',
      },
      {
        type: 'flip',
        title: 'Flip Your Story',
        cards: [
          { old: 'I messed up today so the whole week is ruined.', new_story: 'I had a rough meal. The next one is an opportunity.' },
          { old: 'If I can\u2019t do it perfectly, why bother?', new_story: 'Done is better than perfect. 80% consistency wins.' },
          { old: 'I\u2019ll start fresh on Monday.', new_story: 'I\u2019m starting fresh right now, with my next choice.' },
          { old: 'Everyone else has it figured out except me.', new_story: 'Everyone is figuring it out. I\u2019m not behind \u2014 I\u2019m on my own path.' },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Identity Before Habits',
    subtitle: 'Shift #2',
    description: 'You don\u2019t stick with habits because of willpower. You stick with them because they match who you believe you are. Change the identity first, and the habits follow.',
    exercises: [
      {
        type: 'flip',
        title: 'Flip Your Story',
        cards: [
          { old: 'I\u2019m just not a healthy person.', new_story: 'I am someone who nourishes her body, one choice at a time.' },
          { old: 'Healthy eating isn\u2019t for people like me.', new_story: 'I deserve to feel strong and energized. This is for me.' },
          { old: 'I always fall off eventually.', new_story: 'Every choice is a vote for the woman I\u2019m becoming.' },
          { old: 'I don\u2019t have the discipline.', new_story: 'I don\u2019t need discipline \u2014 I need identity alignment.' },
        ],
      },
      {
        type: 'slider',
        title: 'Where Are You Now?',
        sliders: [
          { left: 'I eat based on emotions', right: 'I eat based on intention' },
          { left: 'My habits don\u2019t match my goals', right: 'My habits reflect who I\u2019m becoming' },
          { left: 'I talk to myself harshly', right: 'I speak to myself like someone I love' },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'The 90% Rule',
    subtitle: 'Shift #3',
    description: 'You don\u2019t need to eat perfectly 100% of the time. Nail it 90% of the time and the other 10% won\u2019t matter. Sustainability beats perfection every single time.',
    exercises: [
      {
        type: 'scenario',
        title: 'What Would You Do?',
        scenario: 'It\u2019s Friday night. Your girls want to go out for dinner and drinks. You\u2019ve been eating well all week. What\u2019s your move?',
        options: [
          { text: 'Skip the dinner \u2014 can\u2019t risk it', aligned: false },
          { text: 'Go but only eat a sad salad and water', aligned: false },
          { text: 'Go, enjoy yourself, choose a meal you love, and get back on plan tomorrow', aligned: true },
          { text: 'Go and go all out \u2014 you\u201Dearned\u201D it', aligned: false },
        ],
        explanation: 'The 90% Rule means you can fully enjoy that 10% without guilt. Going out with your girls IS part of a healthy life. The key is it\u2019s intentional, not reactive.',
      },
      {
        type: 'slider',
        title: 'Find Your Balance',
        sliders: [
          { left: 'I need 100% perfection', right: 'I embrace the 90% rule' },
          { left: 'Treats = failure', right: 'Treats = part of my plan' },
          { left: 'One bad meal ruins everything', right: 'One meal is just one meal' },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Boredom Is the Real Enemy',
    subtitle: 'Shift #4',
    description: 'Most people don\u2019t fail because the plan is too hard. They fail because it gets boring. The secret to lasting change? Learn to find satisfaction in consistency.',
    exercises: [
      {
        type: 'scenario',
        title: 'What Would You Do?',
        scenario: 'You\u2019ve been meal prepping the same 4 meals for 3 weeks. It\u2019s working \u2014 you feel great, your clothes fit better \u2014 but you\u2019re bored. A new trendy diet pops up on your feed. What do you do?',
        options: [
          { text: 'Switch to the new diet immediately \u2014 need something fresh', aligned: false },
          { text: 'Add one new recipe to your rotation and keep going', aligned: true },
          { text: 'Quit meal prepping entirely', aligned: false },
          { text: 'Do a 3-day \u201Creset\u201D cleanse you saw online', aligned: false },
        ],
        explanation: 'Boring means it\u2019s working. The RIVEN mindset says: add variety within your framework, don\u2019t blow up what\u2019s working because your brain wants novelty. Small tweaks, not total overhauls.',
      },
      {
        type: 'flip',
        title: 'Flip Your Story',
        cards: [
          { old: 'This is boring. I need a new plan.', new_story: 'Boring means it\u2019s working. The magic is in the repetition.' },
          { old: 'I need excitement to stay motivated.', new_story: 'I don\u2019t need motivation \u2014 I need commitment to the mundane.' },
          { old: 'If it\u2019s not fun, it\u2019s not sustainable.', new_story: 'Sustainable doesn\u2019t mean exciting. It means doable, day after day.' },
          { old: 'There must be a better, faster way.', new_story: 'The best plan is the one I actually stick with.' },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "You\u2019re Not Starting Over",
    subtitle: 'Shift #5',
    description: 'Every time you come back to your health journey, you bring everything you\u2019ve learned. You\u2019re not at square one \u2014 you\u2019re at square two, five, or twenty. You carry your lessons forward.',
    exercises: [
      {
        type: 'flip',
        title: 'Flip Your Story',
        cards: [
          { old: 'Here I go again, starting from scratch.', new_story: 'I\u2019m not starting over. I\u2019m starting from experience.' },
          { old: 'I always end up back here.', new_story: 'I always come back. That\u2019s resilience, not failure.' },
          { old: 'This time will probably be the same.', new_story: 'This time I know things I didn\u2019t know before.' },
          { old: 'I\u2019ve wasted so much time.', new_story: 'Every attempt taught me something I\u2019ll use now.' },
        ],
      },
      {
        type: 'slider',
        title: 'Check In With Yourself',
        sliders: [
          { left: 'I feel like I\u2019m starting from zero', right: 'I carry forward everything I\u2019ve learned' },
          { left: 'Past attempts were failures', right: 'Past attempts were lessons' },
          { left: 'I doubt I can change', right: 'I know I\u2019m capable of growth' },
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
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
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

  /* ── custom slider ── */
  .gold-slider {
    -webkit-appearance: none; appearance: none;
    width: 100%; height: 6px;
    background: #1E1E1E; border-radius: 999px; outline: none;
    cursor: pointer;
  }
  .gold-slider::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 28px; height: 28px;
    background: ${GOLD}; border-radius: 50%;
    border: 3px solid ${BG};
    box-shadow: 0 0 10px rgba(200,164,86,0.4);
    cursor: pointer;
    transition: transform 0.15s ease;
  }
  .gold-slider::-webkit-slider-thumb:active { transform: scale(1.2); }
  .gold-slider::-moz-range-thumb {
    width: 28px; height: 28px;
    background: ${GOLD}; border-radius: 50%;
    border: 3px solid ${BG};
    box-shadow: 0 0 10px rgba(200,164,86,0.4);
    cursor: pointer;
  }
  .gold-slider::-moz-range-track {
    height: 6px; background: #1E1E1E; border-radius: 999px; border: none;
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
  const [sliderValues, setSliderValues] = useState({})
  const [sliderSubmitted, setSliderSubmitted] = useState(false)
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
    setSliderValues({})
    setSliderSubmitted(false)
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
          <span style={{ color: GOLD, fontFamily: PF, fontSize: '.9rem', letterSpacing: 1 }}>$97 Value \u2014 Yours Free</span>
        </div>
        <p style={{ color: TEXT_DIM, fontSize: '.95rem', maxWidth: 440, margin: '0 auto 40px', lineHeight: 1.8 }}>
          A guided mindset experience designed for Black women who are done with diets and ready for real transformation.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <button onClick={() => go('quiz')} style={btnStyle(GOLD, BG)}>Start the Assessment</button>
          <button onClick={() => go('hub')} style={btnStyle('transparent', GOLD, true)}>Skip to the 5 Shifts</button>
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
            RIVEN \u2014 Mindset Assessment
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
              ? 'You have a solid foundation \u2014 these shifts will take you to the next level.'
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
        <p style={{ color: TEXT_DIM, fontSize: '.9rem', marginBottom: 28 }}>Tap each shift to explore interactive exercises. No typing \u2014 just tap, flip, and reflect.</p>

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
            <p style={{ color: TEXT_DIM, fontSize: '.9rem' }}>You\u2019ve completed all 5 mindset shifts. Revisit anytime to deepen your growth.</p>
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
                  position: 'relative',
                }}
              >
                {opt.text}
                {revealed && isAligned && (
                  <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#7A8B6F', fontFamily: PF, fontSize: '.75rem', fontWeight: 600, letterSpacing: 1 }}>
                    RIVEN {'\u2713'}
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
              I\u2019m Choosing the New Story
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
              <button onClick={advanceExercise} style={btnStyle(col, BG)}>Continue</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  /* ══════════════════════════════════════════
     EXERCISE: SLIDER SELF-ASSESSMENT
     ══════════════════════════════════════════ */
  const renderSliders = (ex, col) => {
    const allMoved = ex.sliders.every((_, i) => sliderValues[i] !== undefined)
    return (
      <div style={{ animation: 'fadeUp .5s ease both' }}>
        <p style={{ fontFamily: PF, fontSize: '1.1rem', fontWeight: 600, color: col, marginBottom: 8 }}>{ex.title}</p>
        <p style={{ color: TEXT_DIM, fontSize: '.85rem', marginBottom: 28 }}>Drag each slider to where you honestly are right now.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 32 }}>
          {ex.sliders.map((sl, i) => {
            const val = sliderValues[i] ?? 50
            const fillPct = val
            return (
              <div key={i}>
                <div style={{ position: 'relative', marginBottom: 12 }}>
                  {/* filled track */}
                  <div style={{
                    position: 'absolute', top: '50%', left: 0, height: 6, borderRadius: 999,
                    width: `${fillPct}%`, background: `linear-gradient(90deg, #C4622D, ${col})`,
                    transform: 'translateY(-50%)', pointerEvents: 'none', transition: 'width .1s',
                  }} />
                  <input
                    type="range" min="0" max="100"
                    value={val}
                    onChange={(e) => setSliderValues({ ...sliderValues, [i]: Number(e.target.value) })}
                    className="gold-slider"
                    style={{ position: 'relative', zIndex: 2, background: '#1E1E1E' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                  <span style={{ fontSize: '.78rem', color: val < 40 ? TEXT : TEXT_DIM, flex: 1, transition: 'color .3s' }}>{sl.left}</span>
                  <span style={{ fontSize: '.78rem', color: val > 60 ? TEXT : TEXT_DIM, flex: 1, textAlign: 'right', transition: 'color .3s' }}>{sl.right}</span>
                </div>
              </div>
            )
          })}
        </div>

        {!sliderSubmitted && (
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => { if (allMoved) setSliderSubmitted(true) }}
              style={{
                ...btnStyle(allMoved ? col : '#333', allMoved ? BG : '#666'),
                cursor: allMoved ? 'pointer' : 'default',
                opacity: allMoved ? 1 : 0.5,
              }}
            >See My Snapshot</button>
          </div>
        )}

        {sliderSubmitted && (
          <div style={{ animation: 'fadeUp .4s ease both' }}>
            <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 14, padding: '24px', marginBottom: 24 }}>
              <p style={{ fontFamily: PF, fontSize: '.8rem', letterSpacing: 2, textTransform: 'uppercase', color: col, marginBottom: 16 }}>Your Snapshot</p>
              {ex.sliders.map((sl, i) => {
                const val = sliderValues[i] ?? 50
                return (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '.72rem', color: TEXT_DIM, maxWidth: '45%' }}>{sl.left}</span>
                      <span style={{ fontSize: '.72rem', color: TEXT_DIM, maxWidth: '45%', textAlign: 'right' }}>{sl.right}</span>
                    </div>
                    <div style={{ background: '#1E1E1E', borderRadius: 999, height: 8, position: 'relative', overflow: 'hidden' }}>
                      <div style={{
                        width: `${val}%`, height: '100%', borderRadius: 999,
                        background: `linear-gradient(90deg, #C4622D, ${col})`,
                      }} />
                    </div>
                  </div>
                )
              })}
              <p style={{ color: TEXT_DIM, fontSize: '.85rem', marginTop: 16, lineHeight: 1.6, fontStyle: 'italic' }}>
                This is where you are right now \u2014 not where you\u2019ll stay. Every shift moves you forward.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={advanceExercise} style={btnStyle(col, BG)}>Continue</button>
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
    const isLastExercise = exerciseStep === s.exercises.length - 1

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
        {ex.type === 'slider' && renderSliders(ex, col)}
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
