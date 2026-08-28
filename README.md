# 📊 Executive Business Intelligence & Strategic Audit Dashboard

> **Hack2skill / Google Gen AI Exchange — Track 2: Turn Business Data into Strategic Decisions**

An enterprise-grade, interactive Business Intelligence dashboard powered by **Google Gemini 2.5** and Google Cloud AI. This application ingests raw financial, departmental, and operational CSV/Excel datasets and automatically converts them into strategic executive briefings, key metrics, anomaly alerts, and actionable recommendations.

---

## 🌟 Key Features

* **Dynamic Dataset Ingestion:** Upload custom business datasets (`.csv`, `.xlsx`) or analyze pre-loaded enterprise audit logs.
* **Executive KPI Suite:** Instant calculation of **Total Revenue ($5.75M)**, **Total Spend ($4.83M)**, **Net Profit Margin (+16.03%)**, **Average CSAT Score (8.00/10)**, **Churn Rate (3.4%)**, and risk level distribution.
* **Longitudinal Financial Analytics:** Visual trajectory charts comparing Revenue vs. Spend vs. Net Operating Margin across accounting periods.
* **Interactive Global Ledger Filters:** Filter data dynamically by **Region**, **Department**, and **Risk Level** across all modules.
* **AI-Powered Strategic Engine (Gemini 2.5):**
  * **Executive Summary:** Automated high-level C-suite brief.
  * **Key Metrics & Trends:** Statistical breakdowns and regional performance indicators.
  * **Operational Risks & Anomalies:** Early warning system flagging high-churn regions, budget overruns, and satisfaction dips.
  * **Strategic Recommendations:** Prioritized, AI-generated action items for management teams.
* **Customization & Reporting:**
  * Multi-theme interface (Light, Warm, Dark modes).
  * Strategy Sandbox for custom ad-hoc natural language querying.
  * PDF report printing and CSV export options.

---

## 🏗️ Technical Architecture

* **LLM / Gen AI Core:** Google Gemini 2.5 API (via `google-genai` SDK)
* **Frontend / Dashboard Framework:** Streamlit / React Web Application
* **Data Processing:** Pandas, NumPy
* **Data Visualizations:** Plotly / Chart.js
* **Deployment / Cloud:** Google Cloud Platform (Vertex AI / AI Studio)

---

## 🚀 Quickstart Guide

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/executive-bi-strategic-audit.git](https://github.com/YOUR_USERNAME/executive-bi-strategic-audit.git)
cd executive-bi-strategic-audit
