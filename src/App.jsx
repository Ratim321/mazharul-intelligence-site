import { createContext, useContext, useEffect, useState } from "react";
import { SV, SVC, PG, SOL, IND, VAL, PR, JR, CS, ST, WA, TN, OTHER } from "./data";
import EnquiryForm, { fmt } from "./Form.jsx";
import { initCanvases } from "./canvas.js";

const NAV = [["home", "Home"], ["about", "About Us"], ["services", "Services"], ["solutions", "Business Solutions"], ["pricing", "Pricing"], ["process", "Our Process"], ["contact", "Contact Us"]];
const PAGES = NAV.map((n) => n[0]);
const MORE = [["about", "About Us"], ["process", "Our Process"], ["contact", "Contact Us"]];
const Ico = {
  home: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" /></svg>,
  services: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></svg>,
  solutions: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6.2 6.2l1.4 1.4M16.4 16.4l1.4 1.4M17.8 6.2l-1.4 1.4M7.6 16.4l-1.4 1.4" /></svg>,
  pricing: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M8.5 8.2c0-1.5 1.6-2.7 3.5-2.7s3.5 1.2 3.5 2.7-1.6 2.7-3.5 2.7-3.5 1.2-3.5 2.7 1.6 2.7 3.5 2.7 3.5-1.2 3.5-2.7" /></svg>,
  more: <svg viewBox="0 0 24 24" className="bn-dots" aria-hidden="true"><circle cx="6" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="18" cy="12" r="1.7" /></svg>,
};
const BN = [["home", "Home", "home"], ["services", "Services", "services"], ["solutions", "Solutions", "solutions"], ["pricing", "Pricing", "pricing"]];
const TITLES = { home: "Mazharul Intelligence – Your Growth, Our Intelligence", about: "About Us", services: "Services", solutions: "Business Solutions", pricing: "Service Packages & Pricing", process: "Our Process", contact: "Contact Us" };
const UL = { month: "Monthly", "one-time": "One-time · starting price", package: "Per package" };
const WAL = `https://wa.me/${WA}?text=${encodeURIComponent("Hello Mazharul Intelligence, I would like to learn more about your services.")}`;
const FB = "https://www.facebook.com/MazharulIntelligence/", LI = "https://www.linkedin.com/company/mazharul-intelligence/";
const n2 = (i) => (i < 9 ? "0" : "") + (i + 1);
const getPage = () => { const h = location.hash.slice(1); return PAGES.includes(h) ? h : "home"; };
const Ctx = createContext();

/* ---------- decorative SVG ---------- */
const IC = [<polygon points="24,4 44,14 44,34 24,44 4,34 4,14" />, <><circle cx="24" cy="24" r="20" /><circle cx="24" cy="24" r="9" /></>, <polygon points="24,5 45,42 3,42" />, <><rect x="5" y="5" width="38" height="38" /><rect x="15" y="15" width="18" height="18" /></>];
const spin = (k, base, step) => ({ animationDuration: base + k * step + "s", animationDirection: k % 2 ? "reverse" : "normal" });
const Geo = () => (<svg className="geo" viewBox="0 0 400 400" aria-hidden="true">{[300, 240, 180, 120, 70].map((z, i) => <rect key={i} x={200 - z / 2} y={200 - z / 2} width={z} height={z} style={spin(i, 30, 10)} />)}</svg>);
const Art = ({ i }) => (<svg viewBox="0 0 300 300" className="art" aria-hidden="true">{[0, 1, 2, 3, 4].map((k) => { const z = 260 - k * 48; return <rect key={k} x={150 - z / 2} y={150 - z / 2} width={z} height={z} style={spin(k, 30, 9)} />; })}<circle cx="150" cy="150" r={34 + i * 12} /></svg>);
const Pat = ({ i }) => (<svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" className="pt" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6].map((k) => { const h = 20 + ((i * 37 + k * 53) % 80); return <rect key={k} x={14 + k * 26} y={112 - h} width="16" height={h} fill="#12d46b" fillOpacity={0.2 + k * 0.1} />; })}<polyline points={`14,${80 - i * 6} 40,60 66,70 92,40 118,50 144,25 170,${30 + i * 4}`} fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="2" /></svg>);

/* ---------- shared bits ---------- */
function A({ to, children, ...r }) {
  const { go } = useContext(Ctx);
  return <a href={"#" + to} onClick={(e) => { e.preventDefault(); go(to); }} {...r}>{children}</a>;
}
const Talk = ({ children, className = "b", custom }) => {
  const { openModal } = useContext(Ctx);
  return <a className={className} href="#contact" onClick={(e) => { e.preventDefault(); openModal(custom ? { sel: [OTHER], pkg: "Custom quotation" } : {}); }}>{children}</a>;
};
const PageHead = ({ eb, h1, p }) => (<div className="ph"><Geo /><div className="w"><span className="eb">{eb}</span><h1>{h1}</h1>{p && <p>{p}</p>}</div></div>);
const Band = ({ label, items, id }) => (<div className={id}><p>{label}</p><div className="cpr">{[...items, ...items].map((x, k) => <div className="cpt" key={k}><svg viewBox="0 0 48 48">{IC[k % 4]}</svg>{x}</div>)}</div></div>);

/* ---------- pricing card ---------- */
function PackageCard({ s, i }) {
  const { req } = useContext(Ctx);
  const [k, setK] = useState(1);
  const u = s[3];
  const unit = u === "month" ? "/ month" : u === "one-time" ? "one-time" : "/ package";
  return (
    <div className="cd pk rv" id={"pk" + i}>
      <div className="pk-top">
        <span className="bl">{n2(i)} · {UL[u]}</span>
        <h3>{s[0]}</h3>
        <p className="d">{s[1]}</p>
        <ul className="fl pk-inc">{s[2].map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
      <div className="pk-tiers">
        <div className="pk-head"><span>Package</span><span>Deliverables / Scope</span><span>Price (BDT)</span></div>
        {TN.map((t, j) => (
          <button key={t} type="button" className={"pk-row" + (j === k ? " on" : "")} onClick={() => setK(j)}>
            <span><b>{t}</b>{j === 1 && <small>Popular</small>}</span>
            <span>{s[4][j][0]}</span>
            <span>{u === "one-time" && j === 0 ? "From " : ""}{fmt(s[4][j][1])} <small>{unit}</small></span>
          </button>
        ))}
      </div>
      <a className="b" href="#contact" onClick={(e) => { e.preventDefault(); req(i, k); }}>Request {TN[k]} Package</a>
    </div>
  );
}
function ServiceCard({ s, i, n }) {
  const { go, setFocusPk } = useContext(Ctx);
  return (
    <article className="cd sv rv" id={"sv" + i}>
      <div className="sv-num">{n2(n ?? i)}</div>
      <div className="sv-body">
        <h3>{s[0]}</h3>
        <p>{s[1]}</p>
        <ul className="fl">{s[2].map((b) => <li key={b}>{b}</li>)}</ul>
        <a className="tl2" href="#pricing" onClick={(e) => { e.preventDefault(); setFocusPk(i); go("pricing"); }}>View packages &amp; pricing →</a>
      </div>
    </article>
  );
}

/* ---------- pages ---------- */
function Home() {
  const { openModal } = useContext(Ctx);
  const [hero, setHero] = useState([]);
  const [ci, setCi] = useState(0);
  useEffect(() => { const t = setTimeout(() => setCi((c) => (c + 1) % CS.length), 7000); return () => clearTimeout(t); }, [ci]);
  const names = [...SV.map((s) => s[0]), OTHER];
  const step = (d) => setCi((ci + d + CS.length) % CS.length);
  return (
    <>
      <div className="hero"><canvas id="net" aria-hidden="true" /><div className="w hg">
        <div><h1 className="hx">Your Growth, <em>Our Intelligence.</em></h1>
          <p className="lead">Practical business support for startups, SMEs and growing organizations: <b>operations</b>, <b>B2B lead generation</b>, <b>data analytics</b>, <b>CRM</b>, <b>digital marketing</b> and <b>ERP</b> solutions, delivered with organized execution.</p>
          <div className="bt"><Talk>Request a Custom Business Solution</Talk><A className="tx" to="services">Explore our services</A></div></div>
        <div className="hp"><h3>How can we help you?</h3>
          <div className="ck">{names.map((v) => <label key={v}><input type="checkbox" checked={hero.includes(v)} onChange={() => setHero(hero.includes(v) ? hero.filter((x) => x !== v) : [...hero, v])} />{v}</label>)}</div>
          <a className="b" href="#contact" onClick={(e) => { e.preventDefault(); openModal({ sel: hero }); }}>Get started</a></div>
      </div></div>
      <div className="cp"><Band id="cpa" label="INDUSTRIES WE SUPPORT" items={IND} /><Band id="cpb" label="OUR APPROACH" items={["Understand", "Analyze", "Implement", "Improve"]} /></div>
      <div className="s"><div className="w"><div className="ci"><span className="eb">Business solutions</span><h2>Smarter solutions for modern business challenges.</h2><i className="bar" /><p className="mut">We combine business support, data intelligence, operational assistance and technology-enabled solutions to address everyday business requirements. <A className="tl2" to="solutions">Explore our solution areas</A>.</p></div>
        <div className="vz"><div className="tp"><span>BUSINESS INSIGHTS</span><i>● ILLUSTRATIVE</i></div><canvas id="viz" aria-label="Animated data visualisation" /></div></div></div>
      <div className="s soft"><div className="w"><div className="nav2"><div><span className="eb">Our journey</span><h2>From foundation to expanding solutions.</h2></div></div>
        <div className="tr" id="tr">{JR.map((x) => <div className="tc" key={x[0]}><div className="st" style={{ font: "800 2.2rem var(--f)", letterSpacing: "-.03em" }}>{x[0]}</div><h3>{x[1]}</h3><p>{x[2]}</p></div>)}</div></div></div>
      <div className="cs dk"><div className="w">
        <div className="stg">{CS.map((c, i) => <div key={i} className={"sl2" + (i === ci ? " on" : "")}><div><span className="eb">{c[0]}</span><h2>{c[1]}</h2><p>{c[2]}</p><div className="bt"><Talk>Request a Consultation</Talk></div></div><Art i={i} /></div>)}</div>
        <div className="ctl"><div className="dt">{CS.map((c, i) => <button key={i} className={i === ci ? "on" : ""} onClick={() => setCi(i)}>{i + 1}</button>)}</div><div className="ar"><button aria-label="Previous" onClick={() => step(-1)}>←</button><button aria-label="Next" onClick={() => step(1)}>→</button></div></div></div></div>
      <div className="s"><div className="w"><span className="eb">Why Mazharul Intelligence</span><h2 style={{ maxWidth: 760 }}>Organized execution. <em style={{ color: "var(--teal2)" }}>Meaningful insights.</em></h2><p className="mut" style={{ maxWidth: 700, margin: "18px 0 44px", fontSize: "1.1rem" }}>We believe that better organization, reliable execution and meaningful business insights are essential to sustainable growth.</p>
        <div className="sts">{ST.map((k, i) => <div className="stt rv" key={k[2]}><svg viewBox="0 0 48 48">{IC[i]}</svg><b data-n={k[0]} data-s={k[1]}>0{k[1]}</b><strong>{k[2]}</strong><p>{k[3]}</p></div>)}</div></div></div>
      <div className="cta"><div className="w s"><h2>Let’s build a smarter business together.</h2><Talk>Request a Custom Business Solution</Talk></div></div>
    </>
  );
}
const About = () => (<>
  <PageHead eb="About Mazharul Intelligence" h1={<>Your Growth, <em>Our Intelligence.</em></>} p="Founded in 2018 | Activities commenced in 2020. A business support and solutions initiative based in Dhaka, Bangladesh." />
  <div className="s"><div className="w g2"><div><h2 style={{ fontSize: "clamp(1.8rem,3.4vw,2.7rem)" }}>Intelligence, strategy and practical execution.</h2></div><div className="mut"><p>Mazharul Intelligence is a business support and solutions initiative focused on helping startups, small and medium-sized businesses, and growing organizations operate more efficiently and achieve sustainable growth.</p><p style={{ marginTop: 14 }}>We provide business-focused services across operations management, B2B lead generation, data analytics, CRM management, digital marketing, administrative support and ERP solutions.</p><p style={{ marginTop: 14 }}><b style={{ color: "var(--ink)" }}>Our approach is simple:</b> understand business needs, develop practical solutions, improve workflows and deliver organized results.</p></div></div></div>
  <div className="s soft"><div className="w g2"><div className="cd hot rv"><span className="eb" style={{ color: "var(--teal)" }}>Founder</span><h3 style={{ fontSize: "1.8rem" }}>Kazi Mazharul Islam</h3><p style={{ marginTop: 6, color: "#d0d0d0" }}>Founder | Mazharul Intelligence</p></div><div className="mut"><p>Mazharul Intelligence was founded by Kazi Mazharul Islam with a vision to help businesses grow through intelligent solutions, organized operations and strategic support.</p><p style={{ marginTop: 14 }}>His professional background in business operations, finance administration, customer coordination, travel operations and data reporting contributes to the practical and service-oriented approach of Mazharul Intelligence.</p></div></div></div>
  <div className="s"><div className="w"><div className="gr"><div className="cd rv"><h3>Our mission</h3><p className="mut" style={{ marginTop: 10 }}>To make business support practical, organized and dependable through intelligent solutions, operational excellence and actionable business insights.</p></div><div className="cd rv"><h3>Our vision</h3><p className="mut" style={{ marginTop: 10 }}>To become a trusted business support and solutions partner, empowering organizations to improve performance, embrace innovation and achieve sustainable growth.</p></div></div>
    <h2 style={{ margin: "70px 0 28px", fontSize: "clamp(1.8rem,3.4vw,2.7rem)" }}>Our core values</h2><div className="gr">{VAL.map((v) => <div className="cd rv" key={v[0]}><h3>{v[0]}</h3><p className="mut" style={{ marginTop: 8 }}>{v[1]}</p></div>)}</div></div></div></>);
const Services = () => (<><PageHead eb="Services" h1={<>Business support, <em>organized.</em></>} p="Creating long-term value for businesses and customers. Each service links to its packages and pricing." /><div className="s"><div className="w svl">{SVC.map((si, di) => <ServiceCard key={SV[si][0]} s={SV[si]} i={si} n={di} />)}</div></div></>);
const Solutions = () => (<><PageHead eb="Business Solutions" h1={<>Smarter solutions for <em>modern challenges.</em></>} p="Practical solutions that help startups, SMEs, agencies and growing organizations improve operations, organize business information and strengthen their processes." />
  <div className="s"><div className="w gr sec3">{SOL.map((x, i) => <div className="cd rv" key={x[0]}><div className="tile"><Pat i={i + 2} /></div><h3>{x[0]}</h3><p className="mut" style={{ marginTop: 8 }}>{x[1]}</p></div>)}</div></div>
  <div className="s soft"><div className="w"><span className="eb">Industries we support</span><div className="gr">{IND.map((x) => <div className="cd rv" key={x}><h3>{x}</h3></div>)}</div></div></div>
  <div className="cta"><div className="w s"><h2>Tell us about your challenges and objectives.</h2><Talk>Request a Custom Business Solution</Talk></div></div></>);
const Pricing = () => (<><PageHead eb="Service Packages & Pricing" h1={<>Clear packages. <em>Transparent pricing.</em></>} p="All prices are in Bangladeshi Taka (BDT). Choose Basic, Standard or Premium on any service and the price and scope update instantly." />
  <div className="s"><div className="w">
    {PG.map((g) => <div key={g[0]} className="pg-sec"><h3 className="gh">{g[0]}</h3><div className="pgr">{SV.slice(g[1], g[2]).map((s, j) => <PackageCard key={s[0]} s={s} i={g[1] + j} />)}</div></div>)}
    <div className="cd hot" style={{ marginTop: 50, display: "flex", gap: 24, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}><div><h3>Need something different?</h3><p style={{ marginTop: 8, color: "#d0d0d0", maxWidth: 620 }}>Every business has different requirements. If your needs don’t match a listed package, request a custom quotation.</p></div><Talk custom>Request a Custom Quotation</Talk></div>
    <p className="mut" style={{ fontSize: 13, marginTop: 18 }}>Requests are enquiries only; this is not a booking or payment system. Final scope and inclusions are confirmed in your proposal.</p></div></div></>);
const Process = () => (<><PageHead eb="Our Process" h1={<>A smarter approach to <em>business solutions.</em></>} p="A structured and transparent process built on clear communication, organized execution and continuous improvement." />
  <div className="s"><div className="w pc">{PR.map((x, i) => <div className="cd rv" key={x[0]} style={{ transitionDelay: i * 0.1 + "s" }}><b>{n2(i)}</b><h3>{x[0]}</h3><p>{x[1]}</p><ul className="fl" style={{ margin: "14px 0 0" }}>{x[2].map((b) => <li key={b}>{b}</li>)}</ul></div>)}</div></div>
  <div className="s soft"><div className="w ci" style={{ marginBottom: 0 }}><span className="eb">Our commitment</span><h2>Clear Communication. Organized Work. Reliable Support.</h2><i className="bar" /><p className="mut">We aim to make business support simpler, more structured and more effective through practical solutions and a professional working approach.</p></div></div>
  <div className="cta"><div className="w s"><div><h2>Ready to get started?</h2><p style={{ marginTop: 12, maxWidth: 620 }}>Let’s understand your business needs and find the right solution together.</p></div><div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><Talk>Start Your Project</Talk><Talk>Request a Consultation</Talk></div></div></div></>);
function Contact() {
  const { toast } = useContext(Ctx);
  return (<><PageHead eb="Contact Us" h1={<>Let’s build a smarter <em>business together.</em></>} p="Every business has different requirements. Tell us about your challenges and objectives, and we will help you identify a suitable business support solution." />
    <div className="s"><div className="w ct"><div className="cd dkc"><h3>Get in touch</h3><p><b>WhatsApp</b><br />+880 1302-622638</p><p><b>Office</b><br />House #488A, Road #32, Mohakhali DOHS,<br />Dhaka-1206, Bangladesh</p>
      <p style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}><a className="b" href={WAL} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a><a className="b o" href={FB} target="_blank" rel="noopener noreferrer">Facebook</a><a className="b o" href={LI} target="_blank" rel="noopener noreferrer">LinkedIn</a></p></div>
      <div className="cd"><h3 style={{ marginBottom: 18 }}>Tell us about your requirements</h3><EnquiryForm toast={toast} /></div></div></div></>);
}

/* ---------- app shell ---------- */
export default function App() {
  const [page, setPage] = useState(getPage());
  const [menu, setMenu] = useState(false);
  const [more, setMore] = useState(false);
  const [dark, setDark] = useState(() => { try { return localStorage.getItem("mi_theme") === "dark"; } catch { return false; } });
  const [modal, setModal] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [focusPk, setFocusPk] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const moreOn = MORE.some(([id]) => id === page);

  const go = (p) => { try { history.replaceState(null, "", "#" + p); } catch { /* sandboxed */ } setPage(p); setMenu(false); setMore(false); window.scrollTo(0, 0); };
  const toast = (t) => { setToastMsg(t); setTimeout(() => setToastMsg(""), 2800); };
  const openModal = (init = {}) => setModal({ k: Date.now(), ...init });
  const req = (i, k) => { const s = SV[i], u = s[3]; openModal({ sel: [s[0]], pkg: TN[k], msg: `Hello! I would like to request the ${TN[k]} package for ${s[0]} (${s[4][k][0]}, BDT ${fmt(s[4][k][1])}${u === "month" ? " per month" : u === "one-time" ? ", one-time starting price" : ""}).` }); };

  useEffect(() => { const f = () => setPage(getPage()); addEventListener("hashchange", f); return () => removeEventListener("hashchange", f); }, []);
  useEffect(() => { document.title = TITLES[page] + (page === "home" ? "" : " – Mazharul Intelligence"); }, [page]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; try { localStorage.setItem("mi_theme", dark ? "dark" : "light"); } catch { /* ignore */ } }, [dark]);
  useEffect(() => { const stop = initCanvases(); const t = setTimeout(() => setLoaded(true), 1300); return () => { stop(); clearTimeout(t); }; }, []);
  useEffect(() => { const f = () => setShowTop(scrollY > 700); addEventListener("scroll", f, { passive: true }); f(); return () => removeEventListener("scroll", f); }, []);
  useEffect(() => { const f = (e) => e.key === "Escape" && setModal(null); addEventListener("keydown", f); return () => removeEventListener("keydown", f); }, []);
  useEffect(() => { /* reveal-on-scroll + count-up */
    const io = new IntersectionObserver((en) => en.forEach((e) => { if (!e.isIntersecting) return; const el = e.target; el.dataset.v = "1"; if (el.dataset.n != null && el.dataset.s != null) { const n = +el.dataset.n, s = el.dataset.s, t0 = performance.now(); const tick = (t) => { const p = Math.min(1, (t - t0) / 1800); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 4))) + s; if (p < 1) requestAnimationFrame(tick); }; tick(t0); } io.unobserve(el); }), { threshold: 0.15 });
    const t = setTimeout(() => document.querySelectorAll(".rv:not([data-v]),[data-n][data-s]:not([data-v])").forEach((el) => io.observe(el)), 60);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [page]);
  useEffect(() => { /* jump to a service's package card */
    if (focusPk == null || page !== "pricing") return;
    const t = setTimeout(() => { const el = document.getElementById("pk" + focusPk); if (el) { el.scrollIntoView({ block: "center" }); el.classList.add("fx"); setTimeout(() => el.classList.remove("fx"), 2200); } setFocusPk(null); }, 150);
    return () => clearTimeout(t);
  }, [focusPk, page]);

  const body = { home: <Home />, about: <About />, services: <Services />, solutions: <Solutions />, pricing: <Pricing />, process: <Process />, contact: <Contact /> };
  return (
    <Ctx.Provider value={{ go, openModal, req, toast, setFocusPk }}>
      <div id="ld" className={loaded ? "off" : ""}><div><i /><b /></div></div>
      <header><div className="w hb">
        <A className="lg" to="home"><img src="/logo.png?v=2" alt="Mazharul Intelligence" className="lg-mark" /><span>Mazharul Intelligence</span></A>
        <nav id="nav" className={menu ? "open" : ""}><ul>{NAV.map(([id, label]) => (
          <li key={id} className={id === "services" ? "dd" : undefined}><A to={id} className={page === id ? "on" : ""}>{label}</A>
            {id === "services" && <div className="mm"><div className="w">{SV.map((s) => <A key={s[0]} to="services"><b>{s[0]}</b><span>{s[1]}</span></A>)}</div></div>}</li>))}</ul></nav>
        <button id="th" aria-label="Switch between light and dark mode" title={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setDark(!dark)}>{dark ? "☀" : "☾"}</button>
        <Talk className="b sm">Start Your Project</Talk>
        <button id="mb" className={menu ? "x" : ""} aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}><i /><i /></button>
      </div></header>
      <main>{PAGES.map((id) => <section key={id} id={id} className={"page" + (page === id ? " on" : "")}>{body[id]}</section>)}</main>
      <nav className={"bnav" + (more ? " more-open" : "")} aria-label="Mobile">
        {BN.map(([id, label, ic]) => (
          <A key={id} to={id} className={"bn" + (page === id ? " on" : "")}>{Ico[ic]}<span>{label}</span></A>
        ))}
        <button type="button" className={"bn" + (moreOn || more ? " on" : "")} aria-expanded={more} aria-controls="bn-more" onClick={() => setMore((v) => !v)}>{Ico.more}<span>More</span></button>
      </nav>
      <div id="bn-more" className={"bn-sheet" + (more ? " on" : "")} role="menu">
        <div className="bn-sheet-card">
          {MORE.map(([id, label]) => <A key={id} to={id} className={page === id ? "on" : ""} role="menuitem">{label}</A>)}
        </div>
      </div>
      {more && <button type="button" className="bn-backdrop" aria-label="Close menu" onClick={() => setMore(false)} />}
      <footer><div className="w"><div className="fw">
        <div><A className="lg" to="home"><img src="/logo.png?v=2" alt="Mazharul Intelligence" className="lg-mark" /><span>Mazharul Intelligence</span></A><p>Your Growth, Our Intelligence.<br /><br />House #488A, Road #32, Mohakhali DOHS,<br />Dhaka-1206, Bangladesh</p></div>
        <div><h4>Company</h4><A to="about">About Us</A><A to="process">Our Process</A><A to="contact">Contact Us</A></div>
        <div><h4>Solutions</h4><A to="services">Services</A><A to="solutions">Business Solutions</A><A to="pricing">Pricing</A></div>
        <div><h4>Connect</h4><a href={WAL} target="_blank" rel="noopener noreferrer">WhatsApp: +880 1302-622638</a><a href={FB} target="_blank" rel="noopener noreferrer">Facebook</a><a href={LI} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
      </div><div className="fb"><span>© 2026 Mazharul Intelligence. All rights reserved.</span><span>Founded 2018 | Activities commenced 2020</span></div></div></footer>
      <div className={"md" + (modal ? " on" : "")} role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
        <div className="mb2"><button className="xx" aria-label="Close" onClick={() => setModal(null)}>×</button><h3>Request a Custom Business Solution</h3><p>Tell us about your challenges and objectives, and we will help you identify a suitable business support solution.</p>
          {modal && <EnquiryForm key={modal.k} init={modal} toast={toast} onSent={() => setModal(null)} />}</div></div>
      <a id="wa" href={WAL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      <button id="top" className={showTop ? "s" : ""} aria-label="Scroll to top" onClick={() => scrollTo({ top: 0, behavior: "smooth" })}>↑</button>
      <div id="toast" className={toastMsg ? "s" : ""}>{toastMsg}</div>
    </Ctx.Provider>
  );
}
