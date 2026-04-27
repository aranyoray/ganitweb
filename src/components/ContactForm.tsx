"use client";

import { useState, type FormEvent } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (formData.get("website")) {
      setStatus("success");
      return;
    }

    const body = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Could not send your message. Please try again later.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-md)] bg-leaf/10 border border-leaf/30 p-8 text-center">
        <p className="text-lg font-semibold text-ink-800">Message sent!</p>
        <p className="mt-2 text-sm text-stone-600">
          We aim to reply within 2 business days.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-coral hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-ink-800 mb-1.5"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full rounded-[var(--radius-sm)] border border-sand-200 bg-cream-light px-4 py-3 text-sm text-ink-800 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-ink-800 mb-1.5"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-[var(--radius-sm)] border border-sand-200 bg-cream-light px-4 py-3 text-sm text-ink-800 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-ink-800 mb-1.5"
        >
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          className="w-full rounded-[var(--radius-sm)] border border-sand-200 bg-cream-light px-4 py-3 text-sm text-ink-800 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky"
          placeholder="What can we help with?"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-ink-800 mb-1.5"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-[var(--radius-sm)] border border-sand-200 bg-cream-light px-4 py-3 text-sm text-ink-800 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky resize-y"
          placeholder="Tell us more..."
        />
      </div>

      {status === "error" && (
        <div className="rounded-[var(--radius-sm)] bg-error/10 border border-error/30 px-4 py-3 text-sm text-error">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-[var(--radius-pill)] bg-coral px-6 py-3 text-sm font-semibold text-white hover:brightness-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
