# Pham Phuong Nghi • Architectural Sketch Portfolio Website

An interactive, responsive portfolio website created from scratch for **Pham Phuong Nghi** (12 Physics, High School for the Gifted).

---

## 🎨 Visual Identity & Style
- **Aesthetic**: Architectural ink sketch style (kí họa kiến trúc bằng bút mực) with delicate hatching, perspective lines, and paper texture.
- **Watercolor Wash Highlight**: Blue `#72a9e8` at 60% opacity (`rgba(114, 169, 232, 0.60)`).
- **Typography**: Google Font **Montserrat** (with offline system fallback).
- **Audio Ambience**: Pure HTML5 Web Audio API pencil sketch & paper turn sounds (with Mute toggle).

---

## 🏛️ Navigation & Structure

1. **Initial Museum Entrance (1-Point Perspective)**
   - Center Grand Portal: **"What I did"** (Past)
   - Left Construction Portal: **"What I'm doing"** (Present)
   - Right Drafting Station: **"What I plan to do"** (Future)

2. **Author Profile Box**
   - Displays:
     ```
     Pham Phuong Nghi
     12 Physics
     High School for the Gifted
     ```
   - Appears prominently in the center on entrance with a 5-second countdown timer.
   - Smoothly morphs and docks to the top-right corner.
   - Remains persistent across all views, and can be clicked to re-expand at any time.

3. **What I did (Past) • Rotunda Floor Plan & Galleries**
   - Circular rotunda floor plan (bản vẽ mặt bằng kiến trúc) with 6 radiating exhibition rooms:
     1. **Digital paintings** (4 artworks: Church of Light, Emotion of Red, House in Iceland, Metro)
     2. **Models** (2 display pedestals: *Bus Stop Totoro* & *The City's Industrialism*)
     3. **Pencil** (6 anatomy and portrait studies)
     4. **Sketches** (3 architectural works: One Pillar Pagoda, The Cologne Cathedral, The Jewish Museum in Berlin)
     5. **Vietnamese Lacquered Painting (Sơn Mài)** (2 artworks: Capybara in Giao Linh, Carp turning into a Capy)
     6. **Others** (1 artwork: The Emotion in Still Life)
   - **Adaptive Picture Frame**: dynamically conforms to each artwork's aspect ratio.
   - **Hand-drawn Arrows**: Left & Right navigation with 3D flip morph animations.
   - Automatically hides navigation arrows for single-artwork folders (such as *Others*).

4. **Models Exhibition Room**
   - Perspective gallery with 2 display pedestals (bệ trưng bày mẫu vật) under glass vitrines with translucent watercolor wash reflections.
   - Clicking a pedestal opens an inspection modal with artwork preview, title, and close button ('X').

5. **What I'm doing (Present) • Under-Construction Studio**
   - Active workshop with timber stepladder, paint bucket with dripping watercolor wash, and highlighted cardboard boxes.
   - Clicking the highlighted boxes unboxes the **Everyday Stationery Board Game** project:
     - 4-slide carousel with navigation controls.
     - Project brief:
       > *"This project transforms everyday stationery into a functional board game, where pen caps become chess pieces, erasers become dice, and notebooks become game boards, featuring illustrations inspired by Thần Đồng Đất Việt. By bringing childhood memories back into our daily routines, the project explores how familiar objects can keep the past within sight, allowing forgotten memories to be rediscovered through the things we use every day."*

6. **What I plan to do (Future) • Open Sketchbook & Drafting Pen**
   - Hardcover sketchbook opened flat on a drafting desk with an architectural fineliner nib pen.
   - **Left Page**: 3x3 grid displaying all 9 celestial studies in **The Inner Orbits** (The Sun, Mercury, Venus, Moon, Mars, Jupiter, Saturn, Uranus, Neptune).
   - **Right Page**: Large featured showcase for **The Humane Chaos**.
   - Clicking any artwork opens the interactive Lightbox Zoom modal.

7. **Universal Controls & Lightbox Zoom**
   - **Back Button**: Backs up one step in navigation history.
   - **Home Button**: Returns directly to the museum hall.
   - **Interactive Lightbox Zoom**:
     - Scroll wheel to zoom in / out (60% to 400%).
     - Click & drag to pan around high-resolution artwork.
     - Double-click to toggle zoom.
     - Controls: Zoom In (`+`), Zoom Out (`-`), Reset (`1:1`), Close (`✕` / `Esc`).

---

## 🚀 How to Run
Simply double-click `index.html` in any web browser (Chrome, Edge, Firefox, Safari).
No installation, Node.js, or external server is required. Everything is 100% self-contained!
