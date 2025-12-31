<div align="center">
  <img src="public/logo.png" alt="DocGuard Logo" width="120" height="120" />
  <h1>DocGuard Nigeria 🏦🇳🇬</h1>
  <h3>The Intelligent Loan Compliance & Origination Operating System</h3>
  <p><i>From Term Sheet to Perfection in Minutes. Automated. Compliant. Secure.</i></p>

  <p align="center">
    <a href="#-features">Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-demo-mode">Demo Mode</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-installation">Installation</a>
  </p>
</div>

---

## 💡 The Problem
In Nigeria's ₦15 trillion corporate lending market, **administrative friction kills deals**. 
*   **LMA Adaptation**: Manual conversion of English law templates to Nigerian context takes weeks.
*   **CAC Perfection**: Filing charges at the Corporate Affairs Commission is manual, opaque, and prone to "query" delays.
*   **Disconnected Data**: KYC, Legal, and Compliance teams work in silos, re-typing the same RC Numbers and TINs 10x.

## 🛡️ The Solution: DocGuard
**DocGuard** is an AI-powered desktop command center that automates the entire secured lending lifecycle. It unifies **Origination**, **Documentation**, **KYC**, and **Regulatory Filing** into a single, intelligent workflow.

## 🚀 Core Capabilities

### 1. 🧠 Cross-Module Intelligence (New)
*   **Unified Data Flow**: Enter borrower details *once* during origination. DocGuard automatically propagates **RC Number**, **TIN**, and **BVN** to KYC checks, Legal Docs, and CAC Filings.
*   **Context-Aware**: Linking a loan to any module instantly pre-fills forms, eliminating manual entry errors.

### 2. 📝 LMA Smart Document Builder
*   **AI Clause Analysis**: Gemini 2.0 Flash analyzes clauses for risk against Nigerian Evidence Act 2023.
*   **Magic Rewrite**: One-click adaptation of UK-style covenants to Nigerian customized clauses.
*   **Legal Precision**: Automatically injects full corporate descriptors (e.g., *"Dangote Industries (with Registration No. RC123456)"*) into definitions.

### 3. 🏛️ CAC Registry Bot (RPA)
*   **Automated Perfection**: Native Electron robot simulates interaction with the CAC portal.
*   **Screenshot Hub & Evidence Vault**: Captures and cryptographically timestamps proof of filing (Uploads/Screenshots) to a secure Supabase bucket.
*   **Smart Pre-fill**: Auto-populates Charge Forms based on the linked loan's facility type and amount.

### 4. 🕵️‍♂️ KYC Orchestrator
*   **Corporate Due Diligence**: Parallel verification of **CAC Status** and **FIRS Tax Compliance**.
*   **Identity**: Simulated **NIN** and **BVN** validation for directors.
*   **Liveness**: Integrated webcam biometrics.

### 5. ⏰ Deadline Guardian
*   **Active Monitoring**: Tracks the mandatory **90-day registration window** (CAMA 2020).
*   **Smart Alerts**: Native desktop notifications warn you when a filing is approaching the "Void" risk threshold.

### 6. 💼 Origination Pipeline
*   **Structured Capture**: Standardized intake for Term Facilities, Revolving Credit, and Project Finance.
*   **Pipeline Dashboard**: Kanban-style view of all deals from "Lead" to "Disbursed".
## 🎮 Demo Mode (Verification Guide)

The application includes sophisticated mock services to demonstrate the "Happy Path" without needing live government API keys.

| Service | Trigger Input | Behavior |
| :--- | :--- | :--- |
| **CAC Registry** | `RC...` (e.g., `RC123456`) | Returns a valid "Active" limited liability company. |
| **CAC Registry** | Other | Throws "Company Not Found" error. |
| **FIRS (Tax)** | `10-12 Digits` (e.g., `1000234567`) | Returns a valid "Tax Compliant" status. |
| **FIRS (Tax)** | Other | Throws "TIN Invalid" error. |

**Try this Flow:**
1.  **Originate**: Create a loan for "Lagos Tech Ltd" with RC Number `RC999999` and TIN `1112223334`.
2.  **KYC**: Go to KYC, link "Lagos Tech Ltd". Watch the Corporate Verification step **auto-pass** with green checks.
3.  **Registry**: Go to CAC Registry, link "Lagos Tech Ltd". Click "Create Charge". Watch the form **auto-fill** with the RC Number.
4.  **Docs**: Go to Doc Builder, link "Lagos Tech Ltd". See "The Borrower" replaced with **"Lagos Tech Ltd (with Registration No. RC999999)"**.

## 🏗️ Architecture & Tech Stack

### Frontend (The Shell)
*   **Framework**: React 19 (Latest)
*   **Language**: TypeScript 5.8
*   **Styling**: Tailwind CSS v4 (Oxidized)
*   **Bundler**: Vite 6.2 (Superfast HMR)
*   **Icons**: Lucide React

### Desktop Layer (Electron)
*   **Engine**: Electron 39
*   **Security**: Context Isolation, Preload Scripts, encrypted local secrets.
*   **Features**: Native File System Access (for saving PDFs), Native Notifications, Shell Integration.

### Backend & AI (The Brain)
*   **Database**: Supabase (PostgreSQL 15) with Row Level Security (RLS).
*   **Storage**: Supabase Storage (Evidence Buckets).
*   **AI**: Google Gemini 2.0 Flash (`@google/genai` SDK) for clause analysis and risk scoring.

## 📦 Installation
**Prerequisites**: Node.js v18+

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Doc-Guard/docguard-nigeria.git
    cd docguard-nigeria
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # Note: If esbuild binary is missing, run: npm install --save-dev esbuild
    ```

3.  **Configure Environment**
    Create `.env` based on `.env.example` and add your keys:
    ```env
    VITE_GEMINI_API_KEY=your_key_here
    VITE_SUPABASE_URL=your_url
    VITE_SUPABASE_ANON_KEY=your_key
    ```

## 🏃‍♂️ Running the App

### Development Mode
```bash
# Run web version
npm run dev

# Run Electron desktop version
npm run electron:dev
```

### Build for Production
To generate the Linux AppImage and Windows Portable Executable:
```bash
npm run build && npm run build:electron && npx electron-builder --linux --win
```
_Note: Windows installer generation requires Wine on Linux._

## 🔐 Security
*   **Credential Obfuscation**: API keys are XOR-encrypted in production builds.
*   **Context Isolation**: Enabled in Electron main process.

---
*Built for the LMA Edge Hackathon 2025.*
