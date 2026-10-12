import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Printer, RotateCcw } from "lucide-react";
import {
  PLAN_ITEMS,
  STATUS_LABEL,
  WEEKS,
  dayParts,
  todayISO,
  type PlanItem,
  type Status,
  type Week,
} from "@/data/plan";
import { useSuivi } from "@/store/suivi";

const STATUS_ORDER: Status[] = ["todo", "doing", "done"];

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function SuiviApp() {
  const status = useSuivi((s) => s.status);
  const notes = useSuivi((s) => s.notes);
  const checks = useSuivi((s) => s.checks);
  const log = useSuivi((s) => s.log);
  const setStatus = useSuivi((s) => s.setStatus);
  const setNote = useSuivi((s) => s.setNote);
  const toggleCheck = useSuivi((s) => s.toggleCheck);
  const reset = useSuivi((s) => s.reset);

  const today = todayISO();
  const currentWeek = WEEKS.find((week) => week.items.some((item) => item.date === today));
  const [weekId, setWeekId] = useState(currentWeek?.id ?? "all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    void useSuivi.persist.rehydrate();
  }, []);

  const counts = useMemo(() => {
    const tally = { todo: 0, doing: 0, done: 0 };
    for (const item of PLAN_ITEMS) tally[status[item.id] ?? item.initial] += 1;
    return tally;
  }, [status]);

  const total = PLAN_ITEMS.length;
  const percent = Math.round((counts.done / total) * 100);
  const todayItem = PLAN_ITEMS.find((item) => item.date === today);

  function downloadCsv() {
    const header = [
      "Semaine",
      "Date",
      "Jour",
      "Nature",
      "Titre",
      "Statut",
      "Livrable",
      "Note",
      "Points",
    ];
    const lines = [header.join(";")];
    for (const week of WEEKS) {
      for (const item of week.items) {
        const parts = dayParts(item.date);
        const pointText =
          item.kind === "milestone"
            ? item.points
                .map((point, index) => `${checks[`${item.id}:${index}`] ? "[x]" : "[ ]"} ${point}`)
                .join(" | ")
            : item.points.join(" | ");
        lines.push(
          [
            `Semaine ${week.index} — ${week.name}`,
            item.date,
            parts.label,
            item.kind === "milestone" ? "Livrable vendredi" : "Feature du jour",
            item.title,
            STATUS_LABEL[status[item.id] ?? item.initial],
            item.livrable,
            notes[item.id] ?? "",
            pointText,
          ]
            .map(csvCell)
            .join(";"),
        );
      }
    }
    const blob = new Blob([`\uFEFF${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "digifemmes-feuille-de-suivi.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-ink text-sheet">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-sheet/20 font-display text-lg">
              DF
            </span>
            <div>
              <p className="text-xs font-medium tracking-widest text-sheet/70 uppercase">
                Projet site web · 12–30 octobre 2026
              </p>
              <h1 className="mt-1 font-display text-4xl leading-none font-medium">Feuille de suivi</h1>
              <p className="mt-2 max-w-xl text-sm text-sheet/80">
                Une feature par jour. Le vendredi, le livrable de la semaine. Trois états : à faire, en
                cours, terminé.
              </p>
            </div>
          </div>
          <div className="no-print flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadCsv}
              className="min-h-11 rounded-full border border-sheet/30 px-4 text-sm font-medium hover:bg-sheet/10"
            >
              Télécharger le CSV
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sheet px-4 text-sm font-medium text-ink"
            >
              <Printer className="size-4" aria-hidden="true" />
              Imprimer
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex flex-col gap-6">
          <section className="rounded-sheet border border-line bg-sheet p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium tracking-widest text-muted uppercase">Avancement</p>
                <p className="font-display text-5xl leading-none tabular-nums">{percent}%</p>
              </div>
              <p className="text-sm text-muted">
                {counts.done} terminé{counts.done > 1 ? "s" : ""} sur {total} lignes
              </p>
            </div>
            <div
              className="mt-4 flex h-2 overflow-hidden rounded-full bg-line"
              role="meter"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Part terminée du chantier"
            >
              <div className="h-full bg-ink" style={{ width: `${percent}%` }} />
              <div
                className="h-full bg-copper"
                style={{ width: `${Math.round((counts.doing / total) * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">Encre : terminé. Cuivre : en cours.</p>
            <dl className="mt-5 grid grid-cols-3 gap-3">
              <Count label="À faire" value={counts.todo} />
              <Count label="En cours" value={counts.doing} tone="copper" />
              <Count label="Terminé" value={counts.done} tone="ink" />
            </dl>
            <p className="mt-5 border-t border-line pt-4 text-sm">
              <span className="font-medium">Aujourd’hui · </span>
              {todayItem ? (
                <>
                  {dayParts(todayItem.date).label} — {todayItem.title}
                  <span className="text-muted">
                    {" "}
                    · {STATUS_LABEL[status[todayItem.id] ?? todayItem.initial]}
                  </span>
                </>
              ) : (
                <span className="text-muted">hors du calendrier du 12 au 30 octobre.</span>
              )}
            </p>
          </section>

          <div className="no-print grid gap-3 sm:grid-cols-3">
            {WEEKS.map((week) => (
              <WeekChip
                key={week.id}
                week={week}
                active={weekId === week.id}
                status={status}
                onSelect={() => setWeekId(week.id)}
              />
            ))}
          </div>

          <div className="no-print flex flex-wrap gap-2">
            <FilterChip active={weekId === "all"} onClick={() => setWeekId("all")}>
              Tout le chantier
            </FilterChip>
            {currentWeek ? (
              <FilterChip active={weekId === currentWeek.id} onClick={() => setWeekId(currentWeek.id)}>
                Semaine en cours
              </FilterChip>
            ) : null}
          </div>

          {WEEKS.map((week) => {
            const shown = weekId === "all" || week.id === weekId;
            return (
              <div key={week.id} className={shown ? undefined : "hidden print:block"}>
                <WeekSheet
                  week={week}
                  today={today}
                  status={status}
                  notes={notes}
                  checks={checks}
                  openId={openId}
                  onToggleOpen={(id) => setOpenId((current) => (current === id ? null : id))}
                  onStatus={setStatus}
                  onNote={setNote}
                  onCheck={toggleCheck}
                />
              </div>
            );
          })}
        </div>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-4 xl:self-start">
          <section className="rounded-sheet border border-line bg-sheet p-5">
            <h2 className="font-display text-2xl">Journal</h2>
            <p className="mt-1 text-sm text-muted">Chaque changement de statut reste ici.</p>
            {log.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                Rien encore. Le passage d’une ligne en cours ou terminée s’inscrit automatiquement.
              </p>
            ) : (
              <ol className="mt-4 flex flex-col gap-3">
                {log.slice(0, 8).map((entry) => (
                  <li key={entry.id} className="border-t border-line pt-3 text-sm">
                    <p className="text-xs tracking-wide text-muted uppercase">{formatWhen(entry.at)}</p>
                    <p className="mt-1 font-medium">{entry.title}</p>
                    <p className="text-copper">{STATUS_LABEL[entry.to]}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="rounded-sheet border border-line bg-sheet p-5 text-sm">
            <h2 className="font-display text-2xl">Lecture</h2>
            <ul className="mt-3 flex flex-col gap-2 text-muted">
              <li>Le titre de la ligne est la feature du jour.</li>
              <li>Le vendredi n’est pas une feature : c’est le livrable à présenter.</li>
              <li>Une case cochée ne change pas le statut. Le statut, c’est l’état réel.</li>
              <li>La note sert au point : blocage, décision, suite.</li>
            </ul>
          </section>

          <div className="no-print">
            {confirmReset ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setConfirmReset(false);
                  }}
                  className="min-h-11 rounded-full bg-ink px-4 text-sm font-medium text-sheet"
                >
                  Confirmer la remise à zéro
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="min-h-11 rounded-full border border-line px-4 text-sm"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex min-h-11 items-center gap-2 text-sm text-muted"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Revenir au plan initial
              </button>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

function Count({ label, value, tone = "muted" }: { label: string; value: number; tone?: "muted" | "copper" | "ink" }) {
  const toneClass = tone === "copper" ? "text-copper" : tone === "ink" ? "text-ink" : "text-muted";
  return (
    <div className="rounded-2xl bg-paper px-3 py-3">
      <dt className="text-xs tracking-wide text-muted uppercase">{label}</dt>
      <dd className={`font-display text-3xl tabular-nums ${toneClass}`}>{value}</dd>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 rounded-full px-4 text-sm font-medium ${
        active ? "bg-ink text-sheet" : "border border-line bg-sheet text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function WeekChip({
  week,
  active,
  status,
  onSelect,
}: {
  week: Week;
  active: boolean;
  status: Record<string, Status>;
  onSelect: () => void;
}) {
  const done = week.items.filter((item) => (status[item.id] ?? item.initial) === "done").length;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`rounded-2xl border p-4 text-left ${active ? "border-copper bg-wash" : "border-line bg-sheet"}`}
    >
      <p className="text-xs font-medium tracking-widest text-muted uppercase">
        Semaine {week.index} · {week.range}
      </p>
      <p className="mt-1 font-display text-xl">{week.name}</p>
      <p className="mt-2 text-sm text-muted">Vendredi · {week.friday}</p>
      <p className="mt-3 text-sm tabular-nums">
        {done}/{week.items.length} terminé{done > 1 ? "s" : ""}
      </p>
    </button>
  );
}

function WeekSheet({
  week,
  today,
  status,
  notes,
  checks,
  openId,
  onToggleOpen,
  onStatus,
  onNote,
  onCheck,
}: {
  week: Week;
  today: string;
  status: Record<string, Status>;
  notes: Record<string, string>;
  checks: Record<string, boolean>;
  openId: string | null;
  onToggleOpen: (id: string) => void;
  onStatus: (id: string, title: string, to: Status) => void;
  onNote: (id: string, note: string) => void;
  onCheck: (key: string) => void;
}) {
  const done = week.items.filter((item) => (status[item.id] ?? item.initial) === "done").length;
  return (
    <section className="print-break overflow-hidden rounded-sheet border border-line bg-sheet">
      <div className="border-b border-line px-5 py-5">
        <p className="text-xs font-medium tracking-widest text-copper uppercase">
          Semaine {week.index} · {week.range}
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-3xl">{week.name}</h2>
          <p className="text-sm tabular-nums text-muted">
            {done}/{week.items.length}
          </p>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted">{week.intent}</p>
      </div>
      <div className="hidden grid-cols-[7rem_minmax(0,1fr)] gap-4 border-b border-line px-5 py-2 text-xs tracking-widest text-muted uppercase md:grid">
        <span>Jour</span>
        <span>Feature du jour et statut</span>
      </div>
      <ol>
        {week.items.map((item) => (
          <DayRow
            key={item.id}
            item={item}
            today={today}
            state={status[item.id] ?? item.initial}
            note={notes[item.id] ?? ""}
            checks={checks}
            open={openId === item.id}
            onToggleOpen={() => onToggleOpen(item.id)}
            onStatus={(to) => onStatus(item.id, item.title, to)}
            onNote={(note) => onNote(item.id, note)}
            onCheck={onCheck}
          />
        ))}
      </ol>
    </section>
  );
}

function DayRow({
  item,
  today,
  state,
  note,
  checks,
  open,
  onToggleOpen,
  onStatus,
  onNote,
  onCheck,
}: {
  item: PlanItem;
  today: string;
  state: Status;
  note: string;
  checks: Record<string, boolean>;
  open: boolean;
  onToggleOpen: () => void;
  onStatus: (to: Status) => void;
  onNote: (note: string) => void;
  onCheck: (key: string) => void;
}) {
  const parts = dayParts(item.date);
  const isToday = item.date === today;
  const late = item.date < today && state !== "done";
  const milestone = item.kind === "milestone";
  const checked = milestone ? item.points.filter((_, index) => checks[`${item.id}:${index}`]).length : 0;

  return (
    <li className={`border-b border-line last:border-b-0 ${isToday ? "bg-wash" : ""}`}>
      <article className="grid gap-4 px-5 py-5 md:grid-cols-[7rem_minmax(0,1fr)]">
        <div>
          <p className="font-display text-4xl leading-none tabular-nums">{parts.day}</p>
          <p className="mt-1 text-sm capitalize">{parts.weekday}</p>
          {isToday ? <p className="mt-2 text-xs font-medium tracking-wide text-copper uppercase">Aujourd’hui</p> : null}
          {late ? <p className="mt-2 text-xs font-medium tracking-wide text-copper uppercase">Dépassé</p> : null}
          {milestone ? (
            <p className="mt-2 text-xs font-medium tracking-wide text-ink uppercase">Livrable</p>
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium tracking-widest text-muted uppercase">
                {milestone ? "Vendredi · à présenter" : "Feature du jour"}
              </p>
              <h3 className="mt-1 font-display text-2xl">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.headline}</p>
            </div>
            <StatusPicker value={state} onChange={onStatus} />
            <p className="hidden text-sm font-medium print:block">Statut : {STATUS_LABEL[state]}</p>
          </div>

          {milestone ? (
            <fieldset className="mt-4">
              <legend className="text-sm font-medium">
                Points du livrable · {checked}/{item.points.length}
              </legend>
              <ul className="mt-2 flex flex-col gap-2">
                {item.points.map((point, index) => {
                  const key = `${item.id}:${index}`;
                  const on = Boolean(checks[key]);
                  return (
                    <li key={key}>
                      <label className="flex min-h-11 items-start gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => onCheck(key)}
                          className="mt-1 size-5 accent-copper"
                        />
                        <span className={on ? "text-muted line-through" : ""}>{point}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          ) : null}

          {note.trim() ? <p className="mt-3 text-sm text-muted">Note · {note}</p> : null}

          <button
            type="button"
            onClick={onToggleOpen}
            aria-expanded={open}
            className="no-print mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-medium"
          >
            <ChevronDown className={`size-4 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
            {open ? "Masquer le périmètre" : "Périmètre, livrable, validation"}
          </button>
          <div className={open ? undefined : "hidden print:block"}>
            <Detail item={item} note={note} onNote={onNote} />
          </div>
        </div>
      </article>
    </li>
  );
}

function Detail({ item, note, onNote }: { item: PlanItem; note: string; onNote: (note: string) => void }) {
  return (
    <div className="mt-2 grid gap-3 rounded-2xl bg-paper p-4 text-sm sm:grid-cols-2">
      {item.kind === "feature" ? (
        <div className="sm:col-span-2">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">Périmètre</p>
          <ul className="mt-1 list-disc pl-4">
            {item.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div>
        <p className="text-xs font-medium tracking-widest text-muted uppercase">Livrable</p>
        <p className="mt-1">{item.livrable}</p>
      </div>
      <div>
        <p className="text-xs font-medium tracking-widest text-muted uppercase">Validation</p>
        <p className="mt-1">{item.validation}</p>
      </div>
      {item.stack ? (
        <div className="sm:col-span-2">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">Stack</p>
          <p className="mt-1">{item.stack}</p>
        </div>
      ) : null}
      <label className="no-print sm:col-span-2">
        <span className="text-xs font-medium tracking-widest text-muted uppercase">Note d’avancement</span>
        <textarea
          value={note}
          onChange={(event) => onNote(event.target.value)}
          rows={2}
          placeholder="Blocage, décision, ou ce qui sera montré."
          className="mt-1 w-full resize-y rounded-2xl border border-line bg-sheet px-3 py-2 text-sm text-ink placeholder:text-muted"
        />
      </label>
      {note.trim() ? (
        <p className="hidden sm:col-span-2 print:block">
          <span className="text-xs font-medium tracking-widest text-muted uppercase">Note · </span>
          {note}
        </p>
      ) : null}
    </div>
  );
}

function StatusPicker({ value, onChange }: { value: Status; onChange: (to: Status) => void }) {
  return (
    <div role="radiogroup" aria-label="Statut" className="no-print flex shrink-0 flex-wrap gap-1">
      {STATUS_ORDER.map((option) => {
        const selected = value === option;
        const selectedClass =
          option === "doing"
            ? "bg-copper text-sheet"
            : option === "done"
              ? "bg-ink text-sheet"
              : "bg-paper text-ink";
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={`inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-medium ${
              selected ? selectedClass : "border border-line text-muted"
            }`}
          >
            {option === "done" && selected ? <Check className="size-4" aria-hidden="true" /> : null}
            {STATUS_LABEL[option]}
          </button>
        );
      })}
    </div>
  );
}
