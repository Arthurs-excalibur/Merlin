# 🧙‍♂️ Merlin: Your AI-First Knowledge Companion

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Arthurs-excalibur/Merlin)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri-orange.svg)](https://tauri.app/)

Merlin is a high-performance desktop application designed to bridge the gap between your local knowledge base (Obsidian) and advanced AI intelligence. Built with **Cognitive Tactility** at its core, Merlin provides a physical, interactive interface for your digital thoughts.

![Merlin Dashboard](./src/assets/hero.png)

## ✨ Features

- **🧠 Neural Memory**: Seamless integration with your Obsidian vault.
- **🎨 Cognitive Tactility**: A premium design system featuring Modern Neumorphism and Glassmorphism.
- **⚡ High Performance**: Native desktop experience powered by Tauri and Rust.
- **🔍 Intelligent Search**: Semantic understanding of your notes and documents.
- **🌓 Hybrid Views**: Switch between graph visualizations and structured chat interfaces.

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Vanilla CSS
- **Backend**: Tauri (Rust)
- **State Management**: React Context + Custom Hooks
- **Visuals**: Modern Neumorphism & Glassmorphism Design System

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install)
- [Ollama](https://ollama.ai/) (for local LLM support)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Arthurs-excalibur/Merlin.git
   cd Merlin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm run tauri dev
   ```

## 📖 Architecture

Merlin follows a modular architecture designed for extensibility:

- `/src/context`: Core state management and AI hooks.
- `/src/screens`: High-fidelity UI views (Chat, Memory, Settings).
- `/src-tauri`: Native Rust implementation for filesystem and system hooks.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Arthurs-excalibur](https://github.com/Arthurs-excalibur)
