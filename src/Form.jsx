import { useState } from "react";
import { SV, TN, WA, OTHER } from "./data";

export const fmt = (n) => Number(n).toLocaleString("en-US");

/* Enquiry form with live price estimate and custom-quotation calculator.
   init: { sel: [service names], pkg: "Standard" | "Custom quotation" | ..., msg } */
export default function EnquiryForm({ init = {}, toast = () => {}, onSent }) {
  const blank = { name: "", company: "", contact: "" };
  const [f, setF] = useState(blank);
  const [sel, setSel] = useState(init.sel || []);
  const [pkg, setPkg] = useState(init.pkg || "");
  const [msg, setMsg] = useState(init.msg || "");
  const [ct, setCt] = useState({});
  const [blocked, setBlocked] = useState(null);

  const svcs = sel.map((v) => SV.find((s) => s[0] === v)).filter(Boolean);
  const other = sel.includes(OTHER);
  const tierOf = (s) => (TN.includes(pkg) ? TN.indexOf(pkg) : pkg === "Custom quotation" ? ct[s[0]] ?? 1 : -1);
  const tot = (kf) => {
    const t = { month: 0, "one-time": 0, package: 0 };
    svcs.forEach((s) => { const k = kf(s); if (k > -1) t[s[3]] += s[4][k][1]; });
    const r = [];
    if (t.month) r.push(`BDT ${fmt(t.month)} / month`);
    if (t["one-time"]) r.push(`BDT ${fmt(t["one-time"])} one-time (starting price)`);
    if (t.package) r.push(`BDT ${fmt(t.package)} per package`);
    return r;
  };
  const toggle = (v) => setSel((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!sel.length) return toast("Please select the service you need");
    const lines = svcs.filter((s) => tierOf(s) > -1).map((s) => {
      const k = tierOf(s);
      return `- ${s[0]}: ${TN[k]} (${s[4][k][0]}) BDT ${fmt(s[4][k][1])}`;
    });
    const est = lines.length ? `\n\nEstimate:\n${lines.join("\n")}\nEstimated total: ${tot(tierOf).join(" + ")}` : "";
    const txt = `Hello Mazharul Intelligence,\n\nName: ${f.name}${f.company ? `\nCompany: ${f.company}` : ""}\nContact: ${f.contact}\nService: ${sel.join(", ")}\nPackage: ${pkg || "Not specified"}${est}${msg ? `\n\nRequirements: ${msg}` : ""}`;
    const url = `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;
    let w = null;
    try { w = window.open(url, "_blank"); } catch { /* blocked */ }
    if (w) {
      toast("Opening WhatsApp with your enquiry…");
      setF(blank); setSel([]); setPkg(""); setMsg(""); setCt({}); setBlocked(null);
      onSent && onSent();
    } else setBlocked({ url, txt });
  };
  const copy = () =>
    navigator.clipboard.writeText(blocked.txt).then(
      () => toast("Message copied. Paste it in WhatsApp: +880 1302-622638"),
      () => toast("Copy failed. Please copy your details manually.")
    );

  return (
    <form className="fq" onSubmit={submit}>
      <div className="fg">
        <input placeholder="Full name" required aria-label="Full name" value={f.name} onChange={set("name")} />
        <input placeholder="Company (optional)" aria-label="Company" value={f.company} onChange={set("company")} />
        <input className="f2" placeholder="Email or phone / WhatsApp" required aria-label="Email or phone" value={f.contact} onChange={set("contact")} />
        <select className="f2" aria-label="Package preference" value={pkg} onChange={(e) => setPkg(e.target.value)}>
          <option value="">Package preference</option>
          {TN.map((t, k) => (
            <option key={t} value={t}>{svcs.length ? `${t} – ${tot(() => k).join(" + ")}` : t}</option>
          ))}
          <option value="Custom quotation">Custom quotation (calculate below)</option>
          <option value="Not sure yet">Not sure yet</option>
        </select>
        <textarea className="f2" rows="3" placeholder="Project requirements" value={msg} onChange={(e) => setMsg(e.target.value)} />
      </div>
      <p className="sm">Service required</p>
      <div className="chips">
        {[...SV.map((s) => s[0]), OTHER].map((v) => (
          <button key={v} type="button" className={"ch" + (sel.includes(v) ? " on" : "")} onClick={() => toggle(v)}>{v}</button>
        ))}
      </div>
      <div className="est">
        {!svcs.length ? (
          <p className="mut">{other ? "Other requirements are quoted separately by our team." : "Select a service to see your estimate."}</p>
        ) : tierOf(svcs[0]) < 0 ? (
          <p className="mut">Choose a package preference to see your estimate.</p>
        ) : (
          <>
            {pkg === "Custom quotation" && <p className="sm">Custom quotation: choose a tier for each service</p>}
            <table><tbody>
              {svcs.map((s) => {
                const k = tierOf(s);
                return (
                  <tr key={s[0]}>
                    <td>{s[0]}</td>
                    <td>
                      {pkg === "Custom quotation" ? (
                        <select className="ct" value={k} onChange={(e) => setCt({ ...ct, [s[0]]: +e.target.value })}>
                          {TN.map((t, j) => <option key={t} value={j}>{t}</option>)}
                        </select>
                      ) : TN[k]}
                    </td>
                    <td>{s[4][k][0]}</td>
                    <td><b>BDT {fmt(s[4][k][1])}</b></td>
                  </tr>
                );
              })}
            </tbody></table>
            <p className="tt">Estimated total: {tot(tierOf).join(" + ")}</p>
            <p className="mut" style={{ fontSize: 12 }}>Estimate only. Final scope and pricing are confirmed in your proposal.{other ? " Other requirements are quoted separately." : ""}</p>
          </>
        )}
      </div>
      <button className="b d" type="submit">Send enquiry via WhatsApp</button>
      <div className="snt">
        {blocked && (
          <>
            <p className="sm" style={{ margin: "10px 0 8px" }}>Your browser blocked the pop-up. Tap below to send your enquiry:</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a className="b sm" href={blocked.url} target="_blank" rel="noopener noreferrer">Open WhatsApp</a>
              <button type="button" className="b d sm" onClick={copy}>Copy message</button>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
