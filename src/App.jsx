import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabaseClient'

const CV_FILE = '/cv_romain_aubert.pdf'

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.fade-up').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <a href="#hero" className="nav-logo">R<span>A</span></a>
      <div className="nav-links">
        <a href="#build" className="hide-sm">Ce que je construis</a>
        <a href="#projects" className="hide-sm">Projets</a>
        <a href="#mountain" className="hide-sm">Montagne</a>
        <a href="#contact">Contact</a>
        <a href={CV_FILE} download className="nav-cv">CV ↓</a>
      </div>
    </nav>
  )
}

function Hero() {
  const bgRef = useRef(null)
  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth > 960 && window.scrollY < window.innerHeight && bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.18}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <section id="hero">
      <div className="hero-bg" ref={bgRef} />
      <div className="hero-content">
        <div className="hero-eyebrow">Builder · Développement assisté par IA · Conseil</div>
        <h1>ROMAIN<br />AUBERT</h1>
        <p className="hero-sub">
          Ingénieur Centrale Lille. Je conçois et je livre des <strong>outils métier sur-mesure</strong> —
          ERP, CRM, outils opérationnels — en <strong>développement assisté par IA</strong>.
          Du besoin terrain au produit en production, vite et proprement.
        </p>
        <div className="hero-ctas">
          <a href="#build" className="btn-solid">Ce que je construis</a>
          <a href={CV_FILE} download className="btn-outline">Télécharger le CV</a>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about">
      <div className="about-text fade-up">
        <div className="section-label">Qui je suis</div>
        <h2>Ingénieur.<br />Builder.<br />Montagnard.</h2>
        <p>
          Ingénieur <strong>Centrale Lille</strong>, spécialisation data science, SI et stratégie d'entreprise.
          Consultant chez Sia, je passe du cadrage business au <strong>produit qui tourne</strong> : j'analyse
          le besoin, je modélise, puis je construis l'outil. Python, React, Supabase, automatisations et APIs LLM.
        </p>
        <p>
          Ma conviction : avec le <strong>développement assisté par IA</strong>, le coût de fabrication d'un outil
          métier sur-mesure s'effondre. Le rôle de conseil n'est plus de choisir un SaaS de plus, mais de savoir
          quoi construire, quoi acheter, quoi automatiser — et de le livrer.
        </p>
        <p>
          Hors écran : trail, ski de randonnée, alpinisme, vélo longue distance. <strong>La même logique
          qu'en montagne</strong> — lire le terrain, choisir la ligne, avancer sans sur-équiper.
        </p>
        <div className="about-contact">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
          <a href="#contact">Me contacter</a>
        </div>
      </div>
      <div className="about-img-wrap fade-up">
        <img src="/images/portrait.jpg" alt="Romain Aubert" loading="lazy" />
      </div>
    </section>
  )
}

const OFFERS = [
  { n: '01', t: 'Cadrer : build vs buy vs automate', d: "Diagnostiquer le besoin réel, mapper l'existant (ERP legacy, SaaS, APIs) et trancher : construire sur-mesure, acheter, ou automatiser. Périmètre, risques, ROI." },
  { n: '02', t: 'Construire l\'outil métier', d: "Front React, backend BaaS (Supabase / Firebase), automatisations (n8n, Make). Du prototype cliquable à l'application en production, en jours plutôt qu'en mois." },
  { n: '03', t: 'Intégrer l\'IA sans sur-ingénierie', d: "Agents, RAG, tool-calling là où ils créent de la valeur. Positionner l'IA dans le workflow existant sans usine à gaz ni dette technique." },
]

const SKILLS = [
  ['React', true], ['Supabase', true], ['Python', true], ['Power BI', true], ['SQL', true],
  ['n8n / Make', true], ['LLM APIs', true], ['RAG', false], ['Agents IA', false],
  ['Power Query', false], ['Swift', false], ['Vercel / Netlify', false],
]

function Build() {
  return (
    <section id="build">
      <div className="inner">
        <div className="split-top fade-up">
          <div>
            <div className="section-label">Ce que je construis</div>
            <h2>Du besoin métier<br />au produit livré.</h2>
          </div>
          <div><p>
            Je ne vends pas une techno, je résous un problème opérationnel. Le développement assisté
            par IA me permet de livrer des outils sur-mesure à une vitesse qui change l'équation économique
            d'un projet interne.
          </p></div>
        </div>

        <div className="offer-grid fade-up">
          {OFFERS.map((o) => (
            <div className="offer" key={o.n}>
              <div className="offer-num">{o.n}</div>
              <h3>{o.t}</h3>
              <p>{o.d}</p>
            </div>
          ))}
        </div>

        <div className="skills-wrap fade-up">
          {SKILLS.map(([s, on]) => (
            <span className={on ? 'skill on' : 'skill'} key={s}>{s}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

const PROJECTS = [
  {
    year: 'Ce site · React + Supabase',
    title: 'Portfolio full-stack livré en vibe coding',
    desc: "Le site que vous lisez : front React, backend Supabase (formulaire de contact persisté, CV servi en statique), déployé en continu. Conçu et mis en ligne en quelques heures — la démonstration vivante de l'approche.",
    tags: ['React', 'Supabase', 'Vibe coding'],
  },
  {
    year: '2025 · Sia · Concours interne GEO',
    title: 'Outil Python d\'analyse de positionnement marché',
    desc: "Solution autonome : clustering sémantique, APIs multi-LLM, analyse statistique d'occurrence de mots-clés pour mesurer l'alignement marché sur le segment conseil luxe. 1er sur l'ensemble des consultants.",
    tags: ['Python', 'NLP', 'LLM APIs', 'Clustering'],
  },
  {
    year: '2025 — actuel · Sia · Mission hôtelière',
    title: 'Analyse comportementale sur 202M d\'enregistrements',
    desc: "Refonte du système de matching guests/séjours sur une base de 202 millions de lignes : segmentation, modélisation des comportements, recommandations data & process pour le COMEX. PMO de la refondation.",
    tags: ['Power Query', 'Power BI', 'Segmentation'],
  },
  {
    year: '2023-2024 · IAC Partners',
    title: 'Outil de pricing automatisé',
    desc: "Analyse de fiabilité sur 10 ans de données et outil de pricing automatisé : 200k€ d'économies récurrentes sur 40M€ d'achats. Robustesse supply chain en ramp-up aéro/défense.",
    tags: ['Excel', 'Power Query', 'Automatisation'],
  },
]

function Projects() {
  return (
    <section id="projects">
      <div className="projects-header fade-up">
        <div className="section-label">Projets & expériences</div>
        <h2>Ce que j'ai<br />vraiment construit.</h2>
      </div>
      <div className="cards">
        {PROJECTS.map((p) => (
          <div className="card fade-up" key={p.title}>
            <div className="card-year">{p.year}</div>
            <div className="card-title">{p.title}</div>
            <div className="card-desc">{p.desc}</div>
            <div className="card-tags">{p.tags.map((t) => <span className="card-tag" key={t}>{t}</span>)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

const PHOTOS = [
  { img: '/images/alpine.jpg', cap: 'Alpinisme · Pelvoux', tall: true, pos: 'center 30%' },
  { img: '/images/ski.jpg', cap: 'Ski de randonnée', pos: 'center 18%' },
  { img: '/images/trail_salomon.jpg', cap: 'Trail', pos: 'center 10%' },
  { img: '/images/restonica.jpg', cap: 'Restonica 100k by UTMB', pos: 'center 8%' },
  { img: '/images/cycling.jpg', cap: 'Cyclisme endurance', pos: 'center 25%' },
]

function Mountain() {
  return (
    <section id="mountain">
      <div className="inner">
        <div className="mountain-header fade-up">
          <div>
            <div className="section-label">Montagne & sport</div>
            <h2>Lire le terrain,<br />choisir la ligne.</h2>
          </div>
          <div><p>
            Trail, ski de randonnée, alpinisme, vélo — ancrés depuis l'enfance. La montagne m'a appris à décider
            vite avec une information incomplète et à n'emporter que l'essentiel. C'est exactement ce que je fais
            quand je construis un outil.
          </p></div>
        </div>
        <div className="photo-grid">
          {PHOTOS.map((p) => (
            <div
              className={p.tall ? 'photo-item tall' : 'photo-item'}
              key={p.img}
              style={{ backgroundImage: `url('${p.img}')`, backgroundPosition: p.pos }}
            >
              <span className="photo-cap">{p.cap}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'ok' | 'err'
  const [error, setError] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending'); setError('')
    if (!supabase) {
      setStatus('err')
      setError("Backend non configuré : ajoute tes clés Supabase dans le fichier .env.")
      return
    }
    const { error } = await supabase.from('contacts').insert({
      name: form.name,
      email: form.email,
      message: form.message,
    })
    if (error) { setStatus('err'); setError(error.message) }
    else { setStatus('ok'); setForm({ name: '', email: '', message: '' }) }
  }

  return (
    <section id="contact">
      <div className="contact-grid">
        <div className="fade-up">
          <div className="section-label">Contact</div>
          <h2>Parlons-en.</h2>
          <p>
            Un outil métier à construire, une mission, une question ? Écrivez-moi. Les messages
            sont enregistrés côté Supabase — le backend de ce site, encore une fois en démonstration.
          </p>
          <div className="contact-direct">
            Direct : <a href="mailto:romain.aubert@icloud.com">romain.aubert@icloud.com</a>
          </div>
          {/* Phase 2 — assistant IA sur le profil de Romain (chatbot RAG). */}
          <div className="contact-direct" style={{ marginTop: 24, color: 'var(--muted2)' }}>
            🤖 Bientôt : un assistant IA pour poser vos questions sur mon profil.
          </div>
        </div>
        <form className="fade-up" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="name">Nom</label>
            <input id="name" name="name" value={form.name} onChange={onChange} required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" value={form.message} onChange={onChange} required />
          </div>
          <button type="submit" className="btn-solid" disabled={status === 'sending'}>
            {status === 'sending' ? 'Envoi…' : 'Envoyer'}
          </button>
          {status === 'ok' && <div className="form-msg ok">Message envoyé. Merci, je reviens vers vous vite.</div>}
          {status === 'err' && <div className="form-msg err">{error}</div>}
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <span>Romain Aubert · {new Date().getFullYear()}</span>
      <span>Builder · Développement assisté par IA</span>
      <a href="mailto:romain.aubert@icloud.com">romain.aubert@icloud.com</a>
    </footer>
  )
}

const ASK_SUGGESTIONS = [
  'Quelles sont ses expériences en IA ?',
  'Quels outils a-t-il construits ?',
  'Quel est son parcours ?',
  'Pourquoi le conseil en IA ?',
]

function Ask() {
  const [q, setQ] = useState('')
  const [answer, setAnswer] = useState('')
  const [status, setStatus] = useState(null) // null | 'loading' | 'done' | 'err'
  const [error, setError] = useState('')

  const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask`
  const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  const ask = async (question) => {
    const text = (question ?? q).trim()
    if (!text) return
    setQ(text); setStatus('loading'); setError(''); setAnswer('')
    try {
      const res = await fetch(FN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON}`, apikey: ANON },
        body: JSON.stringify({ question: text }),
      })
      const data = await res.json()
      if (!res.ok) { setStatus('err'); setError(data.error || 'Erreur.') }
      else { setStatus('done'); setAnswer(data.answer || '') }
    } catch (e) { setStatus('err'); setError(String(e)) }
  }

  const onSubmit = (e) => { e.preventDefault(); ask() }

  return (
    <section id="ask">
      <div className="ask-grid">
        <div className="fade-up">
          <div className="section-label">Assistant IA</div>
          <h2>Que voulez-vous<br />savoir sur moi ?</h2>
          <p>Posez votre question. Un assistant y répond à partir de mon CV et de mon profil :
             expériences, compétences, projets, parcours.</p>
          <form onSubmit={onSubmit} className="ask-form">
            <input value={q} onChange={(e) => setQ(e.target.value)}
                   placeholder="Ex : Quels outils IA a-t-il construits ?" maxLength={1000} />
            <button type="submit" className="btn-solid" disabled={status === 'loading'}>
              {status === 'loading' ? '…' : 'Demander'}
            </button>
          </form>
          <div className="ask-chips">
            {ASK_SUGGESTIONS.map((s) => (
              <button key={s} className="ask-chip" onClick={() => ask(s)} disabled={status === 'loading'}>{s}</button>
            ))}
          </div>
        </div>
        <div className="ask-answer fade-up">
          <div className="ask-answer-label">Réponse</div>
          {status === null && <p className="ask-placeholder">La réponse s'affichera ici.</p>}
          {status === 'loading' && <p className="ask-placeholder">Réflexion en cours…</p>}
          {status === 'done' && <p className="ask-text">{answer}</p>}
          {status === 'err' && <p className="ask-err">{error}</p>}
        </div>
      </div>
    </section>
  )
}

export default function App() {
  useReveal()
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Ask />
      <Build />
      <Projects />
      <Mountain />
      <Contact />
      <Footer />
    </>
  )
}
