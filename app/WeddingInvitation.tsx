"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { wedding } from "../src/config/wedding";

type RsvpData = {
  name: string;
  attendance: "yes" | "no";
  banquetTime: "15:00" | "17:00";
  guestCount: string;
  companions: string;
  message: string;
  contact: string;
  confirmed: boolean;
};

const emptyRsvp: RsvpData = {
  name: "",
  attendance: "yes",
  banquetTime: "15:00",
  guestCount: "1",
  companions: "",
  message: "",
  contact: "",
  confirmed: false,
};

function Lines({ text }: { text: string }) {
  return text.split("\n").map((line, index, all) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < all.length - 1 && <br />}
    </span>
  ));
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
    </header>
  );
}

function ThankYouView() {
  return (
    <main className="thank-you-page" lang="vi">
      <section className="thank-you-card" aria-labelledby="thank-you-title">
        <div className="thank-you-ring" aria-hidden="true"><span>✓</span></div>
        <p className="thank-you-eyebrow">ĐÃ NHẬN PHẢN HỒI</p>
        <h1 id="thank-you-title">Chân thành cảm ơn</h1>
        <p className="thank-you-lead">
          Phản hồi của bạn đã được gửi thành công và chúng tôi đã nhận được thông tin.
        </p>
        <div className="thank-you-divider" aria-hidden="true" />
        <p className="thank-you-note">
          Gia đình rất mong được đón tiếp bạn trong ngày vui. Bạn có thể đóng trang này.
        </p>
        <div className="thank-you-names">
          {wedding.groomName} <span>&amp;</span> {wedding.brideName}
        </div>
        <p className="thank-you-date">{wedding.weddingDateDisplay}</p>
      </section>
    </main>
  );
}

export default function WeddingInvitation() {
  const [completed, setCompleted] = useState(false);
  const [form, setForm] = useState<RsvpData>(emptyRsvp);
  const [formState, setFormState] = useState<"idle" | "sending" | "demo" | "error">("idle");
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
    );
    const elements = rootRef.current?.querySelectorAll(".reveal");
    elements?.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("rsvp") !== "complete") return;
    const timer = window.setTimeout(() => setCompleted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const deadlinePassed = useMemo(() => {
    const deadline = new Date(`${wedding.replyDeadline}T23:59:59`);
    return !Number.isNaN(deadline.getTime()) && new Date() > deadline;
  }, []);

  function updateField<K extends keyof RsvpData>(key: K, value: RsvpData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (formState !== "idle") setFormState("idle");
  }

  async function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.confirmed) return;

    const endpoint = import.meta.env.VITE_RSVP_ENDPOINT?.trim();
    const entries = {
      name: import.meta.env.VITE_RSVP_ENTRY_NAME?.trim(),
      attendance: import.meta.env.VITE_RSVP_ENTRY_ATTENDANCE?.trim(),
      banquetTime: import.meta.env.VITE_RSVP_ENTRY_BANQUET_TIME?.trim(),
      guestCount: import.meta.env.VITE_RSVP_ENTRY_GUEST_COUNT?.trim(),
      companions: import.meta.env.VITE_RSVP_ENTRY_COMPANIONS?.trim(),
      message: import.meta.env.VITE_RSVP_ENTRY_MESSAGE?.trim(),
      contact: import.meta.env.VITE_RSVP_ENTRY_CONTACT?.trim(),
    };
    if (!endpoint || Object.values(entries).some((entry) => !entry)) {
      setFormState("demo");
      return;
    }

    setFormState("sending");
    try {
      const isAttending = form.attendance === "yes";
      const body = new URLSearchParams({
        [entries.name!]: form.name,
        [entries.attendance!]: isAttending ? "Tôi sẽ tham dự" : "Tôi không thể tham dự",
        [entries.banquetTime!]: isAttending ? form.banquetTime : "",
        [entries.guestCount!]: isAttending ? form.guestCount : "",
        [entries.companions!]: isAttending ? form.companions : "",
        [entries.message!]: form.message,
        [entries.contact!]: form.contact,
      });
      await fetch(endpoint, { method: "POST", mode: "no-cors", body });
      const confirmationUrl = new URL(window.location.href);
      confirmationUrl.search = "";
      confirmationUrl.hash = "";
      confirmationUrl.searchParams.set("rsvp", "complete");
      window.history.replaceState(
        { rsvpComplete: true },
        "",
        `${confirmationUrl.pathname}${confirmationUrl.search}`,
      );
      setForm(emptyRsvp);
      setCompleted(true);
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch {
      setFormState("error");
    }
  }

  if (completed) return <ThankYouView />;

  return (
    <main ref={rootRef} lang="vi">
      <section className="hero">
        <img
          className="hero-image"
          src={wedding.coverImage}
          alt={`${wedding.groomName} và ${wedding.brideName}`}
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="hero-kicker">THIỆP MỜI ĐÁM CƯỚI</p>
          <div className="hero-mark" aria-hidden="true">♡</div>
          <h1>
            <span>{wedding.groomName}</span><em>&amp;</em><span>{wedding.brideName}</span>
          </h1>
          <div className="hero-date">{wedding.weddingDateHeroDisplay}</div>
          <div className="hero-message"><Lines text={wedding.heroMessage} /></div>
          <a className="scroll-cue" href="#greeting" aria-label="Xem thiệp mời">
            <span />XEM THIỆP
          </a>
        </div>
      </section>

      <section id="greeting" className="section invitation-intro reveal">
        <div className="enso" aria-hidden="true">♡</div>
        <SectionHeading eyebrow="LỜI MỜI" title="Trân trọng kính mời" />
        <div className="invitation-copy">
          <p className="invitation-lead">
            {wedding.greeting.intro}{" "}
            {wedding.groomName} cùng {wedding.brideName}{" "}
            {wedding.greeting.announcement}{" "}
            <strong>{wedding.weddingDateLong}</strong>.
          </p>
          <div className="invitation-divider" aria-hidden="true">
            <span />
          </div>
          <p>{wedding.greeting.invitation}</p>
          <p className="invitation-closing">{wedding.greeting.closing}</p>
        </div>
        <div className="signature">
          {wedding.groomName} <span>&amp;</span> {wedding.brideName}
        </div>
      </section>

      <section className="section details-section">
        <div className="details-card reveal">
          <SectionHeading eyebrow="NGÀY CƯỚI" title="Thời gian & địa điểm" />
          <div className="date-display">
            <strong>{wedding.weddingDateDisplay}</strong>
            <div className="language-block">{wedding.weekday}</div>
          </div>
          <div className="time-grid time-grid-three">
            <div>
              <span>ĐÓN KHÁCH</span><strong>{wedding.receptionTime}</strong>
              <div className="language-block">Thời gian đón khách</div>
            </div>
            {wedding.banquetTimes.map((time, index) => (
              <div key={time} className="banquet-time">
                <span>NHẬP TIỆC {index + 1}</span><strong>{time}</strong>
                <div className="language-block">Khung giờ tham dự</div>
              </div>
            ))}
          </div>
          <div className="venue">
            <span className="venue-icon" aria-hidden="true">⌖</span>
            <h3 className="venue-title"><span>{wedding.venueName}</span></h3>
            <p>{wedding.venueAddress}</p>
            {wedding.venuePhone && <a href={`tel:${wedding.venuePhone}`}>{wedding.venuePhone}</a>}
          </div>
          <a className="primary-button" href={wedding.googleMapsUrl} target="_blank" rel="noreferrer">
            <span>Xem trên Google Maps</span>
          </a>
        </div>
      </section>

      {wedding.showTimeline && (
        <section className="section timeline-section reveal">
          <SectionHeading eyebrow="LỊCH TRÌNH" title="Lịch trình" />
          <div className="timeline">
            {wedding.timeline.map((item, index) => (
              <div className="timeline-item" key={`${item.time}-${index}`}>
                <time>{item.time}</time><span className="timeline-dot" />
                <div className="language-block">{item.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section rsvp-section" id="rsvp">
        <div className="rsvp-card reveal">
          <SectionHeading eyebrow="PHẢN HỒI" title="Xác nhận tham dự" />
          <div className="deadline">
            <span>Vui lòng phản hồi trước ngày {wedding.replyDeadlineDisplay}.</span>
          </div>
          {deadlinePassed && (
            <div className="deadline-note" role="status">
              <p>Đã quá hạn phản hồi, sau khi gửi vui lòng liên hệ trực tiếp với cô dâu chú rể.</p>
            </div>
          )}

          <form onSubmit={submitRsvp}>
            <label className="field">
              <span>Họ và tên <b>*</b></span>
              <input required name="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Nguyễn Văn A" autoComplete="name" />
            </label>

            <fieldset>
              <legend>Xác nhận tham dự <b>*</b></legend>
              <label className="radio-card">
                <input type="radio" name="attendance" value="yes" checked={form.attendance === "yes"} onChange={() => updateField("attendance", "yes")} />
                <span><strong>Tôi sẽ tham dự</strong></span>
              </label>
              <label className="radio-card">
                <input type="radio" name="attendance" value="no" checked={form.attendance === "no"} onChange={() => updateField("attendance", "no")} />
                <span><strong>Tôi không thể tham dự</strong></span>
              </label>
            </fieldset>

            {form.attendance === "yes" && (
              <fieldset className="banquet-choice">
                <legend>Khung giờ nhập tiệc <b>*</b></legend>
                {wedding.banquetTimes.map((time) => (
                  <label className="radio-card" key={time}>
                    <input
                      required
                      type="radio"
                      name="banquetTime"
                      value={time}
                      checked={form.banquetTime === time}
                      onChange={() => updateField("banquetTime", time)}
                    />
                    <span><strong>{time}</strong><small>Tham gia nhập tiệc lúc {time}</small></span>
                  </label>
                ))}
              </fieldset>
            )}

            <label className="field">
              <span>Số người tham dự</span>
              <select name="guestCount" value={form.guestCount} onChange={(e) => updateField("guestCount", e.target.value)} disabled={form.attendance === "no"}>
                {[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Tên người đi cùng</span>
              <input name="companions" value={form.companions} onChange={(e) => updateField("companions", e.target.value)} disabled={form.attendance === "no"} />
            </label>
            <label className="field">
              <span>Lời nhắn cho cô dâu chú rể</span>
              <textarea name="message" rows={4} value={form.message} onChange={(e) => updateField("message", e.target.value)} />
            </label>
            <label className="field">
              <span>Số điện thoại hoặc email</span>
              <input name="contact" value={form.contact} onChange={(e) => updateField("contact", e.target.value)} placeholder="Không bắt buộc" />
            </label>

            <label className="confirm-row">
              <input required type="checkbox" checked={form.confirmed} onChange={(e) => updateField("confirmed", e.target.checked)} />
              <span><b>Tôi đã kiểm tra nội dung trả lời.</b></span>
            </label>

            <button className="submit-button" type="submit" disabled={formState === "sending"}>
              <span>{formState === "sending" ? "Đang gửi…" : "Gửi xác nhận"}</span>
            </button>

            {formState !== "idle" && (
              <div className={`form-notice notice-${formState}`} role="status" aria-live="polite">
                {formState === "demo" && <p>Biểu mẫu chưa được kết nối với Google Form mới nên chưa gửi dữ liệu.</p>}
                {formState === "error" && <p>Hiện chưa thể gửi. Vui lòng thử lại sau.</p>}
              </div>
            )}
          </form>
        </div>
      </section>

      <footer>
        <div className="footer-ornament" aria-hidden="true">♡</div>
        <div className="footer-message copy-vi">{wedding.footerMessage}</div>
        <div className="footer-names">
          {wedding.groomName} <span>&amp;</span> {wedding.brideName}
        </div>
        <p className="footer-date">{wedding.weddingDateDisplay}</p>
      </footer>
    </main>
  );
}
