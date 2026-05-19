"""
SF Dev Guide — Voice Narration Generator
Uses edge-tts (Microsoft Neural voices) + ffmpeg to add narration to the walkthrough video.
"""

import asyncio
import subprocess
import os
import sys

# ── NARRATION SCRIPT ────────────────────────────────────────────────────────
# ~230 words | ~92 seconds at natural pace | fits the 96-second video

NARRATION = """
If you're building on Salesforce and you're still googling the same things over and over — you need to see this.

This is the SF Dev Guide. An offline Salesforce reference app built entirely in vanilla HTML — no login, no subscription, no install required.

Ten Apex topics. Every one comes with the exact syntax formula, a real production-grade code example, the governor limits to watch out for, and performance optimization tips.

Triggers. Six topics — including the Trigger Handler Framework pattern that every senior developer uses, and most juniors never learn.

Lightning Web Components. Nine topics. Wire service, custom events, lifecycle hooks — all with copy-paste-ready code.

Here's the part that makes developers stop and bookmark this: twenty-one real-world project ideas across seven Salesforce clouds. Architecture breakdowns, tech stacks, implementation steps, and deliverables. These aren't toy projects. AI-powered case triage. Patient 360 care management. Real-time behavioral segmentation.

And the certification prep. Sixteen exams — including Agentforce Specialist and the new AI Specialist, the two hardest Salesforce certs right now. Topic weights shown as visual progress bars. Targeted study guides. And two hundred and sixty-nine interactive practice questions with instant color-coded feedback and full explanations.

Light mode. Dark mode. Completely offline after first load.

This took months to build. And it's completely free.

Star it. Share it. Your Salesforce career just got a cheat code.
""".strip()

# ── CONFIG ───────────────────────────────────────────────────────────────────

# Voice options (uncomment one):
VOICE = "en-US-GuyNeural"        # Confident, clear male — great for tech demos
# VOICE = "en-US-AriaNeural"     # Professional female — clean and authoritative
# VOICE = "en-US-AndrewNeural"   # Warm, engaging male — podcast style
# VOICE = "en-GB-SoniaNeural"    # British female — premium feel

RATE  = "+5%"    # Slightly faster than default — snappy but not rushed
PITCH = "+0Hz"   # Natural pitch

VIDEO_IN  = r"Videos\sf_dev_guide_walkthrough.mp4"
AUDIO_TMP = r"Videos\_narration_tmp.mp3"
VIDEO_OUT = r"Videos\sf_dev_guide_narrated.mp4"

# ── GENERATE AUDIO ────────────────────────────────────────────────────────────

async def generate_audio():
    print(f"[1/3] Generating narration with voice: {VOICE} ...")
    import edge_tts
    communicate = edge_tts.Communicate(NARRATION, VOICE, rate=RATE, pitch=PITCH)
    await communicate.save(AUDIO_TMP)
    print(f"      Saved audio -> {AUDIO_TMP}")

# ── MERGE WITH VIDEO ─────────────────────────────────────────────────────────

def merge_audio_video():
    print("[2/3] Merging narration audio with video using ffmpeg ...")

    # Get video duration
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", VIDEO_IN],
        capture_output=True, text=True
    )
    video_duration = float(probe.stdout.strip())
    print(f"      Video duration: {video_duration:.1f}s")

    # Get audio duration
    probe2 = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", AUDIO_TMP],
        capture_output=True, text=True
    )
    audio_duration = float(probe2.stdout.strip())
    print(f"      Audio duration: {audio_duration:.1f}s")

    # Merge: use shortest stream as limiter, scale audio to video duration if needed
    cmd = [
        "ffmpeg", "-y",
        "-i", VIDEO_IN,
        "-i", AUDIO_TMP,
        "-map", "0:v:0",          # take video from first input
        "-map", "1:a:0",          # take audio from second input
        "-c:v", "copy",           # copy video stream (no re-encode, fast)
        "-c:a", "aac",            # encode audio as AAC
        "-b:a", "192k",
        "-shortest",              # end when shorter stream ends
        VIDEO_OUT
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("ffmpeg error:", result.stderr[-800:])
        sys.exit(1)
    print(f"      Merged video -> {VIDEO_OUT}")

# ── CLEANUP ───────────────────────────────────────────────────────────────────

def cleanup():
    print("[3/3] Cleaning up temp files ...")
    if os.path.exists(AUDIO_TMP):
        os.remove(AUDIO_TMP)
    print("      Done.")

# ── MAIN ──────────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("  SF Dev Guide — Voice Narration Generator")
    print("=" * 60)
    print()
    print("NARRATION SCRIPT:")
    print("-" * 60)
    print(NARRATION)
    print("-" * 60)
    print(f"  Word count : {len(NARRATION.split())} words")
    print(f"  Est. time  : ~{len(NARRATION.split()) / 150 * 60:.0f} seconds at 150wpm")
    print()

    asyncio.run(generate_audio())
    merge_audio_video()
    cleanup()

    print()
    print("=" * 60)
    size_mb = os.path.getsize(VIDEO_OUT) / 1024 / 1024
    print(f"  Output: {VIDEO_OUT}")
    print(f"  Size  : {size_mb:.1f} MB")
    print("  Open the video to hear the narration!")
    print("=" * 60)

if __name__ == "__main__":
    main()
