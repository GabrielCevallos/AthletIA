"""Rule-based recommender for workout recommendations.

This module implements the exact objectives requested and a simple
generate_recommendations(user_data) function which returns a list of
recommendation dicts with keys: type, title, description, difficulty.

The function expects `user_data` to be a dict coming from the users
microservice; it will look for fields like 'id', 'level' and 'goals'/'objectives'.
"""
from typing import Any, Dict, List, Set


# Allowed training objectives (as requested)
WEIGHT_LOSS = "weight_loss"
MUSCLE_GAIN = "muscle_gain"
WEIGHT_MAINTENANCE = "weight_maintenance"
ENDURANCE = "endurance"
FLEXIBILITY = "flexibility"
GENERAL_FITNESS = "general_fitness"
REHABILITATION = "rehabilitation"
IMPROVED_POSTURE = "improved_posture"
BALANCE_AND_COORDINATION = "balance_and_coordination"
CARDIOVASCULAR_HEALTH = "cardiovascular_health"
STRENGTH_TRAINING = "strength_training"
ATHLETIC_PERFORMANCE = "athletic_performance"
LIFESTYLE_ENHANCEMENT = "lifestyle_enhancement"


def _extract_goals(user_data: Dict[str, Any]) -> Set[str]:
    """Normalize and extract a set of lowercased goal strings from user_data.

    Supports keys: 'goals', 'objectives', and falls back to [] if missing.
    Accepts list or comma-separated string.
    """
    candidates = None
    for key in ("goals", "objectives", "targets"):
        if key in user_data:
            candidates = user_data[key]
            break

    if not candidates:
        return set()

    if isinstance(candidates, str):
        parts = [p.strip().lower() for p in candidates.split(",") if p.strip()]
        return set(parts)

    if isinstance(candidates, (list, tuple, set)):
        return set(str(x).lower() for x in candidates if x is not None)

    # Unknown shape
    return set()


def _difficulty_from_level(level_value: Any) -> str:
    """Map a user 'level' value to 'beginner' or 'advanced'.

    Default is 'beginner' when not present or not recognized.
    """
    if not level_value:
        return "beginner"
    lvl = str(level_value).lower()
    if "adv" in lvl or "expert" in lvl or "pro" in lvl:
        return "advanced"
    if "begin" in lvl or "novice" in lvl or "starter" in lvl:
        return "beginner"
    # Treat intermediate/other as beginner per requirements (explicit beginner/advanced only)
    return "beginner"


def generate_recommendations(user_data: Dict[str, Any]) -> List[Dict[str, str]]:
    """Return recommendations based on user objectives and level.

    Each recommendation is a dict with: type, title, description, difficulty.
    Recommendations are added only if they match the requested objectives.
    At least one recommendation is returned (a sensible fallback).
    """
    goals = _extract_goals(user_data)
    difficulty = _difficulty_from_level(user_data.get("level") if isinstance(user_data, dict) else None)

    recs: List[Dict[str, str]] = []
    added_titles: Set[str] = set()

    def add(title: str, description: str) -> None:
        if title in added_titles:
            return
        added_titles.add(title)
        recs.append({
            "type": "workout",
            "title": title,
            "description": description,
            "difficulty": difficulty,
        })

    # Rules mapping
    if WEIGHT_LOSS in goals:
        add(
            "Cardio / HIIT",
            "High-intensity interval training or cardio sessions to increase calorie burn and support weight loss.",
        )

    if MUSCLE_GAIN in goals or STRENGTH_TRAINING in goals:
        add(
            "Strength & Hypertrophy",
            "Resistance training focused on progressive overload: compound lifts and accessory work.",
        )

    if FLEXIBILITY in goals or IMPROVED_POSTURE in goals:
        add(
            "Mobility & Yoga",
            "Yoga and mobility flows to enhance flexibility and posture control.",
        )

    if CARDIOVASCULAR_HEALTH in goals or ENDURANCE in goals:
        add(
            "Endurance Training",
            "Steady-state cardio (running, cycling, rowing) and interval endurance sessions.",
        )

    if BALANCE_AND_COORDINATION in goals:
        add(
            "Balance & Coordination",
            "Stability drills, proprioceptive exercises and coordination circuits.",
        )

    if REHABILITATION in goals:
        add(
            "Rehab & Low Intensity",
            "Controlled, low-intensity routines and corrective exercises for safe progression.",
        )

    if LIFESTYLE_ENHANCEMENT in goals or GENERAL_FITNESS in goals:
        add(
            "Sustainable Mixed Routine",
            "A mix of cardio, strength and mobility designed for long-term adherence and general health.",
        )

    if ATHLETIC_PERFORMANCE in goals:
        add(
            "Performance & Conditioning",
            "Sport-specific drills, power and conditioning to improve athletic output.",
        )

    if WEIGHT_MAINTENANCE in goals:
        add(
            "Maintenance Circuit",
            "Balanced workouts to preserve current body composition and fitness levels.",
        )

    # If nothing matched, provide a friendly starter routine
    if not recs:
        add(
            "Starter Full-Body",
            "Beginner-friendly full-body sessions combining light cardio, basic strength moves and mobility.",
        )

    return recs
