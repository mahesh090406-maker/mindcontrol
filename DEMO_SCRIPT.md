# 🎙️ MindConnect Hackathon Demo Script

Use this script during your presentation to ensure a smooth flow.

## 1. Introduction (The Hook)
*   "Stress is the silent killer. Today, we present **MindConnect**, a biofeedback platform that makes mental health visible and actionable."

## 2. Dashboard Demo (The "Wow" Factor)
*   **Action**: Open `http://localhost:3000`.
*   **Say**: "Here is our patient dashboard. It aggregates real-time data into actionable insights."
*   **Point out**:
    *   **Well-being Index**: "We track long-term trends."
    *   **Stat Grid (Top)**: "Key metrics like Mood and Sleep consistency."
    *   **Mood History (Bottom/Right)**: "Visualizing emotional stability over time."

## 3. The Core Tech: Biofeedback (The "Magic")
*   **Action**: Click "Biofeedback" or go to `http://localhost:3000/gsr`.
*   **Say**: "This is where the magic happens. We interface directly with GSR hardware."
*   **Demo Trick (Simulation)**:
    *   *Since you might not have the sensor connected:*
    *   Scroll to **"Simulation & Controls"**.
    *   Move the **"Manual Reading" Slider** up slowly.
    *   **Say**: "As the patient's stress rises..." (Watch the graph go up).
    *   **Trigger Alert**: Move it past the Threshold (e.g., >25µS).
    *   **Say**: "The system detects high arousal in real-time and triggers immediate intervention protocols."

## 4. Assessment (The AI Layer)
*   **Action**: Go to `/assessment`.
*   **Say**: "We combine physiological data with subjective reports."
*   **Action**: Click through the wizard (Mood -> Sleep -> Review).
*   **Say**: "This feeds our AI model to personalize treatment plans."

## 5. Admin Panel (The Doctor's View)
*   **Action**: Open a new tab to `http://localhost:3000/admin`.
*   **Say**: "While the patient sees their progress, the clinician gets a population-level view."
*   **Action**: Login (Any ID/Password works in demo mode).
*   **Point out**:
    *   **Patient List** with Risk Levels.
    *   **Real-time Alerts**.
    *   **Drill-down**: "Doctors can intervene before a crisis occurs."

## 6. Closing
*   "MindConnect isn't just a tracker; it's a closed-loop system for mental wellness."
