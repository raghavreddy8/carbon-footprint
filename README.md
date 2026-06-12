# EcoSwap - Gamified Carbon Footprint Swapper

EcoSwap is an interactive, retro-themed web application designed to help users measure, track, and reduce their carbon footprint through simple, actionable choices ("Swaps"), real-time dynamic audio-visual feedback, and personalized insights.

---

## 🧭 Chosen Vertical
EcoSwap falls under the **Climate Action & Personal Sustainability** vertical. The application is built to remove the cognitive friction and doom-scrolling anxiety associated with climate change. Instead of presenting raw spreadsheets, it translates sustainable living into a retro 8-bit visual game.

---

## 💡 Approach and Logic

### 1. Habit-Based Alternatives (The "Swaps")
Rather than asking users to stop using energy completely, the app focuses on **realistic alternatives** (e.g., using plant-based milk instead of dairy, cold water washes instead of hot). This reduces user resistance and makes carbon reduction feel achievable.

### 2. Gamified Visual Feedback Loop
*   **Dynamic Theme Shift:** The entire page theme shifts dynamically from **Polluted** (warning reds/oranges/charcoals) to **Neutral** (sandy/clay tones) and finally **Healthy** (lush emeralds and mint greens) based on current savings.
*   **Virtual Forest Sandbox:** An HTML5 canvas renders trees corresponding to active swaps. The sky, sun, clouds, grass, and even wildlife (jumping bunnies) adjust to reflect the environment's health.
*   **Responsive Companions:** Retro SVG characters (**Leafy**, **Puffy**, and a floating **Minion**) change expressions (giggle/wave vs. sweat/cough/rain) dynamically as the user's footprint moves.

### 3. Tactile & Ambient Sound Synthesis
*   Instead of loading heavy static audio files, the app uses the **Web Audio API** to generate all sounds in real-time.
*   **Lofi Background Loop:** Warm Rhodes keyboard progressions, vinyl crackle (dust pops), and a sequenced drum beat. The music chord scales shift (soothing major 7ths vs. dissonant minors) and detune (tape wobble wow/flutter) dynamically based on carbon levels.
*   **Mechanical Keyboard Clicks:** Interface click actions trigger synthesized Cherry MX Blue (tactile click) and Cherry MX Red (spacebar clack) switch sounds.

---

## ⚙️ How the Solution Works

1.  **Onboarding Assessment:** The user completes a brief 3-step questionnaire (Commuting, Diet, Home Energy) to establish a baseline carbon footprint.
2.  **Adaptive Swap Deck:** A swipable card interface (which can be dragged by mouse/touch or navigated using keyboard Arrow keys) presents swaps targeting the user's highest emission sectors.
3.  **Insights Calculation Engine:**
    *   **Savings Tracker:** Calculates monthly saved $CO_2$ and remaining footprint.
    *   **Climate Equivalents:** Converts raw $CO_2$ kilograms into visual comparisons (e.g., trees planted per year, car miles avoided, phones charged).
    *   **Contextual Algorithms:** Recommends advanced swaps based on combinations of already-committed choices (e.g., combining cold wash with air drying).

---

## 📌 Assumptions Made

1.  **Average Monthly Footprint Constants:** Base emission values are approximated using average monthly consumer benchmarks (e.g., a solo gasoline car commuter averages ~200 kg $CO_2$ per month, while a heavy meat diet adds ~100 kg $CO_2$ per month).
2.  **Monthly Equivalencies:**
    *   *Trees Planted:* 1 tree absorbs $\approx 1.67\text{ kg } CO_2$ per month ($20\text{ kg } CO_2$ per year).
    *   *Car Miles Avoided:* 1 mile driven in a typical passenger car emits $\approx 0.4\text{ kg } CO_2$.
    *   *Smartphones Charged:* 1 full charge accounts for $\approx 0.0083\text{ kg } CO_2$ (8.3 grams).
    *   *Trash Bags Diverted:* 1 average bag of landfill waste accounts for $\approx 15\text{ kg } CO_2$ of greenhouse gas.
3.  **Web Audio Context:** AudioContext starts in a suspended state to comply with standard browser autoplay policies. It is initialized upon the user's first interactive swipe or click.
4.  **Local State Scope:** State is kept in memory during the browser session. Reloading the page clears memory and starts the game fresh, encouraging replayability.

---

## 🚀 How to Run the App

1.  Navigate to the folder on your Desktop:
    ```powershell
    cd C:\Users\Raghav\Desktop\carbon-footprint
    ```
2.  Install dependencies (if not already done):
    ```bash
    npm install
    ```
3.  Start the Vite dev server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` in your browser. Unmute audio in the header, complete the quiz, and swipe!
