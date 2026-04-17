# Salesforce Developer Reference — SF Dev Guide

A comprehensive **offline Salesforce reference web app** covering Apex Classes, Apex Triggers, Lightning Web Components, 21 real-world project ideas across 7 Salesforce clouds, and interactive certification prep Q&A for 16 certifications (including Agentforce & AI certs).

---

## Screenshots

All screenshots are in the [`Screenshots/`](./Screenshots/) folder.  
Videos (MP4 + MOV) are in the [`Videos/`](./Videos/) folder.

| # | File | What it shows |
|---|------|---------------|
| 01 | `01_home.png` | Home page viewport |
| 01 | `01_home_full.png` | Full scrollable home page |
| 02 | `02_apex_classes_home.png` | Apex Classes topic grid |
| 03 | `03_apex_class_declaration.png` | Class Declaration topic — Overview tab |
| 04 | `04_apex_code_example.png` | Class Declaration — Code Example (syntax-highlighted) |
| 05 | `05_apex_gov_limits.png` | Class Declaration — Governor Limits tab |
| 06 | `06_soql_queries.png` | SOQL Queries topic overview + syntax |
| 07 | `07_apex_triggers_home.png` | Apex Triggers topic grid |
| 08 | `08_trigger_handler_framework.png` | Trigger Handler Framework topic |
| 09 | `09_lwc_home.png` | LWC topic grid |
| 10 | `10_lwc_wire_service.png` | @wire Service & Adapters syntax |
| 11 | `11_projects_home.png` | Project Ideas — all 7 clouds |
| 12 | `12_projects_sales_cloud.png` | Sales Cloud Projects (3 projects) |
| 13 | `13_projects_health_cloud.png` | Health Cloud Projects (3 projects) |
| 14 | `14_projects_data_cloud.png` | Data Cloud Projects (3 projects) |
| 15 | `15_certifications_home.png` | Certifications home — all 16 certs |
| 16 | `16_cert_admin_detail.png` | Admin cert — Exam Overview tab |
| 17 | `17_cert_admin_qa.png` | Admin cert — Practice Q&A tab |
| 18 | `18_cert_qa_answered.png` | Q&A interaction — correct answer + explanation |
| 19 | `19_cert_agentforce.png` | Agentforce Specialist cert detail |
| 20 | `20_cert_ai_specialist.png` | Salesforce AI Specialist cert detail |
| 21 | `21_cert_pdi_topic_weights.png` | PDI — Topic Weights with progress bars |
| 22 | `22_dark_mode_cert.png` | Dark mode — PDI Topic Weights |

---

## Videos

| File | Format | Duration | Description |
|------|--------|----------|-------------|
| `sf_dev_guide_walkthrough.mp4` | MP4 (mp4v) | ~96 sec | Full walkthrough of all sections |
| `sf_dev_guide_walkthrough.mov` | MOV (mp4v) | ~96 sec | Same walkthrough in QuickTime format |

Each screenshot is held for 4 seconds. Covers: Home → Apex Classes → Triggers → LWC → Projects → Certifications → Q&A → Dark Mode.

---

## Project Structure

```
sf-dev-guide/
├── index.html          — Main app shell (CSS, layout, all rendering JS)
├── data-apex.js        — Apex Classes, Triggers, LWC topic data
├── data-projects.js    — 7 clouds × 3 projects = 21 project ideas
├── data-certs.js       — 16 certifications with 269 practice Q&A
├── Screenshots/        — 22 PNG screenshots (1440×900)
├── Videos/             — MP4 + MOV walkthrough videos (~3 MB each)
└── README.md           — This file
```

---

## Functionality Overview

### 1. Apex Classes (10 Topics)

Each topic includes: **Syntax formula**, **Code Example** (real-world project code), **Best Practices**, **Governor Limits**, and **Optimization tips**.

| Topic | Key Syntax / Formula |
|-------|----------------------|
| **Class Declaration & Modifiers** | `[access_modifier] [sharing_keyword] class ClassName [extends Parent] [implements Interface] { }` |
| **Variables & Primitive Data Types** | `DataType variableName = value;` — Types: Integer, Long, Decimal, Double, Boolean, String, Id, Date, DateTime, Blob |
| **Collections — List, Set, Map** | `List<T>`, `Set<T>`, `Map<K,V>` — Backbone of bulk processing |
| **SOQL Queries** | `[SELECT fields FROM SObject WHERE conditions ORDER BY field LIMIT n WITH SECURITY_ENFORCED]` |
| **DML Operations** | `insert / update / upsert / delete / undelete / merge` — Always operate in bulk |
| **Exception Handling** | `try { } catch (ExceptionType e) { } finally { }` — Always catch specific exceptions |
| **@future Methods** | `@future(callout=true) public static void method(Set<Id> ids)` — Async, primitive params only |
| **Batch Apex** | `Database.Batchable<SObject>` → `start()` + `execute()` + `finish()` — Up to 50M records |
| **Queueable Apex** | `Queueable` interface → `System.enqueueJob(new MyJob())` — Supports sObject params, chaining |
| **Invocable Methods** | `@InvocableMethod(label='...' description='...')` — Exposes Apex to Flow, Process Builder, REST |

#### Key Governor Limits — Apex
| Limit | Synchronous | Asynchronous |
|-------|-------------|--------------|
| SOQL queries | 100 | 200 |
| DML statements | 150 | 300 |
| SOQL rows returned | 50,000 | 50,000 |
| Heap size | 6 MB | 12 MB |
| CPU time | 10 sec | 60 sec |
| Callouts | 100 | 100 |

---

### 2. Apex Triggers (6 Topics)

| Topic | Key Formula / Pattern |
|-------|----------------------|
| **Trigger Syntax & Structure** | `trigger TriggerName on SObject (before insert, after update, ...) { TriggerHandler.run(); }` |
| **Trigger Events — Before & After** | Before: modify `Trigger.new` fields (no DML). After: create related records (use DML). |
| **Trigger Context Variables** | `Trigger.new` (List), `Trigger.old` (List), `Trigger.newMap` (Map<Id,SObj>), `Trigger.oldMap`, `Trigger.isInsert`, `Trigger.isUpdate`, `Trigger.isBefore`, `Trigger.isAfter`, `Trigger.size` |
| **Trigger Handler Framework** | `trigger → TriggerHandler.cls → AccountService.cls` — Separates dispatch from business logic |
| **Bulk Trigger Patterns** | Collect IDs → single SOQL outside loop → Map<Id,SObject> → loop Trigger.new using map |
| **Recursive Trigger Prevention** | Static Boolean flag: `if (TriggerHandler.hasRun) return; TriggerHandler.hasRun = true;` |

#### Bulk-Safe Trigger Pattern
```apex
// Collect
Set<Id> parentIds = new Set<Id>();
for (Child__c c : Trigger.new) parentIds.add(c.Parent__c);

// Query once
Map<Id, Parent__c> parentMap = new Map<Id, Parent__c>(
    [SELECT Id, Name FROM Parent__c WHERE Id IN :parentIds]);

// Process
for (Child__c c : Trigger.new) {
    Parent__c p = parentMap.get(c.Parent__c);
    // use p safely
}
```

---

### 3. Lightning Web Components (9 Topics)

| Topic | Key Syntax / Formula |
|-------|----------------------|
| **Component Structure** | Folder: `myComp/myComp.html` + `myComp.js` + `myComp.css` + `myComp.js-meta.xml` |
| **Lifecycle Hooks** | `connectedCallback()` → `renderedCallback()` → `disconnectedCallback()` |
| **@api Decorator** | `@api propName;` — Public property exposed to parent & App Builder |
| **@wire Service & Adapters** | `import { wire } from 'lwc'; import apexMethod from '@salesforce/apex/Class.method'; @wire(apexMethod, { param: '$reactiveProp' }) result;` |
| **Custom Events & Communication** | `this.dispatchEvent(new CustomEvent('eventname', { detail: { value } }));` — Parent listens with `oneventname` |
| **Imperative Apex Calls** | `const result = await apexMethod({ param: value });` — Use for write operations |
| **Lightning Message Service (LMS)** | `publish(context, CHANNEL, payload)` / `subscribe(context, CHANNEL, handler)` — Cross-component messaging |
| **Lightning Data Service (LDS)** | `@wire(getRecord, { recordId, fields })` — Client-side cache, auto-refresh |
| **Navigation Service** | `import { NavigationMixin } from 'lightning/navigation'; this[NavigationMixin.Navigate]({ type: 'standard__recordPage', ... })` |

#### LWC Component Template
```html
<!-- myComp.html -->
<template>
    <lightning-card title={cardTitle}>
        <template if:true={record.data}>
            <p>{record.data.fields.Name.value}</p>
        </template>
    </lightning-card>
</template>
```
```javascript
// myComp.js
import { LightningElement, api, wire } from 'lwc';
import { getRecord, FIELDS } from 'lightning/uiRecordApi';

export default class MyComp extends LightningElement {
    @api recordId;
    @wire(getRecord, { recordId: '$recordId', fields: ['Account.Name'] })
    record;
}
```

---

### 4. Project Ideas (21 Projects across 7 Clouds)

| Cloud | Projects |
|-------|---------|
| **Sales Cloud** | Intelligent Lead Scoring & Auto-Routing · Territory Management & Quota Dashboard · CPQ Configure-Price-Quote Automation |
| **Service Cloud** | AI-Powered Case Triage & Routing · Knowledge Base Self-Service Portal · Field Service Optimization |
| **Marketing Cloud** | Automated Customer Onboarding Journey · Win-Back Re-Engagement Campaign · Transactional Email & Notification Service |
| **Health Cloud** | Patient 360 Care Management Platform · Prior Authorization Automation · Population Health Risk Dashboard |
| **Data Cloud** | Unified Customer Profile System · Real-Time Behavioral Segmentation · Predictive Churn Analysis & Intervention |
| **Experience Cloud** | Partner Portal & Deal Registration · Customer Self-Service Community |
| **Financial Services Cloud** | Wealth Management Advisor Console · Insurance Claims Automation |

Each project includes:
- **Overview** — what it does and why
- **Duration** — estimated build time
- **Difficulty** — Beginner / Intermediate / Advanced
- **Team Size** — typical headcount
- **Tech Stack** — full list of Salesforce products and features
- **Implementation Steps** — detailed numbered steps
- **Architecture** — layer-by-layer design
- **Deliverables** — what the completed project produces

---

### 5. Certifications Prep (16 Certifications, 269 Practice Q&A)

#### Exam Reference Table

| Cert | Level | Questions | Pass% | Time | Cost |
|------|-------|-----------|-------|------|------|
| ⚙️ Salesforce Administrator | Associate | 60 | 65% | 105 min | $200 |
| 🏗️ Platform App Builder | Associate | 60 | 63% | 105 min | $200 |
| 👨‍💻 Platform Developer I | Professional | 60 | 65% | 110 min | $200 |
| 🧑‍💻 Platform Developer II | Advanced | 60 | 72% | 120 min | $200 |
| 💼 Sales Cloud Consultant | Professional | 60 | 62% | 105 min | $200 |
| 🎧 Service Cloud Consultant | Professional | 60 | 67% | 105 min | $200 |
| 📧 Marketing Cloud Developer | Professional | 60 | 65% | 105 min | $200 |
| 🔮 Data Cloud Consultant | Professional | 60 | 63% | 105 min | $200 |
| 🌐 Experience Cloud Consultant | Professional | 60 | 65% | 105 min | $200 |
| 🤖 Salesforce AI Associate | Associate | 40 | 65% | 70 min | $75 |
| 🧠 Salesforce AI Specialist | Professional | 60 | 73% | 105 min | $200 |
| 🦾 Agentforce Specialist | Professional | 60 | 70% | 105 min | $200 |
| 💌 MCAE / Pardot Specialist | Professional | 60 | 65% | 105 min | $200 |
| ⚡ JavaScript Developer I | Professional | 60 | 65% | 110 min | $200 |
| 💲 CPQ Specialist | Professional | 60 | 65% | 105 min | $200 |
| 📊 Business Analyst | Professional | 60 | 72% | 105 min | $200 |

Each certification page includes:
- **Exam Overview** — questions, passing %, time, cost, format, level
- **Topic Weights** — visual progress bars for each exam domain
- **Study Guide** — approach + 10 targeted study tips
- **Practice Q&A** — interactive questions with click-to-answer, color-coded correct/wrong, full explanations, and per-cert score counter

#### Agentforce Specialist — Key Concepts

| Concept | Description |
|---------|-------------|
| **Agent** | Autonomous AI agent — understands intent, reasons, plans, executes actions |
| **Topic** | Domain container: Classification Description + Instructions + Actions |
| **Standard Actions** | Built-in: Query Records, Create Record, Send Email, Summarize Record |
| **Flow Actions** | Any auto-launched Flow with Input/Output variables |
| **Apex Actions** | `@InvocableMethod` annotated Apex classes |
| **Prompt Template Actions** | Flex Prompt Builder templates for AI generation steps |
| **Grounding** | Injecting real CRM/Data Cloud context into LLM prompt at inference time |
| **Trust Layer flow** | Masking → Grounding → LLM Call → Toxicity Detection → De-masking |
| **Einstein Trust Layer** | PII Data Masking, Zero Data Retention, Toxicity Detection, Audit Trail |
| **Human Handoff** | Transfer to Omni-Channel queue with full conversation context |

#### Einstein Trust Layer — Processing Flow

```
User Prompt
    ↓
[1] Data Masking  — PII replaced with tokens (john@acme.com → [EMAIL_1])
    ↓
[2] Grounding     — CRM record context injected into prompt
    ↓
[3] LLM Call      — Masked, grounded prompt sent to external LLM
    ↓
[4] Toxicity Scan — Response checked for harmful content
    ↓
[5] De-masking    — Tokens replaced back with real values
    ↓
Response shown to user
```

#### Salesforce AI Specialist — Prompt Builder Template Types

| Template Type | Use Case | Triggered From |
|---------------|----------|----------------|
| **Sales Email** | Personalized outbound emails grounded with Opportunity/Lead data | Email action on record |
| **Field Generation** | Auto-populate a specific field (e.g., Case Summary) | Record page / automation |
| **Record Summary** | AI-generated record overview | "Summarize" button on record page |
| **Flex** | Any custom AI generation — most flexible | Flow, Apex, LWC, Copilot Actions |

---

### 6. Interactive Features

| Feature | How it works |
|---------|-------------|
| **Syntax-Highlighted Code** | All code blocks rendered by highlight.js (github-dark theme) |
| **Tabbed topic view** | Overview / Code Example / Best Practices / Gov. Limits / Optimization |
| **Click-to-Answer Q&A** | Click an option → green (correct) or red (wrong) + explanation reveals |
| **Reveal Answer** | See answer + explanation without scoring |
| **Per-cert Score Counter** | `N / 22 answered` tracker per certification |
| **Global Search** | Search bar filters topics, projects, and certifications in real time |
| **Dark Mode** | Toggle between light and dark themes — persists per session |
| **Sidebar Navigation** | Collapsible groups for Apex, Triggers, LWC, Projects (per cloud), Certifications |
| **Prev / Next navigation** | Navigate sequentially through topics within a section |

---

## How to Run

```bash
# Option 1 — Python HTTP server (recommended)
cd sf-dev-guide
python -m http.server 8765
# Open: http://localhost:8765/index.html

# Option 2 — Any static file server
npx serve .
# Open: http://localhost:3000/index.html

# Option 3 — VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

> No build step, no dependencies to install. Pure HTML + CSS + JavaScript. Works completely offline after the initial CDN load of highlight.js.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | Vanilla CSS (custom properties, grid, flexbox) |
| Logic | Vanilla JavaScript (ES6+) |
| Code Highlighting | [highlight.js 11.9](https://highlightjs.org/) via CDN |
| Data | Three external JS files loaded as global constants (`DATA`, `PRODUCTS`, `CERTS`) |
| Hosting | Any static file server / open directly in browser |

---

*Generated: 2026-04-17 | Salesforce Developer Reference — SF Dev Guide*
