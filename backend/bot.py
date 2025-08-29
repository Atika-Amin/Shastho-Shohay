from __future__ import annotations

import argparse
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

# -----------------------------
# Helpers
# -----------------------------

def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", str(text).strip().lower())

def split_list(cell: Optional[str]) -> List[str]:
    if cell is None:
        return []
    parts = re.split(r"[,|;]", str(cell))  # allow ',', '|' or ';'
    return [normalize(p) for p in parts if normalize(p)]

def truthy(cell: Optional[str]) -> bool:
    if cell is None:
        return False
    return normalize(cell) in {"1", "true", "yes", "y", "t"}

# -----------------------------
# Data Models
# -----------------------------

INTRO = "Hi there! 👋 I’m your symptom guide. How are you feeling today?\n"
CLARIFY = "Could you tell me what’s bothering you most — like fever, cough, stomach pain, or something else?"

@dataclass
class Condition:
    name: str
    core_symptoms: List[str]
    is_single: bool = False
    synonyms: Dict[str, str] = field(default_factory=dict)
    description: str = ""
    first_aid: str = ""
    when_to_see_doctor: str = ""
    doctor_type: str = ""
    # Exclusive “only …” rules: if set, we consider this condition only when the
    # user's confirmed symptoms are a subset of this set.
    only_set: Set[str] = field(default_factory=set)

@dataclass
class TriageState:
    confirmed: Set[str] = field(default_factory=set)
    denied: Set[str] = field(default_factory=set)

    focus: Optional[str] = None
    asked: Set[str] = field(default_factory=set)
    ruled_out: Set[str] = field(default_factory=set)

    pending_batch: List[str] = field(default_factory=list)
    overview_shown: bool = False

    # NEW: track "maybe" answers
    maybe: Set[str] = field(default_factory=set)

# -----------------------------
# CSV Loading
# -----------------------------

CONDITION_ALIASES = ["disease", "condition", "diagnosis", "name"]
SYMPTOMS_ALIASES = ["core_symptoms", "symptoms", "key_symptoms", "must_have", "critical_symptoms"]
SINGLE_ALIASES = ["single", "single_symptom", "is_single"]
SYNONYMS_ALIASES = ["synonyms"]
DESCRIPTION_ALIASES = ["description"]
FIRST_AID_ALIASES = ["first_aid", "first aid"]
WHEN_TO_SEE_ALIASES = ["when_to_see_doctor", "when to see doctor"]
DOCTOR_TYPE_ALIASES = ["doctor_type", "doctor type"]

def load_conditions(csv_path: Path) -> List[Condition]:
    import pandas as pd

    df = pd.read_csv(csv_path)

    def pick(colnames: List[str], aliases: List[str]) -> Optional[str]:
        for a in aliases:
            for c in colnames:
                if normalize(c) == a:
                    return c
        return None

    cols = list(df.columns)
    cond_col = pick(cols, CONDITION_ALIASES)
    symp_col = pick(cols, SYMPTOMS_ALIASES)
    single_col = pick(cols, SINGLE_ALIASES)
    syn_col = pick(cols, SYNONYMS_ALIASES)

    desc_col = pick(cols, DESCRIPTION_ALIASES)
    fa_col = pick(cols, FIRST_AID_ALIASES)
    when_col = pick(cols, WHEN_TO_SEE_ALIASES)
    doc_col = pick(cols, DOCTOR_TYPE_ALIASES)

    if not cond_col or not symp_col:
        raise ValueError("CSV needs a condition column and a symptoms column.")

    out: List[Condition] = []
    for _, row in df.iterrows():
        name = str(row[cond_col]).strip()
        core = split_list(row[symp_col])
        is_single = truthy(row[single_col]) if single_col in df.columns else (len(core) == 1)

        # Handle "only ..." exclusives and create a cleaned core list
        only_set: Set[str] = set()
        clean_core: List[str] = []
        for s in core:
            if s.startswith("only "):
                base = s.replace("only ", "", 1)
                only_set.add(base)
                clean_core.append(base)
            else:
                clean_core.append(s)

        synonyms: Dict[str, str] = {}
        if syn_col and syn_col in df.columns and not pd.isna(row[syn_col]):
            for pair in re.split(r"[|;]", str(row[syn_col])):
                pair = pair.strip()
                if pair and "=" in pair:
                    k, v = pair.split("=", 1)
                    synonyms[normalize(k)] = normalize(v)

        description = str(row[desc_col]).strip() if desc_col and not pd.isna(row[desc_col]) else ""
        first_aid = str(row[fa_col]).strip() if fa_col and not pd.isna(row[fa_col]) else ""
        when_to = str(row[when_col]).strip() if when_col and not pd.isna(row[when_col]) else ""
        doctor_type = str(row[doc_col]).strip() if doc_col and not pd.isna(row[doc_col]) else ""

        out.append(Condition(
            name=name,
            core_symptoms=clean_core,
            is_single=is_single,
            synonyms=synonyms,
            description=description,
            first_aid=first_aid,
            when_to_see_doctor=when_to,
            doctor_type=doctor_type,
            only_set=only_set,
        ))
    return out

# -----------------------------
# Engine (batch-mode)
# -----------------------------

FRIENDLY = {
    "mosquito": "recent mosquito bites or exposure",
    "shortness of breath": "shortness of breath",
    "loss of smell": "loss of smell",
}

ALIASES = {
    # snake bite variants
    "snakebite": "snake bite",
    "snake-bite": "snake bite",
    "snake": "snake bite",
    "bitten by snake": "snake bite",
    "bitten by a snake": "snake bite",
    # burn variants
    "burnt": "burn",
    "burned": "burn",
    "burn injury": "burn",
    "hand burn": "burn",
    "burn on hand": "burn",
}
# --- add near other constants in Engine/SymptomBot area ---
GREETINGS = {
    "hi", "hello", "hey", "yo", "hola", "hi there", "hello there",
    "assalamualaikum", "as-salamu alaykum", "salam", "good morning",
    "good afternoon", "good evening", "start", "start again", "restart",
}

def _is_greeting(text: str) -> bool:
    t = normalize(text)
    # single word or short pleasantry only
    return t in GREETINGS or re.fullmatch(r"(hi|hello|hey|yo)[!. ]*", t or "") is not None


class Engine:
    YES = {"yes", "y", "yeah", "yep", "sure", "correct", "right", "i do", "i have", "affirmative"}
    NO = {"no", "n", "nope", "nah", "negative", "i don't", "i do not", "i havent", "haven't"}
    MAYBE = {"maybe", "not sure", "unsure", "idk", "dont know", "don't know"}

    def __init__(self, conditions: List[Condition]):
        self.conditions = conditions
        self.known: Set[str] = set(s for c in conditions for s in c.core_symptoms)
        self.by_name: Dict[str, Condition] = {c.name: c for c in conditions}
        self.sym2cond: Dict[str, Set[str]] = {}
        for c in conditions:
            for s in c.core_symptoms:
                self.sym2cond.setdefault(s, set()).add(c.name)

    def label(self, s: str) -> str:
        return FRIENDLY.get(s, s)

    def extract(self, text: str) -> Set[str]:
        t = normalize(text)
        out: Set[str] = set()

        # 1) Alias hits (fast path)
        for k, v in ALIASES.items():
            if re.search(rf"(?<!\w){re.escape(k)}(?!\w)", t):
                out.add(v)

        # 2) Exact symptom hits
        for s in sorted(self.known, key=len, reverse=True):
            if s and re.search(rf"(?<!\w){re.escape(s)}(?!\w)", t):
                out.add(s)

        return out

    def is_yes(self, text: str) -> bool:
        t = normalize(text)
        return any(re.search(rf"(?<!\w){re.escape(x)}(?!\w)", t) for x in self.YES)

    def is_no(self, text: str) -> bool:
        t = normalize(text)
        return any(re.search(rf"(?<!\w){re.escape(x)}(?!\w)", t) for x in self.NO)

    def is_maybe(self, text: str) -> bool:
        t = normalize(text)
        return any(re.search(rf"(?<!\w){re.escape(x)}(?!\w)", t) for x in self.MAYBE)

    def score(self, confirmed, ruled_out, maybe):
        scores = []
        for c in self.conditions:
            if c.name in ruled_out or not c.core_symptoms:
                continue
            if c.only_set:
                if any(sym not in c.only_set for sym in confirmed):
                    continue
            overlap = len(set(c.core_symptoms) & confirmed)
            maybes = len(set(c.core_symptoms) & maybe)
            # Only count "maybe" as 0.5 IF we already have at least one confirmed symptom
            score = overlap + (0.5 * maybes if overlap > 0 else 0)
            if score > 0:
                scores.append((c.name, score))
        scores.sort(key=lambda x: x[1], reverse=True)
        return scores

    # NEW: return ALL condition names whose core contains the seed set
    def matching_conditions(self, seed: Set[str]) -> List[str]:
        """
        Return ALL condition names whose core_symptoms contain every item in `seed`.
        Preserves CSV order for stability.
        """
        if not seed:
            return [c.name for c in self.conditions]
        out: List[str] = []
        for c in self.conditions:
            if seed.issubset(set(c.core_symptoms)):
                out.append(c.name)
        return out

    # UPDATED: build follow-ups from ALL matching conditions, ranked by frequency
    def next_batch(self, state: TriageState, k: int = 3) -> List[str]:
        seed = state.confirmed or set()
        candidates = self.matching_conditions(seed)
        if not candidates:
            return []

        freq: Dict[str, int] = {}
        for name in candidates:
            c = self.by_name[name]
            for s in c.core_symptoms:
                if (
                    s not in state.confirmed
                    and s not in state.denied
                    and s not in state.asked
                    and s not in state.maybe
                ):
                    freq[s] = freq.get(s, 0) + 1

        if not freq:
            return []

        remaining = sorted(
            freq.items(),
            key=lambda kv: (-kv[1], len(kv[0]), kv[0])
        )
        return [sym for sym, _ in remaining[:k]]

class SymptomBot:
    def __init__(self, engine: Engine):
        self.e = engine
        self.s = TriageState()
        self.started = False
        self.finished = False
        self.THANKS = {"thanks", "thank you", "thx", "ty", "appreciate it", "many thanks"}
        self.BYES = {"bye", "goodbye", "see you", "take care", "okay bye", "ok bye"}

    def reset(self):
        self.s = TriageState()
        self.started = False
        self.finished = False

    def greet(self) -> str:
        return INTRO

    def _is_thanks(self, text: str) -> bool:
        t = normalize(text)
        return any(k in t for k in self.THANKS)

    def _is_bye(self, text: str) -> bool:
        t = normalize(text)
        return any(k in t for k in self.BYES)

    def _closing(self) -> str:
        return "You're welcome! 😊 Take care, and feel free to tell me new symptoms anytime."

    def handle(self, user_text: str) -> str:
        if not self.started:
            self.started = True

        # If conversation already concluded
        if self.finished:
            if self._is_thanks(user_text) or self._is_bye(user_text):
                return self._closing()
            # NEW: greeting after finish restarts politely
            if _is_greeting(user_text):
                self.reset()
                self.started = True
                return self.greet()
            found_after = self.e.extract(user_text)
            if found_after:
                self.reset()
                self.started = True
                self.s.confirmed.update(found_after)
                return self._continue()
            return self._closing()

        # NEW: handle greetings up front (before batches / extraction)
        if _is_greeting(user_text):
            self.reset()
            self.started = True
            return self.greet()

        

        # Handle pending batch
        if self.s.pending_batch:
            result = self._ingest_answers(user_text, self.s.pending_batch)
            # Mark only resolved ones (yes/no/maybe or explicitly mentioned) so we don’t re-ask
            self.s.asked.update(result["resolved"])
            self.s.pending_batch = []
            return self._continue()

        # Free text ingestion
        found = self.e.extract(user_text)
        if found:
            self.s.confirmed.update(found)
        elif not self.s.confirmed:
            if self._is_thanks(user_text) or self._is_bye(user_text):
                return self._closing()
            return CLARIFY

        return self._continue()

    def _ingest_answers(self, text: str, batch: List[str]) -> Dict[str, Set[str]]:
        resolved: Set[str] = set()
        confirmed: Set[str] = set()
        denied: Set[str] = set()
        maybe: Set[str] = set()

        if self.e.is_yes(text):
            confirmed.update(batch)
            resolved.update(batch)
            self.s.confirmed.update(batch)
            return {"confirmed": confirmed, "denied": denied, "maybe": set(), "resolved": resolved}

        if self.e.is_no(text):
            denied.update(batch)
            resolved.update(batch)
            self.s.denied.update(batch)
            return {"confirmed": set(), "denied": denied, "maybe": set(), "resolved": resolved}

        if self.e.is_maybe(text):
            maybe.update(batch)
            resolved.update(batch)
            self.s.maybe.update(batch)
            return {"confirmed": set(), "denied": set(), "maybe": maybe, "resolved": resolved}

        # Parse explicit mentions
        found = self.e.extract(text)
        for s in batch:
            if s in found:
                confirmed.add(s)
                resolved.add(s)
        self.s.confirmed.update(confirmed)
        return {"confirmed": confirmed, "denied": denied, "maybe": maybe, "resolved": resolved}

    def _overview(self) -> Optional[str]:
        ranked = self.e.score(self.s.confirmed, self.s.ruled_out, self.s.maybe)
        if not ranked:
            return None
        names = [n for n, _ in ranked[:3]]
        bullets = []
        for n in names:
            c = self.e.by_name[n]
            hallmarks = [s for s in c.core_symptoms if s not in self.s.confirmed][:2]
            if hallmarks:
                bullets.append(f"• {c.name} — often with {', '.join(hallmarks)}")
            else:
                bullets.append(f"• {c.name}")
        batch = self.e.next_batch(self.s, k=3)
        if batch:
            self.s.pending_batch = batch
            lines = [self._friendly_q(s) for s in batch]
            return (
                "Thanks for sharing that. It can happen in many conditions. Some common ones are:\n"
                + "\n".join(bullets)
                + "\n\nCould you tell me if you also have any of these:\n"
                + "\n".join(lines)
            )
        return "Thanks for sharing that. It can happen in many conditions. Some common ones are:\n" + "\n".join(bullets)

    def _friendly_q(self, sym: str) -> str:
        label = self.e.label(sym)
        return f"{label[0].upper() + label[1:]}?"

    def _continue(self) -> str:
        if not self.s.overview_shown and self.s.confirmed:
            self.s.overview_shown = True
            ov = self._overview()
            if ov:
                return ov

        batch = self.e.next_batch(self.s, k=3)
        if batch:
            self.s.pending_batch = batch
            lines = [self._friendly_q(s) for s in batch]
            return "Could you also let me know if any of these apply:\n" + "\n".join(lines)

        ranked = self.e.score(self.s.confirmed, self.s.ruled_out, self.s.maybe)
        if ranked:
            best = self.e.by_name[ranked[0][0]]

            # Emergency override: skip competitor phase entirely
            emergency = {"Snake Bite", "Burn"}
            if best.name in emergency:
                return self._finalize(best)

            # Skip competitor phase if we've already asked once
            if any(sym in self.s.asked for sym in best.core_symptoms):
                return self._finalize(best)

            # Competitor quick check
            compet: Set[str] = set()
            for s in best.core_symptoms:
                compet.update(self.e.sym2cond.get(s, set()))
            compet.discard(best.name)

            candidates = []
            for cname in compet:
                c = self.e.by_name[cname]
                for sym in c.core_symptoms:
                    if (
                        sym not in best.core_symptoms
                        and sym not in self.s.confirmed
                        and sym not in self.s.denied
                        and sym not in self.s.asked
                        and sym not in self.s.maybe
                    ):
                        candidates.append(sym)
                    if len(candidates) >= 3:
                        break
                if len(candidates) >= 3:
                    break

            if candidates:
                self.s.pending_batch = candidates
                self.s.asked.update(candidates)
                return "One quick check before I summarize:\n" + "\n".join(self._friendly_q(sym) for sym in candidates)

            return self._finalize(best)

        return (
            "I don't have enough to suggest a likely condition. If you can, list any symptoms in simple words, like 'fever, cough'.\n"
            "If you're unwell or worried, please seek professional medical advice."
        )

    def _finalize(self, cond: Condition) -> str:
        # Guard: don’t finalize serious diseases with weak evidence
        crit = getattr(cond, "critical_symptoms", None)
        if isinstance(crit, list):
            crit_len = len(crit)
        elif isinstance(crit, str):
            crit_len = len(split_list(crit))
        else:
            crit_len = len(cond.core_symptoms)

        min_required = 3 if crit_len >= 3 else 1
        confirmed_count = len(set(cond.core_symptoms) & self.s.confirmed)
        if confirmed_count < min_required:
            # Ask more questions or fallback instead of finalizing
            extra = self.e.next_batch(self.s, k=3)
            if extra:
                self.s.pending_batch = extra
                return "I need a bit more info to be confident. Do you also have any of these?\n" + "\n".join(self._friendly_q(s) for s in extra)
        # Normal summary if threshold met
        self.finished = True
        return self._summary(cond)

    def _summary(self, cond: Condition) -> str:
        core = ", ".join(cond.core_symptoms) if cond.core_symptoms else "(n/a)"
        lines = [
            f"{cond.name} looks likely given what you've shared.",
        ]
        if cond.description:
            lines.append(f"About it: {cond.description}")
        lines.append(f"Core symptoms: {core}.")
        if cond.first_aid:
            lines.append(f"First aid: {cond.first_aid}")
        if cond.when_to_see_doctor:
            lines.append(f"When to see a doctor: {cond.when_to_see_doctor}")
        if cond.doctor_type:
            lines.append(f"Doctor to consult: {cond.doctor_type}")
        lines.append("This is informational only — please consult a clinician for diagnosis or concerns.")
        return "\n".join(lines)
